import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-2xl max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <p className="text-center text-gray-500">Authentication coming soon</p>
      </motion.div>
    </div>
  );
}