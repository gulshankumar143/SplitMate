import { useEffect, useMemo, useState } from 'react';
import { fetchAnalyticsSummary } from '../api/expenseService.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#06b6d4', '#22c55e', '#f59e0b', '#a855f7', '#fb7185', '#38bdf8'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState({ categories: [], monthly: [], groups: [], settlements: [], topExpenses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetchAnalyticsSummary();
        setAnalytics(response.data.data.analytics || {});
      } catch (err) {
        console.error(err);
        setError('Unable to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const categoryData = useMemo(() => analytics.categories.map((item) => ({ name: item.category, value: item.total })), [analytics.categories]);

  return (
    <main className="grid gap-8 xl:grid-cols-[0.7fr_0.6fr]">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Analytics</h1>
            <p className="mt-2 text-slate-400">Spending trends, category breakdowns, and settlement summaries.</p>
          </div>
          <div className="rounded-3xl bg-slate-950/80 px-5 py-3 text-slate-200">Total Categories: {analytics.categories.length}</div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-slate-700 bg-slate-950/70 p-6 text-slate-400">Loading analytics…</div>
        ) : error ? (
          <div className="mt-8 rounded-[2rem] border border-rose-500 bg-rose-500/10 p-6 text-rose-200">{error}</div>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="rounded-[2rem] border border-slate-700 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Monthly spending</h2>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthly} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                    <Area type="monotone" dataKey="total" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-700 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Category distribution</h2>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-3xl font-semibold text-white">Insights</h2>
        <p className="mt-2 text-slate-400">Budget health, top groups and settlement status at a glance.</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-slate-400">Top group by total spend</p>
            <p className="mt-2 text-xl font-semibold text-white">{analytics.groups[0]?.name || 'N/A'}</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-slate-400">Pending vs completed settlements</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {analytics.settlements.map((item) => (
                <div key={item.status} className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white capitalize">{item.status}</p>
                  <p>₹{item.total?.toLocaleString() || 0}</p>
                  <p className="text-slate-500">{item.count} records</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-slate-400">Highest value expenses</p>
            <div className="mt-3 space-y-3">
              {analytics.topExpenses.slice(0, 4).map((expense) => (
                <div key={expense.title + expense.amount} className="flex items-center justify-between text-sm text-slate-300">
                  <span>{expense.title}</span>
                  <span className="font-semibold text-white">₹{expense.amount}</span>
                </div>
              ))}
              {!analytics.topExpenses.length && <p className="text-slate-500">No expense data available yet.</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Analytics;
