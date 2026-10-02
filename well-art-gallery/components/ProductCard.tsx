'use client';

import Link from 'next/link';
import {Heart} from 'lucide-react';
import {Product} from '@/lib/types';
import {BuyNowButton} from './BuyNowButton';
import {AddToCartButton} from './AddToCartButton';
import {useStore} from './StoreProvider';

export function ProductCard({product}:{product:Product}){
  const {toggleWishlist,isWishlisted}=useStore();
  const wished=isWishlisted(product.id);

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image">
        <img src={product.image||'/placeholder.svg'} alt={product.name}
          className="product-preview-image" loading="lazy" decoding="async"
          onError={e=>{const img=e.currentTarget;if(img.src.endsWith('/placeholder.svg'))return;img.src='/placeholder.svg'}}/>
        <span className="product-badge">New</span>
      </Link>

      <div className="product-body">
        <div className="product-top">
          <div className="product-info">
            <p className="muted">{product.category}</p>
            <Link href={`/products/${product.slug}`} className="product-name" title={product.name}>{product.name}</Link>
          </div>
          <button type="button" className={`heart ${wished?'selected':''}`}
            aria-label={wished?'Remove from wishlist':'Add to wishlist'}
            onClick={()=>toggleWishlist(product)}>
            <Heart fill={wished?'currentColor':'none'}/>
          </button>
        </div>

        <div className="price-row">
          <div><b>₹{product.price.toLocaleString('en-IN')}</b>{product.compareAtPrice&&<del>₹{product.compareAtPrice.toLocaleString('en-IN')}</del>}</div>
          <div className="card-actions">
            <BuyNowButton product={product}/>
            <AddToCartButton product={product}/>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-name{
          font-size:14px!important;line-height:1.25!important;font-weight:650!important;
          display:-webkit-box!important;-webkit-box-orient:vertical!important;
          -webkit-line-clamp:2!important;overflow:hidden!important;
          max-height:2.5em!important;margin-top:4px!important;
        }
        .product-badge{
          position:absolute;top:10px;left:10px;z-index:2;
          background:#dc2626!important;color:#fff!important;
          padding:6px 10px!important;border-radius:999px!important;
          font-size:11px!important;line-height:1!important;font-weight:800!important;
          box-shadow:0 3px 10px rgba(220,38,38,.2);
        }
        .card-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        .card-actions :global(.buy-btn),.card-actions :global(.secondary-btn){
          padding:8px 10px!important;font-size:11px!important;line-height:1.1!important;
          border-radius:9px!important;white-space:nowrap!important;
        }
        .card-actions :global(.secondary-btn){margin:0!important}
        @media(max-width:800px){
          .product-name{font-size:13px!important;line-height:1.22!important}
          .product-badge{top:8px;left:8px;padding:5px 8px!important;font-size:10px!important}
          .product-body{padding:10px!important}
          .price-row{margin-top:10px!important;align-items:flex-end!important}
          .price-row b{font-size:16px!important}
          .card-actions{gap:4px}
          .card-actions :global(.buy-btn),.card-actions :global(.secondary-btn){
            padding:7px 8px!important;font-size:10px!important
          }
        }
      `}</style>
    </article>
  );
}
