using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using LulzimTafa.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Services;

public sealed class SeoService(AppDbContext db, IConfiguration configuration)
{
    private const string SiteName = "Lulzim Tafa";

    private static readonly Dictionary<string, (string En, string Sq)> Routes = new()
    {
        [""] = ("", ""),
        ["about"] = ("about", "rreth"),
        ["testimonials"] = ("testimonials", "vleresime"),
        ["books"] = ("books", "librat"),
        ["poetry"] = ("poetry", "poezi"),
        ["poetry/video"] = ("poetry/video", "poezi/video"),
        ["poetry-house"] = ("poetry-house", "shtepia-e-poezise"),
        ["news"] = ("news", "lajme"),
        ["gallery"] = ("gallery", "galeria"),
        ["awards"] = ("awards", "cmimet")
    };

    private static readonly Dictionary<(string Lang, string Section), (string Title, string Description)> StaticMetadata = new()
    {
        [("en", "")] = ("Lulzim Tafa | Academic, Author and Poet", "Official website of Lulzim Tafa, Kosovar Albanian academic, author and poet. Explore his biography, books, poetry, awards and latest news."),
        [("sq", "")] = ("Lulzim Tafa | Akademik, autor dhe poet", "Faqja zyrtare e Lulzim Tafës, akademik, autor dhe poet shqiptar nga Kosova. Shfletoni biografinë, librat, poezinë, çmimet dhe lajmet e tij."),
        [("en", "about")] = ("About Lulzim Tafa | Biography", "Discover the biography, academic career and literary work of Kosovar Albanian poet and author Lulzim Tafa."),
        [("sq", "about")] = ("Rreth Lulzim Tafës | Biografia", "Zbuloni biografinë, karrierën akademike dhe krijimtarinë letrare të poetit dhe autorit Lulzim Tafa."),
        [("en", "testimonials")] = ("Testimonials about Lulzim Tafa", "Read reflections and testimonials about the work and literary influence of Lulzim Tafa."),
        [("sq", "testimonials")] = ("Vlerësime për Lulzim Tafën", "Lexoni vlerësime dhe reflektime për veprën dhe ndikimin letrar të Lulzim Tafës."),
        [("en", "books")] = ("Books by Lulzim Tafa", "Explore poetry books, publications and translated editions by Lulzim Tafa."),
        [("sq", "books")] = ("Librat e Lulzim Tafës", "Shfletoni librat me poezi, botimet dhe veprat e përkthyera të Lulzim Tafës."),
        [("en", "poetry")] = ("Poetry by Lulzim Tafa", "Read selected poems and translations by Kosovar Albanian poet Lulzim Tafa."),
        [("sq", "poetry")] = ("Poezi nga Lulzim Tafa", "Lexoni poezi të zgjedhura dhe përkthime nga poeti shqiptar i Kosovës, Lulzim Tafa."),
        [("en", "poetry-house")] = ("Poetry House | Lulzim Tafa", "Discover the Poetry House and Poetry Theatre founded by Lulzim Tafa in Prishtina."),
        [("sq", "poetry-house")] = ("Shtëpia e Poezisë | Lulzim Tafa", "Zbuloni Shtëpinë e Poezisë dhe Teatrin e Poezisë të themeluar nga Lulzim Tafa në Prishtinë."),
        [("en", "news")] = ("News and Interviews | Lulzim Tafa", "Latest news, interviews and public appearances by author and academic Lulzim Tafa."),
        [("sq", "news")] = ("Lajme dhe intervista | Lulzim Tafa", "Lajmet, intervistat dhe paraqitjet më të fundit publike të autorit dhe akademikut Lulzim Tafa."),
        [("en", "gallery")] = ("Gallery | Lulzim Tafa", "Photos from the literary, academic and public life of Lulzim Tafa."),
        [("sq", "gallery")] = ("Galeria | Lulzim Tafa", "Fotografi nga jeta letrare, akademike dhe publike e Lulzim Tafës."),
        [("en", "awards")] = ("Awards and Recognition | Lulzim Tafa", "Explore international awards and distinctions received by poet and academic Lulzim Tafa."),
        [("sq", "awards")] = ("Çmime dhe mirënjohje | Lulzim Tafa", "Shfletoni çmimet dhe mirënjohjet ndërkombëtare të poetit dhe akademikut Lulzim Tafa.")
    };

