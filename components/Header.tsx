'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/context/LanguageContext';
import { useShop } from '../lib/context/ShopContext';
import {
  Search,
  ShoppingCart,
  Heart,
  GitCompare,
  FileText,
  User,
  Settings,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenCartDrawer: () => void;
  onOpenRfqDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCartDrawer, onOpenRfqDrawer }) => {
  const { t } = useLanguage();
  const {
    setActivePage,
    filters,
    setFilters,
    cartTotalCount,
    wishlist,
    compareList,
    rfqItems,
    products,
    navigateToProduct,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
    setIsSearchFocused(true);
  };

  const executeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setActivePage('shop');
  };

  // Preview matches
  const previewMatches = filters.searchQuery.trim() === ''
    ? []
    : products.filter((p) => {
        const q = filters.searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q)
        );
      }).slice(0, 5);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-blue-600/30">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                TANIT
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                METAL
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
              INDUSTRY & AUTOMATION
            </p>
          </div>
        </div>

        {/* Live AJAX Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <form onSubmit={executeSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('header.search_placeholder')}
                className="w-full bg-slate-50 text-slate-800 pl-4 pr-12 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all shadow-inner"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-md transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Live Search AJAX Dropdown Popup */}
          {isSearchFocused && filters.searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Matching Search Results ({previewMatches.length})</span>
                <span className="text-blue-600 cursor-pointer" onClick={() => { setActivePage('shop'); setIsSearchFocused(false); }}>
                  View All in Catalog
                </span>
              </div>

              {previewMatches.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No direct matching parts or SKUs found. Try searching by brand like <strong>Festo</strong>, <strong>Siemens</strong>, or <strong>SMC</strong>.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {previewMatches.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigateToProduct(product.id);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>MPN: <strong className="text-slate-700">{product.partNumber}</strong></span>
                            <span>•</span>
                            <span className="text-blue-700 font-semibold">{product.brandName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-medium">In Stock</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-2.5 bg-slate-900 text-white text-xs text-center flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => { setActivePage('shop'); setIsSearchFocused(false); }}>
                <span>Search for "{filters.searchQuery}" across entire catalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* RFQ Drawer Action */}
          <button
            onClick={onOpenRfqDrawer}
            className="relative bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Request for Quote Drawer"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold hidden xl:inline">RFQ List</span>
            {rfqItems.length > 0 && (
              <span className="bg-cyan-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {rfqItems.length}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setActivePage('wishlist')}
            className="relative p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('header.wishlist')}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Compare */}
          <button
            onClick={() => setActivePage('compare')}
            className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('header.compare')}
          >
            <GitCompare className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Action */}
          <button
            onClick={onOpenCartDrawer}
            className="relative bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            <div className="text-left hidden sm:block leading-none">
              <span className="block text-[10px] text-blue-200 uppercase font-medium">{t('header.cart')}</span>
              <span className="text-xs font-bold">{cartTotalCount} items</span>
            </div>
            {cartTotalCount > 0 && (
              <span className="bg-cyan-400 text-slate-900 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center sm:hidden">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            onClick={() => setActivePage('account')}
            className="p-2 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
            title={t('header.account')}
          >
            <User className="w-5 h-5" />
          </button>

          {/* WordPress Admin Switcher */}
          <button
            onClick={() => setActivePage('admin')}
            className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow"
            title={t('header.admin_mode')}
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="hidden lg:inline">{t('header.admin_mode')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
