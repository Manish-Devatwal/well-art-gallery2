'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { BuyNowButton } from './BuyNowButton';
import { AddToCartButton } from './AddToCartButton';
import { useStore } from './StoreProvider';

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);

  return (
    <article
      className="product-card"
      style={{
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="product-image"
        style={{ display: 'block' }}
      >
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="product-preview-image"
          loading="lazy"
          decoding="async"
        />

        <span
          className="product-badge"
          style={{
            background: '#dc2626',
            color: '#fff',
            fontSize: 9,
            padding: '4px 7px',
            borderRadius: 999,
          }}
        >
          New
        </span>
      </Link>

      <div
        className="product-body"
        style={{
          padding: '8px 9px 9px',
        }}
      >
        <div
          className="product-top"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 5,
            minHeight: 44,
          }}
        >
          <div
            className="product-info"
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <p
              className="muted"
              style={{
                fontSize: 8,
                lineHeight: '10px',
                margin: '0 0 2px',
              }}
            >
              {product.category}
            </p>

            <Link
              href={`/products/${product.slug}`}
              title={product.name}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: 28,
                maxHeight: 28,
                fontSize: 10.5,
                lineHeight: '14px',
                fontWeight: 600,
                letterSpacing: 0,
              }}
            >
              {product.name}
            </Link>
          </div>

          <button
            type="button"
            className={`heart ${wished ? 'selected' : ''}`}
            aria-label={
              wished
                ? 'Remove from wishlist'
                : 'Add to wishlist'
            }
            onClick={() => toggleWishlist(product)}
            style={{
              width: 26,
              height: 26,
              minWidth: 26,
              flexShrink: 0,
              padding: 0,
            }}
          >
            <Heart
              size={17}
              fill={wished ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div
          className="price-row"
          style={{
            marginTop: 6,
            paddingTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <b
            style={{
              fontSize: 13,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </b>

          <div
            className="card-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              marginLeft: 'auto',
            }}
          >
            <BuyNowButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-actions :global(button) {
          min-height: 25px !important;
          height: 25px !important;
          padding: 4px 6px !important;
          font-size: 8px !important;
          line-height: 1 !important;
          border-radius: 6px !important;
          white-space: nowrap !important;
        }

        @media (min-width: 801px) {
          .product-body {
            padding: 9px 10px 10px !important;
          }

          .product-info > a {
            font-size: 11px !important;
            line-height: 14px !important;
          }
        }

        @media (max-width: 380px) {
          .card-actions :global(button) {
            padding: 4px 5px !important;
            font-size: 7px !important;
          }
        }
      `}</style>
    </article>
  );
}