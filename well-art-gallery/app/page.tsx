import Link from 'next/link';
import {Hero} from '@/components/Hero';
import {ProductGrid} from '@/components/ProductGrid';
import {SectionTitle} from '@/components/SectionTitle';
import {getCategories,getProducts} from '@/lib/store';

export default async function HomePage(){
  const [{products},{categories}]=await Promise.all([getProducts({limit:48}),getCategories()]);
  return <><Hero/>
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="All products" title="Shop our collection" href="/products"/>
        {products.length?<ProductGrid products={products}/>:<div className="empty-card"><h3>No products found</h3><p className="muted">Add products from the Admin panel.</p></div>}
        {products.length>=48&&<div className="home-more"><Link className="primary-btn" href="/products">View all products</Link></div>}
      </div>
    </section>
    <section className="section section-soft">
      <div className="container">
        <SectionTitle eyebrow="Shop by category" title="All categories" href="/products"/>
        <div className="category-strip">
          {categories.map(c=><Link className="category-card" href={`/products?category=${encodeURIComponent(c.slug)}`} key={c.id}><span>{c.name}</span><span>→</span></Link>)}
          {!categories.length&&<Link className="category-card" href="/products"><span>All Products</span><span>→</span></Link>}
        </div>
      </div>
    </section>
  </>
}
