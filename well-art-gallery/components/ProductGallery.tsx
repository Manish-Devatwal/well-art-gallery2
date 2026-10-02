'use client';

import {useState} from 'react';

export default function ProductGallery({images,name}:{images:string[];name:string}){
  const safeImages=images.filter(Boolean).slice(0,5);
  const [active,setActive]=useState(0);
  const [lightbox,setLightbox]=useState(false);

  if(!safeImages.length)return null;

  return <>
    <div className="product-gallery">
      <div className="gallery-main">
        <button
          type="button"
          className="gallery-main-image"
          onClick={()=>setLightbox(true)}
          aria-label={`Open ${name} image`}
        >
          <img
            src={safeImages[active]}
            alt={`${name} ${active+1}`}
            loading="eager"
            decoding="async"
            onError={e=>{
              const img=e.currentTarget;
              img.src='/placeholder.svg';
            }}
          />
        </button>

        {safeImages.length>1 && (
          <>
            <button
              type="button"
              className="gallery-main-nav gallery-main-prev"
              onClick={()=>setActive(active===0?safeImages.length-1:active-1)}
              aria-label="Previous image"
            >‹</button>
            <button
              type="button"
              className="gallery-main-nav gallery-main-next"
              onClick={()=>setActive((active+1)%safeImages.length)}
              aria-label="Next image"
            >›</button>
          </>
        )}
      </div>

      {safeImages.length>1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Product images">
          {safeImages.map((src,index)=>(
            <button
              key={`${src}-${index}`}
              type="button"
              className={`gallery-thumb ${active===index?'active':''}`}
              onClick={()=>setActive(index)}
              aria-label={`Show image ${index+1}`}
            >
              <img src={src} alt="" loading="lazy"/>
            </button>
          ))}
        </div>
      )}
    </div>

    {lightbox && (
      <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={()=>setLightbox(false)}>
        <button type="button" className="gallery-close" onClick={()=>setLightbox(false)} aria-label="Close">×</button>
        <img
          src={safeImages[active]}
          alt={`${name} ${active+1}`}
          onClick={e=>e.stopPropagation()}
        />
        {safeImages.length>1 && (
          <>
            <button type="button" className="gallery-nav gallery-prev" onClick={e=>{e.stopPropagation();setActive(active===0?safeImages.length-1:active-1)}}>‹</button>
            <button type="button" className="gallery-nav gallery-next" onClick={e=>{e.stopPropagation();setActive((active+1)%safeImages.length)}}>›</button>
          </>
        )}
      </div>
    )}
  </>;
}
