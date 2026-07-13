using System.ComponentModel.DataAnnotations;

namespace LulzimTafa.Api.Models;

public class Book
{
    public int Id { get; set; }
    [MaxLength(220)] public required string Slug { get; set; }
    public int? Year { get; set; }
    public string? CoverImagePath { get; set; }
    public string? MockupImagePath { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<BookImage> Images { get; set; } = [];
    public List<BookTranslation> Translations { get; set; } = [];
}

public class BookImage
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public required string ImagePath { get; set; }
    [MaxLength(180)] public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
}

public class BookTranslation
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(180)] public string? Title { get; set; }
    [MaxLength(80)] public string? Category { get; set; }
    [MaxLength(120)] public string? Location { get; set; }
    public string? Summary { get; set; }
    public string? Description { get; set; }
}

public class PoemLanguage
{
    public int Id { get; set; }
    [MaxLength(80)] public required string Name { get; set; }
    public int DisplayOrder { get; set; }
    public List<Poem> Poems { get; set; } = [];
}

public class Poem
{
    public int Id { get; set; }
    [MaxLength(180)] public required string Title { get; set; }
    [MaxLength(220)] public required string Slug { get; set; }
    public required string Excerpt { get; set; }
    public required string Body { get; set; }
    public string? PaperImagePath { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public int PoemLanguageId { get; set; }
    public PoemLanguage? Language { get; set; }
}

public class NewsArticle
{
    public int Id { get; set; }
    [MaxLength(220)] public required string Slug { get; set; }
    public DateOnly Date { get; set; }
    public string? ImagePath { get; set; }
    public string? ThumbnailImagePath { get; set; }
    public bool IsExternal { get; set; }
    public string? ExternalUrl { get; set; }
    public string? SourceUrl { get; set; }
    [MaxLength(40)] public string? VideoType { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool HiddenFromList { get; set; }
    public List<NewsArticleTranslation> Translations { get; set; } = [];
}

public class NewsArticleTranslation
{
    public int Id { get; set; }
    public int NewsArticleId { get; set; }
    public NewsArticle? NewsArticle { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(220)] public string? Title { get; set; }
    [MaxLength(80)] public string? Category { get; set; }
    public string? Excerpt { get; set; }
    public string? Body { get; set; }
    public string? GalleryImagesJson { get; set; }
    public string? RelatedSourcesJson { get; set; }
}

public class Award
{
    public int Id { get; set; }
    [MaxLength(220)] public string? Slug { get; set; }
    public int? Year { get; set; }
    public string? IconPath { get; set; }
    public string? CertificateImagePath { get; set; }
    [MaxLength(40)] public string? Layout { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<AwardTranslation> Translations { get; set; } = [];
}

public class AwardTranslation
{
    public int Id { get; set; }
    public int AwardId { get; set; }
    public Award? Award { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(220)] public string? Title { get; set; }
    public string? Description { get; set; }
    [MaxLength(120)] public string? Location { get; set; }
}

public class GalleryImage
{
    public int Id { get; set; }
    public required string ImagePath { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<GalleryImageTranslation> Translations { get; set; } = [];
}

public class GalleryImageTranslation
{
    public int Id { get; set; }
    public int GalleryImageId { get; set; }
    public GalleryImage? GalleryImage { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(220)] public string? Caption { get; set; }
}

public class Testimonial
{
    public int Id { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<TestimonialTranslation> Translations { get; set; } = [];
}

public class TestimonialTranslation
{
    public int Id { get; set; }
    public int TestimonialId { get; set; }
    public Testimonial? Testimonial { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    public string? Quote { get; set; }
    [MaxLength(160)] public string? AuthorName { get; set; }
    [MaxLength(160)] public string? AuthorTitle { get; set; }
}

public class VideoPoetryItem
{
    public int Id { get; set; }
    [MaxLength(220)] public string? Slug { get; set; }
    [MaxLength(40)] public string? Type { get; set; }
    public string? Url { get; set; }
    public string? Filename { get; set; }
    public string? ThumbnailImagePath { get; set; }
    [MaxLength(40)] public string? PreviewFit { get; set; }
    public double? PreviewTime { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<VideoPoetryItemTranslation> Translations { get; set; } = [];
}

public class VideoPoetryItemTranslation
{
    public int Id { get; set; }
    public int VideoPoetryItemId { get; set; }
    public VideoPoetryItem? VideoPoetryItem { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(220)] public string? Title { get; set; }
    public string? Description { get; set; }
}

public class ContactMessage
{
    public int Id { get; set; }
    [MaxLength(160)] public required string FullName { get; set; }
    [MaxLength(220)] public required string Email { get; set; }
    [MaxLength(220)] public required string Subject { get; set; }
    public required string Message { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
}

public class SocialLink
{
    public int Id { get; set; }
    [MaxLength(80)] public required string Label { get; set; }
    public required string Url { get; set; }
    public string? IconPath { get; set; }
    public int DisplayOrder { get; set; }
}

public class SiteSetting
{
    public int Id { get; set; }
    [MaxLength(120)] public required string Key { get; set; }
    public required string Value { get; set; }
}

public class SiteTranslation
{
    public int Id { get; set; }
    [MaxLength(160)] public required string Key { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    public required string Value { get; set; }
}

public class PageSection
{
    public int Id { get; set; }
    [MaxLength(80)] public required string PageKey { get; set; }
    [MaxLength(120)] public required string SectionKey { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<PageSectionTranslation> Translations { get; set; } = [];
}

public class PageSectionTranslation
{
    public int Id { get; set; }
    public int PageSectionId { get; set; }
    public PageSection? PageSection { get; set; }
    [MaxLength(8)] public required string LanguageCode { get; set; }
    [MaxLength(220)] public string? Title { get; set; }
    [MaxLength(220)] public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public string? ExtraJson { get; set; }
}

public class AdminUser
{
    public int Id { get; set; }
    [MaxLength(120)] public required string DisplayName { get; set; }
    [MaxLength(80)] public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? PasswordChangedAtUtc { get; set; }
}
