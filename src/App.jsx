import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  BrainCircuit, Zap, Users, X, ArrowRight, TrendingUp,
  LogOut, ShieldAlert, FileUp, RefreshCw, Briefcase,
  Plus, Link, Lock, Globe, Shield, BarChart3, CheckCircle,
  Clock, AlertTriangle
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : { apiKey: "YOUR_API_KEY", authDomain: "YOUR_PROJECT.firebaseapp.com", projectId: "YOUR_PROJECT_ID" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hireai-v1';

// --- Static Data ---
const FEATURE_TABLE = [
  { name: 'Job Posting Tool',            subs: 'Form + DB · Public Apply Page · URL + Job Board · Auto-trigger AI', tier: 'Free',  phase: 1, days: '3.5d', deferred: false },
  { name: 'AI Resume Screening',         subs: 'Batch CV analysis · Claude API scoring · Drive import · OneDrive',  tier: 'Pro',   phase: 1, days: '4d',   deferred: false },
  { name: 'Talent Matrix',               subs: 'Ranked view · Score breakdown · Filter/sort · CSV export',          tier: 'Pro',   phase: 2, days: '2d',   deferred: false },
  { name: 'Anonymous Quota Enforcement', subs: 'Per-job limits · IP fingerprint · Soft + hard cap · Real-time',    tier: 'Pro',   phase: 3, days: '2d',   deferred: false },
  { name: 'ATS Integrations',            subs: 'Greenhouse · Lever · Workday',                                     tier: 'Pro',   phase: 4, days: '5d',   deferred: true  },
  { name: 'Email-in Apply',              subs: 'Inbound parsing · Auto-attach to job',                             tier: 'Pro',   phase: 4, days: '3d',   deferred: true  },
  { name: 'Embed Widget',                subs: 'iFrame job board · Custom domain',                                 tier: 'Pro',   phase: 4, days: '2d',   deferred: true  },
  { name: 'Multi-seat',                  subs: 'Team invites · Role management',                                   tier: 'Pro',   phase: 4, days: '3d',   deferred: true  },
];

const PRO_FEATURES = [
  'AI resume screening (unlimited)',
  'Google Drive & OneDrive import',
  'Claude API-powered scoring',
  'Batch processing up to 200 CVs',
  'Talent Matrix with ranked views',
  'Anonymous quota enforcement',
  'Custom scoring criteria',
  'Export ranked list to CSV',
  'Job post analytics dashboard',
  'Priority support',
  'API access',
  'White-label apply page',
];

// ─────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────
const LandingPage = ({ onAuthTrigger }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const MODULES = [
    { label: 'Job Posting',  color: 'text-emerald-400',  dot: 'bg-emerald-400' },
    { label: 'AI Screening', color: 'text-violet-400',   dot: 'bg-violet-400'  },
    { label: 'Quota Guard',  color: 'text-amber-400',    dot: 'bg-amber-400'   },
    { label: 'Talent Matrix',color: 'text-pink-400',     dot: 'bg-pink-400'    },
    { label: 'Analytics',    color: 'text-sky-400',      dot: 'bg-sky-400'     },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><BrainCircuit size={24} /></div>
            <span className="text-xl font-bold tracking-tight">HireAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => onAuthTrigger('login')} className="text-sm font-bold text-slate-700">Sign In</button>
            <button onClick={() => onAuthTrigger('register')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">Get Started Free</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-44 pb-20 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full">
            <Zap size={13} className="text-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Build HireAI in 17 Days</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 leading-tight max-w-4xl mx-auto">
            Post jobs free.<br /><span className="text-indigo-600">Screen smarter</span> with AI.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            The agentic hiring platform that turns volume applications into ranked, decision-ready talent — in minutes.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={() => onAuthTrigger('register')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 flex items-center space-x-2">
              <span>Post Your First Job</span><ArrowRight size={20} />
            </button>
            <button onClick={() => onAuthTrigger('login')} className="border border-slate-200 px-8 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50">
              Sign In
            </button>
          </div>

          {/* 5-Module Stat Bar */}
          <div className="bg-slate-900 rounded-[2rem] p-8 grid grid-cols-5 gap-4 mt-8">
            {MODULES.map((m, i) => (
              <div key={i} className="text-center space-y-2">
                <div className={`w-2 h-2 rounded-full ${m.dot} mx-auto`} />
                <p className={`text-sm font-black ${m.color}`}>{m.label}</p>
                <p className="text-xs text-slate-500">Module {i + 1}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Overview Table */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Feature Scope</h2>
          <p className="text-slate-500 mb-8 text-sm">Every feature, its tier, build phase, and day estimate. Month 2 rows are out of MVP scope.</p>
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Feature</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Sub-features</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Tier</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Phase</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Days</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.map((f, i) => (
                  <tr key={i} className={`border-b border-slate-100 transition-opacity ${f.deferred ? 'opacity-30' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{f.name}</span>
                      {f.deferred && <span className="ml-2 text-xs text-slate-400 font-normal italic">Month 2</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{f.subs}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${f.tier === 'Free' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                        {f.tier}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500 font-bold">{f.phase}</td>
                    <td className="px-4 py-4 text-center text-slate-400 font-mono text-xs">{f.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Phase 1 — Foundation */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            Phase 1 — Foundation <span className="text-slate-400 font-normal text-lg">(Days 1–9)</span>
          </h2>
          <p className="text-slate-500 text-sm mb-8">Core infrastructure: job posting, AI screening, and the public apply flow.</p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Job Posting Tool — Full Width */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-emerald-100 p-2.5 rounded-xl"><Briefcase className="text-emerald-600" size={22} /></div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Job Posting Tool</h3>
                  <p className="text-xs text-emerald-600 font-bold">Free forever · Phase 1 · 3.5 days total</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'Form + DB',         days: '0.5d', note: 'Firestore jobs collection with per-user RLS', done: false },
                  { label: 'Public Apply Page',  days: '1.5d', note: 'No-auth file upload, quota check on submit',  done: false },
                  { label: 'URL + Job Board',    days: '0.5d', note: 'hireai.app/jobs/[slug] shareable link',       done: false },
                  { label: 'Standalone Mode',    days: '0d',   note: 'Already done ✓',                              done: true  },
                  { label: 'Auto-trigger AI',    days: '1d',   note: 'On new apply → queue screening batch',        done: false },
                ].map((sub, i) => (
                  <div key={i} className={`rounded-2xl p-4 border ${sub.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{sub.label}</p>
                    <p className={`font-black text-xl mt-1 ${sub.done ? 'text-emerald-500' : 'text-indigo-600'}`}>{sub.days}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-snug">{sub.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Screening */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-violet-100 p-2.5 rounded-xl"><BrainCircuit className="text-violet-600" size={22} /></div>
                <div>
                  <h3 className="font-black text-slate-900">AI Screening</h3>
                  <p className="text-xs text-violet-600 font-bold">Pro · Phase 1 · 4 days</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start space-x-2"><span className="text-violet-400 font-black mt-0.5">·</span><span>Claude API — ~$0.003 / CV at 50-CV batches</span></li>
                <li className="flex items-start space-x-2"><span className="text-violet-400 font-black mt-0.5">·</span><span>Google Drive picker (OAuth read-only scope)</span></li>
                <li className="flex items-start space-x-2"><span className="text-violet-400 font-black mt-0.5">·</span><span>OneDrive via MS Graph — 25 MB file limit</span></li>
                <li className="flex items-start space-x-2"><span className="text-violet-400 font-black mt-0.5">·</span><span>Hard batch cap: 200 CVs per run</span></li>
                <li className="flex items-start space-x-2"><span className="text-violet-400 font-black mt-0.5">·</span><span>Returns ranked JSON → stored in Firestore</span></li>
              </ul>
            </div>

            {/* Talent Matrix */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-pink-100 p-2.5 rounded-xl"><BarChart3 className="text-pink-600" size={22} /></div>
                <div>
                  <h3 className="font-black text-slate-900">Talent Matrix</h3>
                  <p className="text-xs text-pink-600 font-bold">Pro · Phase 2 · 2 days</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start space-x-2"><span className="text-pink-400 font-black mt-0.5">·</span><span>Ranked candidates with AI score breakdown</span></li>
                <li className="flex items-start space-x-2"><span className="text-pink-400 font-black mt-0.5">·</span><span>Filter by score threshold, skills, location</span></li>
                <li className="flex items-start space-x-2"><span className="text-pink-400 font-black mt-0.5">·</span><span>One-click shortlist → email trigger</span></li>
                <li className="flex items-start space-x-2"><span className="text-pink-400 font-black mt-0.5">·</span><span>Export ranked list to CSV</span></li>
              </ul>
            </div>

          </div>
        </section>

        {/* Phase 3 — Anonymous Quota */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            Phase 3 — Quota Guard <span className="text-slate-400 font-normal text-lg">(Days 14–15)</span>
          </h2>
          <p className="text-slate-500 text-sm mb-8">The trickiest engineering problem: enforcing apply limits on candidates who have no account.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8">
            <div className="flex items-center space-x-3 mb-5">
              <div className="bg-amber-100 p-2.5 rounded-xl"><Shield className="text-amber-600" size={22} /></div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Anonymous Quota Enforcement</h3>
                <p className="text-xs text-amber-700 font-bold">Pro · Phase 3 · 2 days — Hardest engineering problem in the product</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                'Count applies per job without requiring candidate accounts',
                'Firestore counter keyed on IP + device fingerprint composite',
                'Soft quota warning at 80% · hard cap at 100%',
                'Company sets per-job limit (default: 200 applies)',
                'Quota shown in real-time on recruiter dashboard',
                'Quota reset → auto-triggers new AI screening batch',
              ].map((point, i) => (
                <div key={i} className="bg-white border border-amber-100 rounded-2xl p-4 text-sm text-slate-700">
                  <AlertTriangle size={14} className="text-amber-500 mb-2" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase 4 — Month 2 Deferrals */}
        <section className="pb-20 opacity-35">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Phase 4 — Month 2 Deferrals</h2>
          <p className="text-slate-500 text-sm mb-8">Out of MVP scope. Not in the 17-day build.</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'ATS Integrations', note: 'Greenhouse · Lever · Workday' },
              { label: 'Email-in Apply',   note: 'Inbound parsing · Auto-attach' },
              { label: 'Embed Widget',     note: 'iFrame board · Custom domain' },
              { label: 'Multi-seat',       note: 'Team invites · Role management' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
                <Lock className="mx-auto text-slate-400 mb-3" size={20} />
                <p className="font-bold text-slate-600 text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="pb-24">
          <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Simple Pricing</h2>
          <p className="text-slate-500 text-center text-sm mb-12">Job posting is free forever — your acquisition hook. AI is where the magic is.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Free */}
            <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-8 flex flex-col">
              <p className="font-black text-slate-400 text-sm uppercase tracking-wide mb-2">Free</p>
              <p className="text-5xl font-black text-slate-900 mb-6">$0 <span className="text-slate-400 font-normal text-xl">/ forever</span></p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
                <p className="font-black text-emerald-700 text-sm">Unlimited job posts — always free</p>
                <p className="text-xs text-emerald-600 mt-1">Your acquisition hook. No cap, no expiry, no credit card.</p>
              </div>
              <ul className="space-y-2.5 text-sm flex-1">
                {[
                  { label: 'Unlimited job posts',    free: true  },
                  { label: 'Public apply pages',     free: true  },
                  { label: 'Shareable job URLs',     free: true  },
                  { label: 'Job board listing',      free: true  },
                  { label: 'AI resume screening',    free: false },
                  { label: 'Talent Matrix',          free: false },
                  { label: 'Quota enforcement',      free: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    {item.free
                      ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      : <Lock size={14} className="text-slate-200 flex-shrink-0" />}
                    <span className={item.free ? 'text-slate-700' : 'text-slate-300'}>{item.label}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onAuthTrigger('register')} className="w-full mt-8 border-2 border-slate-900 text-slate-900 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 rounded-[2rem] p-8 flex flex-col">
              <p className="font-black text-indigo-400 text-sm uppercase tracking-wide mb-2">Pro</p>
              <p className="text-5xl font-black text-white mb-6">$99 <span className="text-slate-500 font-normal text-xl">/ month</span></p>
              <ul className="space-y-2.5 text-sm flex-1 mb-8">
                {PRO_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-300">
                    <CheckCircle size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onAuthTrigger('register')} className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-2xl shadow-indigo-900/50 hover:bg-indigo-500 transition-colors">
                Start Pro Trial
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// JOB POSTS VIEW
// ─────────────────────────────────────────
const JobPostsView = ({ user, appId, db }) => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ title: '', department: '', location: '', type: 'Full-time', description: '', quota: 200 });

  useEffect(() => {
    const ref = collection(db, 'artifacts', appId, 'users', user.uid, 'jobs');
    return onSnapshot(query(ref), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });
  }, [user]);

  const createJob = async (e) => {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'jobs'), {
      ...form,
      slug,
      quota: Number(form.quota),
      applications: 0,
      status: 'active',
      createdAt: serverTimestamp(),
    });
    setForm({ title: '', department: '', location: '', type: 'Full-time', description: '', quota: 200 });
    setShowForm(false);
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`https://hireai.app/jobs/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Job Posts</h1>
          <p className="text-slate-500 text-sm mt-1">Free forever · Unlimited posts · Shareable apply links</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-200">
          <Plus size={16} /><span>New Job</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={createJob} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-4">
          <h2 className="font-black text-xl">Create Job Post</h2>
          <div className="grid grid-cols-2 gap-4">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Job title *" className="col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" />
            <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" />
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300">
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
            </select>
            <input type="number" min="1" value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })} placeholder="Application quota" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" />
          </div>
          <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Job description and requirements... *" className="w-full h-36 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300 resize-none" />
          <div className="flex space-x-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold">Publish Job</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {jobs.length === 0 && !showForm ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
          <Briefcase className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="font-bold text-slate-400 mb-1">No jobs posted yet</p>
          <p className="text-sm text-slate-300">Create your first posting — free, always.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const pct = Math.min(100, Math.round(((job.applications || 0) / job.quota) * 100));
            const overHalf = pct >= 80;
            return (
              <div key={job.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{[job.department, job.location, job.type].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => copyLink(job.slug)} className={`flex items-center space-x-1.5 text-xs font-bold border px-3 py-2 rounded-xl transition-colors ${copied === job.slug ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      <Link size={13} /><span>{copied === job.slug ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-xs font-bold border border-indigo-200 text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                      <Zap size={13} /><span>Screen CVs</span>
                    </button>
                  </div>
                </div>
                {/* Quota bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className={overHalf ? 'text-amber-600' : 'text-slate-400'}>
                      {job.applications || 0} / {job.quota} applications
                    </span>
                    <span className={overHalf ? 'text-amber-600' : 'text-slate-400'}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// AI SCREENING VIEW
// ─────────────────────────────────────────
const ScreeningView = ({ user, appId, db, pricing, jobs }) => {
  const [jd, setJd] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleJobSelect = (jobId) => {
    setSelectedJob(jobId);
    const job = jobs.find(j => j.id === jobId);
    if (job) setJd(job.description);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black">AI Screening</h1>
        <p className="text-slate-500 text-sm mt-1">Claude API · ~$0.003 / CV · max 200 CVs per batch</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        {jobs.length > 0 && (
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Load from Job Post</label>
            <select value={selectedJob} onChange={e => handleJobSelect(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-700">
              <option value="">— or paste a custom JD below —</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}{j.location ? ` · ${j.location}` : ''}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Job Description & Scoring Criteria</label>
          <textarea
            className="w-full h-36 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-300 resize-none"
            placeholder="Describe the role, must-haves, nice-to-haves..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors"
        >
          <input type="file" multiple ref={fileInputRef} onChange={(e) => setUploadedFiles(Array.from(e.target.files))} className="hidden" />
          <FileUp className="mx-auto text-indigo-400 mb-4" size={40} />
          <p className="font-bold text-slate-600">Drop resumes here or click to browse</p>
          <p className="text-xs text-slate-400 mt-1">
            {uploadedFiles.length > 0 ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} selected` : 'PDF, DOCX, images · max 200 CVs per batch'}
          </p>
        </div>

        {/* Stack note */}
        <div className="flex items-center space-x-6 text-xs text-slate-400 font-bold border-t border-slate-100 pt-4">
          <span>Claude API</span>
          <span className="text-slate-200">·</span>
          <span>Google Drive</span>
          <span className="text-slate-200">·</span>
          <span>OneDrive</span>
          <span className="text-slate-200">·</span>
          <span>Firebase Functions</span>
        </div>

        <button
          disabled={isProcessing || !jd.trim()}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          {isProcessing
            ? <><RefreshCw className="animate-spin" size={20} /><span>Processing...</span></>
            : <><Zap size={20} /><span>Run AI Screening (${pricing.perTransaction} / batch)</span></>
          }
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// TALENT MATRIX VIEW
// ─────────────────────────────────────────
const TalentMatrixView = ({ rankings }) => (
  <div className="max-w-5xl mx-auto space-y-8">
    <div>
      <h1 className="text-3xl font-black">Talent Matrix</h1>
      <p className="text-slate-500 text-sm mt-1">AI-ranked candidates · Sorted by score</p>
    </div>

    {rankings.length === 0 ? (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
        <Users className="mx-auto text-slate-200 mb-4" size={48} />
        <p className="font-bold text-slate-400 mb-1">No results yet</p>
        <p className="text-sm text-slate-300">Run AI Screening to populate the matrix.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {rankings.map((r, i) => {
          const medalColor = i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-200';
          const scoreColor = r.score >= 80 ? 'text-emerald-600' : r.score >= 60 ? 'text-amber-600' : 'text-slate-400';
          return (
            <div key={r.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0 ${medalColor}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-black text-slate-900">{r.name || `Candidate ${i + 1}`}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{r.reasoning || 'AI analysis complete'}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-4xl font-black ${scoreColor}`}>{r.score}</p>
                <p className="text-xs text-slate-400 font-bold">/ 100</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────
// ADMIN VIEW
// ─────────────────────────────────────────
const AdminView = () => (
  <div className="max-w-2xl mx-auto space-y-8">
    <h1 className="text-3xl font-black">Admin</h1>
    <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6">
      <p className="font-bold text-amber-700 text-sm">Pricing config, quota overrides, and usage analytics coming in Phase 3.</p>
    </div>
  </div>
);

// ─────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────
const App = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ role: 'user' });
  const [view, setView] = useState('landing');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [pricing, setPricing] = useState({ perTransaction: 5.0 });
  const [rankings, setRankings] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { console.error(e); }
    };
    initAuth();

    return onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        setShowAuth(false);
        if (view === 'landing') setView('jobs');
        const profileRef = doc(db, 'artifacts', appId, 'users', currUser.uid, 'profile', 'user-data');
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          const newProfile = { role: 'user', email: currUser.email || 'Anon', uid: currUser.uid };
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'config');
    const unsubConfig = onSnapshot(configRef, (d) => {
      if (d.exists() && d.data().pricing) setPricing(d.data().pricing);
    });

    const rankingsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'rankings');
    const unsubRankings = onSnapshot(query(rankingsRef), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRankings(data.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)));
    });

    const jobsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'jobs');
    const unsubJobs = onSnapshot(query(jobsRef), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });

    return () => { unsubConfig(); unsubRankings(); unsubJobs(); };
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (authMode === 'register') await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { setError(err.message); }
  };

  const SidebarButton = ({ icon: Icon, label, id, activeColor = 'bg-indigo-600' }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === id ? `${activeColor} text-white shadow-lg` : 'text-slate-500 hover:bg-slate-50'}`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  // Auth modal (shared across landing triggers)
  const AuthModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
        <button onClick={() => setShowAuth(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X /></button>
        <h2 className="text-2xl font-black mb-1 text-center">{authMode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="text-center text-slate-400 text-sm mb-8">{authMode === 'login' ? 'Sign in to HireAI' : 'Start posting jobs for free'}</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-300" placeholder="Password" required />
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl">Continue</button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); }} className="font-bold text-indigo-600">
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );

  if (view === 'landing') return (
    <>
      <LandingPage onAuthTrigger={(mode) => { setAuthMode(mode); setShowAuth(true); }} />
      {showAuth && <AuthModal />}
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col flex-shrink-0">
        <div className="flex items-center space-x-2 px-2 mb-10">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><BrainCircuit size={20} /></div>
          <span className="text-xl font-bold tracking-tight">HireAI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarButton icon={Briefcase}      label="Job Posts"      id="jobs" />
          <SidebarButton icon={Zap}            label="AI Screening"   id="screening" />
          <SidebarButton icon={Users}          label="Talent Matrix"  id="matrix" />
          {profile.role === 'admin' && <SidebarButton icon={ShieldAlert} label="Admin" id="admin" activeColor="bg-red-600" />}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={20} /><span className="font-bold text-sm">Sign Out</span>
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {view === 'jobs'      && <JobPostsView   user={user} appId={appId} db={db} />}
        {view === 'screening' && <ScreeningView  user={user} appId={appId} db={db} pricing={pricing} jobs={jobs} />}
        {view === 'matrix'    && <TalentMatrixView rankings={rankings} />}
        {view === 'admin'     && <AdminView />}
      </main>
    </div>
  );
};

export default App;
