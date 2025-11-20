import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      {/* Navigation will be added here */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
      {/* Footer will be added here */}
    </div>
  );
}