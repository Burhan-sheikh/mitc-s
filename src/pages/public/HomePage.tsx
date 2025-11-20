import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="container-custom section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          Welcome to MITC Store
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Premium IT Products from Mateen IT Corp., Srinagar
        </p>
        <div className="glass-card inline-block px-8 py-4 rounded-2xl">
          <p className="text-lg font-medium">
            🚧 Application structure created successfully!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Components will be built next
          </p>
        </div>
      </motion.div>
    </div>
  );
}