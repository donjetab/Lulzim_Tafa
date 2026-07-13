using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/awards")]
public class AwardsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AwardDto>>> GetAwards([FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var awards = await db.Awards
            .AsNoTracking()
            .Include(award => award.Translations)
            .OrderBy(award => award.DisplayOrder)
            .ThenByDescending(award => award.Year)
            .ToListAsync();

        return awards.Select(award => ToDto(award, language)).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<Award>> CreateAward(Award award)
    {
        award.Slug = string.IsNullOrWhiteSpace(award.Slug) ? SlugFromText(award.Translations.FirstOrDefault()?.Title ?? $"award-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}") : award.Slug;
        award.Layout = string.IsNullOrWhiteSpace(award.Layout) ? "landscape" : award.Layout;
        db.Awards.Add(award);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAwards), new { id = award.Id }, award);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAward(int id, Award award)
    {
        if (id != award.Id) return BadRequest();
        award.Slug = string.IsNullOrWhiteSpace(award.Slug) ? $"award-{id}" : award.Slug;
        award.Layout = string.IsNullOrWhiteSpace(award.Layout) ? "landscape" : award.Layout;
        db.Entry(award).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAward(int id)
    {
        var award = await db.Awards.FindAsync(id);
        if (award is null) return NotFound();
        db.Awards.Remove(award);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static AwardDto ToDto(Award award, string language)
    {
        var translations = award.Translations;
        var translation = PickTranslation(translations, language);
        return new AwardDto(
            award.Id,
            award.Slug ?? $"award-{award.Id}",
            Value(translations, translation, language, current => current.Title) ?? string.Empty,
            Value(translations, translation, language, current => current.Description) ?? string.Empty,
            award.Year,
            award.IconPath,
            award.CertificateImagePath,
            string.IsNullOrWhiteSpace(award.Layout) ? "landscape" : award.Layout,
            award.IsFeatured,
            award.DisplayOrder,
            Value(translations, translation, language, current => current.Location));
    }

    private static AwardTranslation? PickTranslation(IEnumerable<AwardTranslation> translations, string language) =>
        translations.FirstOrDefault(translation => translation.LanguageCode == language)
        ?? translations.FirstOrDefault(translation => translation.LanguageCode == "en");

    private static string? Value(IEnumerable<AwardTranslation> translations, AwardTranslation? selected, string language, Func<AwardTranslation, string?> getValue)
    {
        var value = selected is null ? null : getValue(selected);
        if (!string.IsNullOrWhiteSpace(value)) return value;

        return translations
            .Where(translation => translation.LanguageCode != language)
            .Select(getValue)
            .FirstOrDefault(candidate => !string.IsNullOrWhiteSpace(candidate));
    }

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();

    private static string SlugFromText(string? value)
    {
        var normalized = string.Concat((value ?? string.Empty)
                .Normalize(System.Text.NormalizationForm.FormD)
                .Where(character => char.GetUnicodeCategory(character) != System.Globalization.UnicodeCategory.NonSpacingMark))
            .ToLowerInvariant();

        var slug = string.Concat(normalized.Select(character => char.IsLetterOrDigit(character) ? character : '-'))
            .Replace("--", "-")
            .Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? $"award-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}" : slug;
    }

    public sealed record AwardDto(
        int Id,
        string Slug,
        string Title,
        string Description,
        int? Year,
        string? IconPath,
        string? CertificateImagePath,
        string Layout,
        bool IsFeatured,
        int DisplayOrder,
        string? Location);
}
