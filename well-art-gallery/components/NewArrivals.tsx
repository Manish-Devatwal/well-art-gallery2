'use client';

import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Sparkles} from 'lucide-react';
import {Product} from '@/lib/types';
import {ProductCard} from './ProductCard';

export function NewArrivals({products}:{products:Product[]}){
  const items=useMemo(()=>products.slice(0,5),[products]);
  const [index,setIndex]=useState(0);
  const [perView,setPerView]=useState(4);

  useEffect(()=>{
    const update=()=>setPerView(window.innerWidth<=800?2:4);
    update();
    window.addEventListener('resize',update);
    return()=>window.removeEventListener('resize',update);
  },[]);

  const maxIndex=Math.max(0,items.length-perView);

  useEffect(()=>{
    if(items.length<=perView)return;
    const timer=window.setInterval(()=>{
      setIndex(current=>current>=maxIndex?0:current+1);
    },3500);
    return()=>window.clearInterval(timer);
  },[items.length,perView,maxIndex]);

  useEffect(()=>{
    if(index>maxIndex)setIndex(maxIndex);
  },[index,maxIndex]);

  if(!items.length)return null;

  const offset=index*(100/perView);

  return(
    <section className="new-arrivals" aria-labelledby="new-arrivals-title">
      <div className="container">
        <div className="new-arrivals-head">
          <div>
            <p className="eyebrow"><Sparkles size={13}/> Just added</p>
            <h2 id="new-arrivals-title">New <em>Arrivals.</em></h2>
            <p className="new-arrivals-subtitle">Our latest products, added automatically from the admin catalogue.</p>
          </div>
          <div className="new-arrivals-actions">
            <button type="button" aria-label="Previous new arrivals"
              onClick={()=>setIndex(current=>current<=0?maxIndex:current-1)}
              disabled={items.length<=perView}><ArrowLeft size={18}/></button>
            <button type="button" aria-label="Next new arrivals"
              onClick={()=>setIndex(current=>current>=maxIndex?0:current+1)}
              disabled={items.length<=perView}><ArrowRight size={18}/></button>
          </div>
        </div>

        <div className="new-arrivals-window">
          <div className="new-arrivals-track" style={{transform:`translateX(-${offset}%)`}}>
            {items.map(product=>(
              <div className="new-arrival-slide" key={product.id}>
                <ProductCard product={product}/>
              </div>
            ))}
          </div>
        </div>

        {items.length>perView&&(
          <div className="new-arrivals-dots" aria-label="New arrivals slides">
            {Array.from({length:maxIndex+1}).map((_,dot)=>(
              <button key={dot} type="button"
                aria-label={`Show new arrivals slide ${dot+1}`}
                className={dot===index?'active':''}
                onClick={()=>setIndex(dot)}/>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .new-arrivals{background:#fff;padding:54px 0 62px;border-bottom:1px solid #e8e8e8}
        .new-arrivals-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}
        .new-arrivals .eyebrow{display:flex;align-items:center;gap:6px;margin:0 0 8px}
        .new-arrivals h2{margin:0;font-size:clamp(34px,4vw,50px);line-height:.98;letter-spacing:-.04em;font-weight:500}
        .new-arrivals h2 em{font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#1557b0}
        .new-arrivals-subtitle{color:#687386;font-size:13px;margin:9px 0 0}
        .new-arrivals-actions{display:flex;gap:8px;flex:0 0 auto}
        .new-arrivals-actions button{width:42px;height:42px;border-radius:50%;border:1px solid #d8e0ea;background:#fff;display:grid;place-items:center;cursor:pointer;color:#172033}
        .new-arrivals-actions button:hover:not(:disabled){border-color:#1557b0;color:#1557b0}
        .new-arrivals-actions button:disabled{opacity:.4;cursor:default}
        .new-arrivals-window{overflow:hidden;width:100%}
        .new-arrivals-track{display:flex;transition:transform .55s cubic-bezier(.2,.7,.2,1);will-change:transform}
        .new-arrival-slide{flex:0 0 25%;min-width:0;padding:0 9px}
        .new-arrival-slide:first-child{padding-left:0}
        .new-arrival-slide:last-child{padding-right:0}

        /* New Arrivals card: premium mirror arch */
        :global(.new-arrivals .new-arrival-slide .product-card){
          height:100%!important;
          border:1px solid #d8e2ee!important;
          border-radius:50% 50% 22px 22px / 34% 34% 22px 22px!important;
          overflow:hidden!important;
          background:#fff!important;
          box-shadow:0 10px 30px rgba(18,45,78,.08)!important;
          display:flex!important;
          flex-direction:column!important;
        }

        /* Full image, no crop */
        :global(.new-arrivals .new-arrival-slide .product-image){
          position:relative!important;
          flex:1 1 auto!important;
          aspect-ratio:1 / 1.05!important;
          min-height:0!important;
          border-radius:50% 50% 0 0 / 34% 34% 0 0!important;
          overflow:hidden!important;
          background:#fff!important;
        }

        :global(.new-arrivals .new-arrival-slide .product-image img){
          width:100%!important;
          height:100%!important;
          object-fit:contain!important;
          object-position:center!important;
          transform:none!important;
        }

        /* Red premium NEW seal */
        :global(.new-arrivals .new-arrival-slide .product-image span){
          top:12px!important;
          left:12px!important;
          z-index:5!important;
          width:46px!important;
          height:46px!important;
          padding:0!important;
          display:flex!important;
          align-items:center!important;
          justify-content:center!important;
          background:#d71920!important;
          color:#fff!important;
          border:3px solid #fff!important;
          border-radius:50%!important;
          font-size:11px!important;
          font-weight:800!important;
          letter-spacing:.02em!important;
          box-shadow:0 3px 10px rgba(0,0,0,.16)!important;
        }

        /* Hide category, long product name and wishlist from New Arrivals.
           Only compact price + Buy Now remain. */
        :global(.new-arrivals .new-arrival-slide .product-top){
          display:none!important;
        }

        :global(.new-arrivals .new-arrival-slide .product-body){
          flex:0 0 auto!important;
          padding:10px 12px 12px!important;
          background:#fff!important;
        }

        :global(.new-arrivals .new-arrival-slide .price-row){
          margin:0!important;
          display:flex!important;
          align-items:center!important;
          justify-content:space-between!important;
          gap:8px!important;
          min-height:40px!important;
        }

        :global(.new-arrivals .new-arrival-slide .price-row b){
          font-size:16px!important;
          line-height:1!important;
          white-space:nowrap!important;
          color:#172033!important;
        }

        :global(.new-arrivals .new-arrival-slide .price-row del){
          display:none!important;
        }

        :global(.new-arrivals .new-arrival-slide .buy-btn){
          flex:0 0 auto!important;
          padding:9px 13px!important;
          font-size:12px!important;
          line-height:1!important;
          border-radius:10px!important;
          white-space:nowrap!important;
        }

        :global(.new-arrivals .new-arrival-slide .product-card:hover){
          transform:translateY(-5px)!important;
          border-color:#c9d8ea!important;
          box-shadow:0 16px 36px rgba(18,75,135,.13)!important;
        }

        .new-arrivals-dots{display:flex;justify-content:center;gap:6px;margin-top:20px}
        .new-arrivals-dots button{width:7px;height:7px;padding:0;border:0;border-radius:99px;background:#c9d2de;cursor:pointer;transition:width .2s,background .2s}
        .new-arrivals-dots button.active{width:24px;background:#1557b0}

        @media(max-width:800px){
          .new-arrivals{padding:34px 0 42px}
          .new-arrivals-head{margin-bottom:20px;align-items:center}
          .new-arrivals-subtitle{font-size:12px;max-width:280px}
          .new-arrivals-actions button{width:38px;height:38px}
          .new-arrival-slide{flex-basis:50%;padding:0 5px}
          .new-arrival-slide:first-child{padding-left:0}
          .new-arrival-slide:last-child{padding-right:0}

          :global(.new-arrivals .new-arrival-slide .product-card){
            border-radius:50% 50% 16px 16px / 30% 30% 16px 16px!important;
          }

          :global(.new-arrivals .new-arrival-slide .product-image){
            aspect-ratio:1 / 1.08!important;
            border-radius:50% 50% 0 0 / 30% 30% 0 0!important;
          }

          :global(.new-arrivals .new-arrival-slide .product-image span){
            top:9px!important;
            left:9px!important;
            width:40px!important;
            height:40px!important;
            font-size:10px!important;
          }

          :global(.new-arrivals .new-arrival-slide .product-body){
            padding:8px 9px 9px!important;
          }

          :global(.new-arrivals .new-arrival-slide .price-row){
            min-height:36px!important;
          }

          :global(.new-arrivals .new-arrival-slide .price-row b){
            font-size:14px!important;
          }

          :global(.new-arrivals .new-arrival-slide .buy-btn){
            padding:8px 10px!important;
            font-size:11px!important;
          }
        }
      `}</style>
    </section>
  );
}
