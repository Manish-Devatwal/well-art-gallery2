'use client';

import { Product } from '@/lib/types';
import { useStore } from './StoreProvider';

export function AddToCartButton({ product }: { product: Product }) {
  const { toggleCart, isInCart } = useStore();
  const active = isInCart(product.id);

  return (
    <button
      type="button"
      className="secondary-btn"
      onClick={() => toggleCart(product)}
    >
      {active ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
