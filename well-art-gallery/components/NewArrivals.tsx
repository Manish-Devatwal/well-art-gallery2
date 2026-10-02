'use client';

import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Sparkles} from 'lucide-react';
import {Product} from '@/lib/types';
import {ProductCard} from './ProductCard';
import {AddToCartButton} from './AddToCartButton';
import {BuyNowButton} from './BuyNowButton';

export function NewArrivals({products}:{products:Product[]}){
  const items=useMemo(()=>products.slice(0,5),[products]);
  const [index,setIndex]=useState(0);
  const [perView,setPerView]=useState(4);

  useEffect(()=>{const update=()=>setPerView(window.innerWidth<=800?2:4);update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
  const maxIndex=Math.max(0,items.length-perView);
  useEffect(()=>{if(items.length<=perView)return;const t=window.setInterval(()=>setIndex(c=>c>=maxIndex?0:c+1),3500);return()=>window.clearInterval(t)},[items.length,perView,maxIndex]);
  useEffect(()=>{if(index>maxIndex)setIndex(maxIndex)},[index,maxIndex]);
  if(!items.length)return null;
  const offset=index*(100/perView);

  return <section className="new-arrivals" aria-labelledby="new-arrivals-title">
    <div className="container">
      <div className="new-arrivals-head">
        <div><p className="eyebrow"><Sparkles size={13}/> Just added</p><h2 id="new-arrivals-title">New <em>Arrivals.</em></h2><p className="new-arrivals-subtitle">Our latest products, added automatically from the admin catalogue.</p></div>
        <div className="new-arrivals-actions">
          <button type="button" aria-label="Previous new arrivals" onClick={()=>setIndex(c=>c<=0?maxIndex:c-1)} disabled={items.length<=perView}><ArrowLeft size={18}/></button>
          <button type="button" aria-label="Next new arrivals" onClick={()=>setIndex(c=>c>=maxIndex?0:c+1)} disabled={items.length<=perView}><ArrowRight size={18}/></button>
        </div>
      </div>

      <div className="new-arrivals-window"><div className="new-arrivals-track" style={{transform:`translateX(-${offset}%)`}}>
        {items.map(product=><div className="new-arrival-slide" key={product.id}>
          <article className="new-arrival-card">
            <a href={`/products/${product.slug}`} className="new-arrival-image">
              <img src={product.image||'/placeholder.svg'} alt={product.name} loading="lazy" decoding="async"/>
              <span className="new-arrival-seal">NEW</span>
            </a>
            <div className="new-arrival-bottom">
              <b>₹{product.price.toLocaleString('en-IN')}</b>
              <div className="new-arrival-actions-row">
                <BuyNowButton product={product}/>
                <AddToCartButton product={product}/>
              </div>
            </div>
          </article>
        </div>)}
      </div></div>

      {items.length>perView&&<div className="new-arrivals-dots">{Array.from({length:maxIndex+1}).map((_,dot)=><button key={dot} type="button" aria-label={`Show slide ${dot+1}`} className={dot===index?'active':''} onClick={()=>setIndex(dot)}/>)}</div>}
    </div>

    <style jsx>{`
      .new-arrivals{background:#fff;padding:54px 0 62px;border-bottom:1px solid #e8e8e8}
      .new-arrivals-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}
      .new-arrivals h2{margin:0;font-size:clamp(34px,4vw,50px);line-height:.98;letter-spacing:-.04em;font-weight:500}
      .new-arrivals h2 em{font-family:Georgia,serif;font-weight:400;color:#1557b0}
      .new-arrivals-subtitle{color:#687386;font-size:13px;margin:9px 0 0}
      .new-arrivals-actions{display:flex;gap:8px}
      .new-arrivals-actions button{width:42px;height:42px;border-radius:50%;border:1px solid #d8e0ea;background:#fff;display:grid;place-items:center;cursor:pointer}
      .new-arrivals-window{overflow:hidden;width:100%}
      .new-arrivals-track{display:flex;transition:transform .55s cubic-bezier(.2,.7,.2,1)}
      .new-arrival-slide{flex:0 0 25%;min-width:0;padding:0 9px}
      .new-arrival-slide:first-child{padding-left:0}.new-arrival-slide:last-child{padding-right:0}

      .new-arrival-card{
        height:100%;display:flex;flex-direction:column;overflow:hidden;background:#fff;
        border:1px solid #d8e2ee;border-radius:50% 50% 22px 22px / 34% 34% 22px 22px;
        box-shadow:0 10px 30px rgba(18,45,78,.08);
      }
      .new-arrival-image{
        display:block;position:relative;aspect-ratio:1/1.02;overflow:hidden;
        border-radius:50% 50% 0 0 / 34% 34% 0 0;background:#fff;
      }
      .new-arrival-image img{width:100%;height:100%;object-fit:contain;object-position:center}
      .new-arrival-seal{
        position:absolute;top:14px;left:14px;z-index:3;width:48px;height:48px;
        display:flex;align-items:center;justify-content:center;background:#d71920;color:#fff;
        border:3px solid #fff;border-radius:50%;font-size:10px;font-weight:900;
        box-shadow:0 3px 10px rgba(0,0,0,.16)
      }
      .new-arrival-bottom{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px 12px}
      .new-arrival-bottom>b{font-size:16px;white-space:nowrap;color:#172033}
      .new-arrival-actions-row{display:flex;gap:5px;align-items:center}
      .new-arrival-actions-row :global(button){white-space:nowrap!important;padding:8px 9px!important;font-size:10px!important;line-height:1!important;border-radius:9px!important}
      .new-arrival-actions-row :global(.secondary-btn){margin:0!important}
      .new-arrivals-dots{display:flex;justify-content:center;gap:6px;margin-top:20px}
      .new-arrivals-dots button{width:7px;height:7px;padding:0;border:0;border-radius:99px;background:#c9d2de}
      .new-arrivals-dots button.active{width:24px;background:#1557b0}
      @media(max-width:800px){
        .new-arrivals{padding:34px 0 42px}.new-arrivals-head{margin-bottom:20px;align-items:center}
        .new-arrivals-subtitle{font-size:12px;max-width:280px}.new-arrival-slide{flex-basis:50%;padding:0 5px}
        .new-arrival-card{border-radius:50% 50% 16px 16px / 30% 30% 16px 16px}
        .new-arrival-image{aspect-ratio:1/1.08;border-radius:50% 50% 0 0 / 30% 30% 0 0}
        .new-arrival-seal{top:9px;left:9px;width:40px;height:40px;font-size:9px}
        .new-arrival-bottom{padding:8px 8px 9px;gap:4px}.new-arrival-bottom>b{font-size:14px}
        .new-arrival-actions-row{gap:3px}.new-arrival-actions-row :global(button){padding:7px 7px!important;font-size:9px!important}
      }
    `}</style>
  </section>
}
