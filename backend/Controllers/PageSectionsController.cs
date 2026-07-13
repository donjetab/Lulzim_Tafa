using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/page-sections")]
public class PageSectionsController(AppDbContext db) : ControllerBase
{
    [HttpGet("{pageKey}")]
    public async Task<ActionResult<IEnumerable<PageSectionDto>>> GetPageSections(
        string pageKey,
        [FromQuery] string? lang = "en",
        [FromQuery] bool fallback = true)
    {
        var language = NormalizeLanguage(lang);
        var sections = await db.PageSections
            .AsNoTracking()
            .Include(section => section.Translations)
            .Where(section => section.PageKey == pageKey && section.IsActive)
            .OrderBy(section => section.DisplayOrder)
            .ToListAsync();

        return sections.Select(section => ToDto(section, language, fallback)).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<PageSection>> CreateSection(PageSection section)
    {
        db.PageSections.Add(section);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPageSections), new { pageKey = section.PageKey }, section);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateSection(int id, PageSection section)
    {
        if (id != section.Id) return BadRequest();
        db.Entry(section).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{sectionId:int}/translations")]
    public async Task<ActionResult<PageSectionTranslationDto>> UpsertSectionTranslation(int sectionId, PageSectionTranslation translation)
    {
        var savedTranslation = await UpsertTranslation(sectionId, translation);
        return Ok(ToTranslationDto(savedTranslation));
    }

    [HttpPost("{pageKey}/{sectionKey}/translations")]
    public async Task<ActionResult<PageSectionTranslationDto>> UpsertSectionTranslationByKey(
        string pageKey,
        string sectionKey,
        PageSectionTranslation translation)
    {
        var section = await db.PageSections.FirstOrDefaultAsync(item => item.PageKey == pageKey && item.SectionKey == sectionKey);
        if (section is null)
        {
            section = new PageSection { PageKey = pageKey, SectionKey = sectionKey, DisplayOrder = 0, IsActive = true };
            db.PageSections.Add(section);
            await db.SaveChangesAsync();
        }

        var savedTranslation = await UpsertTranslation(section.Id, translation);
        return Ok(ToTranslationDto(savedTranslation));
    }

    private async Task<PageSectionTranslation> UpsertTranslation(int sectionId, PageSectionTranslation translation)
    {
        var language = NormalizeLanguage(translation.LanguageCode);
        var existing = await db.PageSectionTranslations.FirstOrDefaultAsync(item =>
            item.PageSectionId == sectionId && item.LanguageCode == language);

        if (existing is null)
        {
            existing = new PageSectionTranslation
            {
                PageSectionId = sectionId,
                LanguageCode = language,
            };
            db.PageSectionTranslations.Add(existing);
        }

        existing.Title = translation.Title ?? existing.Title;
        existing.Subtitle = translation.Subtitle ?? existing.Subtitle;
        existing.Content = translation.Content ?? existing.Content;
        existing.ExtraJson = translation.ExtraJson ?? existing.ExtraJson;
        await db.SaveChangesAsync();
        return existing;
    }

    private static PageSectionDto ToDto(PageSection section, string language, bool fallback)
    {
        var translations = section.Translations;
        var translation = PickTranslation(translations, language, fallback);
        return new PageSectionDto(
            section.Id,
            section.PageKey,
            section.SectionKey,
            section.DisplayOrder,
            section.IsActive,
            Value(translations, translation, language, fallback, current => current.Title),
            Value(translations, translation, language, fallback, current => current.Subtitle),
            Value(translations, translation, language, fallback, current => current.Content),
            Value(translations, translation, language, fallback, current => current.ExtraJson));
    }

    private static PageSectionTranslation? PickTranslation(IEnumerable<PageSectionTranslation> translations, string language, bool fallback)
    {
        var exactTranslation = translations.FirstOrDefault(translation => translation.LanguageCode == language);
        if (exactTranslation is not null || !fallback) return exactTranslation;

        return language == "en"
            ? null
            : translations.FirstOrDefault(translation => translation.LanguageCode == "en");
    }

    private static string? Value(IEnumerable<PageSectionTranslation> translations, PageSectionTranslation? selected, string language, bool fallback, Func<PageSectionTranslation, string?> getValue)
    {
        var value = selected is null ? null : getValue(selected);
        if (!fallback || !string.IsNullOrWhiteSpace(value)) return value;

        return translations
            .Where(translation => translation.LanguageCode != language)
            .Select(getValue)
            .FirstOrDefault(candidate => !string.IsNullOrWhiteSpace(candidate));
    }

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();

    private static PageSectionTranslationDto ToTranslationDto(PageSectionTranslation translation) =>
        new(
            translation.Id,
            translation.PageSectionId,
            translation.LanguageCode,
            translation.Title,
            translation.Subtitle,
            translation.Content,
            translation.ExtraJson);

    public sealed record PageSectionDto(
        int Id,
        string PageKey,
        string SectionKey,
        int DisplayOrder,
        bool IsActive,
        string? Title,
        string? Subtitle,
        string? Content,
        string? ExtraJson);

    public sealed record PageSectionTranslationDto(
        int Id,
        int PageSectionId,
        string LanguageCode,
        string? Title,
        string? Subtitle,
        string? Content,
        string? ExtraJson);
}