    public string GetPublicOrigin(HttpRequest request)
    {
        var configured = configuration["Seo:SiteUrl"]?.TrimEnd('/');
        return !string.IsNullOrWhiteSpace(configured)
            ? configured
            : $"{request.Scheme}://{request.Host}";
    }

    public async Task<string> BuildSitemapAsync(string origin)
    {
        var pairs = Routes.Values
            .Where(route => route.En != "poetry/video")
            .Select(route => Pair(route.En, route.Sq))
            .ToList();

        var poemSlugs = await db.Poems.AsNoTracking().Select(item => item.Slug).ToListAsync();
        pairs.AddRange(poemSlugs.Select(slug => Pair($"poetry/{slug}", $"poezi/{slug}")));

        var newsItems = await db.NewsArticles.AsNoTracking().Include(item => item.Translations)
            .Where(item => !item.IsExternal && !item.HiddenFromList)
            .ToListAsync();
        pairs.AddRange(newsItems.Select(item =>
        {
            var albanianTitle = Pick(item.Translations, "sq", translation => translation.LanguageCode)?.Title;
            var albanianSlug = Slugify(albanianTitle) ?? item.Slug;
            return Pair($"news/{item.Slug}", $"lajme/{albanianSlug}");
        }));

        var awardSlugs = await db.Awards.AsNoTracking()
            .Where(item => item.Slug != null && item.Slug != "")
            .Select(item => item.Slug!)
            .ToListAsync();
        pairs.AddRange(awardSlugs.Select(slug => Pair($"awards/{slug}", $"cmimet/{slug}")));

        var videoSlugs = await db.VideoPoetryItems.AsNoTracking()
            .Where(item => item.Slug != null && item.Slug != "" && item.Type == "local")
            .Select(item => item.Slug!)
            .ToListAsync();
        pairs.Add(Pair("poetry/video", "poezi/video"));
        pairs.AddRange(videoSlugs.Select(slug => Pair($"poetry/video/{slug}", $"poezi/video/{slug}")));

        var xml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.Append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n");
        foreach (var pair in pairs.Distinct())
        {
            AppendSitemapUrl(xml, origin, pair.En, pair.En, pair.Sq);
            AppendSitemapUrl(xml, origin, pair.Sq, pair.En, pair.Sq);
        }
        xml.Append("</urlset>");
        return xml.ToString();
    }

