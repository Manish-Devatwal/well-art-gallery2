'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {createClient,hasSupabase} from '@/lib/supabase';

type Slide={
  id:string;
  title:string;
  subtitle?:string;
  image_url:string;
  cta_text:string;
  cta_url:string;
  sort_order:number;
};

const fallbackSlides:Slide[]=[
  {id:'demo-1',title:'Artificial Flowers, Real Beauty',subtitle:'Refresh every corner with premium flowers that stay beautiful all year.',cta_text:'Shop Flowers',cta_url:'/products',image_url:'/demo/hero-1.svg',sort_order:0},
  {id:'demo-2',title:'Wedding & Event Decor',subtitle:'Elegant floral styling without the maintenance.',cta_text:'Explore Wedding Decor',cta_url:'/products?category=wedding-decor',image_url:'/demo/hero-2.svg',sort_order:1},
  {id:'demo-3',title:'Fresh Deals Every Week',subtitle:'Beautiful arrangements at prices made for easy gifting.',cta_text:'View Products',cta_url:'/products',image_url:'/demo/hero-3.svg',sort_order:2}
];

export function Hero(){
  const [slides,setSlides]=useState<Slide[]>(fallbackSlides);
  const [i,setI]=useState(0);

  useEffect(()=>{
    let alive=true;

    async function loadBanners(){
      if(!hasSupabase()) return;
      const sb=createClient();
      const {data,error}=await sb
        .from('hero_banners')
        .select('id,title,subtitle,image_url,cta_text,cta_url,sort_order')
        .eq('is_active',true)
        .order('sort_order',{ascending:true});

      if(!alive) return;
      if(!error && data && data.length){
        setSlides(data as Slide[]);
        setI(0);
      }
    }

    loadBanners();
    return()=>{alive=false};
  },[]);

  useEffect(()=>{
    if(slides.length<=1) return;
    const t=setInterval(()=>setI(x=>(x+1)%slides.length),5000);
    return()=>clearInterval(t);
  },[slides.length]);

  const s=slides[i]||slides[0];

  return (
    <section className="hero" aria-label="Featured offers">
      <img src={s.image_url} alt={s.title} fetchPriority="high"/>
      <div className="hero-overlay"/>
      <div className="container hero-content">
        <p className="eyebrow">WELL ART GALLERY</p>
        <h1>{s.title}</h1>
        {s.subtitle&&<p>{s.subtitle}</p>}
        <Link className="primary-btn" href={s.cta_url||'/products'}>
          {s.cta_text||'Shop Now'}
        </Link>
      </div>

      {slides.length>1&&<>
        <button type="button" aria-label="Previous slide" className="hero-arrow left"
          onClick={()=>setI(x=>(x-1+slides.length)%slides.length)}>
          <ChevronLeft/>
        </button>
        <button type="button" aria-label="Next slide" className="hero-arrow right"
          onClick={()=>setI(x=>(x+1)%slides.length)}>
          <ChevronRight/>
        </button>
        <div className="dots">
          {slides.map((slide,n)=>(
            <button type="button" key={slide.id}
              className={n===i?'active':''}
              onClick={()=>setI(n)}
              aria-label={`Slide ${n+1}`}/>
          ))}
        </div>
      </>}
    </section>
  );
}
