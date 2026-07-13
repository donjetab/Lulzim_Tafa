using System.Text.Json;
using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Services;

public static class MultilingualContentInitializer
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await CreateTablesAsync(db);
        await AddCmsColumnsAsync(db);
        await SeedEntityTranslationsAsync(db);
        await MoveSiteSettingTranslationsAsync(db);
        await MovePageSectionsAsync(db);
        await MoveVideoPoetryItemsAsync(db);
        await DropDuplicatedTextColumnsAsync(db);
    }

    private static async Task AddCmsColumnsAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync("""
IF OBJECT_ID(N'[NewsArticles]', N'U') IS NOT NULL
BEGIN
    IF COL_LENGTH('NewsArticles', 'ThumbnailImagePath') IS NULL
        ALTER TABLE [NewsArticles] ADD [ThumbnailImagePath] nvarchar(max) NULL;
    IF COL_LENGTH('NewsArticles', 'SourceUrl') IS NULL
        ALTER TABLE [NewsArticles] ADD [SourceUrl] nvarchar(max) NULL;
    IF COL_LENGTH('NewsArticles', 'VideoType') IS NULL
        ALTER TABLE [NewsArticles] ADD [VideoType] nvarchar(40) NULL;
    IF COL_LENGTH('NewsArticles', 'VideoUrl') IS NULL
        ALTER TABLE [NewsArticles] ADD [VideoUrl] nvarchar(max) NULL;
    IF COL_LENGTH('NewsArticles', 'HiddenFromList') IS NULL
        ALTER TABLE [NewsArticles] ADD [HiddenFromList] bit NOT NULL CONSTRAINT [DF_NewsArticles_HiddenFromList] DEFAULT 0;
END;

IF OBJECT_ID(N'[Awards]', N'U') IS NOT NULL
BEGIN
    IF COL_LENGTH('Awards', 'Slug') IS NULL
        ALTER TABLE [Awards] ADD [Slug] nvarchar(220) NULL;
    IF COL_LENGTH('Awards', 'Layout') IS NULL
        ALTER TABLE [Awards] ADD [Layout] nvarchar(40) NULL;
END;
""");
    }

    private static async Task CreateTablesAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync("""
IF OBJECT_ID(N'[SiteTranslations]', N'U') IS NULL
BEGIN
    CREATE TABLE [SiteTranslations] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_SiteTranslations] PRIMARY KEY,
        [Key] nvarchar(160) NOT NULL,
        [LanguageCode] nvarchar(8) NOT NULL,
        [Value] nvarchar(max) NOT NULL
    );
    CREATE UNIQUE INDEX [IX_SiteTranslations_Key_LanguageCode] ON [SiteTranslations] ([Key], [LanguageCode]);
END;

IF OBJECT_ID(N'[PageSections]', N'U') IS NULL
BEGIN
    CREATE TABLE [PageSections] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_PageSections] PRIMARY KEY,
        [PageKey] nvarchar(80) NOT NULL,
        [SectionKey] nvarchar(120) NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL
    );
    CREATE UNIQUE INDEX [IX_PageSections_PageKey_SectionKey] ON [PageSections] ([PageKey], [SectionKey]);
END;

IF OBJECT_ID(N'[PageSectionTranslations]', N'U') IS NULL
BEGIN
    CREATE TABLE [PageSectionTranslations] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_PageSectionTranslations] PRIMARY KEY,
        [PageSectionId] int NOT NULL,
        [LanguageCode] nvarchar(8) NOT NULL,
        [Title] nvarchar(220) NULL,
        [Subtitle] nvarchar(220) NULL,
        [Content] nvarchar(max) NULL,
        [ExtraJson] nvarchar(max) NULL,
        CONSTRAINT [FK_PageSectionTranslations_PageSections_PageSectionId] FOREIGN KEY ([PageSectionId]) REFERENCES [PageSections] ([Id]) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX [IX_PageSectionTranslations_PageSectionId_LanguageCode] ON [PageSectionTranslations] ([PageSectionId], [LanguageCode]);
END;
""");

        await CreateTranslationTableAsync(db, "BookTranslations", "BookId", "Books", """
        [Title] nvarchar(180) NULL,
        [Category] nvarchar(80) NULL,
        [Location] nvarchar(120) NULL,
        [Summary] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL
""");
        await CreateTranslationTableAsync(db, "NewsArticleTranslations", "NewsArticleId", "NewsArticles", """
        [Title] nvarchar(220) NULL,
        [Category] nvarchar(80) NULL,
        [Excerpt] nvarchar(max) NULL,
        [Body] nvarchar(max) NULL,
        [GalleryImagesJson] nvarchar(max) NULL,
        [RelatedSourcesJson] nvarchar(max) NULL
""");
        await CreateTranslationTableAsync(db, "AwardTranslations", "AwardId", "Awards", """
        [Title] nvarchar(220) NULL,
        [Description] nvarchar(max) NULL,
        [Location] nvarchar(120) NULL
""");
        await CreateTranslationTableAsync(db, "GalleryImageTranslations", "GalleryImageId", "GalleryImages", """
        [Caption] nvarchar(220) NULL
""");
        await CreateTranslationTableAsync(db, "TestimonialTranslations", "TestimonialId", "Testimonials", """
        [Quote] nvarchar(max) NULL,
        [AuthorName] nvarchar(160) NULL,
        [AuthorTitle] nvarchar(160) NULL
""");

        await db.Database.ExecuteSqlRawAsync("""
IF OBJECT_ID(N'[VideoPoetryItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [VideoPoetryItems] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_VideoPoetryItems] PRIMARY KEY,
        [Slug] nvarchar(220) NULL,
        [Type] nvarchar(40) NULL,
        [Url] nvarchar(max) NULL,
        [Filename] nvarchar(max) NULL,
        [ThumbnailImagePath] nvarchar(max) NULL,
        [PreviewFit] nvarchar(40) NULL,
        [PreviewTime] float NULL,
        [IsFeatured] bit NOT NULL,
        [DisplayOrder] int NOT NULL
    );
END;

IF OBJECT_ID(N'[VideoPoetryItemTranslations]', N'U') IS NULL
BEGIN
    CREATE TABLE [VideoPoetryItemTranslations] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_VideoPoetryItemTranslations] PRIMARY KEY,
        [VideoPoetryItemId] int NOT NULL,
        [LanguageCode] nvarchar(8) NOT NULL,
        [Title] nvarchar(220) NULL,
        [Description] nvarchar(max) NULL,
        CONSTRAINT [FK_VideoPoetryItemTranslations_VideoPoetryItems_VideoPoetryItemId] FOREIGN KEY ([VideoPoetryItemId]) REFERENCES [VideoPoetryItems] ([Id]) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX [IX_VideoPoetryItemTranslations_VideoPoetryItemId_LanguageCode] ON [VideoPoetryItemTranslations] ([VideoPoetryItemId], [LanguageCode]);
END;

IF OBJECT_ID(N'[VideoPoetryItemTranslations]', N'U') IS NOT NULL
    AND COL_LENGTH('VideoPoetryItemTranslations', 'Description') IS NULL
BEGIN
    ALTER TABLE [VideoPoetryItemTranslations] ADD [Description] nvarchar(max) NULL;
END;
""");
    }

    private static Task CreateTranslationTableAsync(AppDbContext db, string table, string parentColumn, string parentTable, string fields)
    {
        var sql = $"""
IF OBJECT_ID(N'[{table}]', N'U') IS NULL
BEGIN
    CREATE TABLE [{table}] (
        [Id] int IDENTITY(1,1) NOT NULL CONSTRAINT [PK_{table}] PRIMARY KEY,
        [{parentColumn}] int NOT NULL,
        [LanguageCode] nvarchar(8) NOT NULL,
{fields},
        CONSTRAINT [FK_{table}_{parentTable}_{parentColumn}] FOREIGN KEY ([{parentColumn}]) REFERENCES [{parentTable}] ([Id]) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX [IX_{table}_{parentColumn}_LanguageCode] ON [{table}] ([{parentColumn}], [LanguageCode]);
END;
""";
        return db.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task SeedEntityTranslationsAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync("""
IF COL_LENGTH('Books', 'Title') IS NOT NULL
    EXEC(N'INSERT INTO [BookTranslations] ([BookId], [LanguageCode], [Title], [Category], [Location], [Summary], [Description])
        SELECT [Id], ''en'', [Title], [Category], [Location], [Summary], [Description]
        FROM [Books] b
        WHERE NOT EXISTS (SELECT 1 FROM [BookTranslations] t WHERE t.[BookId] = b.[Id] AND t.[LanguageCode] = ''en'')');

IF COL_LENGTH('NewsArticles', 'Title') IS NOT NULL
    EXEC(N'INSERT INTO [NewsArticleTranslations] ([NewsArticleId], [LanguageCode], [Title], [Category], [Excerpt], [Body])
        SELECT [Id], ''en'', [Title], [Category], [Excerpt], [Body]
        FROM [NewsArticles] n
        WHERE NOT EXISTS (SELECT 1 FROM [NewsArticleTranslations] t WHERE t.[NewsArticleId] = n.[Id] AND t.[LanguageCode] = ''en'')');

IF COL_LENGTH('NewsArticles', 'GalleryImagesJson') IS NOT NULL
    EXEC(N'UPDATE t SET [GalleryImagesJson] = n.[GalleryImagesJson]
        FROM [NewsArticleTranslations] t
        INNER JOIN [NewsArticles] n ON n.[Id] = t.[NewsArticleId]
        WHERE t.[LanguageCode] = ''en'' AND t.[GalleryImagesJson] IS NULL');

IF COL_LENGTH('NewsArticles', 'RelatedSourcesJson') IS NOT NULL
    EXEC(N'UPDATE t SET [RelatedSourcesJson] = n.[RelatedSourcesJson]
        FROM [NewsArticleTranslations] t
        INNER JOIN [NewsArticles] n ON n.[Id] = t.[NewsArticleId]
        WHERE t.[LanguageCode] = ''en'' AND t.[RelatedSourcesJson] IS NULL');

IF COL_LENGTH('Awards', 'Title') IS NOT NULL
    EXEC(N'INSERT INTO [AwardTranslations] ([AwardId], [LanguageCode], [Title], [Description])
        SELECT [Id], ''en'', [Title], [Description]
        FROM [Awards] a
        WHERE NOT EXISTS (SELECT 1 FROM [AwardTranslations] t WHERE t.[AwardId] = a.[Id] AND t.[LanguageCode] = ''en'')');

IF COL_LENGTH('Awards', 'Location') IS NOT NULL
    EXEC(N'UPDATE t SET [Location] = a.[Location]
        FROM [AwardTranslations] t
        INNER JOIN [Awards] a ON a.[Id] = t.[AwardId]
        WHERE t.[LanguageCode] = ''en'' AND t.[Location] IS NULL');

IF COL_LENGTH('GalleryImages', 'Caption') IS NOT NULL
    EXEC(N'INSERT INTO [GalleryImageTranslations] ([GalleryImageId], [LanguageCode], [Caption])
        SELECT [Id], ''en'', [Caption]
        FROM [GalleryImages] g
        WHERE NOT EXISTS (SELECT 1 FROM [GalleryImageTranslations] t WHERE t.[GalleryImageId] = g.[Id] AND t.[LanguageCode] = ''en'')');

IF COL_LENGTH('Testimonials', 'Quote') IS NOT NULL
    EXEC(N'INSERT INTO [TestimonialTranslations] ([TestimonialId], [LanguageCode], [Quote], [AuthorName], [AuthorTitle])
        SELECT [Id], ''en'', [Quote], [AuthorName], [AuthorTitle]
        FROM [Testimonials] t0
        WHERE NOT EXISTS (SELECT 1 FROM [TestimonialTranslations] t WHERE t.[TestimonialId] = t0.[Id] AND t.[LanguageCode] = ''en'')');

IF COL_LENGTH('VideoPoetryItems', 'Title') IS NOT NULL
    EXEC(N'INSERT INTO [VideoPoetryItemTranslations] ([VideoPoetryItemId], [LanguageCode], [Title])
        SELECT [Id], ''en'', [Title]
        FROM [VideoPoetryItems] v
        WHERE NOT EXISTS (SELECT 1 FROM [VideoPoetryItemTranslations] t WHERE t.[VideoPoetryItemId] = v.[Id] AND t.[LanguageCode] = ''en'')');
""");
    }

    private static async Task MoveSiteSettingTranslationsAsync(AppDbContext db)
    {
        var settings = await db.SiteSettings.AsNoTracking().ToListAsync();
        foreach (var setting in settings)
        {
            if (setting.Key.StartsWith("translation.", StringComparison.OrdinalIgnoreCase))
            {
                var parts = setting.Key.Split('.', 3);
                if (parts.Length == 3) await UpsertSiteTranslation(db, parts[2], parts[1], setting.Value);
            }
            else if (setting.Key.EndsWith(".en", StringComparison.OrdinalIgnoreCase) || setting.Key.EndsWith(".sq", StringComparison.OrdinalIgnoreCase))
            {
                var language = setting.Key[^2..].ToLowerInvariant();
                var key = setting.Key[..^3];
                await UpsertSiteTranslation(db, key, language, setting.Value);
            }
            else if (setting.Key.StartsWith("content.", StringComparison.OrdinalIgnoreCase))
            {
                await MoveLegacyContentSetting(db, setting);
            }
        }

        await db.SaveChangesAsync();
    }

    private static async Task MoveLegacyContentSetting(AppDbContext db, SiteSetting setting)
    {
        var parts = setting.Key.Split('.');
        if (parts.Length < 5) return;

        var collection = parts[1];
        var parentId = parts[2];
        var field = parts[3];
        var language = parts[4].ToLowerInvariant();
        var value = setting.Value;

        switch (collection)
        {
            case "books" when int.TryParse(parentId, out var bookId):
                var book = await db.BookTranslations.FirstOrDefaultAsync(item => item.BookId == bookId && item.LanguageCode == language)
                    ?? Add(db, new BookTranslation { BookId = bookId, LanguageCode = language });
                SetBookField(book, field, value);
                break;
            case "news" when int.TryParse(parentId, out var newsId):
                var news = await db.NewsArticleTranslations.FirstOrDefaultAsync(item => item.NewsArticleId == newsId && item.LanguageCode == language)
                    ?? Add(db, new NewsArticleTranslation { NewsArticleId = newsId, LanguageCode = language });
                SetNewsField(news, field, value);
                break;
            case "awards" when int.TryParse(parentId, out var awardId):
                var award = await db.AwardTranslations.FirstOrDefaultAsync(item => item.AwardId == awardId && item.LanguageCode == language)
                    ?? Add(db, new AwardTranslation { AwardId = awardId, LanguageCode = language });
                if (field == "title") award.Title = value;
                if (field == "description") award.Description = value;
                if (field == "location") award.Location = value;
                break;
            case "gallery" when int.TryParse(parentId, out var imageId):
                var image = await db.GalleryImageTranslations.FirstOrDefaultAsync(item => item.GalleryImageId == imageId && item.LanguageCode == language)
                    ?? Add(db, new GalleryImageTranslation { GalleryImageId = imageId, LanguageCode = language });
                if (field == "caption") image.Caption = value;
                break;
            case "testimonials" when int.TryParse(parentId, out var testimonialId):
                var testimonial = await db.TestimonialTranslations.FirstOrDefaultAsync(item => item.TestimonialId == testimonialId && item.LanguageCode == language)
                    ?? Add(db, new TestimonialTranslation { TestimonialId = testimonialId, LanguageCode = language });
                if (field == "quote") testimonial.Quote = value;
                if (field == "authorName") testimonial.AuthorName = value;
                if (field == "authorTitle") testimonial.AuthorTitle = value;
                break;
            case "video-poetry":
                var videoItem = await db.VideoPoetryItems.FirstOrDefaultAsync(item => item.Slug == parentId);
                if (videoItem is null) break;
                var video = await db.VideoPoetryItemTranslations.FirstOrDefaultAsync(item => item.VideoPoetryItemId == videoItem.Id && item.LanguageCode == language)
                    ?? Add(db, new VideoPoetryItemTranslation { VideoPoetryItemId = videoItem.Id, LanguageCode = language });
                if (field == "title") video.Title = value;
                if (field == "description") video.Description = value;
                break;
        }
    }

    private static async Task MovePageSectionsAsync(AppDbContext db)
    {
        var map = new (string SettingKey, string PageKey, string SectionKey, int Order)[]
        {
            ("heroTitle", "home", "hero", 10),
            ("heroText", "home", "hero", 10),
            ("biography", "about", "biography", 20),
            ("aboutIntroParagraphs", "about", "intro", 10),
            ("quickFacts", "about", "quick-facts", 30),
            ("mediaSpotlightLinks", "media", "spotlight-links", 10),
        };

        var settings = await db.SiteSettings.AsNoTracking().ToListAsync();
        foreach (var group in map.GroupBy(item => new { item.PageKey, item.SectionKey, item.Order }))
        {
            var section = await db.PageSections.Include(item => item.Translations).FirstOrDefaultAsync(item => item.PageKey == group.Key.PageKey && item.SectionKey == group.Key.SectionKey);
            if (section is null)
            {
                section = new PageSection { PageKey = group.Key.PageKey, SectionKey = group.Key.SectionKey, DisplayOrder = group.Key.Order, IsActive = true };
                db.PageSections.Add(section);
                await db.SaveChangesAsync();
            }

            foreach (var language in new[] { "en", "sq" })
            {
                var translation = section.Translations.FirstOrDefault(item => item.LanguageCode == language)
                    ?? Add(db, new PageSectionTranslation { PageSectionId = section.Id, LanguageCode = language });

                foreach (var item in group)
                {
                    var setting = settings.FirstOrDefault(current => current.Key == $"{item.SettingKey}.{language}") ?? settings.FirstOrDefault(current => current.Key == item.SettingKey);
                    if (setting is null) continue;

                    if (item.SettingKey == "heroTitle") translation.Title = setting.Value;
                    else if (item.SettingKey == "heroText") translation.Content = setting.Value;
                    else if (item.SettingKey is "quickFacts" or "mediaSpotlightLinks") translation.ExtraJson = setting.Value;
                    else translation.Content = setting.Value;
                }
            }
        }

        await db.SaveChangesAsync();
    }

    private static async Task MoveVideoPoetryItemsAsync(AppDbContext db)
    {
        if (await db.VideoPoetryItems.AnyAsync()) return;

        var record = await db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(setting => setting.Key == "videoPoetryItemsJson");
        if (string.IsNullOrWhiteSpace(record?.Value)) return;

        var items = JsonSerializer.Deserialize<List<LegacyVideoPoetryItem>>(record.Value, JsonOptions) ?? [];
        foreach (var item in items.Where(item => !string.IsNullOrWhiteSpace(item.Id)))
        {
            db.VideoPoetryItems.Add(new VideoPoetryItem
            {
                Slug = item.Slug,
                Type = item.Type,
                Url = item.Url,
                Filename = item.Filename,
                ThumbnailImagePath = item.ThumbnailImagePath,
                PreviewFit = item.PreviewFit,
                PreviewTime = item.PreviewTime,
                IsFeatured = item.IsFeatured,
                DisplayOrder = item.DisplayOrder,
                Translations =
                [
                    new VideoPoetryItemTranslation
                    {
                        LanguageCode = "en",
                        Title = item.Title,
                    },
                ],
            });
        }

        await db.SaveChangesAsync();
    }

    private static async Task DropDuplicatedTextColumnsAsync(AppDbContext db)
    {
        await DropColumnIfExists(db, "Books", "Title");
        await DropColumnIfExists(db, "Books", "Category");
        await DropColumnIfExists(db, "Books", "Location");
        await DropColumnIfExists(db, "Books", "Summary");
        await DropColumnIfExists(db, "Books", "Description");

        await DropColumnIfExists(db, "NewsArticles", "Title");
        await DropColumnIfExists(db, "NewsArticles", "Category");
        await DropColumnIfExists(db, "NewsArticles", "Excerpt");
        await DropColumnIfExists(db, "NewsArticles", "Body");
        await DropColumnIfExists(db, "NewsArticles", "GalleryImagesJson");
        await DropColumnIfExists(db, "NewsArticles", "RelatedSourcesJson");

        await DropColumnIfExists(db, "Awards", "Title");
        await DropColumnIfExists(db, "Awards", "Description");
        await DropColumnIfExists(db, "Awards", "Location");

        await DropColumnIfExists(db, "GalleryImages", "Caption");

        await DropColumnIfExists(db, "Testimonials", "Quote");
        await DropColumnIfExists(db, "Testimonials", "AuthorName");
        await DropColumnIfExists(db, "Testimonials", "AuthorTitle");

        await DropColumnIfExists(db, "VideoPoetryItems", "Title");
    }

    private static Task DropColumnIfExists(AppDbContext db, string table, string column)
    {
        var sql = $"""
IF COL_LENGTH('{table}', '{column}') IS NOT NULL
BEGIN
    ALTER TABLE [{table}] DROP COLUMN [{column}];
END;
""";
        return db.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task UpsertSiteTranslation(AppDbContext db, string key, string language, string value)
    {
        var existing = await db.SiteTranslations.FirstOrDefaultAsync(item => item.Key == key && item.LanguageCode == language);
        if (existing is null) db.SiteTranslations.Add(new SiteTranslation { Key = key, LanguageCode = language, Value = value });
        else existing.Value = value;
    }

    private static T Add<T>(AppDbContext db, T entity) where T : class
    {
        db.Set<T>().Add(entity);
        return entity;
    }

    private static void SetBookField(BookTranslation translation, string field, string value)
    {
        if (field == "title") translation.Title = value;
        if (field == "category") translation.Category = value;
        if (field == "location") translation.Location = value;
        if (field == "summary") translation.Summary = value;
        if (field == "description") translation.Description = value;
    }

    private static void SetNewsField(NewsArticleTranslation translation, string field, string value)
    {
        if (field == "title") translation.Title = value;
        if (field == "category") translation.Category = value;
        if (field == "excerpt") translation.Excerpt = value;
        if (field == "body") translation.Body = value;
        if (field == "galleryImagesJson") translation.GalleryImagesJson = value;
        if (field == "relatedSourcesJson") translation.RelatedSourcesJson = value;
    }

    private sealed class LegacyVideoPoetryItem
    {
        public string? Id { get; set; }
        public string? Slug { get; set; }
        public string? Title { get; set; }
        public string? Type { get; set; }
        public string? Url { get; set; }
        public string? Filename { get; set; }
        public string? ThumbnailImagePath { get; set; }
        public string? PreviewFit { get; set; }
        public double? PreviewTime { get; set; }
        public bool IsFeatured { get; set; }
        public int DisplayOrder { get; set; }
    }
}
