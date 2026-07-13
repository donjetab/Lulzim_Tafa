using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/poems")]
public class PoemsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PoemDto>>> GetPoems([FromQuery] string? language)
    {
        var query = db.Poems
            .AsNoTracking()
            .Include(poem => poem.Language)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(poem => poem.Language != null && poem.Language.Name == language);
        }

        return await query
            .OrderBy(poem => poem.DisplayOrder)
            .Select(poem => new PoemDto(
                poem.Id,
                poem.Title,
                poem.Slug,
                poem.Excerpt,
                poem.Body,
                poem.PaperImagePath,
                poem.IsFeatured,
                poem.DisplayOrder,
                poem.PoemLanguageId,
                poem.Language == null ? null : poem.Language.Name))
            .ToListAsync();
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<PoemDto>> GetPoem(string idOrSlug)
    {
        var query = db.Poems
            .AsNoTracking()
            .Include(poem => poem.Language)
            .AsQueryable();

        var poem = int.TryParse(idOrSlug, out var id)
            ? await query.FirstOrDefaultAsync(item => item.Id == id)
            : await query.FirstOrDefaultAsync(item => item.Slug == idOrSlug);

        return poem is null ? NotFound() : ToDto(poem);
    }

    [HttpGet("languages")]
    public async Task<ActionResult<IEnumerable<PoemLanguage>>> GetLanguages()
    {
        return await db.PoemLanguages.AsNoTracking().OrderBy(language => language.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Poem>> CreatePoem(Poem poem)
    {
        db.Poems.Add(poem);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPoem), new { idOrSlug = poem.Id }, poem);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePoem(int id, Poem poem)
    {
        if (id != poem.Id) return BadRequest();
        db.Entry(poem).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePoem(int id)
    {
        var poem = await db.Poems.FindAsync(id);
        if (poem is null) return NotFound();
        db.Poems.Remove(poem);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static PoemDto ToDto(Poem poem)
    {
        return new PoemDto(
            poem.Id,
            poem.Title,
            poem.Slug,
            poem.Excerpt,
            poem.Body,
            poem.PaperImagePath,
            poem.IsFeatured,
            poem.DisplayOrder,
            poem.PoemLanguageId,
            poem.Language?.Name);
    }

    public sealed record PoemDto(
        int Id,
        string Title,
        string Slug,
        string Excerpt,
        string Body,
        string? PaperImagePath,
        bool IsFeatured,
        int DisplayOrder,
        int PoemLanguageId,
        string? LanguageName);
}
