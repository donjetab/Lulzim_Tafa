using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestimonialDto>>> GetTestimonials([FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var testimonials = await db.Testimonials
            .AsNoTracking()
            .Include(testimonial => testimonial.Translations)
            .OrderBy(testimonial => testimonial.DisplayOrder)
            .ToListAsync();

        return testimonials.Select(testimonial => ToDto(testimonial, language)).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<Testimonial>> CreateTestimonial(Testimonial testimonial)
    {
        db.Testimonials.Add(testimonial);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTestimonials), new { id = testimonial.Id }, testimonial);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTestimonial(int id, Testimonial testimonial)
    {
        if (id != testimonial.Id) return BadRequest();
        db.Entry(testimonial).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTestimonial(int id)
    {
        var testimonial = await db.Testimonials.FindAsync(id);
        if (testimonial is null) return NotFound();
        db.Testimonials.Remove(testimonial);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static TestimonialDto ToDto(Testimonial testimonial, string language)
    {
        var translations = testimonial.Translations;
        var translation = PickTranslation(translations, language);
        return new TestimonialDto(
            testimonial.Id,
            Value(translations, translation, language, current => current.Quote) ?? string.Empty,
            Value(translations, translation, language, current => current.AuthorName) ?? string.Empty,
            Value(translations, translation, language, current => current.AuthorTitle),
            testimonial.IsFeatured,
            testimonial.DisplayOrder);
    }

    private static TestimonialTranslation? PickTranslation(IEnumerable<TestimonialTranslation> translations, string language) =>
        translations.FirstOrDefault(translation => translation.LanguageCode == language)
        ?? translations.FirstOrDefault(translation => translation.LanguageCode == "en");

    private static string? Value(IEnumerable<TestimonialTranslation> translations, TestimonialTranslation? selected, string language, Func<TestimonialTranslation, string?> getValue)
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

    public sealed record TestimonialDto(
        int Id,
        string Quote,
        string AuthorName,
        string? AuthorTitle,
        bool IsFeatured,
        int DisplayOrder);
}
