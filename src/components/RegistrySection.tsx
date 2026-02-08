'use client';

import { useEffect, useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
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
  purchaser_name?: string;
}

interface ShippingAddress {
  line1: string;
  city: string;
  state: string;
  zip: string;
}

type ModalStep = 'shipping' | 'details' | 'success';

export default function RegistrySection() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  // Multi-step modal state
  const [modalStep, setModalStep] = useState<ModalStep>('shipping');
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserMessage, setPurchaserMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const fetchShippingAddress = async () => {
    try {
      const res = await fetch('/api/settings/shipping-address');
      if (res.ok) {
        const data = await res.json();
        setShippingAddress(data);
      }
    } catch (err) {
      console.error('Error fetching shipping address:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchShippingAddress();
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

  const handleItemClick = (item: RegistryItem) => {
    if (item.product_url) {
      setSelectedItem(item);
      setModalStep('shipping');
      setPurchaserName('');
      setPurchaserEmail('');
      setPurchaserMessage('');
      setCopied(false);
    }
  };

  const handleCopyAddress = () => {
    if (!shippingAddress) return;
    const address = `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToStore = () => {
    if (selectedItem?.product_url) {
      window.open(selectedItem.product_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePurchased = () => {
    setModalStep('details');
  };

  const handleConfirmPurchase = async () => {
    if (!purchaserName.trim()) {
      alert('Please enter your name');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/registry/mark-purchased', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem?.id,
          name: purchaserName,
          email: purchaserEmail,
          message: purchaserMessage,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setModalStep('success');
        await fetchItems(); // Refresh the list
      } else {
        alert(result.error || 'Failed to mark as purchased');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setModalStep('shipping');
    setPurchaserName('');
    setPurchaserEmail('');
    setPurchaserMessage('');
  };

  return (
    <>
      <div className="py-20 px-4">
        {/* Page heading */}
        <FadeIn delay={0.1}>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-wedding-gold text-center mb-4">
            Registry
          </h2>
          <p className="font-serif text-white/70 text-center max-w-xl mx-auto mb-12">
            Sharing this day with you is the only gift we require. For those who have expressed an interest in offering a token of love, we have curated a collection of items for our future home.
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
            <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-7xl mx-auto">
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
                      <div className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-wedding-gold text-luxury-black text-[6px] sm:text-[10px] uppercase tracking-wider font-bold px-1 py-0.5 sm:px-2 sm:py-1 rounded">
                        Must Have
                      </div>
                    )}

                    {/* Hover overlay with button */}
                    {item.product_url && (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                      >
                        <span className="px-6 py-2 border border-wedding-gold text-wedding-gold font-serif text-sm rounded hover:bg-wedding-gold hover:text-luxury-black transition-colors">
                          Gift This
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-1.5 sm:p-4">
                    <h3 className="font-serif text-[10px] sm:text-lg text-white mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2">{item.name}</h3>
                    <p className="font-serif text-xs sm:text-2xl text-wedding-gold">${Number(item.price).toFixed(2)}</p>
                    <div className="hidden sm:flex flex-wrap items-center gap-2 text-xs text-white/50 mt-2">
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
              <h3 className="font-serif text-2xl text-white/50 text-center mb-8">
                Already Gifted
              </h3>
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
      </div>

      {/* Multi-Step Gift Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-luxury-black border border-wedding-gold/30 rounded-2xl max-w-md w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STEP A: Shipping Info */}
            {modalStep === 'shipping' && (
              <>
                {/* Home icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-wedding-gold text-center mb-2">
                  You&apos;re Helping Us Build Our Home
                </h3>

                {/* Personal note */}
                <p className="font-serif text-white/60 text-center text-sm mb-6 italic">
                  &ldquo;{selectedItem.name}&rdquo;
                </p>

                {/* Address card with copy */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-white/50 text-sm mb-2">
                        Please send it to our doorstep:
                      </p>
                      {shippingAddress ? (
                        <p className="font-serif text-white text-lg leading-relaxed">
                          {shippingAddress.line1}<br />
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </p>
                      ) : (
                        <p className="font-serif text-white/50 text-sm">Loading address...</p>
                      )}
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      disabled={!shippingAddress}
                      className="p-2 text-wedding-gold/70 hover:text-wedding-gold transition-colors disabled:opacity-50"
                      title="Copy address"
                    >
                      {copied ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-wedding-gold text-xs mt-2">Address copied!</p>
                  )}
                </div>

                {/* Signature */}
                <p className="font-script text-wedding-gold/60 text-right text-lg mb-6 pr-4">
                  — Yonatan & Saron
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleGoToStore}
                    className="w-full py-3 bg-wedding-gold text-luxury-black font-serif font-medium rounded-lg hover:bg-wedding-gold/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to {selectedItem.store}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePurchased}
                    className="w-full py-3 border border-wedding-gold/50 text-wedding-gold font-serif rounded-lg hover:bg-wedding-gold/10 transition-colors"
                  >
                    I&apos;ve Already Purchased This
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2 text-white/50 font-serif text-sm hover:text-white/70 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </>
            )}

            {/* STEP B: Guest Details */}
            {modalStep === 'details' && (
              <>
                {/* Heart icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-wedding-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-wedding-gold text-center mb-2">
                  May We Thank You?
                </h3>
                <p className="font-serif text-white/60 text-center text-sm mb-6">
                  Kindly leave your details so we may express our gratitude properly.
                </p>

                {/* Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      placeholder="Who should we thank?"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-wedding-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Your Email <span className="text-white/30">(for our thank you note)</span>
                    </label>
                    <input
                      type="email"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-wedding-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Leave us a note <span className="text-white/30">(optional)</span>
                    </label>
                    <textarea
                      value={purchaserMessage}
                      onChange={(e) => setPurchaserMessage(e.target.value)}
                      placeholder="We'd love to hear from you..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-wedding-gold transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmPurchase}
                    disabled={submitting || !purchaserName.trim()}
                    className="w-full py-3 bg-wedding-gold text-luxury-black font-serif font-medium rounded-lg hover:bg-wedding-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Confirm Gift'}
                  </button>
                  <button
                    onClick={() => setModalStep('shipping')}
                    className="w-full py-2 text-white/50 font-serif text-sm hover:text-white/70 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </>
            )}

            {/* STEP C: Success */}
            {modalStep === 'success' && (
              <>
                {/* Celebration icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-wedding-gold/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-3xl text-wedding-gold text-center mb-3">
                  {purchaserName}, You&apos;re the Best!
                </h3>

                {/* Message */}
                <p className="font-serif text-white/70 text-center mb-8 leading-relaxed">
                  Thank you. We are honored by your generosity.<br />
                  <span className="text-white/50 text-sm">Can&apos;t wait to celebrate with you!</span>
                </p>

                {/* Item confirmation */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-4">
                  {selectedItem.image_url && (
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-white text-sm line-clamp-2">{selectedItem.name}</p>
                    <p className="text-white/40 text-xs mt-1">On its way to our home</p>
                  </div>
                  <div className="text-wedding-gold">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>

                {/* Signature */}
                <p className="font-script text-wedding-gold/60 text-center text-xl mb-6">
                  With love, Yonatan & Saron
                </p>

                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 border border-wedding-gold/50 text-wedding-gold font-serif rounded-lg hover:bg-wedding-gold/10 transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
