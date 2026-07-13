using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/content-translations")]
public class ContentTranslationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContentTranslationDto>>> GetTranslations(
        [FromQuery] string collection,
        [FromQuery] string? lang = null)
    {
        var language = NormalizeLanguage(lang);
        return collection switch
        {
            "books" => (await db.BookTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.BookId.ToString(), item.LanguageCode, new()
                {
                    ["title"] = item.Title,
                    ["category"] = item.Category,
                    ["location"] = item.Location,
                    ["summary"] = item.Summary,
                    ["description"] = item.Description,
                })).ToList(),
            "news" => (await db.NewsArticleTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.NewsArticleId.ToString(), item.LanguageCode, new()
                {
                    ["title"] = item.Title,
                    ["category"] = item.Category,
                    ["excerpt"] = item.Excerpt,
                    ["body"] = item.Body,
                    ["galleryImagesJson"] = item.GalleryImagesJson,
                    ["relatedSourcesJson"] = item.RelatedSourcesJson,
                })).ToList(),
            "awards" => (await db.AwardTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.AwardId.ToString(), item.LanguageCode, new()
                {
                    ["title"] = item.Title,
                    ["description"] = item.Description,
                    ["location"] = item.Location,
                })).ToList(),
            "gallery" => (await db.GalleryImageTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.GalleryImageId.ToString(), item.LanguageCode, new()
                {
                    ["caption"] = item.Caption,
                })).ToList(),
            "testimonials" => (await db.TestimonialTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.TestimonialId.ToString(), item.LanguageCode, new()
                {
                    ["quote"] = item.Quote,
                    ["authorName"] = item.AuthorName,
                    ["authorTitle"] = item.AuthorTitle,
                })).ToList(),
            "video-poetry" => (await db.VideoPoetryItemTranslations.AsNoTracking().Where(item => item.LanguageCode == language).ToListAsync())
                .Select(item => new ContentTranslationDto(collection, item.VideoPoetryItemId.ToString(), item.LanguageCode, new()
                {
                    ["title"] = item.Title,
                    ["description"] = item.Description,
                })).ToList(),
            _ => BadRequest($"Unsupported collection '{collection}'."),
        };
    }

    [HttpPost]
    public async Task<IActionResult> UpsertTranslation(ContentTranslationUpsertRequest request)
    {
        var language = NormalizeLanguage(request.LanguageCode);

        switch (request.Collection)
        {
            case "books":
                if (!int.TryParse(request.ParentId, out var bookId)) return BadRequest("Invalid book id.");
                var book = await db.BookTranslations.FirstOrDefaultAsync(item => item.BookId == bookId && item.LanguageCode == language);
                book ??= Add(new BookTranslation { BookId = bookId, LanguageCode = language });
                Apply(request.Fields, ("title", value => book.Title = value), ("category", value => book.Category = value), ("location", value => book.Location = value), ("summary", value => book.Summary = value), ("description", value => book.Description = value));
                var otherBook = await db.BookTranslations.FirstOrDefaultAsync(item => item.BookId == bookId && item.LanguageCode == OtherLanguage(language));
                otherBook ??= Add(new BookTranslation { BookId = bookId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("title", () => otherBook.Title, value => otherBook.Title = value), ("category", () => otherBook.Category, value => otherBook.Category = value), ("location", () => otherBook.Location, value => otherBook.Location = value), ("summary", () => otherBook.Summary, value => otherBook.Summary = value), ("description", () => otherBook.Description, value => otherBook.Description = value));
                break;
            case "news":
                if (!int.TryParse(request.ParentId, out var newsId)) return BadRequest("Invalid news id.");
                var news = await db.NewsArticleTranslations.FirstOrDefaultAsync(item => item.NewsArticleId == newsId && item.LanguageCode == language);
                news ??= Add(new NewsArticleTranslation { NewsArticleId = newsId, LanguageCode = language });
                Apply(request.Fields, ("title", value => news.Title = value), ("category", value => news.Category = value), ("excerpt", value => news.Excerpt = value), ("body", value => news.Body = value), ("galleryImagesJson", value => news.GalleryImagesJson = value), ("relatedSourcesJson", value => news.RelatedSourcesJson = value));
                var otherNews = await db.NewsArticleTranslations.FirstOrDefaultAsync(item => item.NewsArticleId == newsId && item.LanguageCode == OtherLanguage(language));
                otherNews ??= Add(new NewsArticleTranslation { NewsArticleId = newsId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("title", () => otherNews.Title, value => otherNews.Title = value), ("category", () => otherNews.Category, value => otherNews.Category = value), ("excerpt", () => otherNews.Excerpt, value => otherNews.Excerpt = value), ("body", () => otherNews.Body, value => otherNews.Body = value), ("galleryImagesJson", () => otherNews.GalleryImagesJson, value => otherNews.GalleryImagesJson = value), ("relatedSourcesJson", () => otherNews.RelatedSourcesJson, value => otherNews.RelatedSourcesJson = value));
                break;
            case "awards":
                if (!int.TryParse(request.ParentId, out var awardId)) return BadRequest("Invalid award id.");
                var award = await db.AwardTranslations.FirstOrDefaultAsync(item => item.AwardId == awardId && item.LanguageCode == language);
                award ??= Add(new AwardTranslation { AwardId = awardId, LanguageCode = language });
                Apply(request.Fields, ("title", value => award.Title = value), ("description", value => award.Description = value), ("location", value => award.Location = value));
                var otherAward = await db.AwardTranslations.FirstOrDefaultAsync(item => item.AwardId == awardId && item.LanguageCode == OtherLanguage(language));
                otherAward ??= Add(new AwardTranslation { AwardId = awardId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("title", () => otherAward.Title, value => otherAward.Title = value), ("description", () => otherAward.Description, value => otherAward.Description = value), ("location", () => otherAward.Location, value => otherAward.Location = value));
                break;
            case "gallery":
                if (!int.TryParse(request.ParentId, out var imageId)) return BadRequest("Invalid gallery image id.");
                var image = await db.GalleryImageTranslations.FirstOrDefaultAsync(item => item.GalleryImageId == imageId && item.LanguageCode == language);
                image ??= Add(new GalleryImageTranslation { GalleryImageId = imageId, LanguageCode = language });
                Apply(request.Fields, ("caption", value => image.Caption = value));
                var otherImage = await db.GalleryImageTranslations.FirstOrDefaultAsync(item => item.GalleryImageId == imageId && item.LanguageCode == OtherLanguage(language));
                otherImage ??= Add(new GalleryImageTranslation { GalleryImageId = imageId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("caption", () => otherImage.Caption, value => otherImage.Caption = value));
                break;
            case "testimonials":
                if (!int.TryParse(request.ParentId, out var testimonialId)) return BadRequest("Invalid testimonial id.");
                var testimonial = await db.TestimonialTranslations.FirstOrDefaultAsync(item => item.TestimonialId == testimonialId && item.LanguageCode == language);
                testimonial ??= Add(new TestimonialTranslation { TestimonialId = testimonialId, LanguageCode = language });
                Apply(request.Fields, ("quote", value => testimonial.Quote = value), ("authorName", value => testimonial.AuthorName = value), ("authorTitle", value => testimonial.AuthorTitle = value));
                var otherTestimonial = await db.TestimonialTranslations.FirstOrDefaultAsync(item => item.TestimonialId == testimonialId && item.LanguageCode == OtherLanguage(language));
                otherTestimonial ??= Add(new TestimonialTranslation { TestimonialId = testimonialId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("quote", () => otherTestimonial.Quote, value => otherTestimonial.Quote = value), ("authorName", () => otherTestimonial.AuthorName, value => otherTestimonial.AuthorName = value), ("authorTitle", () => otherTestimonial.AuthorTitle, value => otherTestimonial.AuthorTitle = value));
                break;
            case "video-poetry":
                if (!int.TryParse(request.ParentId, out var videoId)) return BadRequest("Invalid video poetry id.");
                var video = await db.VideoPoetryItemTranslations.FirstOrDefaultAsync(item => item.VideoPoetryItemId == videoId && item.LanguageCode == language);
                video ??= Add(new VideoPoetryItemTranslation { VideoPoetryItemId = videoId, LanguageCode = language });
                Apply(request.Fields, ("title", value => video.Title = value), ("description", value => video.Description = value));
                var otherVideo = await db.VideoPoetryItemTranslations.FirstOrDefaultAsync(item => item.VideoPoetryItemId == videoId && item.LanguageCode == OtherLanguage(language));
                otherVideo ??= Add(new VideoPoetryItemTranslation { VideoPoetryItemId = videoId, LanguageCode = OtherLanguage(language) });
                ApplyMissing(request.Fields, ("title", () => otherVideo.Title, value => otherVideo.Title = value), ("description", () => otherVideo.Description, value => otherVideo.Description = value));
                break;
            default:
                return BadRequest($"Unsupported collection '{request.Collection}'.");
        }

        await db.SaveChangesAsync();
        return NoContent();
    }

    private T Add<T>(T entity) where T : class
    {
        db.Set<T>().Add(entity);
        return entity;
    }

    private static void Apply(IReadOnlyDictionary<string, string?> fields, params (string Key, Action<string?> Set)[] setters)
    {
        foreach (var (key, set) in setters)
        {
            if (fields.TryGetValue(key, out var value)) set(value ?? string.Empty);
        }
    }

    private static void ApplyMissing(IReadOnlyDictionary<string, string?> fields, params (string Key, Func<string?> Get, Action<string?> Set)[] setters)
    {
        foreach (var (key, get, set) in setters)
        {
            if (!fields.TryGetValue(key, out var value)) continue;
            if (string.IsNullOrWhiteSpace(get())) set(value ?? string.Empty);
        }
    }

    private static string OtherLanguage(string language) => language == "sq" ? "en" : "sq";

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();

    public sealed record ContentTranslationDto(
        string Collection,
        string ParentId,
        string LanguageCode,
        Dictionary<string, string?> Fields);

    public sealed record ContentTranslationUpsertRequest(
        string Collection,
        string ParentId,
        string LanguageCode,
        Dictionary<string, string?> Fields);
}
