-- Well Art Gallery demo catalog seed
-- Run this once in Supabase SQL Editor after the base schema/migrations.
-- Safe to re-run: existing demo SKUs are skipped.

insert into public.categories (name, slug, description) values
('Bouquets','bouquets','Elegant artificial flower bouquets'),
('Table Decor','table-decor','Statement pieces for tables and consoles'),
('Wall Flowers','wall-flowers','Floral accents for walls and backdrops'),
('Wedding Decor','wedding-decor','Wedding and event floral decor')
on conflict (slug) do nothing;

insert into public.hero_banners
(title, subtitle, image_url, cta_text, cta_url, sort_order, is_active)
values
('Artificial Flowers, Real Beauty','Premium florals designed to stay beautiful all year.','/demo/hero-1.svg','Shop Flowers','/products',0,true),
('Bring the Garden Indoors','Soft botanical styling for calm, beautiful spaces.','/demo/hero-2.svg','Explore Bouquets','/products?category=bouquets',1,true),
('Make Every Celebration Bloom','Elegant wedding and event decor without the upkeep.','/demo/hero-3.svg','Wedding Decor','/products?category=wedding-decor',2,true),
('Bouquets Made to Impress','Luxury-looking arrangements for gifting and everyday spaces.','/demo/hero-4.svg','Shop Bouquets','/products?category=bouquets',3,true),
('Statement Decor, Beautifully Done','Give every corner a polished floral finish.','/demo/hero-5.svg','Explore Decor','/products',4,true);

insert into public.products
(sku, slug, name, description, price, compare_at_price, stock, category_id, image_urls, is_active)
values
('WAG-DEMO-ROSE-001','premium-rose-bouquet','Premium Rose Bouquet','A full, elegant artificial rose bouquet for gifting and home styling.',899,1299,25,(select id from public.categories where slug='bouquets'),array['/demo/product-1.svg','/demo/product-2.svg'],true),
('WAG-DEMO-LILY-002','white-lily-arrangement','White Lily Arrangement','Clean white lilies with a soft premium finish.',749,999,18,(select id from public.categories where slug='bouquets'),array['/demo/product-3.svg','/demo/product-4.svg'],true),
('WAG-DEMO-TABLE-003','blush-table-centerpiece','Blush Table Centerpiece','A refined floral centerpiece for dining and console tables.',1099,1499,12,(select id from public.categories where slug='table-decor'),array['/demo/product-5.svg'],true),
('WAG-DEMO-WALL-004','botanical-wall-bloom','Botanical Wall Bloom','Decorative floral accent for feature walls and photo corners.',1299,1699,10,(select id from public.categories where slug='wall-flowers'),array['/demo/product-6.svg'],true),
('WAG-DEMO-WED-005','wedding-floral-set','Wedding Floral Set','A coordinated artificial floral set for ceremonies and celebrations.',2499,3299,8,(select id from public.categories where slug='wedding-decor'),array['/demo/product-7.svg','/demo/product-8.svg'],true),
('WAG-DEMO-PINK-006','pink-peony-bundle','Pink Peony Bundle','Soft statement blooms with a premium romantic look.',999,1399,20,(select id from public.categories where slug='bouquets'),array['/demo/product-2.svg','/demo/product-4.svg'],true),
('WAG-DEMO-GREEN-007','evergreen-leaf-arrangement','Evergreen Leaf Arrangement','Modern green foliage for shelves, tables and corners.',699,899,30,(select id from public.categories where slug='table-decor'),array['/demo/product-3.svg'],true),
('WAG-DEMO-BACKDROP-008','floral-backdrop-set','Floral Backdrop Set','Layered artificial florals for events, shoots and celebrations.',2999,3999,6,(select id from public.categories where slug='wall-flowers'),array['/demo/product-6.svg','/demo/product-8.svg'],true)
on conflict (sku) do nothing;
