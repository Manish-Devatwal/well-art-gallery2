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
  return {
    title:`${p.name} | Well Art Gallery`,
    description:p.description,
    alternates:{canonical:`/products/${p.slug}`},
    openGraph:{title:p.name,description:p.description,images:p.images.length?p.images:[p.image]}
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const p=await getProduct((await params).slug);
  if(!p)notFound();

  const related=await getRelatedProducts(p,8);
  const url=`${process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'}/products/${p.slug}`;
  const galleryImages=p.images.length?p.images:[p.image];

  return <section className="section page-top">
    <div className="container">
      <div className="product-detail">
        <ProductGallery images={galleryImages} name={p.name}/>

        <div>
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <div className="price-large">₹{p.price.toLocaleString('en-IN')}</div>
          <p className="detail-copy">{p.description}</p>
          <p className="muted">SKU: {p.sku} · {p.stock>0?'In stock':'Out of stock'}</p>

          <div className="detail-actions">
            <BuyNowButton product={p} productUrl={url}/>
            <AddToCartButton product={p}/>
          </div>

          <div className="trust-row">
            <span>✓ Secure ordering</span>
            <span>✓ Quality checked</span>
            <span>✓ WhatsApp support</span>
          </div>
        </div>
      </div>

      {related.products.length>0 && (
        <section className="related-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2>Related products</h2>
            </div>
            <a href={`/products?category=${encodeURIComponent(p.categorySlug||'')}`}>
              View category →
            </a>
          </div>
          <ProductGrid products={related.products}/>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html:JSON.stringify({
          '@context':'https://schema.org',
          '@type':'Product',
          name:p.name,
          image:galleryImages,
          description:p.description,
          sku:p.sku,
          offers:{
            '@type':'Offer',
            priceCurrency:'INR',
            price:p.price,
            availability:p.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',
            url
          }
        })}}
      />
    </div>
  </section>
}
