import { Route, Routes, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import OTPVerify from './pages/OTPVerify.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Friends from './pages/Friends.jsx';
import Groups from './pages/Groups.jsx';
import Chat from './pages/Chat.jsx';
import ExpenseDetails from './pages/ExpenseDetails.jsx';
import AddExpense from './pages/AddExpense.jsx';
import Analytics from './pages/Analytics.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import ProtectedLayout from './components/ui/ProtectedLayout.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<OTPVerify />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>}
          />
          <Route path="/friends" element={<ProtectedRoute><ProtectedLayout><Friends /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><ProtectedLayout><Groups /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ProtectedLayout><Chat /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/expense/:id" element={<ProtectedRoute><ProtectedLayout><ExpenseDetails /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/add-expense" element={<ProtectedRoute><ProtectedLayout><AddExpense /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><ProtectedLayout><Analytics /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><ProtectedLayout><Notifications /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProtectedLayout><Profile /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProtectedLayout><Settings /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><ProtectedLayout><AdminDashboard /></ProtectedLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
