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
    public async Task<ActionResult<IEnumerable<Poem>>> GetPoems([FromQuery] string? language)
    {
        var query = db.Poems.Include(poem => poem.Language).AsQueryable();
        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(poem => poem.Language != null && poem.Language.Name == language);
        }

        return await query.OrderBy(poem => poem.DisplayOrder).ToListAsync();
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<Poem>> GetPoem(string idOrSlug)
    {
        var query = db.Poems.Include(poem => poem.Language).AsQueryable();
        var poem = int.TryParse(idOrSlug, out var id)
            ? await query.FirstOrDefaultAsync(item => item.Id == id)
            : await query.FirstOrDefaultAsync(item => item.Slug == idOrSlug);

        return poem is null ? NotFound() : poem;
    }

    [HttpGet("languages")]
    public async Task<ActionResult<IEnumerable<PoemLanguage>>> GetLanguages()
    {
        return await db.PoemLanguages.OrderBy(language => language.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Poem>> CreatePoem(Poem poem)
    {
        db.Poems.Add(poem);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPoem), new { idOrSlug = poem.Id }, poem);
    }
}
