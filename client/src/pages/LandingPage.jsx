import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  'Smart bill splitting',
  'Real-time expense updates',
  'Google + OTP authentication',
  'Group chat and activity feed',
  'Analytics dashboard'
];

const LandingPage = () => (
  <main className="min-h-screen px-6 py-10 sm:px-12 lg:px-24">
    <section className="mx-auto flex max-w-7xl flex-col gap-8 text-slate-100">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Premium finance for shared living
          </span>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Split bills, settle balances and stay connected with SplitMate.
          </h1>
          <p className="max-w-2xl text-slate-300">
            Built for roommates, travel groups, and teams who want fast bill splitting, smart settlement, and beautiful analytics.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400">
              Sign up
            </Link>
            <Link to="/login" className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-200 transition hover:border-cyan-400">
              Login
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 shadow-2xl shadow-slate-950/50">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-950/80 p-6">
              <h2 className="text-slate-100 text-xl font-semibold">Overview</h2>
              <p className="text-slate-400 mt-3">Shared expenses, settlements and instant group updates in one dashboard.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-5 text-slate-300">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </main>
);

export default LandingPage;
