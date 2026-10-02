import {createClient,hasSupabase} from './supabase';
import {demoProducts} from './demo-data';
import {Product} from './types';
function mapProduct(p:any):Product{return {id:p.id,sku:p.sku,slug:p.slug,name:p.name,description:p.description||'',price:Number(p.price),compareAtPrice:p.compare_at_price==null?undefined:Number(p.compare_at_price),stock:Number(p.stock||0),images:p.image_urls||[],image:(p.image_urls||[])[0]||'/placeholder.svg',category:p.categories?.name||'Decor'};}
export async function getCategories(){
  if(!hasSupabase()) return Array.from(new Map(demoProducts.map(p=>[p.category.toLowerCase().replace(/\s+/g,'-'),{id:p.category,slug:p.category.toLowerCase().replace(/\s+/g,'-'),name:p.category}])).values());
  const sb=createClient();
  const {data}=await sb.from('categories').select('id,name,slug').order('name');
  return data||[];
}
export async function getProducts(opts:{q?:string;category?:string;page?:number;limit?:number}={}):Promise<{products:Product[];count:number}>{const {q='',category='',page=1,limit=24}=opts;if(!hasSupabase()){let p=demoProducts.filter(x=>!q||`${x.name} ${x.category} ${x.sku}`.toLowerCase().includes(q.toLowerCase())).filter(x=>!category||x.category.toLowerCase().replace(/\s+/g,'-')===category.toLowerCase());return {products:p.slice((page-1)*limit,page*limit),count:p.length};}const sb=createClient();let query=sb.from('products').select('id,sku,slug,name,description,price,compare_at_price,stock,image_urls,categories(name,slug)',{count:'exact'}).eq('is_active',true).order('created_at',{ascending:false}).range((page-1)*limit,page*limit-1);if(q) query=query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);if(category) query=query.eq('categories.slug',category);const {data,count,error}=await query;if(error)return {products:[],count:0};return {products:(data||[]).map(mapProduct),count:count||0};}
export async function getProduct(slug:string):Promise<Product|null>{if(!hasSupabase())return demoProducts.find(p=>p.slug===slug)||null;const sb=createClient();const {data}=await sb.from('products').select('id,sku,slug,name,description,price,compare_at_price,stock,image_urls,categories(name,slug)').eq('slug',slug).eq('is_active',true).maybeSingle();return data?mapProduct(data):null;}
