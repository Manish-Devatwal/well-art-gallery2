'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/types';

type Ctx = {
  cart: string[];
  wishlist: string[];
  cartProducts: Product[];
  wishlistProducts: Product[];
  whatsappNumber: string;
  whatsappTemplate: string;
  toggleCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  isInCart: (id: string) => boolean;
  isWishlisted: (id: string) => boolean;
  clearCart: () => void;
  clearWishlist: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

function readProducts(key: string): Product[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Older versions stored only product IDs. Those IDs cannot render a
    // product page by themselves, so discard the legacy shape safely.
    return Array.isArray(parsed) && parsed.every((item) => item && typeof item === 'object')
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    process.env.NEXT_PUBLIC_WHATSAPP_TEMPLATE ||
      'Hi Well Art Gallery! I want to buy: {product_name} | ID: {sku} | Price: ₹{price} | Link: {url}'
  );

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      fetch('/api/store-settings')
        .then((r) => (r.ok ? r.json() : null))
        .then((x) => {
          if (x?.whatsapp_number) setWhatsappNumber(x.whatsapp_number);
          if (x?.whatsapp_template) setWhatsappTemplate(x.whatsapp_template);
        })
        .catch(() => {});

      const storedCart = readProducts('wag-cart-products');
      const storedWishlist = readProducts('wag-wishlist-products');

      // Migrate the previous version, which stored only IDs. This keeps
      // products already added before the fix instead of making users re-add them.
      const legacyCart = (() => {
        try {
          const value = JSON.parse(localStorage.getItem('wag-cart') || '[]');
          return Array.isArray(value) && value.every((id) => typeof id === 'string') ? value : [];
        } catch { return []; }
      })();
      const legacyWishlist = (() => {
        try {
          const value = JSON.parse(localStorage.getItem('wag-wishlist') || '[]');
          return Array.isArray(value) && value.every((id) => typeof id === 'string') ? value : [];
        } catch { return []; }
      })();

      const legacyIds = Array.from(new Set([...legacyCart, ...legacyWishlist])).slice(0, 100);
      let migrated: Product[] = [];

      if (legacyIds.length) {
        try {
          const response = await fetch(`/api/products?ids=${encodeURIComponent(legacyIds.join(','))}`, { cache: 'no-store' });
          if (response.ok) {
            const json = await response.json();
            migrated = Array.isArray(json?.products) ? json.products : [];
          }
        } catch {}
      }

      if (cancelled) return;

      const migratedCart = legacyCart
        .map((id) => migrated.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      const migratedWishlist = legacyWishlist
        .map((id) => migrated.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));

      setCartProducts(storedCart.length ? storedCart : migratedCart);
      setWishlistProducts(storedWishlist.length ? storedWishlist : migratedWishlist);
      setReady(true);
    };

    hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('wag-cart-products', JSON.stringify(cartProducts));
  }, [cartProducts, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem('wag-wishlist-products', JSON.stringify(wishlistProducts));
  }, [wishlistProducts, ready]);

  const value = useMemo<Ctx>(() => {
    const cart = cartProducts.map((p) => p.id);
    const wishlist = wishlistProducts.map((p) => p.id);

    return {
      cart,
      wishlist,
      cartProducts,
      wishlistProducts,
      whatsappNumber,
      whatsappTemplate,
      toggleCart: (product) =>
        setCartProducts((items) =>
          items.some((item) => item.id === product.id)
            ? items.filter((item) => item.id !== product.id)
            : [...items, product]
        ),
      toggleWishlist: (product) =>
        setWishlistProducts((items) =>
          items.some((item) => item.id === product.id)
            ? items.filter((item) => item.id !== product.id)
            : [...items, product]
        ),
      isInCart: (id) => cart.includes(id),
      isWishlisted: (id) => wishlist.includes(id),
      clearCart: () => setCartProducts([]),
      clearWishlist: () => setWishlistProducts([]),
    };
  }, [cartProducts, wishlistProducts, whatsappNumber, whatsappTemplate]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be inside StoreProvider');
  return value;
}
