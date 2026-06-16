import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatCard from '../components/cards/StatCard.jsx';
import FileUploader from '../components/ui/FileUploader.jsx';
import { ChartBar, Clock3, Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { setExpenses } from '../store/slices/expenseSlice.js';
import { createExpense, fetchDashboardOverview } from '../api/expenseService.js';
import { uploadFile } from '../api/uploadService.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.expenses);
  const [stats, setStats] = useState([
    { title: 'Total Spent', value: '₹0', icon: <Wallet size={22} />, accent: 'bg-cyan-500' },
    { title: 'Owed to you', value: '₹0', icon: <Users size={22} />, accent: 'bg-emerald-500' },
    { title: 'Pending', value: '0', icon: <Clock3 size={22} />, accent: 'bg-amber-500' },
    { title: 'Groups', value: '0', icon: <ChartBar size={22} />, accent: 'bg-violet-500' }
  ]);
  const [overview, setOverview] = useState({
    totalSpent: 0,
    owedToYou: 0,
    pendingCount: 0,
    groupCount: 0,
    activeUsers: 0,
    spendChangePercent: 0,
    categories: [],
    topGroups: [],
    recentExpenses: [],
    settlementSummary: {}
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [quickExpense, setQuickExpense] = useState({
    title: '',
    category: 'Food',
    amount: '',
    date: '',
    sharedWith: '',
    paymentMethod: 'UPI',
    notes: ''
  });
  const [quickAttachments, setQuickAttachments] = useState([]);
  const [dashboardStatus, setDashboardStatus] = useState('');
  const [dashboardError, setDashboardError] = useState('');

  const loadDashboardData = async () => {
    try {
      const response = await fetchDashboardOverview();
      const overviewData = response.data.data.overview || {};
      setOverview(overviewData);
      dispatch(setExpenses(overviewData.recentExpenses || []));

      setStats([
        { title: 'Total Spent', value: `₹${(overviewData.totalSpent || 0).toLocaleString()}`, icon: <Wallet size={22} />, accent: 'bg-cyan-500' },
        { title: 'Owed to you', value: `₹${(overviewData.owedToYou || 0).toLocaleString()}`, icon: <Users size={22} />, accent: 'bg-emerald-500' },
        { title: 'Pending', value: `${overviewData.pendingCount || 0}`, icon: <Clock3 size={22} />, accent: 'bg-amber-500' },
        { title: 'Groups', value: `${overviewData.groupCount || 0}`, icon: <ChartBar size={22} />, accent: 'bg-violet-500' }
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Unable to load dashboard stats', error);
      setDashboardError('Unable to load dashboard data. Please refresh.');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  const handleQuickUpload = async (file) => {
    setDashboardError('');
    setDashboardStatus('Uploading file...');
    try {
      const attachment = await uploadFile(file);
      setQuickAttachments((prev) => [...prev, attachment]);
      setDashboardStatus('Proof uploaded');
    } catch (error) {
      setDashboardError(error.response?.data?.message || 'Unable to upload proof. Please try again.');
      setDashboardStatus('Upload failed');
    }
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setDashboardError('');
    setDashboardStatus('Saving expense...');
    try {
      const payload = {
        ...quickExpense,
        amount: parseFloat(quickExpense.amount),
        date: quickExpense.date || new Date().toISOString(),
        sharedWith: quickExpense.sharedWith.split(',').map((item) => item.trim()).filter(Boolean),
        attachments: quickAttachments.map((attachment) => attachment._id)
      };
      await createExpense(payload);
      setDashboardStatus('Expense added successfully');
      setQuickExpense({ title: '', category: 'Food', amount: '', date: '', sharedWith: '', paymentMethod: 'UPI', notes: '' });
      setQuickAttachments([]);
      await loadDashboardData();
    } catch (error) {
      setDashboardError(error.response?.data?.message || 'Unable to create expense.');
      setDashboardStatus('Could not save expense.');
    }
  };

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-14">
      <div className="flex flex-col gap-8">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
              <h1 className="text-4xl font-semibold text-white">Hello, welcome back.</h1>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-3 text-slate-300">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Updated just now'}
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
        {dashboardError && (
          <div className="rounded-[2rem] border border-rose-500 bg-rose-500/10 p-5 text-sm text-rose-200">
            {dashboardError}
          </div>
        )}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent expenses</h2>
                <p className="text-sm text-slate-400">Track your latest shared payments and who paid whom.</p>
              </div>
              <Link to="/add-expense" className="inline-flex items-center rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Full expense form
              </Link>
            </div>
            <div className="space-y-4">
              {list.length ? list.slice(0, 4).map((expense) => (
                <div key={expense._id} className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{expense.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{expense.category} • {new Date(expense.date).toLocaleDateString()} {expense.date ? new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                      <p className="mt-3 text-sm text-slate-400">
                        Paid by <span className="text-white">{expense.paidBy?.name || 'Unknown'}</span> · Status <span className="text-white">{expense.status || 'pending'}</span>
                      </p>
                      {Array.isArray(expense.splitDetails) && expense.splitDetails.length > 0 && (
                        <div className="mt-3 space-y-1 rounded-3xl border border-slate-800 bg-slate-900/90 p-3">
                          <p className="text-sm font-semibold text-white">Split details</p>
                          {expense.splitDetails.map((split) => (
                            <p key={split.user?._id || split.user} className="text-sm text-slate-400">
                              {split.user?.name || split.user?.email || split.user || 'Unknown'} owes ₹{split.amount.toFixed(2)} ({split.percent || 0}%)
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="rounded-3xl bg-slate-950/90 px-4 py-3 text-right">
                      <p className="text-sm text-slate-400">Amount</p>
                      <p className="text-lg font-semibold text-cyan-300">₹{expense.amount}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-6 text-slate-400">No expenses found yet. Add an expense to start tracking shared payments.</div>
              )}
            </div>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white">Insights</h2>
            <p className="mt-2 text-sm text-slate-400">Your spending overview is connected to live backend expense data.</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-5">
                <p className="text-slate-400">Most active group</p>
                <p className="mt-3 text-lg font-semibold text-white">{overview.topGroups?.[0]?.name || 'No groups yet'}</p>
              </div>
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-5">
                <p className="text-slate-400">Active users</p>
                <p className="mt-3 text-lg font-semibold text-white">{overview.activeUsers || 0}</p>
              </div>
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-5">
                <p className="text-slate-400">Top category</p>
                <p className="mt-3 text-lg font-semibold text-white">{overview.categories?.[0]?.category || 'No category yet'}</p>
              </div>
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-5">
                <p className="text-slate-400">Spend change</p>
                <div className="mt-3 flex items-center gap-2">
                  {overview.spendChangePercent > 0 ? (
                    <TrendingUp size={20} className="text-red-400" />
                  ) : overview.spendChangePercent < 0 ? (
                    <TrendingDown size={20} className="text-green-400" />
                  ) : null}
                  <p className={`text-lg font-semibold ${overview.spendChangePercent > 0 ? 'text-red-300' : overview.spendChangePercent < 0 ? 'text-green-300' : 'text-white'}`}>
                    {overview.spendChangePercent >= 0 ? '+' : ''}{overview.spendChangePercent || 0}%
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Expense tracker</h2>
                <p className="text-sm text-slate-400">Create a new expense record and attach proof directly from your dashboard.</p>
              </div>
              <span className="rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300">Quick add</span>
            </div>
            <form onSubmit={handleQuickSubmit} className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block text-slate-200">
                  <span>Title</span>
                  <input value={quickExpense.title} onChange={(e) => setQuickExpense({ ...quickExpense, title: e.target.value })} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label className="block text-slate-200">
                  <span>Amount</span>
                  <input type="number" value={quickExpense.amount} onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
                </label>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block text-slate-200">
                  <span>Category</span>
                  <select value={quickExpense.category} onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none">
                    {['Food','Rent','Travel','Fuel','Shopping','Groceries','Entertainment','Medical','Bills','Subscription','Others'].map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block text-slate-200">
                  <span>Date</span>
                  <input type="date" value={quickExpense.date} onChange={(e) => setQuickExpense({ ...quickExpense, date: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
                </label>
              </div>
              <label className="block text-slate-200">
                <span>Share with (comma-separated IDs)</span>
                <input value={quickExpense.sharedWith} onChange={(e) => setQuickExpense({ ...quickExpense, sharedWith: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
              </label>
              <label className="block text-slate-200">
                <span>Payment method</span>
                <select value={quickExpense.paymentMethod} onChange={(e) => setQuickExpense({ ...quickExpense, paymentMethod: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none">
                  {['UPI','Bank transfer','Cash','Credit Card'].map((method) => <option key={method}>{method}</option>)}
                </select>
              </label>
              <FileUploader label="Attach proof" onUpload={handleQuickUpload} />
              <button type="submit" className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950">Save expense</button>
              {dashboardStatus && <p className="text-sm text-slate-400">{dashboardStatus}</p>}
            </form>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white">Upload proof</h2>
            <p className="mt-2 text-sm text-slate-400">File proof is connected to your expense records so you can upload directly from the dashboard.</p>
            <div className="mt-6 space-y-4 rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
              {quickAttachments.length ? quickAttachments.map((attachment) => (
                <div key={attachment._id} className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100">
                  <p className="font-semibold">{attachment.filename || attachment.originalname || attachment.public_id || attachment._id}</p>
                  {attachment.url && <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 hover:text-cyan-200">View proof</a>}
                </div>
              )) : (
                <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5 text-slate-400">No proof attached yet. Upload a receipt image or invoice to link it to your expense.</div>
              )}
            </div>
            {dashboardError && <p className="mt-4 rounded-3xl border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-200">{dashboardError}</p>}
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
