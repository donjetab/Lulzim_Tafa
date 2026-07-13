using System.Text.Json;
using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/video-poetry")]
public class VideoPoetryController(AppDbContext db) : ControllerBase
{
    private const string SettingKey = "videoPoetryItemsJson";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoPoetryItemDto>>> GetVideoPoetry([FromQuery] string? lang = "en")
    {
        return await ReadItems(lang);
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<VideoPoetryItemDto>> GetVideoPoetryItem(string idOrSlug, [FromQuery] string? lang = "en")
    {
        var items = await ReadItems(lang);
        var item = items.FirstOrDefault(current =>
            string.Equals(current.Id, idOrSlug, StringComparison.OrdinalIgnoreCase)
            || string.Equals(current.Slug, idOrSlug, StringComparison.OrdinalIgnoreCase));

        return item is null ? NotFound() : item;
    }

    [HttpPost]
    public async Task<ActionResult<VideoPoetryItemDto>> CreateVideoPoetryItem(VideoPoetryItemDto item)
    {
        var normalized = Normalize(item);
        db.VideoPoetryItems.Add(normalized.Item);
        await db.SaveChangesAsync();
        await UpsertTitleTranslation(normalized.Item.Id, "en", normalized.Title);
        return CreatedAtAction(nameof(GetVideoPoetryItem), new { idOrSlug = normalized.Item.Id }, ToDtoWithTitle(normalized.Item, normalized.Title));
    }

    [HttpPut("{idOrSlug}")]
    public async Task<IActionResult> UpdateVideoPoetryItem(string idOrSlug, VideoPoetryItemDto item)
    {
        var existing = await FindVideoPoetryItem(idOrSlug);

        if (existing is null) return NotFound();

        var normalized = Normalize(item, existing.Id);
        existing.Slug = normalized.Item.Slug;
        existing.Type = normalized.Item.Type;
        existing.Url = normalized.Item.Url;
        existing.Filename = normalized.Item.Filename;
        existing.ThumbnailImagePath = normalized.Item.ThumbnailImagePath;
        existing.PreviewFit = normalized.Item.PreviewFit;
        existing.PreviewTime = normalized.Item.PreviewTime;
        existing.IsFeatured = normalized.Item.IsFeatured;
        existing.DisplayOrder = normalized.Item.DisplayOrder;
        await UpsertTitleTranslation(existing.Id, "en", normalized.Title);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idOrSlug}")]
    public async Task<IActionResult> DeleteVideoPoetryItem(string idOrSlug)
    {
        var item = await FindVideoPoetryItem(idOrSlug);

        if (item is null) return NotFound();

        db.VideoPoetryItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<List<VideoPoetryItemDto>> ReadItems(string? lang = "en")
    {
        var language = NormalizeLanguage(lang);
        var tableItems = await db.VideoPoetryItems
            .AsNoTracking()
            .Include(item => item.Translations)
            .OrderBy(item => item.DisplayOrder)
            .ToListAsync();

        if (tableItems.Count > 0)
        {
            return tableItems.Select(item => ToDto(item, language)).ToList();
        }

        var record = await db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(setting => setting.Key == SettingKey);
        if (string.IsNullOrWhiteSpace(record?.Value)) return DefaultItems();

        try
        {
            var items = JsonSerializer.Deserialize<List<VideoPoetryItemDto>>(record.Value, JsonOptions) ?? [];
            return items.Count > 0 ? items : DefaultItems();
        }
        catch
        {
            return DefaultItems();
        }
    }

    private async Task<VideoPoetryItem?> FindVideoPoetryItem(string idOrSlug)
    {
        return int.TryParse(idOrSlug, out var id)
            ? await db.VideoPoetryItems.FirstOrDefaultAsync(item => item.Id == id)
            : await db.VideoPoetryItems.FirstOrDefaultAsync(item => item.Slug == idOrSlug);
    }

    private async Task UpsertTitleTranslation(int videoPoetryItemId, string language, string? title)
    {
        var translation = await db.VideoPoetryItemTranslations.FirstOrDefaultAsync(item =>
            item.VideoPoetryItemId == videoPoetryItemId && item.LanguageCode == language);

        if (translation is null)
        {
            db.VideoPoetryItemTranslations.Add(new VideoPoetryItemTranslation
            {
                VideoPoetryItemId = videoPoetryItemId,
                LanguageCode = language,
                Title = title,
            });
            return;
        }

        translation.Title = title;
    }

    private static VideoPoetryItemDto ToDto(VideoPoetryItem item, string language)
    {
        var translation = item.Translations.FirstOrDefault(current => current.LanguageCode == language)
            ?? item.Translations.FirstOrDefault(current => current.LanguageCode == "en");

        return new VideoPoetryItemDto(
            item.Id.ToString(),
            item.Slug,
            Value(item.Translations, translation, language, current => current.Title) ?? string.Empty,
            item.Type,
            item.Url,
            item.Filename,
            item.ThumbnailImagePath,
            item.PreviewFit,
            item.PreviewTime,
            item.IsFeatured,
            item.DisplayOrder);
    }

    private static string? Value(IEnumerable<VideoPoetryItemTranslation> translations, VideoPoetryItemTranslation? selected, string language, Func<VideoPoetryItemTranslation, string?> getValue)
    {
        var value = selected is null ? null : getValue(selected);
        if (!string.IsNullOrWhiteSpace(value)) return value;

        return translations
            .Where(translation => translation.LanguageCode != language)
            .Select(getValue)
            .FirstOrDefault(candidate => !string.IsNullOrWhiteSpace(candidate));
    }

    private static VideoPoetryItemDto ToDtoWithTitle(VideoPoetryItem item, string? title) =>
        new(
            item.Id.ToString(),
            item.Slug,
            title ?? string.Empty,
            item.Type,
            item.Url,
            item.Filename,
            item.ThumbnailImagePath,
            item.PreviewFit,
            item.PreviewTime,
            item.IsFeatured,
            item.DisplayOrder);

    private static (VideoPoetryItem Item, string? Title) Normalize(VideoPoetryItemDto item, int? fallbackId = null)
    {
        var slug = !string.IsNullOrWhiteSpace(item.Slug) ? item.Slug : SlugFromText(item.Title);
        var type = string.IsNullOrWhiteSpace(item.Type) ? "youtube" : item.Type.ToLowerInvariant();
        var thumbnail = type == "youtube"
            ? YouTubeThumbnail(item.Url ?? string.Empty)
            : string.Empty;

        return (new VideoPoetryItem
        {
            Id = int.TryParse(item.Id, out var parsedId) ? parsedId : fallbackId ?? 0,
            Slug = slug,
            Type = type,
            Url = item.Url,
            Filename = type == "local" && string.IsNullOrWhiteSpace(item.Url) ? item.Filename : null,
            ThumbnailImagePath = string.IsNullOrWhiteSpace(thumbnail) ? item.ThumbnailImagePath : thumbnail,
            PreviewFit = item.PreviewFit,
            PreviewTime = item.PreviewTime,
            IsFeatured = item.IsFeatured,
            DisplayOrder = item.DisplayOrder,
        }, item.Title ?? "Untitled video");
    }

    private static string SlugFromText(string? value)
    {
        return string.Concat((value ?? string.Empty)
                .Normalize(System.Text.NormalizationForm.FormD)
                .Where(character => char.GetUnicodeCategory(character) != System.Globalization.UnicodeCategory.NonSpacingMark))
            .ToLowerInvariant()
            .Select(character => char.IsLetterOrDigit(character) ? character : '-')
            .Aggregate(string.Empty, (current, character) => current.EndsWith('-') && character == '-' ? current : current + character)
            .Trim('-');
    }

    private static List<VideoPoetryItemDto> DefaultItems()
    {
        var items = new List<VideoPoetryItemDto>
        {
            YouTube("ekspozite-me-andrra-program", "Lulzim Tafa, \"Ekspozite me andrra\" - Program", "https://www.youtube.com/watch?v=kXi7V22vVWg&t=720s"),
            YouTube("une-e-ti", "Lulzim Tafa - Une e ti", "https://www.youtube.com/watch?v=usU0Yu5OYJk"),
            YouTube("idile", "Lulzim Tafa - Idile", "https://www.youtube.com/watch?v=qv7_xRjlbbE"),
            YouTube("ikja-youtube", "Lulzim Tafa - Ikja", "https://www.youtube.com/watch?v=BoBhlfIUdT0"),
            YouTube("mosmarreveshje", "Lulzim Tafa - Mosmarreveshje", "https://www.youtube.com/watch?v=f8_ooN0ijSo"),
            YouTube("kur-ti-me-therret", "Lulzim Tafa - Kur ti me therret", "https://www.youtube.com/watch?v=CTWTMKtmQiU"),
            YouTube("ashensori", "Lulzim Tafa - Ashensori", "https://www.youtube.com/watch?v=xdNGXPGYRrw"),
            YouTube("lufta", "Lulzim Tafa - Lufta", "https://www.youtube.com/watch?v=zQ6BP9oQMFU"),
            YouTube("te-dua-ma-shume-se-paulinen", "Lulzim Tafa - Te dua ma shume se Paulinen", "https://www.youtube.com/watch?v=H9HZzTqji8Q"),
            YouTube("ajkuna", "Lulzim Tafa - Ajkuna", "https://www.youtube.com/watch?v=LJd9ye1QG8A"),
            YouTube("piromane", "Lulzim Tafa - Piromane", "https://www.youtube.com/watch?v=aXV5dGx0F_g"),
            YouTube("konstatim", "Lulzim Tafa - Konstatim", "https://www.youtube.com/watch?v=5wdElF2Rqyo"),
            Local("bisede-me-hije", "\"Bisede me hije\" - Lulzim Tafa", "bisede-me-hije.mp4"),
            YouTube("neser-shi-do-bjere", "Lulzim Tafa - Neser shi do bjere", "https://www.youtube.com/watch?v=X9IJjjNdVVk"),
            YouTube("ata-me-thane-ik-e-une-ika-youtube", "Lulzim Tafa - Ata me thane ik e une ika", "https://www.youtube.com/watch?v=DvoHgcNXV4g"),
            YouTube("hana", "Lulzim Tafa - Hana", "https://www.youtube.com/watch?v=my_2wPuQ3YU"),
            YouTube("heronjte-dhe-kurvat", "Lulzim Tafa - Heronjte dhe kurvat", "https://www.youtube.com/watch?v=ZPnjSiV1l6o"),
            YouTube("tri-pyetjet", "Lulzim Tafa - Tri pyetjet", "https://www.youtube.com/watch?v=vAPZIoRCuRw"),
            YouTube("dije", "Lulzim Tafa - Dije", "https://www.youtube.com/watch?v=MreSoLAy1Fs"),
            YouTube("i-kam-edhe-dy-fjale", "Lulzim Tafa - I kam edhe dy fjale", "https://www.youtube.com/watch?v=uHyvxwt3hUc"),
            YouTube("definitive", "Lulzim Tafa - Definitive", "https://www.youtube.com/watch?v=foCwVKW93k4"),
            YouTube("lisat-flejne-ne-kembe", "Lulzim Tafa - Lisat flejne ne kembe", "https://www.youtube.com/watch?v=tybQ5YJMXdg"),
            YouTube("arbor-vitae", "Lulzim Tafa - Arbor Vitae", "https://www.youtube.com/watch?v=iQ37TTZJ2_A"),
            Local("lulzim-tafa-dhe-luiza-tafa-2025", "Lulzim Tafa & Luiza Tafa - Gezuar Vitin e Ri 2025", "lulzim-tafa-dhe-luiza-tafa-2025.mp4"),
            Local("purgator", "\"Purgator\" - Lulzim Tafa", "Purgator.mp4"),
            Local("ata-me-thane-ik-e-une-ika", "\"Ata me thane ik e une ika\" - Lulzim Tafa", "Ata më thanë ik e unë ika.mp4"),
            Local("bisede-me-gure", "\"Bisede me gure\" - Vedat Haxhiislami", "Bisedë me gurë.mov"),
            Local("bisede-me-qiellin", "\"Bisede me qiellin\" - Avni Dalipi", "Bisedë me qiellin.mov"),
            Local("bisede-me-detin", "\"Bisede me detin\" - Labinot Lajci", "Bisedë me detin.mov"),
            Local("anderr", "\"Anderr\" - Valmir Krasniqi", "Andërr.mp4"),
            Local("sa-shpejt-me-harroi-nana", "\"Sa shpejt me harroi nana\" - Zyhrije Vata", "Sa shpejt më harroi nana.mp4"),
            YouTube("sa-shpejt-me-harroi-nana-jurgen-palnikaj", "\"SA SHPEJT ME HARROI NANA\" - Jurgen Palnikaj", "https://www.youtube.com/watch?v=X3vzk8gxRSs"),
            Local("andrra-bill-wolak", "Bill Wolak duke e recituar poezine \"Andrra\"", "Andrra - bill wolak.mp4"),
            Local("sa-shpejt-me-harroi-nana-petrit-malaj", "\"SA SHPEJT ME HARROI NANA\" - Petrit Malaj", "Sa shpejt më harroi nana - petrit malaj.mp4"),
            Local("tu-e-kerkue-veten", "\"Tu e kerkue veten\" - Lulzim Tafa", "Tu e kerkue veten.mp4"),
        };

        for (var index = 0; index < items.Count; index++)
        {
            items[index] = items[index] with { DisplayOrder = index };
        }

        return items;
    }

    private static VideoPoetryItemDto YouTube(string id, string title, string url)
    {
        return new VideoPoetryItemDto(id, id, title, "youtube", url, null, YouTubeThumbnail(url), null, null, false, 0);
    }

    private static VideoPoetryItemDto Local(string slug, string title, string filename)
    {
        return new VideoPoetryItemDto(slug, slug, title, "local", null, filename, null, null, null, false, 0);
    }

    private static string YouTubeThumbnail(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return string.Empty;

        var videoId = string.Empty;
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return string.Empty;

        if (uri.Host.Contains("youtu.be", StringComparison.OrdinalIgnoreCase))
        {
            videoId = uri.AbsolutePath.Trim('/');
        }
        else if (!string.IsNullOrWhiteSpace(uri.Query))
        {
            videoId = uri.Query
                .TrimStart('?')
                .Split('&', StringSplitOptions.RemoveEmptyEntries)
                .Select(part => part.Split('=', 2))
                .FirstOrDefault(pair => pair.Length == 2 && pair[0] == "v")?[1] ?? string.Empty;
        }

        return string.IsNullOrWhiteSpace(videoId) ? string.Empty : $"https://i.ytimg.com/vi/{videoId}/hqdefault.jpg";
    }

    private static string NormalizeLanguage(string? language) =>
        string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();

    public sealed record VideoPoetryItemDto(
        string? Id,
        string? Slug,
        string? Title,
        string? Type,
        string? Url,
        string? Filename,
        string? ThumbnailImagePath,
        string? PreviewFit,
        double? PreviewTime,
        bool IsFeatured,
        int DisplayOrder);
}
