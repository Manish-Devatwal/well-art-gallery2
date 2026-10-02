import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCcw, MessageCircle } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionTitle } from '@/components/SectionTitle';
import { getCategories, getHomepageProducts } from '@/lib/store';

export default async function HomePage() {
  const productResult = await getHomepageProducts();
  const categories = await getCategories();
  const products = productResult.products;

  return (
    <main className="home-page">
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span><Sparkles size={14} /> Curated artificial florals • Made to stay beautiful</span>
          <Link href="/products">Explore the collection <ArrowRight size={14} /></Link>
        </div>
      </div>

      <Hero />

      <section className="trust-strip">
        <div className="container trust-grid">
          <div><ShieldCheck /><span><b>Quality checked</b><small>Thoughtfully selected decor</small></span></div>
          <div><Truck /><span><b>Easy ordering</b><small>Quick WhatsApp assistance</small></span></div>
          <div><RefreshCcw /><span><b>Made for everyday</b><small>Beauty without the upkeep</small></span></div>
          <div><MessageCircle /><span><b>Personal help</b><small>We're one message away</small></span></div>
        </div>
      </section>

      <section className="section home-products">
        <div className="container">
          <div className="premium-heading">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>Flowers that make<br /><em>every space feel special.</em></h2>
            </div>
            <p>Discover statement florals, elegant bouquets and decor pieces designed to bring a polished finish to your home, celebration or gift.</p>
          </div>

          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="empty-card">
              <h3>No products found</h3>
              <p className="muted">Add products from the Admin panel.</p>
            </div>
          )}

          {productResult.count > products.length && (
            <div className="home-more">
              <Link className="premium-outline-btn" href="/products">
                View all {productResult.count.toLocaleString('en-IN')} products <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section category-section">
        <div className="container">
          <div className="premium-heading compact">
            <div>
              <p className="eyebrow">Shop your mood</p>
              <h2>Find your <em>signature style.</em></h2>
            </div>
            <Link className="text-link" href="/products">Browse everything <ArrowRight size={16} /></Link>
          </div>

          <div className="luxury-category-grid">
            {categories.map((category, index) => (
              <Link
                className={`luxury-category category-tone-${(index % 4) + 1}`}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                key={category.id}
              >
                <span className="category-number">0{index + 1}</span>
                <span className="category-copy">
                  <small>Collection</small>
                  <strong>{category.name}</strong>
                </span>
                <span className="category-arrow"><ArrowRight size={18} /></span>
              </Link>
            ))}
            {!categories.length && (
              <Link className="luxury-category category-tone-1" href="/products">
                <span className="category-number">01</span>
                <span className="category-copy"><small>Collection</small><strong>All Products</strong></span>
                <span className="category-arrow"><ArrowRight size={18} /></span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="container editorial-card">
          <div className="editorial-copy">
            <p className="eyebrow">The Well Art touch</p>
            <h2>Luxury-looking spaces,<br /><em>without the daily upkeep.</em></h2>
            <p>From a quiet corner at home to a celebration worth remembering, our artificial florals are made to keep the mood beautiful long after the moment.</p>
            <Link href="/products" className="dark-btn">Discover the collection <ArrowRight size={16} /></Link>
          </div>
          <div className="editorial-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-bloom"><span>W</span></div>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container final-cta-inner">
          <p className="eyebrow">Ready when you are</p>
          <h2>Make your next corner<br /><em>feel unforgettable.</em></h2>
          <p>Explore the latest florals and decor from Well Art Gallery.</p>
          <Link href="/products" className="primary-btn">Shop the collection <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
