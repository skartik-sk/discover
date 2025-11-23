'use client';

import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="sticky top-px z-50 flex w-full items-center justify-between whitespace-nowrap px-6 py-4 md:px-8 bg-main-bg/80 backdrop-blur-sm rounded-t-soft">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-header-text">
          <div className="size-6 text-primary-green">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L1 8v8l11 6 11-6V8l-11-6zm0 2.311L19.531 8 12 11.689 4.469 8 12 4.311zM3 9.611L12 14.311l9-4.7V16L12 20.689 3 16V9.611z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Discover</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-body-text hover:text-header-text transition-colors" href="/projects">
            Projects
          </Link>
          <Link className="text-sm font-medium text-body-text hover:text-header-text transition-colors" href="/leaderboard">
            Leaderboard
          </Link>
          <Link className="text-sm font-medium text-body-text hover:text-header-text transition-colors" href="/governance">
            Governance
          </Link>
          <Link className="text-sm font-medium text-body-text hover:text-header-text transition-colors" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium text-body-text hover:text-header-text transition-colors" href="/submit">
            Submit
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button 
          onClick={() => alert('Web3 wallet integration coming in Phase 2!\n\nWill support: MetaMask, WalletConnect, Coinbase Wallet, and more.')}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-btn h-10 px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105"
          title="Coming in Phase 2"
        >
          <span className="truncate">Connect Wallet</span>
        </button>
      </div>
    </header>
  );
};