    public async Task<string> InjectMetadataAsync(string html, PathString requestPath, string origin)
    {
        var route = ParseRoute(requestPath.Value ?? "/");
        if (route is null) return html;

        route = await ResolveDynamicPathsAsync(route);
        var metadata = await GetMetadataAsync(route.Language, route.Section, route.Slug);
        var canonical = $"{origin}/{route.Language}{(route.LocalizedPath.Length > 0 ? $"/{route.LocalizedPath}" : "")}";
        var enUrl = $"{origin}/en{(route.EnglishPath.Length > 0 ? $"/{route.EnglishPath}" : "")}";
        var sqUrl = $"{origin}/sq{(route.AlbanianPath.Length > 0 ? $"/{route.AlbanianPath}" : "")}";
        var jsonLd = JsonSerializer.Serialize(new
        {
            @context = "https://schema.org",
            @type = metadata.SchemaType,
            name = metadata.Title,
            description = metadata.Description,
            url = canonical,
            inLanguage = route.Language,
            isPartOf = new { @type = "WebSite", name = SiteName, url = origin },
            about = new { @type = "Person", name = "Lulzim Tafa", jobTitle = new[] { "Poet", "Author", "Academic" } }
        });

        var head = $"""
            <meta name="description" content="{Encode(metadata.Description)}" />
            <link rel="canonical" href="{Encode(canonical)}" />
            <link rel="alternate" hreflang="en" href="{Encode(enUrl)}" />
            <link rel="alternate" hreflang="sq" href="{Encode(sqUrl)}" />
            <link rel="alternate" hreflang="x-default" href="{Encode(enUrl)}" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Lulzim Tafa" />
            <meta property="og:title" content="{Encode(metadata.Title)}" />
            <meta property="og:description" content="{Encode(metadata.Description)}" />
            <meta property="og:url" content="{Encode(canonical)}" />
            <meta property="og:locale" content="{(route.Language == "sq" ? "sq_AL" : "en_US")}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="{Encode(metadata.Title)}" />
            <meta name="twitter:description" content="{Encode(metadata.Description)}" />
            <script type="application/ld+json">{jsonLd}</script>
        """;

        html = Regex.Replace(html, "<html lang=\"[^\"]*\">", $"<html lang=\"{route.Language}\">");
        html = Regex.Replace(html, "<title>.*?</title>", $"<title>{Encode(metadata.Title)}</title>", RegexOptions.Singleline);
        html = Regex.Replace(html, "<meta\\s+name=\"description\"[\\s\\S]*?/>", string.Empty, RegexOptions.IgnoreCase);
        return html.Replace("</head>", $"{head}\n</head>");
    }

    private async Task<Metadata> GetMetadataAsync(string language, string section, string? slug)
    {
        if (!string.IsNullOrWhiteSpace(slug) && section == "poetry")
        {
            var poem = await db.Poems.AsNoTracking().FirstOrDefaultAsync(item => item.Slug == slug);
            if (poem is not null) return new($"{poem.Title} | {SiteName}", Clean(poem.Excerpt), "CreativeWork");
        }

        if (!string.IsNullOrWhiteSpace(slug) && section == "news")
        {
            var articles = await db.NewsArticles.AsNoTracking().Include(item => item.Translations).ToListAsync();
            var article = articles.FirstOrDefault(item => item.Slug == slug
                || item.Translations.Any(translation => Slugify(translation.Title) == slug));
            if (article is not null)
            {
                var translation = Pick(article.Translations, language, item => item.LanguageCode);
                return new($"{translation?.Title ?? SiteName} | {SiteName}", Clean(translation?.Excerpt), "NewsArticle");
            }
        }

        if (!string.IsNullOrWhiteSpace(slug) && section == "awards")
        {
            var award = await db.Awards.AsNoTracking().Include(item => item.Translations).FirstOrDefaultAsync(item => item.Slug == slug);
            if (award is not null)
            {
                var translation = Pick(award.Translations, language, item => item.LanguageCode);
                return new($"{translation?.Title ?? SiteName} | {SiteName}", Clean(translation?.Description), "CreativeWork");
            }
        }

        var key = section == "poetry/video" ? "poetry" : section;
        var fallback = StaticMetadata.GetValueOrDefault((language, key), StaticMetadata[(language, "")]);
        return new(fallback.Title, fallback.Description, "WebPage");
    }

    private static T? Pick<T>(IEnumerable<T> items, string language, Func<T, string> languageSelector) where T : class =>
        items.FirstOrDefault(item => languageSelector(item) == language)
        ?? items.FirstOrDefault(item => languageSelector(item) == "en");

