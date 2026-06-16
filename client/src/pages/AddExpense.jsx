import { useState } from 'react';
import { createExpense } from '../api/expenseService.js';
import { uploadFile } from '../api/uploadService.js';
import FileUploader from '../components/ui/FileUploader.jsx';

const AddExpense = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'Food', amount: '', date: '', paidBy: '', sharedWith: '', splitType: 'equal', paymentMethod: 'UPI', notes: '' });
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async (file) => {
    setStatus('Uploading file...');
    setUploadError('');
    try {
      const attachment = await uploadFile(file);
      setAttachments((prev) => [...prev, attachment]);
      setStatus('File uploaded');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to upload file. Please try again.';
      setUploadError(message);
      setStatus('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      date: form.date || new Date().toISOString(),
      sharedWith: form.sharedWith.split(',').map((item) => item.trim()).filter(Boolean),
      attachments: attachments.map((attachment) => attachment._id)
    };
    await createExpense(payload);
    setStatus('Expense created successfully');
    setUploadError('');
    setForm({ title: '', description: '', category: 'Food', amount: '', date: '', paidBy: '', sharedWith: '', splitType: 'equal', paymentMethod: 'UPI', notes: '' });
    setAttachments([]);
  };

  return (
    <main className="grid gap-8 lg:grid-cols-[0.95fr_0.45fr]">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Add Expense</h1>
        <p className="mt-2 text-slate-400">Create an expense with attached proof or screenshots.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block text-slate-200">
              <span>Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
            </label>
            <label className="block text-slate-200">
              <span>Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none">
                {['Food','Rent','Travel','Fuel','Shopping','Groceries','Entertainment','Medical','Bills','Subscription','Others'].map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <label className="block text-slate-200">
              <span>Amount</span>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
            </label>
            <label className="block text-slate-200">
              <span>Date</span>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
            </label>
            <label className="block text-slate-200">
              <span>Payment Method</span>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none">
                {['UPI','Bank transfer','Cash','Credit Card'].map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-slate-200">
            <span>Shared With (comma-separated user IDs)</span>
            <input value={form.sharedWith} onChange={(e) => setForm({ ...form, sharedWith: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
          </label>
          <label className="block text-slate-200">
            <span>Split type</span>
            <select value={form.splitType} onChange={(e) => setForm({ ...form, splitType: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none">
              {['equal','exact','percentage','shares'].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block text-slate-200">
            <span>Notes</span>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="4" className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
          </label>
          <FileUploader label="Attach payment proof (optional)" onUpload={handleUpload} />
          <button type="submit" className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950">Submit expense</button>
          {status && <p className="text-sm text-slate-400">{status}</p>}
        </form>
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white">Payment proof</h2>
        <p className="mt-2 text-slate-400">Screenshot or invoice proof will be attached to the expense record.</p>
        <div className="mt-6 grid gap-4">
          {attachments.length ? attachments.map((attachment) => (
            <div key={attachment._id} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 text-slate-200">
              <p className="font-semibold">{attachment.filename || attachment.originalname || attachment.public_id || attachment._id}</p>
              {attachment.url ? (
                <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 hover:text-cyan-200">View uploaded proof</a>
              ) : (
                <p className="text-sm text-slate-400">Proof uploaded successfully.</p>
              )}
            </div>
          )) : <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5 text-slate-500">No receipts uploaded yet.</div>}
        </div>
        {uploadError && (
          <div className="mt-6 rounded-3xl border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-200">
            {uploadError}
          </div>
        )}
      </section>
    </main>
  );
};

export default AddExpense;
