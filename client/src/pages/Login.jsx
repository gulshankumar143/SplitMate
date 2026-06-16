import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials, setError, setLoading } from '../store/slices/authSlice.js';
import { loginUser } from '../api/authService.js';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleChange = (e) => {
    dispatch(setError(null));
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data } = await loginUser(form);
      dispatch(setCredentials(data.data));
      navigate('/dashboard');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-[2rem] border border-slate-700 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/60">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400">Sign in to manage your groups, expenses and settlements.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-slate-300">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          </label>
          <label className="block text-slate-300">
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          </label>
          {error && <p className="rounded-3xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Sign in</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          New to SplitMate? <Link to="/register" className="text-cyan-300 hover:text-cyan-200">Create account</Link>
        </p>
      </motion.section>
    </main>
  );
};

export default Login;