    private async Task<ParsedRoute> ResolveDynamicPathsAsync(ParsedRoute route)
    {
        if (route.Section != "news" || string.IsNullOrWhiteSpace(route.Slug)) return route;
        var articles = await db.NewsArticles.AsNoTracking().Include(item => item.Translations).ToListAsync();
        var article = articles.FirstOrDefault(item => item.Slug == route.Slug
            || item.Translations.Any(translation => Slugify(translation.Title) == route.Slug));
        if (article is null) return route;
        var albanianTitle = Pick(article.Translations, "sq", translation => translation.LanguageCode)?.Title;
        var albanianSlug = Slugify(albanianTitle) ?? article.Slug;
        return route with
        {
            Slug = route.Language == "sq" ? albanianSlug : article.Slug,
            LocalizedPath = route.Language == "sq" ? $"lajme/{albanianSlug}" : $"news/{article.Slug}",
            EnglishPath = $"news/{article.Slug}",
            AlbanianPath = $"lajme/{albanianSlug}"
        };
    }

    private static ParsedRoute? ParseRoute(string path)
    {
        var parts = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0 || parts[0] is not ("en" or "sq")) return null;
        var language = parts[0];
        var remainder = string.Join('/', parts.Skip(1));
        var route = Routes.OrderByDescending(item => item.Value.En.Length).FirstOrDefault(item => remainder == item.Value.En || remainder == item.Value.Sq
            || remainder.StartsWith($"{item.Value.En}/") || remainder.StartsWith($"{item.Value.Sq}/"));
        if (route.Value.En is null) return null;
        var section = route.Key ?? "";
        var localizedBase = language == "sq" ? route.Value.Sq : route.Value.En;
        var sourceBase = remainder.StartsWith(route.Value.Sq, StringComparison.Ordinal) ? route.Value.Sq : route.Value.En;
        var slug = remainder.Length > sourceBase.Length ? remainder[(sourceBase.Length + 1)..] : null;
        var englishPath = Join(route.Value.En, slug);
        var albanianPath = Join(route.Value.Sq, slug);
        return new(language, section, slug, Join(localizedBase, slug), englishPath, albanianPath);
    }

    private static (string En, string Sq) Pair(string en, string sq) => ($"en/{en}".TrimEnd('/'), $"sq/{sq}".TrimEnd('/'));
    private static string Join(string prefix, string? suffix) => string.IsNullOrWhiteSpace(suffix) ? prefix : $"{prefix}/{suffix}";
    private static string Encode(string value) => WebUtility.HtmlEncode(value);
    private static string? Slugify(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var decomposed = value.Normalize(NormalizationForm.FormD);
        var withoutMarks = new string(decomposed.Where(character =>
            System.Globalization.CharUnicodeInfo.GetUnicodeCategory(character) != System.Globalization.UnicodeCategory.NonSpacingMark).ToArray());
        var slug = Regex.Replace(withoutMarks.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? null : slug;
    }
    private static string Clean(string? value)
    {
        var text = Regex.Replace(value ?? string.Empty, "<[^>]+>", " ");
        text = Regex.Replace(WebUtility.HtmlDecode(text), "\\s+", " ").Trim();
        if (text.Length > 160) text = $"{text[..157].TrimEnd()}...";
        return string.IsNullOrWhiteSpace(text) ? "Official website of Lulzim Tafa, academic, author and poet." : text;
    }

    private static void AppendSitemapUrl(StringBuilder xml, string origin, string location, string en, string sq)
    {
        xml.Append("  <url><loc>").Append(Encode($"{origin}/{location}")).Append("</loc>")
            .Append("<xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"").Append(Encode($"{origin}/{en}")).Append("\" />")
            .Append("<xhtml:link rel=\"alternate\" hreflang=\"sq\" href=\"").Append(Encode($"{origin}/{sq}")).Append("\" />")
            .Append("<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"").Append(Encode($"{origin}/{en}")).Append("\" /></url>\n");
    }

    private sealed record Metadata(string Title, string Description, string SchemaType);
    private sealed record ParsedRoute(string Language, string Section, string? Slug, string LocalizedPath, string EnglishPath, string AlbanianPath);
}

