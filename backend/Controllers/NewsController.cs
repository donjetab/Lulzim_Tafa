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
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetNews()
    {
        return await db.NewsArticles.OrderByDescending(article => article.Date).ToListAsync();
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<NewsArticle>> GetNewsArticle(string idOrSlug)
    {
        var article = int.TryParse(idOrSlug, out var id)
            ? await db.NewsArticles.FirstOrDefaultAsync(item => item.Id == id)
            : await db.NewsArticles.FirstOrDefaultAsync(item => item.Slug == idOrSlug);

        return article is null ? NotFound() : article;
    }

    [HttpPost]
    public async Task<ActionResult<NewsArticle>> CreateNewsArticle(NewsArticle article)
    {
        db.NewsArticles.Add(article);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNewsArticle), new { idOrSlug = article.Id }, article);
    }
}
