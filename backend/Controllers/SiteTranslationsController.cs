using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/site-translations")]
public class SiteTranslationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteTranslation>>> GetTranslations([FromQuery] string? lang = null)
    {
        var query = db.SiteTranslations.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(lang))
        {
            query = query.Where(translation => translation.LanguageCode == lang);
        }

        return await query.OrderBy(translation => translation.Key).ThenBy(translation => translation.LanguageCode).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SiteTranslation>> UpsertTranslation(SiteTranslation translation)
    {
        var language = NormalizeLanguage(translation.LanguageCode);
        var existing = await db.SiteTranslations.FirstOrDefaultAsync(item =>
            item.Key == translation.Key && item.LanguageCode == language);

        if (existing is null)
        {
            translation.LanguageCode = language;
            db.SiteTranslations.Add(translation);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTranslations), new { lang = language }, translation);
        }

        existing.Value = translation.Value ?? string.Empty;
        await db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTranslation(int id, SiteTranslation translation)
    {
        if (id != translation.Id) return BadRequest();
        translation.LanguageCode = NormalizeLanguage(translation.LanguageCode);
        db.Entry(translation).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTranslation(int id)
    {
        var translation = await db.SiteTranslations.FindAsync(id);
        if (translation is null) return NotFound();
        db.SiteTranslations.Remove(translation);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();
}
