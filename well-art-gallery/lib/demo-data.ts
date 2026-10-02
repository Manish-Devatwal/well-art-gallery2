import {Product} from './types';
const names=['Silk Rose Bouquet','Premium White Lily','Green Leaf Wall Bundle','Pastel Flower Set','Wedding Flower Basket','Lavender Stem Bundle','Pink Peony Bouquet','Eucalyptus Arrangement'];
const cats=['Bouquets','Table Decor','Wall Flowers','Wedding Decor'];
const prices=[799,649,899,999,1199,549,1099,749];
export const demoProducts:Product[]=Array.from({length:8},(_,i)=>({id:`demo-${i+1}`,sku:`WAG-${1001+i}`,slug:names[i].toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:names[i],category:cats[i%4],price:prices[i],compareAtPrice:prices[i]+200,description:'Beautiful artificial flowers designed to look natural, stay fresh-looking and elevate your home or event decor.',images:[`/demo/product-${i+1}.svg`],image:`/demo/product-${i+1}.svg`,stock:25,badge:i<3?'Popular':undefined}));
