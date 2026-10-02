insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict(id) do nothing;
insert into storage.buckets(id,name,public) values('hero-images','hero-images',true) on conflict(id) do nothing;
drop policy if exists "public product image read" on storage.objects;create policy "public product image read" on storage.objects for select using(bucket_id in ('product-images','hero-images'));
drop policy if exists "admin product image upload" on storage.objects;create policy "admin product image upload" on storage.objects for insert with check(bucket_id in ('product-images','hero-images') and public.is_admin());
drop policy if exists "admin product image update" on storage.objects;create policy "admin product image update" on storage.objects for update using(bucket_id in ('product-images','hero-images') and public.is_admin());
drop policy if exists "admin product image delete" on storage.objects;create policy "admin product image delete" on storage.objects for delete using(bucket_id in ('product-images','hero-images') and public.is_admin());
