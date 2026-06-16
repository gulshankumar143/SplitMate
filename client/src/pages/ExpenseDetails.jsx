import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExpenseById } from '../api/expenseService.js';

const ExpenseDetails = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const loadExpense = async () => {
      const response = await fetchExpenseById(id);
      setExpense(response.data.data.expense);
    };
    loadExpense();
  }, [id]);

  if (!expense) {
    return <div className="min-h-screen px-6 py-8 text-slate-300">Loading expense...</div>;
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">{expense.title}</h1>
              <p className="mt-2 text-slate-400">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">₹{expense.amount}</div>
          </div>
          <div className="mt-8 space-y-4 text-slate-300">
            <p>{expense.description || 'No description provided.'}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Paid by</p>
                <p className="mt-2 text-white">{expense.paidBy?.name || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Split type</p>
                <p className="mt-2 text-white">{expense.splitType}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Shared with</p>
              <div className="mt-3 space-y-2">
                {expense.sharedWith?.map((user) => (
                  <div key={user._id} className="rounded-2xl bg-slate-900/80 p-3 text-sm text-slate-200">{user.name || user.email}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white">Payment proof</h2>
          <p className="mt-2 text-slate-400">Attached receipts and screenshots for this transaction.</p>
          <div className="mt-6 space-y-4">
            {expense.attachments?.length ? expense.attachments.map((attachment) => (
              <a key={attachment._id} href={attachment.url} target="_blank" rel="noreferrer" className="block rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-slate-200 transition hover:border-cyan-400">
                <div className="font-semibold">{attachment.filename}</div>
                <p className="text-sm text-slate-400">Type: {attachment.type}</p>
              </a>
            )) : <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-slate-500">No payment proof uploaded.</div>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ExpenseDetails;
