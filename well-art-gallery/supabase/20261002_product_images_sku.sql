-- Well Art Gallery: product image/SKU hardening
-- Run this once in Supabase SQL Editor after the base schema.

alter table public.products
  drop constraint if exists products_max_5_images;

alter table public.products
  add constraint products_max_5_images
  check (cardinality(image_urls) <= 5);

create or replace function public.generate_product_sku()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.sku is null or btrim(new.sku) = '' then
    new.sku := 'WAG-' ||
      upper(substr(regexp_replace(coalesce(new.name,'PRODUCT'),'[^A-Za-z0-9]+','-','g'),1,14)) ||
      '-' ||
      upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  end if;
  return new;
end;
$$;

drop trigger if exists products_auto_sku on public.products;

create trigger products_auto_sku
before insert on public.products
for each row
execute function public.generate_product_sku();
