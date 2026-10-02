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
    const timer=window.setInterval(()=>setIndex(current=>current>=maxIndex?0:current+1),3500);
    return()=>window.clearInterval(timer);
  },[items.length,perView,maxIndex]);

  useEffect(()=>{if(index>maxIndex)setIndex(maxIndex)},[index,maxIndex]);

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
            <button type="button" aria-label="Previous new arrivals" onClick={()=>setIndex(c=>c<=0?maxIndex:c-1)} disabled={items.length<=perView}><ArrowLeft size={18}/></button>
            <button type="button" aria-label="Next new arrivals" onClick={()=>setIndex(c=>c>=maxIndex?0:c+1)} disabled={items.length<=perView}><ArrowRight size={18}/></button>
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
          <div className="new-arrivals-dots">
            {Array.from({length:maxIndex+1}).map((_,dot)=>(
              <button key={dot} type="button" aria-label={`Show slide ${dot+1}`} className={dot===index?'active':''} onClick={()=>setIndex(dot)}/>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .new-arrivals{background:#fff;padding:44px 0 54px;border-bottom:1px solid #e8edf3}
        .new-arrivals-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:24px}
        .new-arrivals .eyebrow{display:flex;align-items:center;gap:6px;margin:0 0 8px}
        .new-arrivals h2{margin:0;font-size:clamp(30px,4vw,48px);line-height:.98;letter-spacing:-.04em;font-weight:500}
        .new-arrivals h2 em{font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#1557b0}
        .new-arrivals-subtitle{color:#687386;font-size:13px;margin:8px 0 0}
        .new-arrivals-actions{display:flex;gap:8px}
        .new-arrivals-actions button{width:42px;height:42px;border-radius:50%;border:1px solid #d8e0ea;background:#fff;display:grid;place-items:center;cursor:pointer;color:#172033}
        .new-arrivals-actions button:hover:not(:disabled){border-color:#1557b0;color:#1557b0}
        .new-arrivals-actions button:disabled{opacity:.4;cursor:default}
        .new-arrivals-window{overflow:hidden;width:100%}
        .new-arrivals-track{display:flex;transition:transform .55s cubic-bezier(.2,.7,.2,1);will-change:transform}
        .new-arrival-slide{flex:0 0 25%;min-width:0;padding:0 9px}
        .new-arrival-slide:first-child{padding-left:0}.new-arrival-slide:last-child{padding-right:0}

        :global(.new-arrivals .new-arrival-slide .product-card){
          height:100% !important;
          border:1px solid #d9e2ec !important;
          border-radius:50% 50% 20px 20px / 28% 28% 20px 20px !important;
          overflow:hidden !important;
          background:#fff !important;
          box-shadow:0 10px 28px rgba(20,55,90,.08) !important;
        }

        /* Mirror glass/arch: full product image stays visible, never cropped. */
        :global(.new-arrivals .new-arrival-slide .product-image){
          aspect-ratio:1 / 1.12 !important;
          display:block !important;
          position:relative !important;
          overflow:hidden !important;
          background:#fff !important;
          border-radius:50% 50% 0 0 / 30% 30% 0 0 !important;
          padding:12px !important;
          box-sizing:border-box !important;
        }
        :global(.new-arrivals .new-arrival-slide .product-image img){
          width:100% !important;
          height:100% !important;
          object-fit:contain !important;
          object-position:center !important;
          transform:none !important;
          border-radius:12px !important;
        }
        :global(.new-arrivals .new-arrival-slide .product-image span){
          background:#dc2626 !important;
          color:#fff !important;
          z-index:3 !important;
        }
        :global(.new-arrivals .new-arrival-slide .product-body){
          padding:12px 14px 14px !important;
        }
        :global(.new-arrivals .new-arrival-slide .product-name){
          font-size:14px !important;
          line-height:1.25 !important;
          -webkit-line-clamp:2 !important;
          max-height:2.5em !important;
        }
        :global(.new-arrivals .new-arrival-slide .price-row){
          margin-top:10px !important;
        }

        .new-arrivals-dots{display:flex;justify-content:center;gap:6px;margin-top:18px}
        .new-arrivals-dots button{width:7px;height:7px;padding:0;border:0;border-radius:99px;background:#c9d2de;cursor:pointer}
        .new-arrivals-dots button.active{width:24px;background:#1557b0}

        @media(max-width:800px){
          .new-arrivals{padding:30px 0 40px}
          .new-arrivals-head{margin-bottom:18px;align-items:center}
          .new-arrivals-subtitle{font-size:11px;max-width:250px}
          .new-arrivals-actions button{width:36px;height:36px}
          .new-arrival-slide{flex-basis:50%;padding:0 5px}
          .new-arrival-slide:first-child{padding-left:0}.new-arrival-slide:last-child{padding-right:0}

          :global(.new-arrivals .new-arrival-slide .product-card){
            border-radius:50% 50% 15px 15px / 24% 24% 15px 15px !important;
          }
          :global(.new-arrivals .new-arrival-slide .product-image){
            aspect-ratio:1 / 1.10 !important;
            padding:9px !important;
            border-radius:50% 50% 0 0 / 26% 26% 0 0 !important;
          }
          :global(.new-arrivals .new-arrival-slide .product-name){
            font-size:13px !important;
          }
        }
      `}</style>
    </section>
  );
}
