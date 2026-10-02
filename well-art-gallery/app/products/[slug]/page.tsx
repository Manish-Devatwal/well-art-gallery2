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
    openGraph: {
      title: p.name,
      description: p.description,
      images: p.images.length ? p.images : [p.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const related = await getRelatedProducts(p, 8);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${p.slug}`;
  const galleryImages = p.images.length ? p.images : [p.image];

  return (
    <section className="section page-top compact-product-page">
      <div className="container">
        <div className="product-detail">
          <ProductGallery images={galleryImages} name={p.name} />

          <div className="product-detail-copy">
            <p className="eyebrow">{p.category}</p>

            <h1>{p.name}</h1>

            <div className="price-large">
              ₹{p.price.toLocaleString('en-IN')}
            </div>

            {p.description && (
              <div className="detail-description">
                {p.description}
              </div>
            )}

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
              <div>
                <p className="eyebrow">You may also like</p>
                <h2>Related products</h2>
              </div>
              <a href={`/products?category=${encodeURIComponent(p.categorySlug || '')}`}>
                View category →
              </a>
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
                availability: p.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                url,
              },
            }),
          }}
        />
      </div>

      <style>{`
        .compact-product-page .product-detail {
          grid-template-columns: minmax(0, 1fr) minmax(280px, .68fr) !important;
          gap: 30px !important;
          align-items: start !important;
        }

        .compact-product-page .product-detail-image {
          max-height: 580px !important;
        }

        .compact-product-page .product-detail-copy {
          padding-top: 4px !important;
        }

        .compact-product-page .product-detail-copy .eyebrow {
          font-size: 11px !important;
          margin-bottom: 5px !important;
        }

        .compact-product-page .product-detail-copy h1 {
          font-size: 28px !important;
          line-height: 1.18 !important;
          margin: 4px 0 9px !important;
          letter-spacing: -.02em !important;
          font-weight: 650 !important;
        }

        .compact-product-page .price-large {
          font-size: 24px !important;
          line-height: 1 !important;
          margin: 8px 0 12px !important;
        }

        .compact-product-page .detail-description {
          color: var(--muted);
          font-size: 13px !important;
          line-height: 1.55 !important;
          max-width: 620px;
          max-height: 150px;
          overflow: auto;
          margin-bottom: 10px;
        }

        .compact-product-page .product-meta {
          font-size: 11px !important;
          margin: 6px 0 !important;
        }

        .compact-product-page .detail-actions {
          display: flex !important;
          gap: 7px !important;
          margin: 14px 0 !important;
        }

        .compact-product-page .detail-actions button {
          font-size: 11px !important;
          padding: 9px 13px !important;
          min-height: 34px !important;
        }

        .compact-product-page .trust-row {
          font-size: 10px !important;
          gap: 9px !important;
        }

        @media (max-width: 800px) {
          .compact-product-page .product-detail {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .compact-product-page .product-detail-image {
            max-height: none !important;
          }

          .compact-product-page .product-detail-copy h1 {
            font-size: 23px !important;
            line-height: 1.18 !important;
          }

          .compact-product-page .price-large {
            font-size: 21px !important;
            margin: 7px 0 9px !important;
          }

          .compact-product-page .detail-description {
            font-size: 12.5px !important;
            line-height: 1.5 !important;
            max-height: 180px;
          }

          .compact-product-page .detail-actions {
            margin: 11px 0 !important;
          }

          .compact-product-page .detail-actions button {
            font-size: 10px !important;
            padding: 8px 11px !important;
          }
        }
      `}</style>
    </section>
  );
}
