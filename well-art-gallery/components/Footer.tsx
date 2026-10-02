'use client';

import type {ReactNode} from 'react';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {Instagram,Facebook,Youtube,MessageCircle} from 'lucide-react';
import {createClient,hasSupabase} from '@/lib/supabase';

type FooterSettings={
  site_name?:string; footer_about?:string; footer_phone?:string; footer_email?:string;
  footer_address?:string; whatsapp_number?:string; instagram_url?:string; facebook_url?:string;
  youtube_url?:string;
};

export function Footer(){
  const [s,setS]=useState<FooterSettings>({
    site_name:'Well Art Gallery',
    footer_about:'Artificial flowers and decor made to keep your space beautiful.'
  });

  useEffect(()=>{
    if(!hasSupabase()) return;
    const sb=createClient();
    sb.from('store_settings').select('*').eq('id',true).maybeSingle()
      .then(({data})=>{if(data)setS(data)});
  },[]);

  const wa=s.whatsapp_number?.replace(/\D/g,'');
  const social=[
    s.instagram_url&&{href:s.instagram_url,label:'Instagram',icon:<Instagram/>},
    s.facebook_url&&{href:s.facebook_url,label:'Facebook',icon:<Facebook/>},
    s.youtube_url&&{href:s.youtube_url,label:'YouTube',icon:<Youtube/>},
    wa&&{href:`https://wa.me/${wa}`,label:'WhatsApp',icon:<MessageCircle/>}
  ].filter(Boolean) as {href:string;label:string;icon:ReactNode}[];

  return <footer className="footer">
    <div className="container footer-grid footer-grid-wide">
      <div>
        <h3>{s.site_name||'Well Art Gallery'}</h3>
        <p>{s.footer_about||'Artificial flowers and decor made to keep your space beautiful.'}</p>
        {s.footer_address&&<p>{s.footer_address}</p>}
        {s.footer_phone&&<p><a href={`tel:${s.footer_phone}`}>{s.footer_phone}</a></p>}
        {s.footer_email&&<p><a href={`mailto:${s.footer_email}`}>{s.footer_email}</a></p>}
        {social.length>0&&<div className="social-links">{social.map(x=><a key={x.label} href={x.href} target="_blank" rel="noreferrer" aria-label={x.label}>{x.icon}</a>)}</div>}
      </div>
      <div><b>Shop</b><Link href="/products">All Products</Link><Link href="/products?category=bouquets">Bouquets</Link><Link href="/products?category=wedding-decor">Wedding Decor</Link><Link href="/cart">Cart</Link></div>
      <div><b>Help</b><Link href="/wishlist">Wishlist</Link><Link href="/privacy">Privacy Policy</Link><Link href="/products">Contact / Shop</Link></div>
    </div>
    <div className="copyright">© {new Date().getFullYear()} {s.site_name||'Well Art Gallery'}. All rights reserved.</div>
  </footer>;
}
