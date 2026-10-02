import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionTitle } from '@/components/SectionTitle';
import { getCategories, getProducts } from '@/lib/store';

export default async function HomePage() {
  // Products and categories are loaded separately
  // to keep TypeScript inference stable during the Vercel build.
  const productResult = await getProducts({
    limit: 48,
  });

  const categories = await getCategories();
  const products = productResult.products;

  return (
    <>
      {/* Hero Banner */}
      <Hero />

      {/* All Products */}
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="All products"
            title="Shop our collection"
            href="/products"
          />

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="empty-card">
              <h3>No products found</h3>
              <p className="muted">
                Add products from the Admin panel.
              </p>
            </div>
          )}

          {/* Show button only when there may be more products */}
          {products.length >= 48 && (
            <div className="home-more">
              <Link className="primary-btn" href="/products">
                View all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="section section-soft">
        <div className="container">
          <SectionTitle
            eyebrow="Shop by category"
            title="All categories"
            href="/products"
          />

          <div className="category-strip">
            {categories.map((category) => (
              <Link
                className="category-card"
                href={`/products?category=${encodeURIComponent(
                  category.slug
                )}`}
                key={category.id}
              >
                <span>{category.name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}

            {!categories.length && (
              <Link className="category-card" href="/products">
                <span>All Products</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
