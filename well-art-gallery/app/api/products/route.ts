import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = (url.searchParams.get('ids') || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);

  if (!ids.length) return NextResponse.json({ products: [] });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) return NextResponse.json({ products: [] });

  const sb = createClient(supabaseUrl, anonKey);
  const { data, error } = await sb
    .from('products')
    .select('id,sku,slug,name,description,price,compare_at_price,stock,image_urls,categories(name,slug)')
    .in('id', ids)
    .eq('is_active', true);

  if (error) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  const products = (data || []).map((p: any) => {
    const images = Array.isArray(p.image_urls) ? p.image_urls.filter(Boolean) : [];
    return {
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      price: Number(p.price),
      compareAtPrice: p.compare_at_price == null ? undefined : Number(p.compare_at_price),
      stock: Number(p.stock || 0),
      images,
      image: images[0] || '/placeholder.svg',
      category: p.categories?.name || 'Decor',
      categorySlug: p.categories?.slug || '',
    };
  });

  return NextResponse.json({ products });
}
