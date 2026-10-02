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
          onError={e => {
            const img = e.currentTarget;
            if (!img.src.endsWith('/placeholder.svg')) img.src = '/placeholder.svg';
          }}
        />
        <span className="product-badge">New</span>
      </Link>

      <div className="product-body">
        <div className="product-top">
          <div className="product-info">
            <p className="muted product-category">{product.category}</p>
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
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(product)}
          >
            <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="price-row">
          <div className="card-price">
            <b>₹{product.price.toLocaleString('en-IN')}</b>
            {product.compareAtPrice && (
              <del>₹{product.compareAtPrice.toLocaleString('en-IN')}</del>
            )}
          </div>

          <div className="card-actions">
            <BuyNowButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Amazon-style compact catalogue card */
        .product-card {
          min-width: 0;
        }

        .product-category {
          font-size: 11px !important;
          line-height: 1.2 !important;
          margin: 0 0 3px !important;
        }

        .product-name {
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: 2 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          height: 34px !important;
          max-height: 34px !important;
          margin: 0 !important;
          padding: 0 !important;
          font-size: 13px !important;
          line-height: 17px !important;
          font-weight: 600 !important;
          letter-spacing: -0.01em !important;
        }

        .product-top {
          min-height: 54px !important;
          align-items: flex-start !important;
        }

        .product-info {
          min-width: 0 !important;
          flex: 1 !important;
        }

        .heart {
          flex: 0 0 34px !important;
          width: 34px !important;
          height: 34px !important;
          margin-top: 4px !important;
        }

        .price-row {
          margin-top: 9px !important;
          padding-top: 8px !important;
          border-top: 1px solid #edf0f4 !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .card-price {
          min-width: 0;
        }

        .card-price b {
          font-size: 15px !important;
          line-height: 1 !important;
        }

        .card-price del {
          display: none !important;
        }

        .card-actions {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 5px !important;
          flex-wrap: nowrap !important;
        }

        .card-actions :global(button) {
          padding: 7px 8px !important;
          min-height: 32px !important;
          height: 32px !important;
          font-size: 10px !important;
          line-height: 1 !important;
          border-radius: 8px !important;
          white-space: nowrap !important;
        }

        .product-badge {
          position: absolute !important;
          top: 9px !important;
          left: 9px !important;
          z-index: 4 !important;
          background: #dc2626 !important;
          color: #fff !important;
          padding: 5px 9px !important;
          border-radius: 999px !important;
          font-size: 10px !important;
          line-height: 1 !important;
          font-weight: 800 !important;
        }

        @media (max-width: 800px) {
          .product-body {
            padding: 9px !important;
          }

          .product-category {
            font-size: 10px !important;
          }

          .product-name {
            font-size: 12px !important;
            line-height: 16px !important;
            height: 32px !important;
            max-height: 32px !important;
          }

          .product-top {
            min-height: 49px !important;
          }

          .heart {
            width: 30px !important;
            height: 30px !important;
            flex-basis: 30px !important;
          }

          .heart :global(svg) {
            width: 18px !important;
            height: 18px !important;
          }

          .price-row {
            margin-top: 7px !important;
            padding-top: 7px !important;
          }

          .card-price b {
            font-size: 14px !important;
          }

          .card-actions {
            gap: 3px !important;
          }

          .card-actions :global(button) {
            padding: 6px 7px !important;
            min-height: 30px !important;
            height: 30px !important;
            font-size: 9px !important;
          }

          .product-badge {
            top: 7px !important;
            left: 7px !important;
            padding: 5px 8px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
    </article>
  );
}
