'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function NewArrivals({ products }: { products: Product[] }) {
  const items = useMemo(() => products.slice(0, 5), [products]);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth <= 800 ? 2 : 4);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, items.length - perView);

  useEffect(() => {
    if (items.length <= perView) return;
    const timer = window.setInterval(() => {
      setIndex(current => current >= maxIndex ? 0 : current + 1);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [items.length, perView, maxIndex]);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  if (!items.length) return null;

  const cardWidth = 100 / perView;
  const offset = index * cardWidth;

  return (
    <section className="new-arrivals" aria-labelledby="new-arrivals-title">
      <div className="container">
        <div className="new-arrivals-head">
          <div>
            <p className="eyebrow"><Sparkles size={13} /> Just added</p>
            <h2 id="new-arrivals-title">New <em>Arrivals.</em></h2>
            <p className="new-arrivals-subtitle">Fresh artificial florals and decor, newly added to Well Art Gallery.</p>
          </div>
          <div className="new-arrivals-actions">
            <button
              type="button"
              aria-label="Previous new arrivals"
              onClick={() => setIndex(current => current <= 0 ? maxIndex : current - 1)}
              disabled={items.length <= perView}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next new arrivals"
              onClick={() => setIndex(current => current >= maxIndex ? 0 : current + 1)}
              disabled={items.length <= perView}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="new-arrivals-window">
          <div
            className="new-arrivals-track"
            style={{ transform: `translateX(-${offset}%)` }}
          >
            {items.map(product => (
              <div className="new-arrival-slide" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {items.length > perView && (
          <div className="new-arrivals-dots" aria-label="New arrivals slides">
            {Array.from({ length: maxIndex + 1 }).map((_, dot) => (
              <button
                key={dot}
                type="button"
                aria-label={`Show new arrivals slide ${dot + 1}`}
                className={dot === index ? 'active' : ''}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .new-arrivals {
          background: #fff;
          padding: 54px 0 62px;
          border-bottom: 1px solid #e8e8e8;
        }
        .new-arrivals-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }
        .new-arrivals .eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
        }
        .new-arrivals h2 {
          margin: 0;
          font-size: clamp(34px, 4vw, 50px);
          line-height: .98;
          letter-spacing: -.04em;
          font-weight: 500;
        }
        .new-arrivals h2 em {
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 400;
          color: #8b5e3c;
        }
        .new-arrivals-subtitle {
          color: #756b65;
          font-size: 13px;
          margin: 9px 0 0;
        }
        .new-arrivals-actions {
          display: flex;
          gap: 8px;
          flex: 0 0 auto;
        }
        .new-arrivals-actions button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #d8d8d8;
          background: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .new-arrivals-actions button:hover:not(:disabled) {
          border-color: #1d67c1;
          color: #1d67c1;
        }
        .new-arrivals-actions button:disabled {
          opacity: .4;
          cursor: default;
        }
        .new-arrivals-window {
          overflow: hidden;
          width: 100%;
        }
        .new-arrivals-track {
          display: flex;
          transition: transform .55s cubic-bezier(.2,.7,.2,1);
          will-change: transform;
        }
        .new-arrival-slide {
          flex: 0 0 25%;
          min-width: 0;
          padding: 0 9px;
        }
        .new-arrival-slide:first-child { padding-left: 0; }
        .new-arrival-slide:last-child { padding-right: 0; }
        .new-arrival-slide .product-card {
          height: 100%;
          border: 1px solid #e7e7e7;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 7px 25px rgba(0,0,0,.045);
        }
        .new-arrival-slide .product-image {
          aspect-ratio: 1 / 1.03;
        }
        .new-arrival-slide .product-card:hover {
          transform: translateY(-3px);
        }
        .new-arrivals-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
        }
        .new-arrivals-dots button {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 99px;
          background: #c9c9c9;
          cursor: pointer;
          transition: width .2s, background .2s;
        }
        .new-arrivals-dots button.active {
          width: 24px;
          background: #1d67c1;
        }
        @media (max-width: 800px) {
          .new-arrivals {
            padding: 34px 0 42px;
          }
          .new-arrivals-head {
            margin-bottom: 20px;
            align-items: center;
          }
          .new-arrivals-subtitle {
            font-size: 12px;
            max-width: 280px;
          }
          .new-arrivals-actions button {
            width: 38px;
            height: 38px;
          }
          .new-arrival-slide {
            flex-basis: 50%;
            padding: 0 5px;
          }
          .new-arrival-slide:first-child { padding-left: 0; }
          .new-arrival-slide:last-child { padding-right: 0; }
          .new-arrival-slide .product-image {
            aspect-ratio: 1 / 1.08;
          }
          .new-arrival-slide .product-body {
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}
