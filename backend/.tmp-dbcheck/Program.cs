using LulzimTafa.Api.Data;
using Microsoft.EntityFrameworkCore;

const string connectionString = "Server=.\\SQLEXPRESS;Database=LulzimTafaDb;Trusted_Connection=True;MultipleActiveResultSets=true;Encrypt=False;TrustServerCertificate=True";

var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlServer(connectionString)
    .Options;

await using var db = new AppDbContext(options);

var mappedTables = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
{
    "__EFMigrationsHistory",
    "AdminUsers",
    "Awards",
    "AwardTranslations",
    "BookImages",
    "Books",
    "BookTranslations",
    "ContactMessages",
    "GalleryImages",
    "GalleryImageTranslations",
    "NewsArticles",
    "NewsArticleTranslations",
    "PageSections",
    "PageSectionTranslations",
    "PoemLanguages",
    "Poems",
    "SiteSettings",
    "SiteTranslations",
    "SocialLinks",
    "Testimonials",
    "TestimonialTranslations",
    "VideoPoetryItems",
    "VideoPoetryItemTranslations",
};

var droppableOrphans = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
{
    "ContentTranslations",
    "Interviews",
    "InterviewTranslations",
};

var tables = await db.Database.SqlQueryRaw<string>("""
SELECT [name] AS [Value]
FROM sys.tables
WHERE is_ms_shipped = 0
ORDER BY [name]
""").ToListAsync();

Console.WriteLine("SQL user tables");
foreach (var table in tables) Console.WriteLine(table);

Console.WriteLine();
Console.WriteLine("Tables not mapped by the current backend");
var unmappedTables = tables.Where(table => !mappedTables.Contains(table)).ToList();
if (unmappedTables.Count == 0) Console.WriteLine("(none)");
foreach (var table in unmappedTables) Console.WriteLine(table);

var existingDroppableOrphans = tables.Where(table => droppableOrphans.Contains(table)).ToList();
Console.WriteLine();
Console.WriteLine("Old tables selected for cleanup");
if (existingDroppableOrphans.Count == 0) Console.WriteLine("(none)");
foreach (var table in existingDroppableOrphans) Console.WriteLine(table);

if (!args.Contains("--drop-orphans", StringComparer.OrdinalIgnoreCase)) return;

if (existingDroppableOrphans.Contains("InterviewTranslations", StringComparer.OrdinalIgnoreCase))
{
    await db.Database.ExecuteSqlRawAsync("DROP TABLE [InterviewTranslations];");
    Console.WriteLine("Dropped InterviewTranslations");
}

if (existingDroppableOrphans.Contains("Interviews", StringComparer.OrdinalIgnoreCase))
{
    await db.Database.ExecuteSqlRawAsync("DROP TABLE [Interviews];");
    Console.WriteLine("Dropped Interviews");
}

if (existingDroppableOrphans.Contains("ContentTranslations", StringComparer.OrdinalIgnoreCase))
{
    await db.Database.ExecuteSqlRawAsync("DROP TABLE [ContentTranslations];");
    Console.WriteLine("Dropped ContentTranslations");
}
