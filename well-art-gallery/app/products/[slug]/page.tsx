import {notFound} from 'next/navigation';
import {getProduct,getRelatedProducts} from '@/lib/store';
import {BuyNowButton} from '@/components/BuyNowButton';
import {AddToCartButton} from '@/components/AddToCartButton';
import {ProductGrid} from '@/components/ProductGrid';
import ProductGallery from '@/components/ProductGallery';
import type {Metadata} from 'next';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const p=await getProduct((await params).slug);
  if(!p)return {title:'Product not found'};
  return {title:`${p.name} | Well Art Gallery`,description:p.description,alternates:{canonical:`/products/${p.slug}`},openGraph:{title:p.name,description:p.description,images:p.images.length?p.images:[p.image]}};
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const p=await getProduct((await params).slug); if(!p)notFound();
  const related=await getRelatedProducts(p,8);
  const url=`${process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'}/products/${p.slug}`;
  const galleryImages=p.images.length?p.images:[p.image];

  return <section className="section page-top compact-product-page">
    <div className="container">
      <div className="product-detail">
        <ProductGallery images={galleryImages} name={p.name}/>
        <div className="product-detail-copy">
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <div className="price-large">₹{p.price.toLocaleString('en-IN')}</div>
          {p.description&&<p className="detail-copy">{p.description}</p>}
          <p className="muted">SKU: {p.sku} · {p.stock>0?'In stock':'Out of stock'}</p>
          <div className="detail-actions"><BuyNowButton product={p} productUrl={url}/><AddToCartButton product={p}/></div>
          <div className="trust-row"><span>✓ Secure ordering</span><span>✓ Quality checked</span><span>✓ WhatsApp support</span></div>
        </div>
      </div>
      {related.products.length>0&&<section className="related-section"><div className="section-title"><div><p className="eyebrow">You may also like</p><h2>Related products</h2></div><a href={`/products?category=${encodeURIComponent(p.categorySlug||'')}`}>View category →</a></div><ProductGrid products={related.products}/></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name,image:galleryImages,description:p.description,sku:p.sku,offers:{'@type':'Offer',priceCurrency:'INR',price:p.price,availability:p.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',url}})}}/>
    </div>
    <style>{`
      .compact-product-page .product-detail{grid-template-columns:minmax(0,1fr) minmax(300px,.72fr);gap:34px;align-items:start}
      .compact-product-page .product-detail-image{max-height:620px}
      .compact-product-page .product-detail-copy{padding-top:8px}
      .compact-product-page .product-detail-copy h1{font-size:32px;line-height:1.15;margin:6px 0 10px}
      .compact-product-page .price-large{font-size:25px;margin:10px 0 12px}
      .compact-product-page .detail-copy{font-size:14px;line-height:1.55;margin:0 0 10px;color:var(--muted)}
      .compact-product-page .detail-actions{margin:16px 0;gap:8px}
      .compact-product-page .detail-actions button{font-size:12px;padding:9px 13px}
      .compact-product-page .trust-row{font-size:11px;gap:10px}
      @media(max-width:800px){
        .compact-product-page .product-detail{grid-template-columns:1fr;gap:20px}
        .compact-product-page .product-detail-image{max-height:none}
        .compact-product-page .product-detail-copy h1{font-size:25px;line-height:1.18}
        .compact-product-page .price-large{font-size:23px;margin:8px 0 10px}
        .compact-product-page .detail-copy{font-size:13px;line-height:1.5}
        .compact-product-page .detail-actions{margin:13px 0}
      }
    `}</style>
  </section>
}
