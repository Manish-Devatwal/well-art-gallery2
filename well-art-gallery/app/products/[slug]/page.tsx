import { notFound } from 'next/navigation';
import { getProduct, getRelatedProducts } from '@/lib/store';
import { BuyNowButton } from '@/components/BuyNowButton';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductGrid } from '@/components/ProductGrid';
import ProductGallery from '@/components/ProductGallery';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: 'Product not found' };
  return {
    title: `${p.name} | Well Art Gallery`,
    description: p.description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.description, images: p.images.length ? p.images : [p.image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const related = await getRelatedProducts(p, 8);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${p.slug}`;
  const galleryImages = p.images.length ? p.images : [p.image];

  return (
    <section className="section page-top ultra-compact-product-page">
      <div className="container">
        <div className="product-detail">
          <ProductGallery images={galleryImages} name={p.name} />

          <div className="product-detail-copy">
            <p className="eyebrow">{p.category}</p>
            <h1>{p.name}</h1>
            <div className="price-large">₹{p.price.toLocaleString('en-IN')}</div>

            {p.description && <div className="detail-description">{p.description}</div>}

            <p className="muted product-meta">
              SKU: {p.sku} · {p.stock > 0 ? 'In stock' : 'Out of stock'}
            </p>

            <div className="detail-actions">
              <BuyNowButton product={p} productUrl={url} />
              <AddToCartButton product={p} />
            </div>

            <div className="trust-row">
              <span>✓ Secure ordering</span>
              <span>✓ Quality checked</span>
              <span>✓ WhatsApp support</span>
            </div>
          </div>
        </div>

        {related.products.length > 0 && (
          <section className="related-section">
            <div className="section-title">
              <div><p className="eyebrow">You may also like</p><h2>Related products</h2></div>
              <a href={`/products?category=${encodeURIComponent(p.categorySlug || '')}`}>View category →</a>
            </div>
            <ProductGrid products={related.products} />
          </section>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: p.name,
              image: galleryImages,
              description: p.description,
              sku: p.sku,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: p.price,
                availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                url,
              },
            }),
          }}
        />
      </div>

      <style>{`
        .ultra-compact-product-page .product-detail {
          grid-template-columns: minmax(0,1fr) minmax(260px,.62fr) !important;
          gap: 26px !important;
          align-items: start !important;
        }

        .ultra-compact-product-page .product-detail-image {
          max-height: 540px !important;
        }

        .ultra-compact-product-page .product-detail-copy {
          padding-top: 2px !important;
        }

        .ultra-compact-product-page .product-detail-copy .eyebrow {
          font-size: 10px !important;
          margin: 0 0 4px !important;
        }

        .ultra-compact-product-page .product-detail-copy h1 {
          font-size: 23px !important;
          line-height: 1.16 !important;
          margin: 3px 0 7px !important;
          letter-spacing: -.02em !important;
          font-weight: 650 !important;
        }

        .ultra-compact-product-page .price-large {
          font-size: 20px !important;
          line-height: 1 !important;
          margin: 6px 0 9px !important;
        }

        .ultra-compact-product-page .detail-description {
          color: var(--muted);
          font-size: 12px !important;
          line-height: 1.45 !important;
          max-width: 560px;
          max-height: 125px;
          overflow: auto;
          margin-bottom: 7px;
        }

        .ultra-compact-product-page .product-meta {
          font-size: 10px !important;
          margin: 5px 0 !important;
        }

        .ultra-compact-product-page .detail-actions {
          display: flex !important;
          gap: 6px !important;
          margin: 10px 0 !important;
        }

        .ultra-compact-product-page .detail-actions :global(button) {
          min-height: 31px !important;
          height: 31px !important;
          padding: 7px 10px !important;
          font-size: 10px !important;
          line-height: 1 !important;
          border-radius: 7px !important;
        }

        .ultra-compact-product-page .trust-row {
          font-size: 9px !important;
          gap: 7px !important;
        }

        @media (max-width: 800px) {
          .ultra-compact-product-page .product-detail {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .ultra-compact-product-page .product-detail-copy h1 {
            font-size: 20px !important;
            line-height: 1.16 !important;
          }

          .ultra-compact-product-page .price-large {
            font-size: 19px !important;
          }

          .ultra-compact-product-page .detail-description {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
            max-height: 145px;
          }

          .ultra-compact-product-page .detail-actions {
            margin: 9px 0 !important;
          }

          .ultra-compact-product-page .detail-actions :global(button) {
            min-height: 29px !important;
            height: 29px !important;
            padding: 6px 9px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
    </section>
  );
}
