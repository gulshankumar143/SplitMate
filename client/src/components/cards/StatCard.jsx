import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, accent }) => (
  <motion.div
    className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-500/10"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-between gap-4">
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      <div className={`rounded-2xl p-3 text-white ${accent}`}>{icon}</div>
    </div>
    <div className="mt-5 text-3xl font-semibold text-white">{value}</div>
  </motion.div>
);

export default StatCard;
