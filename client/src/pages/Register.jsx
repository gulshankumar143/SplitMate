import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoading, setError } from '../store/slices/authSlice.js';
import { registerUser } from '../api/authService.js';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      await registerUser(form);
      localStorage.setItem('otpEmail', form.email);
      navigate('/verify', { state: { email: form.email } });
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Registration failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-[2rem] border border-slate-700 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/60">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Create your account</h1>
          <p className="text-slate-400">Join SplitMate and start splitting expenses intelligently.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-slate-300">
            <span>Name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          </label>
          <label className="block text-slate-300">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          </label>
          <label className="block text-slate-300">
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Register</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Sign in</Link>
        </p>
      </motion.section>
    </main>
  );
};

export default Register;
