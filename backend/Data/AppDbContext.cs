using LulzimTafa.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
    public DbSet<BookImage> BookImages => Set<BookImage>();
    public DbSet<Poem> Poems => Set<Poem>();
    public DbSet<PoemLanguage> PoemLanguages => Set<PoemLanguage>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<Award> Awards => Set<Award>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().HasIndex(book => book.Slug).IsUnique();
        modelBuilder.Entity<Poem>().HasIndex(poem => poem.Slug).IsUnique();
        modelBuilder.Entity<NewsArticle>().HasIndex(article => article.Slug).IsUnique();
        modelBuilder.Entity<PoemLanguage>().HasIndex(language => language.Name).IsUnique();

        modelBuilder.Entity<Book>()
            .HasMany(book => book.Images)
            .WithOne(image => image.Book)
            .HasForeignKey(image => image.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Poem>()
            .HasOne(poem => poem.Language)
            .WithMany(language => language.Poems)
            .HasForeignKey(poem => poem.PoemLanguageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
