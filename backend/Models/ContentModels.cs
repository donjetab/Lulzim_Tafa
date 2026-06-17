using System.ComponentModel.DataAnnotations;

namespace LulzimTafa.Api.Models;

public class Book
{
    public int Id { get; set; }
    [MaxLength(180)] public required string Title { get; set; }
    [MaxLength(220)] public required string Slug { get; set; }
    [MaxLength(80)] public string? Category { get; set; }
    public int? Year { get; set; }
    [MaxLength(120)] public string? Location { get; set; }
    public string? Summary { get; set; }
    public string? Description { get; set; }
    public string? CoverImagePath { get; set; }
    public string? MockupImagePath { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    public List<BookImage> Images { get; set; } = [];
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
    [MaxLength(220)] public required string Title { get; set; }
    [MaxLength(80)] public required string Category { get; set; }
    public DateOnly Date { get; set; }
    public required string Excerpt { get; set; }
    public string? Body { get; set; }
    public string? ImagePath { get; set; }
    public bool IsExternal { get; set; }
    public string? ExternalUrl { get; set; }
    public bool IsFeatured { get; set; }
}

public class Interview
{
    public int Id { get; set; }
    [MaxLength(220)] public required string Title { get; set; }
    public DateOnly Date { get; set; }
    public required string Excerpt { get; set; }
    public string? ImagePath { get; set; }
    public string? InternalContent { get; set; }
    public string? ExternalUrl { get; set; }
    public bool IsFeatured { get; set; }
}

public class Award
{
    public int Id { get; set; }
    [MaxLength(220)] public required string Title { get; set; }
    public required string Description { get; set; }
    public int? Year { get; set; }
    public string? IconPath { get; set; }
    public string? CertificateImagePath { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
}

public class GalleryImage
{
    public int Id { get; set; }
    public required string ImagePath { get; set; }
    [MaxLength(220)] public string? Caption { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
}

public class Testimonial
{
    public int Id { get; set; }
    public required string Quote { get; set; }
    [MaxLength(160)] public required string AuthorName { get; set; }
    [MaxLength(160)] public string? AuthorTitle { get; set; }
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
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
