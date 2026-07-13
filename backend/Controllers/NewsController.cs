using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticleDto>>> GetNews([FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var articles = await db.NewsArticles
            .AsNoTracking()
            .Include(article => article.Translations)
            .OrderByDescending(article => article.Date)
            .ToListAsync();

        return articles.Select(article => ToDto(article, language)).ToList();
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<NewsArticleDto>> GetNewsArticle(string idOrSlug, [FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var query = db.NewsArticles.AsNoTracking().Include(article => article.Translations).AsQueryable();
        var article = int.TryParse(idOrSlug, out var id)
            ? await query.FirstOrDefaultAsync(item => item.Id == id)
            : await query.FirstOrDefaultAsync(item => item.Slug == idOrSlug);

        return article is null ? NotFound() : ToDto(article, language);
    }

    [HttpPost]
    public async Task<ActionResult<NewsArticle>> CreateNewsArticle(NewsArticle article)
    {
        db.NewsArticles.Add(article);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNewsArticle), new { idOrSlug = article.Id }, article);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateNewsArticle(int id, NewsArticle article)
    {
        if (id != article.Id) return BadRequest();
        db.Entry(article).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteNewsArticle(int id)
    {
        var article = await db.NewsArticles.FindAsync(id);
        if (article is null) return NotFound();
        db.NewsArticles.Remove(article);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static NewsArticleDto ToDto(NewsArticle article, string language)
    {
        var translations = article.Translations;
        var translation = PickTranslation(translations, language);
        return new NewsArticleDto(
            article.Id,
            article.Slug,
            Value(translations, translation, language, current => current.Title) ?? string.Empty,
            Value(translations, translation, language, current => current.Category) ?? string.Empty,
            article.Date,
            Value(translations, translation, language, current => current.Excerpt) ?? string.Empty,
            Value(translations, translation, language, current => current.Body),
            article.ImagePath,
            article.ThumbnailImagePath,
            article.IsExternal,
            article.ExternalUrl,
            article.SourceUrl,
            article.IsFeatured,
            article.HiddenFromList,
            article.VideoType,
            article.VideoUrl,
            Value(translations, translation, language, current => current.GalleryImagesJson),
            Value(translations, translation, language, current => current.RelatedSourcesJson));
    }

    private static NewsArticleTranslation? PickTranslation(IEnumerable<NewsArticleTranslation> translations, string language) =>
        translations.FirstOrDefault(translation => translation.LanguageCode == language)
        ?? translations.FirstOrDefault(translation => translation.LanguageCode == "en");

    private static string? Value(IEnumerable<NewsArticleTranslation> translations, NewsArticleTranslation? selected, string language, Func<NewsArticleTranslation, string?> getValue)
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

    public sealed record NewsArticleDto(
        int Id,
        string Slug,
        string Title,
        string Category,
        DateOnly Date,
        string Excerpt,
        string? Body,
        string? ImagePath,
        string? ThumbnailImagePath,
        bool IsExternal,
        string? ExternalUrl,
        string? SourceUrl,
        bool IsFeatured,
        bool HiddenFromList,
        string? VideoType,
        string? VideoUrl,
        string? GalleryImagesJson,
        string? RelatedSourcesJson);
}
