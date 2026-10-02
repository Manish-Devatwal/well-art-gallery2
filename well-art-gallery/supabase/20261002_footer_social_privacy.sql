alter table public.store_settings
  add column if not exists footer_about text not null default 'Artificial flowers and decor made to keep your space beautiful.',
  add column if not exists footer_phone text not null default '',
  add column if not exists footer_email text not null default '',
  add column if not exists footer_address text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists facebook_url text not null default '',
  add column if not exists youtube_url text not null default '',
  add column if not exists footer_privacy text not null default 'Privacy Policy\n\nWell Art Gallery respects your privacy. We use information you provide to respond to enquiries, process orders and provide customer support. We do not intentionally store full payment credentials on this website.';

update public.store_settings set
  footer_about=coalesce(footer_about,'Artificial flowers and decor made to keep your space beautiful.')
where id=true;

grant select on public.store_settings to anon, authenticated;
grant update on public.store_settings to authenticated;
grant delete on public.hero_banners to authenticated;
grant select, delete on public.categories to authenticated;
