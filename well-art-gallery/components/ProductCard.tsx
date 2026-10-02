'use client';
import Link from 'next/link';
import {Heart} from 'lucide-react';
import {Product} from '@/lib/types';
import {BuyNowButton} from './BuyNowButton';
import {useStore} from './StoreProvider';

export function ProductCard({product}:{product:Product}){
  const {toggleWishlist,isWishlisted}=useStore();
  const wished=isWishlisted(product.id);

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image">
        <img
          src={product.image||'/placeholder.svg'}
          alt={product.name}
          className="product-preview-image"
          loading="lazy"
          decoding="async"
          onError={e=>{
            const img=e.currentTarget;
            if(img.src.endsWith('/placeholder.svg'))return;
            img.src='/placeholder.svg'
          }}
        />
        <span className="product-badge">New</span>
      </Link>

      <div className="product-body">
        <div className="product-top">
          <div className="product-info">
            <p className="muted">{product.category}</p>
            <Link href={`/products/${product.slug}`} className="product-name" title={product.name}>
              {product.name}
            </Link>
          </div>

          <button
            type="button"
            className={`heart ${wished?'selected':''}`}
            aria-label={wished?'Remove from wishlist':'Add to wishlist'}
            onClick={()=>toggleWishlist(product)}
          >
            <Heart fill={wished?'currentColor':'none'}/>
          </button>
        </div>

        <div className="price-row">
          <div>
            <b>₹{product.price.toLocaleString('en-IN')}</b>
            {product.compareAtPrice&&<del>₹{product.compareAtPrice.toLocaleString('en-IN')}</del>}
          </div>
          <BuyNowButton product={product}/>
        </div>
      </div>

      <style jsx>{`
        .product-name{
          font-size:15px;
          line-height:1.25;
          font-weight:650;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
          overflow:hidden;
          max-height:2.5em;
          margin-top:5px;
        }
        .product-badge{
          position:absolute;
          top:10px;
          left:10px;
          z-index:2;
          background:#dc2626 !important;
          color:#fff !important;
          padding:6px 10px !important;
          border-radius:999px !important;
          font-size:11px !important;
          line-height:1 !important;
          font-weight:800 !important;
          letter-spacing:.02em;
          box-shadow:0 3px 10px rgba(220,38,38,.2);
        }
        @media(max-width:800px){
          .product-name{
            font-size:14px;
            line-height:1.25;
            max-height:2.5em;
          }
          .product-badge{
            top:9px;
            left:9px;
            padding:5px 8px !important;
            font-size:10px !important;
          }
        }
      `}</style>
    </article>
  );
}
