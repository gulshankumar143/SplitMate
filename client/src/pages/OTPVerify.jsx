import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api/authService.js';
import { setCredentials, setLoading, setError } from '../store/slices/authSlice.js';
import { useDispatch } from 'react-redux';

const OTPVerify = () => {
  const [code, setCode] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || localStorage.getItem('otpEmail') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data } = await verifyOtp({ email, code });
      dispatch(setCredentials(data.data));
      localStorage.removeItem('otpEmail');
      navigate('/dashboard');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'OTP verification failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <section className="w-full max-w-lg rounded-[2rem] border border-slate-700 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/60">
        <h1 className="text-3xl font-semibold text-white">Verify your email</h1>
        <p className="mt-3 text-slate-400">Enter the OTP sent to {email || 'your email address'}.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input value={code} onChange={(e) => setCode(e.target.value)} type="text" placeholder="Enter OTP" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
          <button className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Verify OTP</button>
        </form>
      </section>
    </main>
  );
};

export default OTPVerify;
