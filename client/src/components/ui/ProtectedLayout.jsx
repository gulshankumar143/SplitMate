import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../store/slices/authSlice.js';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Friends', path: '/friends' },
  { label: 'Groups', path: '/groups' },
  { label: 'Add Expense', path: '/add-expense' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Chat', path: '/chat' }
];

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div>
            <h1 className="text-lg font-semibold text-white">SplitMate</h1>
            <p className="text-sm text-slate-400">Premium expense sharing suite</p>
          </div>
          <nav className="hidden gap-4 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Admin</NavLink>
            )}
          </nav>
          <button onClick={handleLogout} className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
