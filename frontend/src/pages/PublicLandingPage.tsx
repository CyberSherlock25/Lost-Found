import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Users, PackageSearch } from 'lucide-react';

export const PublicLandingPage: React.FC = () => (
  <div className="min-h-screen px-5 py-5 text-slate-100 md:px-10 md:py-7">
    <header className="mx-auto flex max-w-6xl items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-sky-500/25">LF</span>
        <span>
          <strong className="block text-sm tracking-[0.16em] text-white">LOST &amp; FOUND</strong>
          <small className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">University ERP</small>
        </span>
      </Link>
      <Link to="/login" className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-sky-400/60 hover:text-white">Sign in</Link>
    </header>

    <main className="mx-auto max-w-6xl space-y-10 pt-12 md:pt-20">
      <section className="relative overflow-hidden rounded-[28px] border border-sky-500/20 bg-gradient-to-br from-slate-900 via-sky-950/90 to-teal-950/70 p-8 md:p-14 shadow-[0_32px_80px_-32px_rgba(14,165,233,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_30%)]" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified campus operations
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">Lost assets. Found items. Returned with confidence.</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">A professional campus recovery workflow that connects security, faculty, and students with a reliable item verification process.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/items" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-xs font-black text-white transition hover:brightness-110"><Search className="h-4 w-4" /> Browse verified items</Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/12">Sign in to report <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <PackageSearch className="absolute -bottom-10 right-4 h-64 w-64 text-white/[0.06] md:right-16 md:h-80 md:w-80" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Search, title: 'Operational visibility', text: 'Search verified lost and found records with a clean, enterprise-ready workflow.' },
          { icon: ShieldCheck, title: 'Reviewed by campus staff', text: 'Academic and security teams validate submissions before items enter the public registry.' },
          { icon: Users, title: 'Fast resolution', text: 'Coordinated claims, secure proof uploads, and transparent status tracking for every case.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-black text-white">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
          </div>
        ))}
      </section>
    </main>
  </div>
);
