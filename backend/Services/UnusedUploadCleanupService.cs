using System.Text.RegularExpressions;
using LulzimTafa.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Services;

public sealed partial class UnusedUploadCleanupService(
    IServiceScopeFactory scopeFactory,
    IWebHostEnvironment environment,
    IConfiguration configuration,
    ILogger<UnusedUploadCleanupService> logger) : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromHours(Math.Max(1, configuration.GetValue("UploadCleanup:IntervalHours", 12)));
    private readonly TimeSpan _gracePeriod = TimeSpan.FromDays(Math.Max(1, configuration.GetValue("UploadCleanup:GracePeriodDays", 7)));
    private readonly bool _isEnabled = configuration.GetValue("UploadCleanup:Enabled", true);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_isEnabled)
        {
            logger.LogInformation("Unused upload cleanup is disabled.");
            return;
        }

        try
        {
            using var timer = new PeriodicTimer(_interval);
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await RunCleanup(stoppingToken);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            // Normal shutdown path.
        }
    }

    private async Task RunCleanup(CancellationToken stoppingToken)
    {
        try
        {
            var uploadsRoot = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsRoot)) return;

            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var referencedPaths = await GetReferencedUploadPaths(db, stoppingToken);
            var cutoffUtc = DateTime.UtcNow.Subtract(_gracePeriod);
            var deletedCount = 0;

            foreach (var file in Directory.EnumerateFiles(uploadsRoot, "*", SearchOption.AllDirectories))
            {
                stoppingToken.ThrowIfCancellationRequested();

                var info = new FileInfo(file);
                if (info.LastWriteTimeUtc > cutoffUtc) continue;

                var uploadPath = ToUploadPath(uploadsRoot, info.FullName);
                if (referencedPaths.Contains(uploadPath)) continue;

                info.Delete();
                deletedCount++;
                logger.LogInformation("Deleted unused upload {UploadPath}.", uploadPath);
            }

            if (deletedCount > 0)
            {
                logger.LogInformation("Deleted {DeletedCount} unused upload file(s).", deletedCount);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
        catch (Exception error)
        {
            logger.LogWarning(error, "Unused upload cleanup failed.");
        }
    }

    private static async Task<HashSet<string>> GetReferencedUploadPaths(AppDbContext db, CancellationToken cancellationToken)
    {
        var referencedPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        void Add(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return;

            foreach (Match match in UploadPathRegex().Matches(value))
            {
                var path = match.Value.Split(['?', '#'], 2)[0].TrimEnd('.', ',', ';', ')', ']');
                referencedPaths.Add(Uri.UnescapeDataString(path));
            }
        }

        foreach (var book in await db.Books.AsNoTracking().Select(book => new { book.CoverImagePath, book.MockupImagePath }).ToListAsync(cancellationToken))
        {
            Add(book.CoverImagePath);
            Add(book.MockupImagePath);
        }

        foreach (var imagePath in await db.BookImages.AsNoTracking().Select(image => image.ImagePath).ToListAsync(cancellationToken))
        {
            Add(imagePath);
        }

        foreach (var paperImagePath in await db.Poems.AsNoTracking().Select(poem => poem.PaperImagePath).ToListAsync(cancellationToken))
        {
            Add(paperImagePath);
        }

        foreach (var article in await db.NewsArticles.AsNoTracking().Select(article => new { article.ImagePath, article.ThumbnailImagePath, article.VideoUrl }).ToListAsync(cancellationToken))
        {
            Add(article.ImagePath);
            Add(article.ThumbnailImagePath);
            Add(article.VideoUrl);
        }

        foreach (var body in await db.NewsArticleTranslations.AsNoTracking().Select(translation => translation.Body).ToListAsync(cancellationToken))
        {
            Add(body);
        }

        foreach (var award in await db.Awards.AsNoTracking().Select(award => new { award.IconPath, award.CertificateImagePath }).ToListAsync(cancellationToken))
        {
            Add(award.IconPath);
            Add(award.CertificateImagePath);
        }

        foreach (var imagePath in await db.GalleryImages.AsNoTracking().Select(image => image.ImagePath).ToListAsync(cancellationToken))
        {
            Add(imagePath);
        }

        foreach (var iconPath in await db.SocialLinks.AsNoTracking().Select(link => link.IconPath).ToListAsync(cancellationToken))
        {
            Add(iconPath);
        }

        foreach (var settingValue in await db.SiteSettings.AsNoTracking().Select(setting => setting.Value).ToListAsync(cancellationToken))
        {
            Add(settingValue);
        }

        return referencedPaths;
    }

    private static string ToUploadPath(string uploadsRoot, string filePath)
    {
        var relativePath = Path.GetRelativePath(uploadsRoot, filePath).Replace(Path.DirectorySeparatorChar, '/');
        return $"/uploads/{relativePath}";
    }

    [GeneratedRegex(@"/uploads/[^\s""'<>\\]+", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex UploadPathRegex();
}
