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
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="product-preview-image"
          loading="lazy"
          decoding="async"
        />

        <span className="product-badge">New</span>
      </Link>

      <div className="product-body">
        <div className="product-top">
          <div className="product-info">
            <p className="muted product-category">
              {product.category}
            </p>

            <Link
              href={`/products/${product.slug}`}
              className="product-name"
              title={product.name}
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
          >
            <Heart
              size={18}
              fill={wished ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="price-row">
          <b>
            ₹{product.price.toLocaleString('en-IN')}
          </b>

          <div className="card-actions">
            <BuyNowButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-category {
          font-size: 10px !important;
          line-height: 1.15 !important;
          margin: 0 0 3px !important;
        }

        .product-name {
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: 2 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;

          height: 30px !important;
          max-height: 30px !important;

          margin: 0 !important;
          padding: 0 !important;

          font-size: 11.5px !important;
          line-height: 15px !important;
          font-weight: 600 !important;
        }

        .product-top {
          min-height: 43px !important;
          align-items: flex-start !important;
        }

        .product-info {
          min-width: 0 !important;
          flex: 1 !important;
        }

        .heart {
          width: 28px !important;
          height: 28px !important;
          flex: 0 0 28px !important;
          margin: 0 !important;
        }

        .price-row {
          margin-top: 7px !important;
          padding-top: 7px !important;
          border-top: 1px solid #edf0f4 !important;

          gap: 5px !important;
          align-items: center !important;
        }

        .price-row > b {
          font-size: 14px !important;
          line-height: 1 !important;
          white-space: nowrap !important;
        }

        .card-actions {
          display: flex !important;
          gap: 3px !important;
          align-items: center !important;
          margin-left: auto !important;
        }

        .card-actions :global(button) {
          min-height: 28px !important;
          height: 28px !important;

          padding: 6px 7px !important;

          font-size: 8.5px !important;
          line-height: 1 !important;

          border-radius: 7px !important;
          white-space: nowrap !important;
        }

        .product-badge {
          position: absolute !important;

          top: 8px !important;
          left: 8px !important;

          z-index: 4 !important;

          padding: 4px 8px !important;

          font-size: 9px !important;
          line-height: 1 !important;

          border-radius: 999px !important;

          background: #dc2626 !important;
          color: #fff !important;
        }

        @media (max-width: 800px) {
          .product-body {
            padding: 8px !important;
          }

          .product-category {
            font-size: 8.5px !important;
          }

          .product-name {
            font-size: 10.5px !important;
            line-height: 14px !important;

            height: 28px !important;
            max-height: 28px !important;
          }

          .product-top {
            min-height: 41px !important;
          }

          .heart {
            width: 26px !important;
            height: 26px !important;
            flex-basis: 26px !important;
          }

          .price-row {
            margin-top: 6px !important;
            padding-top: 6px !important;
          }

          .price-row > b {
            font-size: 13px !important;
          }

          .card-actions {
            gap: 2px !important;
          }

          .card-actions :global(button) {
            min-height: 26px !important;
            height: 26px !important;

            padding: 5px 6px !important;

            font-size: 8px !important;
            border-radius: 6px !important;
          }

          .product-badge {
            top: 6px !important;
            left: 6px !important;

            padding: 4px 7px !important;
            font-size: 8px !important;
          }
        }
      `}</style>
    </article>
  );
}