using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks([FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var books = await db.Books
            .AsNoTracking()
            .Include(book => book.Images)
            .Include(book => book.Translations)
            .OrderBy(book => book.DisplayOrder)
            .ThenByDescending(book => book.Year)
            .ToListAsync();

        return books.Select(book => ToDto(book, language)).ToList();
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<BookDto>> GetBook(string idOrSlug, [FromQuery] string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var query = db.Books.AsNoTracking().Include(book => book.Images).Include(book => book.Translations).AsQueryable();
        var book = int.TryParse(idOrSlug, out var id)
            ? await query.FirstOrDefaultAsync(item => item.Id == id)
            : await query.FirstOrDefaultAsync(item => item.Slug == idOrSlug);

        return book is null ? NotFound() : ToDto(book, language);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook(Book book)
    {
        db.Books.Add(book);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { idOrSlug = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        if (id != book.Id) return BadRequest();
        db.Entry(book).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null) return NotFound();
        db.Books.Remove(book);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static BookDto ToDto(Book book, string language)
    {
        var translations = book.Translations;
        var translation = PickTranslation(translations, language);
        return new BookDto(
            book.Id,
            Value(translations, translation, language, current => current.Title) ?? string.Empty,
            book.Slug,
            Value(translations, translation, language, current => current.Category),
            book.Year,
            Value(translations, translation, language, current => current.Location),
            Value(translations, translation, language, current => current.Summary),
            Value(translations, translation, language, current => current.Description),
            book.CoverImagePath,
            book.MockupImagePath,
            book.IsFeatured,
            book.DisplayOrder,
            book.Images);
    }

    private static BookTranslation? PickTranslation(IEnumerable<BookTranslation> translations, string language) =>
        translations.FirstOrDefault(translation => translation.LanguageCode == language)
        ?? translations.FirstOrDefault(translation => translation.LanguageCode == "en");

    private static string? Value(IEnumerable<BookTranslation> translations, BookTranslation? selected, string language, Func<BookTranslation, string?> getValue)
    {
        var value = getValue(selected ?? new BookTranslation { BookId = 0, LanguageCode = language });
        if (!string.IsNullOrWhiteSpace(value)) return value;

        return translations
            .Where(translation => translation.LanguageCode != language)
            .Select(getValue)
            .FirstOrDefault(candidate => !string.IsNullOrWhiteSpace(candidate));
    }

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();

    public sealed record BookDto(
        int Id,
        string Title,
        string Slug,
        string? Category,
        int? Year,
        string? Location,
        string? Summary,
        string? Description,
        string? CoverImagePath,
        string? MockupImagePath,
        bool IsFeatured,
        int DisplayOrder,
        List<BookImage> Images);
}
