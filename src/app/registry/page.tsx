'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/ui/Section';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface RegistryItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  store: string;
  image_url?: string;
  product_url?: string;
  is_purchased: boolean;
  is_favorite: boolean;
}

export default function RegistryPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('registry_items')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching registry items:', error);
      } else if (data) {
        setItems(data as RegistryItem[]);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  // Filter items by category
  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  // Separate available and purchased items
  const availableItems = filteredItems.filter(item => !item.is_purchased);
  const purchasedItems = filteredItems.filter(item => item.is_purchased);

  return (
    <main className="min-h-screen bg-luxury-black">
      <Section className="py-20 px-4">
        {/* Back to home link */}
        <FadeIn className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-wedding-gold transition-colors font-serif text-sm"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </FadeIn>

        {/* Page heading */}
        <FadeIn delay={0.1}>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-wedding-gold text-center mb-4">
            Registry
          </h1>
          <p className="font-serif text-white/70 text-center max-w-xl mx-auto mb-12">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, here are some items we would love.
          </p>
        </FadeIn>

        {/* Category Filter */}
        {!loading && items.length > 0 && (
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 font-serif text-sm rounded-full border transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-wedding-gold text-luxury-black border-wedding-gold'
                      : 'text-white/70 border-white/20 hover:border-wedding-gold/50 hover:text-wedding-gold'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-wedding-gold/30 border-t-wedding-gold rounded-full animate-spin mb-4" />
            <p className="font-serif text-white/50">Loading registry...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <p className="font-serif text-white/70">
              Our registry is being prepared. Please check back soon!
            </p>
          </div>
        )}

        {/* Registry Items Grid */}
        {!loading && availableItems.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {availableItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] ${
                    item.is_favorite
                      ? 'border-wedding-gold/50 bg-wedding-gold/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {item.is_favorite && (
                      <div className="absolute top-3 left-3 bg-wedding-gold text-luxury-black text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                        Must Have
                      </div>
                    )}

                    {/* Hover overlay with link */}
                    {item.product_url && (
                      <a
                        href={item.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      >
                        <span className="px-6 py-2 border border-wedding-gold text-wedding-gold font-serif text-sm rounded hover:bg-wedding-gold hover:text-luxury-black transition-colors">
                          View Item
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-white mb-1 line-clamp-2">{item.name}</h3>
                    <p className="font-serif text-2xl text-wedding-gold mb-2">${Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className="bg-white/10 px-2 py-0.5 rounded">{item.category}</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded">{item.store}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Purchased Items Section */}
        {!loading && purchasedItems.length > 0 && (
          <FadeIn delay={0.3}>
            <div className="mt-16">
              <h2 className="font-serif text-2xl text-white/50 text-center mb-8">
                Already Gifted
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {purchasedItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-lg overflow-hidden border border-white/5 bg-white/5 opacity-50"
                  >
                    <div className="aspect-square bg-white/5 relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white/70 text-xs font-serif">Gifted</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="font-serif text-xs text-white/50 line-clamp-1">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Thank you note */}
        <FadeIn delay={0.4}>
          <div className="mt-16 text-center">
            <p className="font-serif text-white/40 text-sm max-w-md mx-auto">
              Thank you for celebrating this special day with us. Your love and support mean the world to us.
            </p>
          </div>
        </FadeIn>
      </Section>
    </main>
  );
}
