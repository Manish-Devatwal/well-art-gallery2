import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { demoProducts } from './demo-data';
import { Product } from './types';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const hasSupabase = () =>
  Boolean(url && key);

function sb() {
  return createSupabaseClient(
    url,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },

      global: {
        fetch: (
          input: any,
          init: any = {}
        ) =>
          fetch(input, {
            ...init,
            cache: 'no-store',
          }),
      },
    }
  );
}

function mapProduct(p: any): Product {
  const images =
    Array.isArray(p.image_urls)
      ? p.image_urls.filter(Boolean)
      : [];

  return {
    id: p.id,
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    description: p.description || '',

    price: Number(p.price),

    compareAtPrice:
      p.compare_at_price == null
        ? undefined
        : Number(p.compare_at_price),

    stock: Number(p.stock || 0),

    images,

    image:
      images[0] ||
      '/placeholder.svg',

    category:
      p.categories?.name ||
      'Decor',

    categorySlug:
      p.categories?.slug ||
      '',
  };
}

export async function getCategories() {
  if (!hasSupabase()) {
    return [];
  }

  const { data } =
    await sb()
      .from('categories')
      .select('id,name,slug')
      .order('name');

  return data || [];
}

export async function getProducts(
  opts: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
    excludeId?: string;
  } = {}
) {
  const {
    q = '',
    category = '',
    page = 1,
    limit = 24,
    excludeId,
  } = opts;

  if (!hasSupabase()) {
    let p = demoProducts
      .filter(
        x =>
          !q ||
          `${x.name} ${x.category} ${x.sku}`
            .toLowerCase()
            .includes(q.toLowerCase())
      )
      .filter(
        x =>
          !category ||
          x.category
            .toLowerCase()
            .replace(/\s+/g, '-') ===
            category.toLowerCase()
      )
      .filter(
        x =>
          !excludeId ||
          x.id !== excludeId
      );

    return {
      products: p.slice(
        (page - 1) * limit,
        page * limit
      ),
      count: p.length,
    };
  }

  let query =
    sb()
      .from('products')
      .select(
        `
        id,
        sku,
        slug,
        name,
        description,
        price,
        compare_at_price,
        stock,
        image_urls,
        categories(name,slug)
        `,
        {
          count: 'exact',
        }
      )
      .eq('is_active', true)
      .order(
        'created_at',
        {
          ascending: false,
        }
      )
      .range(
        (page - 1) * limit,
        page * limit - 1
      );

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,sku.ilike.%${q}%`
    );
  }

  if (category) {
    query =
      query.eq(
        'categories.slug',
        category
      );
  }

  if (excludeId) {
    query =
      query.neq(
        'id',
        excludeId
      );
  }

  const {
    data,
    count,
    error,
  } = await query;

  if (error) {
    return {
      products: [],
      count: 0,
    };
  }

  return {
    products:
      (data || []).map(mapProduct),

    count: count || 0,
  };
}

/*
  Homepage:
  Only ACTIVE products.
  Latest 20 products.
  No stale HTTP cache.
*/

export async function getHomepageProducts() {
  if (!hasSupabase()) {
    return {
      products: [],
      count: 0,
    };
  }

  const {
    data,
    count,
    error,
  } =
    await sb()
      .from('products')
      .select(
        `
        id,
        sku,
        slug,
        name,
        description,
        price,
        compare_at_price,
        stock,
        image_urls,
        categories(name,slug)
        `,
        {
          count: 'exact',
        }
      )
      .eq(
        'is_active',
        true
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      )
      .limit(20);

  if (error) {
    return {
      products: [],
      count: 0,
    };
  }

  return {
    products:
      (data || []).map(mapProduct),

    count: count || 0,
  };
}

export async function getProduct(
  slug: string
): Promise<Product | null> {

  if (!hasSupabase()) {
    return (
      demoProducts.find(
        p => p.slug === slug
      ) || null
    );
  }

  const {
    data,
  } =
    await sb()
      .from('products')
      .select(
        `
        id,
        sku,
        slug,
        name,
        description,
        price,
        compare_at_price,
        stock,
        image_urls,
        categories(name,slug)
        `
      )
      .eq(
        'slug',
        slug
      )
      .eq(
        'is_active',
        true
      )
      .maybeSingle();

  return data
    ? mapProduct(data)
    : null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 8
) {
  if (!product.categorySlug) {
    return {
      products: [],
      count: 0,
    };
  }

  return getProducts({
    category:
      product.categorySlug,

    excludeId:
      product.id,

    page: 1,

    limit,
  });
}