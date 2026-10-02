-- Run this AFTER creating your admin user in Supabase Authentication.
-- Replace the email below with the exact admin account email.
update public.profiles p set role='admin'
from auth.users u where p.id=u.id and u.email='YOUR_ADMIN_EMAIL@example.com';

-- Verify:
-- select u.email,p.role from auth.users u join public.profiles p on p.id=u.id;
