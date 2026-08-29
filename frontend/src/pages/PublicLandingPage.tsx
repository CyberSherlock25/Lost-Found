import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Users, PackageSearch } from 'lucide-react';

export const PublicLandingPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 px-5 py-5 text-slate-100 md:px-10 md:py-7">
    <header className="mx-auto flex max-w-6xl items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-500/20">LF</span>
        <span><strong className="block text-sm tracking-wide text-white">LOST &amp; FOUND</strong><small className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">Smart University</small></span>
      </Link>
      <Link to="/login" className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-400/50 hover:text-white">Sign in</Link>
    </header>
    <main className="mx-auto max-w-6xl space-y-10 pt-12 md:pt-20">
    <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-emerald-950/60 p-8 md:p-14 shadow-2xl">
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> University verified
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">Lost something? Found something?</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">A trusted campus space to reconnect belongings with the people they belong to. Browse verified reports or sign in to submit one.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/items" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300"><Search className="h-4 w-4" /> Browse verified items</Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/15">Sign in to report <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <PackageSearch className="absolute -bottom-10 right-4 h-64 w-64 text-white/[0.06] md:right-16 md:h-80 md:w-80" />
    </section>
    <section className="grid gap-4 md:grid-cols-3">
      {[
        { icon: Search, title: 'Browse openly', text: 'Search verified lost and found reports without creating an account.' },
        { icon: ShieldCheck, title: 'Reviewed on campus', text: 'Teacher and Admin teams check every student submission before publishing.' },
        { icon: Users, title: 'Return with confidence', text: 'Submit ownership proof privately and coordinate a confirmed handover.' },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className="glass-card rounded-2xl border border-slate-800 p-6">
          <Icon className="h-6 w-6 text-emerald-400" />
          <h2 className="mt-4 text-sm font-black text-white">{title}</h2>
          <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
        </div>
      ))}
    </section>
    </main>
  </div>
);
