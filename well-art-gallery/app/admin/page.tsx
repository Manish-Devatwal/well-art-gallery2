'use client';

import {useEffect,useState} from 'react';
import * as XLSX from 'xlsx';
import {createClient} from '@/lib/supabase';
import {LogOut,Upload,Package,Settings,Image as ImageIcon,FolderTree,Trash2,Save,X} from 'lucide-react';

const getSB=()=>createClient();
const MAX_PRODUCT_IMAGES=5;

function generateSku(name:string){
  const base=(name||'PRODUCT')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g,'-')
    .replace(/^-|-$/g,'')
    .slice(0,18)||'PRODUCT';
  const stamp=Date.now().toString(36).toUpperCase().slice(-5);
  const random=Math.random().toString(36).slice(2,6).toUpperCase();
  return `WAG-${base}-${stamp}${random}`;
}

export default function AdminPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState<any>(null);
  const [admin,setAdmin]=useState(false);
  const [status,setStatus]=useState('');
  const [tab,setTab]=useState('Products');
  const [products,setProducts]=useState<any[]>([]);
  const [categories,setCategories]=useState<any[]>([]);
  const [banners,setBanners]=useState<any[]>([]);
  const [settings,setSettings]=useState<any>({whatsapp_number:'',whatsapp_template:''});
  const [form,setForm]=useState({
    name:'',sku:'',price:'',stock:'0',category_id:'',description:'',image_urls:''
  });
  const [catName,setCatName]=useState('');
  const [banner,setBanner]=useState({
    title:'',subtitle:'',image_url:'',cta_text:'Shop Now',cta_url:'/products'
  });

  const refresh=async()=>{
    const sb=getSB();
    const [p,c,b,s]=await Promise.all([
      sb.from('products').select('id,sku,name,price,stock,is_active,image_urls').order('created_at',{ascending:false}).limit(100),
      sb.from('categories').select('*').order('name'),
      sb.from('hero_banners').select('*').order('sort_order'),
      sb.from('store_settings').select('*').eq('id',true).maybeSingle()
    ]);
    setProducts(p.data||[]);
    setCategories(c.data||[]);
    setBanners(b.data||[]);
    if(s.data)setSettings(s.data);
  };

  useEffect(()=>{
    const sb=getSB();
    sb.auth.getUser().then(async({data})=>{
      if(!data.user)return;
      setUser(data.user);
      const r=await sb.from('profiles').select('role').eq('id',data.user.id).maybeSingle();
      setAdmin(r.data?.role==='admin');
      if(r.data?.role==='admin')refresh();
    });
  },[]);

  const login=async()=>{
    const sb=getSB();
    setStatus('Signing in...');
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){setStatus(error.message);return}
    setUser(data.user);
    const r=await sb.from('profiles').select('role').eq('id',data.user.id).maybeSingle();
    if(r.data?.role!=='admin'){
      await sb.auth.signOut();
      setUser(null);
      setStatus('This account is not an admin.');
      return;
    }
    setAdmin(true);
    setStatus('Signed in');
    refresh();
  };

  const logout=async()=>{
    const sb=getSB();
    await sb.auth.signOut();
    setUser(null);
    setAdmin(false);
  };

  const uploadImage=async(file:File,bucket:'product-images'|'hero-images')=>{
    if(!file.type.startsWith('image/'))throw new Error('Please upload an image file.');
    if(file.size>8*1024*1024)throw new Error('Image must be 8MB or smaller.');
    const sb=getSB();
    const path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`;
    const {error}=await sb.storage.from(bucket).upload(path,file,{
      upsert:false,
      contentType:file.type,
      cacheControl:'31536000'
    });
    if(error)throw error;
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleProductFiles=async(files:FileList|null)=>{
    if(!files?.length)return;
    const current=form.image_urls.split(/\s*,\s*|\s+/).filter(Boolean);
    if(current.length>=MAX_PRODUCT_IMAGES){
      setStatus(`Maximum ${MAX_PRODUCT_IMAGES} product images allowed.`);
      return;
    }

    const selected=Array.from(files).slice(0,MAX_PRODUCT_IMAGES-current.length);
    if(selected.length<files.length){
      setStatus(`Only ${MAX_PRODUCT_IMAGES} images can be attached to one product.`);
    }else{
      setStatus(`Uploading ${selected.length} image${selected.length>1?'s':''}...`);
    }

    try{
      const urls:string[]=[];
      for(const file of selected)urls.push(await uploadImage(file,'product-images'));
      setForm(x=>({
        ...x,
        image_urls:[...current,...urls].slice(0,MAX_PRODUCT_IMAGES).join(',')
      }));
      setStatus(`${urls.length} image${urls.length>1?'s':''} uploaded. You can add ${MAX_PRODUCT_IMAGES-current.length-urls.length} more.`);
    }catch(e:any){
      setStatus(e.message||'Image upload failed');
    }
  };

  const removeFormImage=(index:number)=>{
    const urls=form.image_urls.split(/\s*,\s*|\s+/).filter(Boolean);
    urls.splice(index,1);
    setForm({...form,image_urls:urls.join(',')});
  };

  const addProduct=async()=>{
    const sb=getSB();
    const name=form.name.trim();
    if(!name){setStatus('Product name is required.');return}
    if(!form.price||Number(form.price)<0){setStatus('Enter a valid price.');return}

    const sku=form.sku.trim()||generateSku(name);
    const slug=sku.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const urls=form.image_urls.split(/\s*,\s*|\s+/).filter(Boolean).slice(0,MAX_PRODUCT_IMAGES);

    setStatus(`Saving product with SKU ${sku}...`);

    const {error}=await sb.from('products').insert({
      sku,
      slug,
      name,
      price:Number(form.price),
      stock:Number(form.stock||0),
      category_id:form.category_id||null,
      description:form.description.trim(),
      image_urls:urls,
      is_active:true
    });

    if(error){
      if(error.code==='23505'&&String(error.message).includes('products_sku_key')){
        setStatus('This SKU already exists. Leave SKU empty and the system will generate a unique one automatically.');
      }else{
        setStatus(error.message);
      }
      return;
    }

    setStatus(`Product saved successfully. SKU: ${sku}`);
    setForm({name:'',sku:'',price:'',stock:'0',category_id:'',description:'',image_urls:''});
    refresh();
  };

  const removeProduct=async(id:string)=>{
    const sb=getSB();
    if(!confirm('Delete this product?'))return;
    const {error}=await sb.from('products').delete().eq('id',id);
    setStatus(error?error.message:'Product deleted');
    refresh();
  };

  const addCategory=async()=>{
    const sb=getSB();
    const name=catName.trim();
    if(!name)return;
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const {error}=await sb.from('categories').insert({name,slug});
    setStatus(error?error.message:'Category added');
    if(!error)setCatName('');
    refresh();
  };

  const handleBannerFile=async(file:File)=>{
    setStatus('Uploading banner...');
    try{
      const url=await uploadImage(file,'hero-images');
      setBanner(x=>({...x,image_url:url}));
      setStatus('Banner image uploaded');
    }catch(e:any){setStatus(e.message)}
  };

  const addBanner=async()=>{
    const sb=getSB();
    const {error}=await sb.from('hero_banners').insert({...banner,sort_order:banners.length,is_active:true});
    setStatus(error?error.message:'Banner added');
    if(!error){
      setBanner({title:'',subtitle:'',image_url:'',cta_text:'Shop Now',cta_url:'/products'});
      refresh();
    }
  };

  const removeBanner=async(b:any)=>{
    const sb=getSB();
    if(!confirm('Delete this banner?'))return;
    const {error}=await sb.from('hero_banners').delete().eq('id',b.id);
    if(error){setStatus(error.message);return}
    try{
      const marker='/storage/v1/object/public/hero-images/';
      const idx=String(b.image_url||'').indexOf(marker);
      if(idx>=0){
        const path=decodeURIComponent(String(b.image_url).slice(idx+marker.length));
        if(path)await sb.storage.from('hero-images').remove([path]);
      }
    }catch{}
    setStatus('Banner deleted');
    refresh();
  };

  const removeCategory=async(id:string)=>{
    const sb=getSB();
    if(!confirm('Delete this category? Products will remain without a category.'))return;
    const {error}=await sb.from('categories').delete().eq('id',id);
    setStatus(error?error.message:'Category deleted');
    refresh();
  };

  const saveSettings=async()=>{
    const sb=getSB();
    const {error}=await sb.from('store_settings').upsert({...settings,id:true});
    setStatus(error?'Could not save settings: '+error.message:'Settings saved');
  };

  const importSheet=async(file:File)=>{
    const sb=getSB();
    setStatus('Reading import file...');
    try{
      const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});
      const rows=XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]],{defval:''});
      const payload=rows.slice(0,1000).map((r:any)=>{
        const name=String(r.name||r.Name||'').trim();
        const suppliedSku=String(r.sku||r.SKU||'').trim();
        const sku=suppliedSku||generateSku(name);
        return {
          sku,
          slug:String(r.slug||sku||name).toLowerCase().replace(/[^a-z0-9]+/g,'-'),
          name,
          description:String(r.description||r.Description||''),
          price:Number(r.price||r.Price||0),
          compare_at_price:r.compare_at_price?Number(r.compare_at_price):null,
          stock:Number(r.stock||r.Stock||0),
          image_urls:String(r.image_urls||r.image||r.images||'').split(/\s*,\s*|\s+/).filter(Boolean).slice(0,MAX_PRODUCT_IMAGES),
          is_active:true
        };
      }).filter((r:any)=>r.name&&Number.isFinite(r.price));

      if(!payload.length)throw new Error('No valid rows. Required: name and price.');
      const {error}=await sb.from('products').upsert(payload,{onConflict:'sku'});
      setStatus(error?error.message:`Imported ${payload.length} products`);
      if(!error)refresh();
    }catch(e:any){setStatus(e.message)}
  };

  if(!process.env.NEXT_PUBLIC_SUPABASE_URL){
    return <main className="admin-page"><div className="admin-card"><h1>Well Art Gallery Admin</h1><p>Connect Supabase in <b>.env.local</b> first.</p></div></main>;
  }

  if(!user||!admin){
    return <main className="admin-page">
      <div className="admin-card">
        <h1>Admin Login</h1>
        <p className="muted">Only users with <b>admin</b> role can access the dashboard.</p>
        <input className="admin-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="admin-input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="primary-btn full" onClick={login}>Login</button>
        {status&&<p className="status">{status}</p>}
      </div>
    </main>;
  }

  const tabs:any[]=[['Products',Package],['Banners',ImageIcon],['Categories',FolderTree],['Settings',Settings]];

  const imageList=form.image_urls.split(/\s*,\s*|\s+/).filter(Boolean).slice(0,MAX_PRODUCT_IMAGES);

  return <main className="admin-page">
    <div className="admin-wrap">
      <aside className="admin-side">
        <h2>Well Art</h2>
        {tabs.map(([x,I])=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}><I/> {x}</button>)}
        <button onClick={logout}><LogOut/> Logout</button>
      </aside>

      <section className="admin-main">
        <div className="admin-head">
          <div><p className="eyebrow">Secure dashboard</p><h1>{tab}</h1></div>
          <span className="status">{status||user.email}</span>
        </div>

        {tab==='Products'&&<>
          <div className="admin-card">
            <h3>Add product</h3>
            <p className="admin-help">SKU खाली छोड़ोगे तो system automatically unique SKU generate करेगा.</p>

            <div className="admin-form wide">
              <input className="admin-input" placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              <input className="admin-input" placeholder="SKU (optional — auto generated)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
              <input className="admin-input" placeholder="Price" type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
              <input className="admin-input" placeholder="Stock" type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/>
              <select className="admin-input" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
                <option value="">Category</option>
                {categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}
              </select>
              <textarea className="admin-input" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            </div>

            <div className="admin-image-upload">
              <div className="admin-upload-head">
                <div>
                  <b>Product images</b>
                  <small>Upload up to 5 images together. Customers can slide through them like Amazon.</small>
                </div>
                <span>{imageList.length}/{MAX_PRODUCT_IMAGES}</span>
              </div>

              <label className="upload-btn">
                <Upload/> Choose up to 5 images
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e=>handleProductFiles(e.target.files)}
                />
              </label>

              {imageList.length>0&&(
                <div className="admin-image-list">
                  {imageList.map((url,index)=>(
                    <div className="admin-image-item" key={`${url}-${index}`}>
                      <img src={url} alt={`Product image ${index+1}`}/>
                      <span>{index+1}</span>
                      <button type="button" onClick={()=>removeFormImage(index)} aria-label="Remove image"><X/></button>
                    </div>
                  ))}
                </div>
              )}

              <input
                className="admin-input"
                placeholder="Or paste image URLs, comma separated (max 5)"
                value={form.image_urls}
                onChange={e=>setForm({...form,image_urls:e.target.value.split(/\s*,\s*|\s+/).filter(Boolean).slice(0,MAX_PRODUCT_IMAGES).join(',')})}
              />
            </div>

            <button className="primary-btn" onClick={addProduct}><Save/> Save Product</button>

            <hr/>
            <p><b>Bulk import:</b> CSV/XLSX with <code>name,sku,price,stock,description,image_urls</code>. SKU may be blank and will be generated.</p>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={e=>e.target.files?.[0]&&importSheet(e.target.files[0])}/>
          </div>

          <div className="admin-card">
            <h3>Products ({products.length})</h3>
            {products.map(p=><div className="admin-row" key={p.id}>
              <span><b>{p.name}</b><small>{p.sku} · ₹{Number(p.price).toLocaleString('en-IN')} · Stock {p.stock}</small></span>
              <button className="danger-btn" onClick={()=>removeProduct(p.id)}><Trash2/></button>
            </div>)}
          </div>
        </>}

        {tab==='Categories'&&<div className="admin-card">
          <h3>Categories</h3>
          <div className="inline-form">
            <input className="admin-input" placeholder="New category" value={catName} onChange={e=>setCatName(e.target.value)}/>
            <button className="primary-btn" onClick={addCategory}>Add</button>
          </div>
          {categories.map(c=><div className="admin-row" key={c.id}>
            <span>{c.name}<small>/{c.slug}</small></span>
            <button className="danger-btn" title="Delete category" onClick={()=>removeCategory(c.id)}><Trash2/></button>
          </div>)}
        </div>}

        {tab==='Banners'&&<div className="admin-card">
          <h3>Add hero banner</h3>
          <input className="admin-input" placeholder="Title" value={banner.title} onChange={e=>setBanner({...banner,title:e.target.value})}/>
          <input className="admin-input" placeholder="Subtitle" value={banner.subtitle} onChange={e=>setBanner({...banner,subtitle:e.target.value})}/>
          <input className="admin-input" placeholder="Image URL" value={banner.image_url} onChange={e=>setBanner({...banner,image_url:e.target.value})}/>
          <label className="upload-btn"><Upload/> Upload banner<input hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&handleBannerFile(e.target.files[0])}/></label>
          <input className="admin-input" placeholder="Button text" value={banner.cta_text} onChange={e=>setBanner({...banner,cta_text:e.target.value})}/>
          <input className="admin-input" placeholder="Button URL" value={banner.cta_url} onChange={e=>setBanner({...banner,cta_url:e.target.value})}/>
          <button className="primary-btn" onClick={addBanner}>Save Banner</button>
          {banners.map(b=><div className="admin-row" key={b.id}>
            <span><b>{b.title}</b><small>{b.image_url}</small></span>
            <button className="danger-btn" title="Delete banner" onClick={()=>removeBanner(b)}><Trash2/></button>
          </div>)}
        </div>}

        {tab==='Settings'&&<div className="admin-card">
          <h3>Store & footer settings</h3>
          <div className="admin-form wide">
            <label>Site name<input className="admin-input" value={settings.site_name||''} onChange={e=>setSettings({...settings,site_name:e.target.value})}/></label>
            <label>Footer about<textarea className="admin-input" value={settings.footer_about||''} onChange={e=>setSettings({...settings,footer_about:e.target.value})}/></label>
            <label>Phone<input className="admin-input" value={settings.footer_phone||''} onChange={e=>setSettings({...settings,footer_phone:e.target.value})}/></label>
            <label>Email<input className="admin-input" value={settings.footer_email||''} onChange={e=>setSettings({...settings,footer_email:e.target.value})}/></label>
            <label>Address<textarea className="admin-input" value={settings.footer_address||''} onChange={e=>setSettings({...settings,footer_address:e.target.value})}/></label>
            <label>WhatsApp number<input className="admin-input" value={settings.whatsapp_number||''} onChange={e=>setSettings({...settings,whatsapp_number:e.target.value})}/></label>
            <label>Instagram URL<input className="admin-input" value={settings.instagram_url||''} onChange={e=>setSettings({...settings,instagram_url:e.target.value})}/></label>
            <label>Facebook URL<input className="admin-input" value={settings.facebook_url||''} onChange={e=>setSettings({...settings,facebook_url:e.target.value})}/></label>
            <label>YouTube URL<input className="admin-input" value={settings.youtube_url||''} onChange={e=>setSettings({...settings,youtube_url:e.target.value})}/></label>
            <label>WhatsApp template<textarea className="admin-input" rows={4} value={settings.whatsapp_template||''} onChange={e=>setSettings({...settings,whatsapp_template:e.target.value})}/></label>
            <label>SEO title<input className="admin-input" value={settings.seo_title||''} onChange={e=>setSettings({...settings,seo_title:e.target.value})}/></label>
            <label>SEO description<textarea className="admin-input" value={settings.seo_description||''} onChange={e=>setSettings({...settings,seo_description:e.target.value})}/></label>
            <label className="wide-field">Privacy policy<textarea className="admin-input" rows={12} value={settings.footer_privacy||''} onChange={e=>setSettings({...settings,footer_privacy:e.target.value})}/></label>
          </div>
          <button className="primary-btn" onClick={saveSettings}><Save/> Save Settings</button>
        </div>}
      </section>
    </div>
  </main>;
}
