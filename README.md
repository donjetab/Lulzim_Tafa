# Lulzim Tafa Full-Stack Website

This project is a first implementation of a CMS-ready literary website for Lulzim Tafa. It uses a React/Vite frontend and a .NET 8 Web API backend structured for Entity Framework Core and MS SQL Server.

## Design System Analysis

The supplied screenshots establish a refined literary identity:

- Deep navy header and footer, nearly black, with muted gold branding.
- Warm parchment and ivory page backgrounds with subtle stains, paper edges, and soft vignette texture.
- Large classic serif headings, compact sans-serif navigation, and gold all-caps section labels.
- Editorial spacing with generous vertical rhythm, centered section titles, and narrow readable body text.
- Visual complexity comes from image assets: paper sheets, book mockups, portraits, library bands, certificates, dried flowers, medals, ink, and old books.
- Cards are restrained: news cards have rounded image tops and navy date badges; poetry cards feel like individual paper sheets; awards use certificate backgrounds.

## Reusable Components

- `Layout`: shared navy navbar and footer.
- `PageHero`: parchment page headers for books, poetry, news, awards, contact, and admin.
- `SectionHeading`: gold eyebrow, serif title, short intro copy.
- `BookCard`: reused by home, books grid, and book details navigation.
- `PoemCard`: reused by poetry preview and poetry listing.
- `NewsCard`: supports internal articles and external interview links.
- `AwardCard`: supports featured certificate-style cards and horizontal recognition cards.
- Data access is routed through `frontend/src/data/api.js`, so static data can later be replaced by backend calls.

## Database Structure

The backend contains EF Core entities for:

- `Books`
- `BookImages`
- `Poems`
- `PoemLanguages`
- `NewsArticles`
- `Interviews`
- `Awards`
- `GalleryImages`
- `Testimonials`
- `ContactMessages`
- `SocialLinks`
- `SiteSettings`

REST endpoints are scaffolded for:

- `GET /api/books`
- `GET /api/books/{idOrSlug}`
- `GET /api/poems`
- `GET /api/poems/{idOrSlug}`
- `GET /api/poems?language=English`
- `GET /api/poems/languages`
- `GET /api/news`
- `GET /api/news/{idOrSlug}`
- `GET /api/interviews`
- `GET /api/awards`
- `GET /api/gallery`
- `GET /api/testimonials`
- `POST /api/contact`
- `GET /api/contact/messages`
- `GET /api/site-settings`
- `GET /api/site-settings/social-links`
- `POST /api/uploads/{folder}`

## Asset Plan

Save these as PNG, JPG, or WebP assets:

- Portraits and hero author images.
- Book covers and 3D book mockups with shadows.
- Parchment backgrounds, ripped paper headers, and long poem papers.
- Poetry card sheets, tape, clips, seals, dried botanical overlays.
- Award certificate card backgrounds, medal icons, laurel icons, seals.
- Open-book testimonial carousel art.
- Library quote banner image.
- Gallery photos and news/interview images.
- Header decorative images with books, ink, pen, medals, and flowers.

Suggested frontend folders:

```text
frontend/src/assets/
  backgrounds/
  papers/
  books/
  icons/
  awards/
  gallery/
  news/
  decorative/
  mockups/
```

Backend uploads should use:

```text
backend/wwwroot/uploads/
  books/
  poems/
  news/
  gallery/
  awards/
  testimonials/
```

CSS should handle:

- Layout, spacing, responsive grids, typography, and color system.
- Hover states, active nav underline, shadows, buttons, and filters.
- Placeholder gradients until final image assets are available.

Image assets should handle:

- Paper texture realism.
- Torn edges.
- Book shadows and mockup perspective.
- Open book pages.
- Certificate borders.
- Botanical details and medals.

## Build Plan

1. Create a data-driven frontend shell with shared navbar/footer and route structure.
2. Build static sample data in the same shape as the future API.
3. Implement all public pages with reusable components.
4. Add the .NET API entities, DbContext, and public REST endpoints.
5. Add uploads to `wwwroot/uploads`.
6. Replace placeholder CSS visuals with real exported assets from the mockups.
7. Connect frontend data calls to the backend API.
8. Add the admin panel CRUD forms, image uploads, featured toggles, page ordering, and site settings.
9. Add EF migrations and seed data.
10. Add authentication/authorization for admin routes.

## Running

Install frontend dependencies:

```powershell
npm.cmd --prefix frontend install
```

Run the frontend:

```powershell
npm.cmd --prefix frontend run dev
```

Run the backend:

```powershell
dotnet run --project backend/LulzimTafa.Api.csproj
```

The backend defaults to LocalDB:

```text
Server=(localdb)\MSSQLLocalDB;Database=LulzimTafaDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True
```
