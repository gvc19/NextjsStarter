"use client";

import React from "react";
import { Input } from "@/components/ui/input";

// Custom icons as SVG components
const LogoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#4ECDC4" />
        <stop offset="100%" stopColor="#45B7D1" />
      </linearGradient>
    </defs>
    <path
      d="M8 2L4 8L8 14L12 8L8 2Z"
      fill="url(#logoGradient)"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="m13 13-3-3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function MainHeader() {
  return (
    <header className="w-full h-8 bg-[#2C2460] border-b border-white/10">
      <div className="flex items-center justify-between h-full px-3">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <LogoIcon />
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center bg-[#4A408C] rounded px-2 py-0.5 space-x-1.5 h-5">
            <SearchIcon />
            <Input
              placeholder="Search"
              className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-4"
            />
          </div>
        </div>

        {/* Right Section - New Button and Profile */}
        <div className="flex items-center space-x-2">
          {/* New Button */}
          <button className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors">
            <PlusIcon />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">S</span>
            </div>
            <button className="text-gray-300 hover:text-white transition-colors">
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}