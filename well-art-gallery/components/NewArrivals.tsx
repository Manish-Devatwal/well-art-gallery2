'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { Product } from '@/lib/types';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';

export function NewArrivals({
  products
}: {
  products: Product[];
}) {
  const items = useMemo(
    () => products.filter(Boolean).slice(0, 5),
    [products]
  );

  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      setPerView(window.innerWidth <= 800 ? 2 : 4);
    };

    update();

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  const maxIndex = Math.max(
    0,
    items.length - perView
  );

  useEffect(() => {
    if (items.length <= perView) return;

    const timer = window.setInterval(() => {
      setIndex(current =>
        current >= maxIndex ? 0 : current + 1
      );
    }, 3500);

    return () => window.clearInterval(timer);
  }, [items.length, perView, maxIndex]);

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [index, maxIndex]);

  if (!items.length) return null;

  const offset = index * (100 / perView);

  return (
    <section className="new-arrivals">
      <div className="container">

        <div className="new-arrivals-head">

          <div>
            <p className="eyebrow">
              <Sparkles size={13} />
              Just added
            </p>

            <h2>
              New <em>Arrivals.</em>
            </h2>

            <p className="new-arrivals-subtitle">
              Our latest products, added automatically
              from the admin catalogue.
            </p>
          </div>

          <div className="new-arrivals-actions">

            <button
              type="button"
              onClick={() =>
                setIndex(current =>
                  current <= 0 ? maxIndex : current - 1
                )
              }
              disabled={items.length <= perView}
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                setIndex(current =>
                  current >= maxIndex ? 0 : current + 1
                )
              }
              disabled={items.length <= perView}
            >
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

        <div className="new-arrivals-window">

          <div
            className="new-arrivals-track"
            style={{
              transform: `translateX(-${offset}%)`
            }}
          >

            {items.map(product => (

              <div
                className="new-arrival-slide"
                key={product.id}
              >

                <article className="new-arrival-card">

                  <a
                    href={`/products/${product.slug}`}
                    className="new-arrival-image"
                  >

                    <img
                      src={
                        product.image ||
                        '/placeholder.svg'
                      }
                      alt={product.name}
                      loading="lazy"
                    />

                    <span>NEW</span>

                  </a>

                  <div className="new-arrival-bottom">

                    <b>
                      ₹
                      {product.price.toLocaleString(
                        'en-IN'
                      )}
                    </b>

                    <div>
                      <BuyNowButton product={product} />
                      <AddToCartButton
                        product={product}
                      />
                    </div>

                  </div>

                </article>

              </div>

            ))}

          </div>

        </div>

        {items.length > perView && (
          <div className="new-arrivals-dots">

            {Array.from({
              length: maxIndex + 1
            }).map((_, i) => (

              <button
                key={i}
                className={
                  i === index ? 'active' : ''
                }
                onClick={() => setIndex(i)}
              />

            ))}

          </div>
        )}

      </div>

      <style jsx>{`
        .new-arrivals {
          background: #fff;
          padding: 48px 0 54px;
          border-bottom: 1px solid #e8e8e8;
        }

        .new-arrivals-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .new-arrivals h2 {
          margin: 0;
          font-size: clamp(32px, 4vw, 48px);
        }

        .new-arrivals h2 em {
          font-family: Georgia, serif;
          font-weight: 400;
          color: #1557b0;
        }

        .new-arrivals-subtitle {
          font-size: 12px;
          color: #687386;
          margin: 7px 0 0;
        }

        .new-arrivals-actions {
          display: flex;
          gap: 7px;
        }

        .new-arrivals-actions button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #d8e0ea;
          background: #fff;
        }

        .new-arrivals-window {
          overflow: hidden;
        }

        .new-arrivals-track {
          display: flex;
          transition:
            transform 0.55s
            cubic-bezier(.2,.7,.2,1);
        }

        .new-arrival-slide {
          flex: 0 0 25%;
          padding: 0 8px;
        }

        .new-arrival-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;

          background: #fff;
          border: 1px solid #d8e2ee;

          border-radius:
            50% 50% 20px 20px /
            32% 32% 20px 20px;

          box-shadow:
            0 8px 25px
            rgba(18,45,78,.07);
        }

        .new-arrival-image {
          display: block;
          position: relative;

          aspect-ratio: 1 / 1.03;

          overflow: hidden;

          border-radius:
            50% 50% 0 0 /
            32% 32% 0 0;
        }

        .new-arrival-image img {
          width: 100%;
          height: 100%;

          object-fit: contain;
          object-position: center;
        }

        .new-arrival-image span {
          position: absolute;

          top: 11px;
          left: 11px;

          width: 44px;
          height: 44px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background: #d71920;
          color: #fff;

          border: 3px solid #fff;

          font-size: 9px;
          font-weight: 900;
        }

        .new-arrival-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 5px;

          padding: 8px 9px;
        }

        .new-arrival-bottom > b {
          font-size: 14px;
          white-space: nowrap;
        }

        .new-arrival-bottom > div {
          display: flex;
          gap: 3px;
        }

        .new-arrival-bottom :global(button) {
          height: 27px !important;
          min-height: 27px !important;

          padding: 5px 6px !important;

          font-size: 8px !important;

          border-radius: 6px !important;

          white-space: nowrap;
        }

        .new-arrivals-dots {
          display: flex;
          justify-content: center;

          gap: 5px;
          margin-top: 15px;
        }

        .new-arrivals-dots button {
          width: 7px;
          height: 7px;

          border: 0;
          border-radius: 9px;

          background: #c9d2de;
        }

        .new-arrivals-dots .active {
          width: 22px;
          background: #1557b0;
        }

        @media (max-width: 800px) {

          .new-arrivals {
            padding: 32px 0 40px;
          }

          .new-arrival-slide {
            flex-basis: 50%;
            padding: 0 4px;
          }

          .new-arrival-image {
            aspect-ratio: 1 / 1.08;
          }

          .new-arrival-image span {
            top: 7px;
            left: 7px;

            width: 38px;
            height: 38px;

            font-size: 8px;
          }

          .new-arrival-bottom {
            padding: 7px;
          }

          .new-arrival-bottom > b {
            font-size: 12px;
          }

          .new-arrival-bottom > div {
            gap: 2px;
          }

          .new-arrival-bottom :global(button) {
            height: 25px !important;
            min-height: 25px !important;

            padding: 4px 5px !important;

            font-size: 7px !important;
          }
        }
      `}</style>

    </section>
  );
}