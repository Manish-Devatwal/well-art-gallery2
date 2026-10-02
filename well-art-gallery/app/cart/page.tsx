'use client';

import Link from 'next/link';
import { useStore } from '@/components/StoreProvider';
import { BuyNowButton } from '@/components/BuyNowButton';

export default function CartPage() {
  const { cartProducts, clearCart } = useStore();
  const items = cartProducts;

  return (
    <section className="section page-top">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2>Cart <span className="page-count">({items.length})</span></h2>
          </div>
          {items.length > 0 && (
            <button className="secondary-btn" onClick={clearCart}>
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-card">
            <h3>Your cart is empty</h3>
            <p className="muted">
              Add products from the shop and continue your order through WhatsApp.
            </p>
            <Link className="primary-btn" href="/products">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((p) => (
              <div className="cart-item" key={p.id}>
                <Link href={`/products/${p.slug}`}>
                  <img src={p.image || '/placeholder.svg'} alt={p.name} />
                </Link>
                <div>
                  <Link href={`/products/${p.slug}`}>
                    <h3>{p.name}</h3>
                  </Link>
                  <p className="muted">SKU: {p.sku}</p>
                  <b>₹{p.price.toLocaleString('en-IN')}</b>
                </div>
                <BuyNowButton product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
