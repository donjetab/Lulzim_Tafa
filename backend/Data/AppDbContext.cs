using LulzimTafa.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
    public DbSet<BookTranslation> BookTranslations => Set<BookTranslation>();
    public DbSet<BookImage> BookImages => Set<BookImage>();
    public DbSet<Poem> Poems => Set<Poem>();
    public DbSet<PoemLanguage> PoemLanguages => Set<PoemLanguage>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<NewsArticleTranslation> NewsArticleTranslations => Set<NewsArticleTranslation>();
    public DbSet<Award> Awards => Set<Award>();
    public DbSet<AwardTranslation> AwardTranslations => Set<AwardTranslation>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<GalleryImageTranslation> GalleryImageTranslations => Set<GalleryImageTranslation>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<TestimonialTranslation> TestimonialTranslations => Set<TestimonialTranslation>();
    public DbSet<VideoPoetryItem> VideoPoetryItems => Set<VideoPoetryItem>();
    public DbSet<VideoPoetryItemTranslation> VideoPoetryItemTranslations => Set<VideoPoetryItemTranslation>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<SiteTranslation> SiteTranslations => Set<SiteTranslation>();
    public DbSet<PageSection> PageSections => Set<PageSection>();
    public DbSet<PageSectionTranslation> PageSectionTranslations => Set<PageSectionTranslation>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().HasIndex(book => book.Slug).IsUnique();
        modelBuilder.Entity<Poem>().HasIndex(poem => poem.Slug).IsUnique();
        modelBuilder.Entity<NewsArticle>().HasIndex(article => article.Slug).IsUnique();
        modelBuilder.Entity<Award>().HasIndex(award => award.Slug);
        modelBuilder.Entity<PoemLanguage>().HasIndex(language => language.Name).IsUnique();
        modelBuilder.Entity<AdminUser>().HasIndex(admin => admin.Username).IsUnique();
        modelBuilder.Entity<SiteSetting>().HasIndex(setting => setting.Key).IsUnique();
        modelBuilder.Entity<SiteTranslation>().HasIndex(translation => new { translation.Key, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<PageSection>().HasIndex(section => new { section.PageKey, section.SectionKey }).IsUnique();
        modelBuilder.Entity<PageSectionTranslation>().HasIndex(translation => new { translation.PageSectionId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<BookTranslation>().HasIndex(translation => new { translation.BookId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<NewsArticleTranslation>().HasIndex(translation => new { translation.NewsArticleId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<AwardTranslation>().HasIndex(translation => new { translation.AwardId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<GalleryImageTranslation>().HasIndex(translation => new { translation.GalleryImageId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<TestimonialTranslation>().HasIndex(translation => new { translation.TestimonialId, translation.LanguageCode }).IsUnique();
        modelBuilder.Entity<VideoPoetryItemTranslation>().HasIndex(translation => new { translation.VideoPoetryItemId, translation.LanguageCode }).IsUnique();

        modelBuilder.Entity<VideoPoetryItem>().HasKey(item => item.Id);

        modelBuilder.Entity<Book>()
            .HasMany(book => book.Images)
            .WithOne(image => image.Book)
            .HasForeignKey(image => image.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Book>()
            .HasMany(book => book.Translations)
            .WithOne(translation => translation.Book)
            .HasForeignKey(translation => translation.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NewsArticle>()
            .HasMany(article => article.Translations)
            .WithOne(translation => translation.NewsArticle)
            .HasForeignKey(translation => translation.NewsArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Award>()
            .HasMany(award => award.Translations)
            .WithOne(translation => translation.Award)
            .HasForeignKey(translation => translation.AwardId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<GalleryImage>()
            .HasMany(image => image.Translations)
            .WithOne(translation => translation.GalleryImage)
            .HasForeignKey(translation => translation.GalleryImageId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Testimonial>()
            .HasMany(testimonial => testimonial.Translations)
            .WithOne(translation => translation.Testimonial)
            .HasForeignKey(translation => translation.TestimonialId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VideoPoetryItem>()
            .HasMany(item => item.Translations)
            .WithOne(translation => translation.VideoPoetryItem)
            .HasForeignKey(translation => translation.VideoPoetryItemId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PageSection>()
            .HasMany(section => section.Translations)
            .WithOne(translation => translation.PageSection)
            .HasForeignKey(translation => translation.PageSectionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Poem>()
            .HasOne(poem => poem.Language)
            .WithMany(language => language.Poems)
            .HasForeignKey(poem => poem.PoemLanguageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
