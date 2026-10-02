'use client';

import Link from 'next/link';
import { useStore } from '@/components/StoreProvider';
import { ProductCard } from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlistProducts, clearWishlist } = useStore();
  const items = wishlistProducts;

  return (
    <section className="section page-top">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Saved items</p>
            <h2>Wishlist <span className="page-count">({items.length})</span></h2>
          </div>
          {items.length > 0 && (
            <button className="secondary-btn" onClick={clearWishlist}>
              Clear wishlist
            </button>
          )}
        </div>

        {items.length ? (
          <div className="product-grid">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-card">
            <h3>No saved products yet</h3>
            <p className="muted">Tap the heart on any product to save it here.</p>
            <Link className="primary-btn" href="/products">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
