using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/gallery")]
public class GalleryController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GalleryImageDto>>> GetGallery([FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var images = await db.GalleryImages
            .AsNoTracking()
            .Include(image => image.Translations)
            .OrderBy(image => image.DisplayOrder)
            .ToListAsync();

        return images.Select(image => ToDto(image, language)).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<GalleryImage>> CreateGalleryImage(GalleryImage image)
    {
        db.GalleryImages.Add(image);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGallery), new { id = image.Id }, image);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateGalleryImage(int id, GalleryImage image)
    {
        if (id != image.Id) return BadRequest();
        db.Entry(image).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteGalleryImage(int id)
    {
        var image = await db.GalleryImages.FindAsync(id);
        if (image is null) return NotFound();
        db.GalleryImages.Remove(image);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static GalleryImageDto ToDto(GalleryImage image, string language)
    {
        var translations = image.Translations;
        var translation = PickTranslation(translations, language);
        return new GalleryImageDto(
            image.Id,
            image.ImagePath,
            Value(translations, translation, language, current => current.Caption),
            image.IsFeatured,
            image.DisplayOrder);
    }

    private static GalleryImageTranslation? PickTranslation(IEnumerable<GalleryImageTranslation> translations, string language) =>
        translations.FirstOrDefault(translation => translation.LanguageCode == language)
        ?? translations.FirstOrDefault(translation => translation.LanguageCode == "en");

    private static string? Value(IEnumerable<GalleryImageTranslation> translations, GalleryImageTranslation? selected, string language, Func<GalleryImageTranslation, string?> getValue)
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

    public sealed record GalleryImageDto(
        int Id,
        string ImagePath,
        string? Caption,
        bool IsFeatured,
        int DisplayOrder);
}
