"use client";

import { useState } from "react";
import { Package, Image as ImageIcon, Settings, Upload, ShieldCheck } from "lucide-react";

export function AdminShell() {
  const [tab, setTab] = useState("products");
  const tabs = [
    ["products", "Products", Package], ["banners", "Banners", ImageIcon], ["settings", "Store Settings", Settings], ["security", "Security", ShieldCheck]
  ] as const;

  return (
    <section className="admin-page">
      <div className="container">
        <div className="admin-head"><div><p className="eyebrow">Well Art Gallery</p><h1>Store Admin</h1></div><span className="admin-status">● Protected area</span></div>
        <div className="admin-layout">
          <aside className="admin-sidebar">{tabs.map(([id, label, Icon]) => <button className={tab===id ? "admin-tab active":"admin-tab"} onClick={()=>setTab(id)} key={id}><Icon size={18}/>{label}</button>)}</aside>
          <div className="admin-content">
            {tab==="products" && <><div className="admin-toolbar"><div><h2>Products</h2><p>Manage your catalogue without storing images in the database.</p></div><button className="primary-btn"><Upload size={17}/> Bulk Import</button></div><div className="admin-empty"><Package size={38}/><h3>Connect Supabase to load products</h3><p>Run <code>supabase/schema.sql</code>, add your environment variables, then this dashboard can be wired to your live catalogue.</p></div></>}
            {tab==="banners" && <div className="admin-empty"><ImageIcon size={38}/><h3>Hero banners</h3><p>Upload optimized images to Supabase Storage. Only public CDN URLs are stored with banner records.</p></div>}
            {tab==="settings" && <div className="admin-empty"><Settings size={38}/><h3>Store settings</h3><p>WhatsApp number, message template, SEO defaults and storefront settings belong here.</p></div>}
            {tab==="security" && <div className="admin-empty"><ShieldCheck size={38}/><h3>Security</h3><p>Use Supabase Auth + Row Level Security. Never put service-role keys or admin passwords in the browser.</p></div>}
          </div>
        </div>
      </div>
    </section>
  );
}