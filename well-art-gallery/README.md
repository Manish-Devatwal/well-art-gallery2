# Well Art Gallery

Production-oriented Next.js + Supabase e-commerce starter for an artificial-flower/decor store.

## Included
- Responsive storefront: 2 product cards/mobile, 4/desktop
- Local demo images so the UI renders without external image-CDN dependency
- Supabase Postgres + Auth + Storage architecture
- RLS-protected admin writes
- Admin login, products, categories, hero banners, settings
- Product image upload to Supabase Storage (no Base64/local persistence)
- CSV/XLSX bulk product import (up to 1,000 rows per browser import batch)
- Search, pagination, product detail pages, JSON-LD, sitemap/robots
- Cart + wishlist for guest browsing via localStorage
- WhatsApp Buy Now with editable number/template
- Security headers and admin-session middleware
- Trigram search indexes for larger catalogues

## Setup
1. Copy `.env.example` to `.env.local` and fill values.
2. Create a Supabase project.
3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Run `supabase/storage-policies.sql`.
5. Create an Auth email/password user.
6. Run `supabase/admin-bootstrap.sql` after replacing the email with the admin account email.
7. `npm install`
8. `npm run typecheck`
9. `npm run build`
10. Deploy to Vercel and set the same environment variables.

## Product import columns
`sku,name,price,stock,description,image_urls,compare_at_price`

`image_urls` may contain comma-separated public Supabase Storage URLs.

## Production scaling
The UI never loads the entire catalogue. Queries are paginated and indexed. For very large search traffic, add a dedicated search service (Meilisearch/OpenSearch) and CDN/object storage. Load-test before claiming a specific concurrency level.

## Important security note
Never put a Supabase service-role key or database password in `NEXT_PUBLIC_*` variables or client code. Admin authorization is enforced by Supabase RLS; the browser admin UI is not the security boundary.
