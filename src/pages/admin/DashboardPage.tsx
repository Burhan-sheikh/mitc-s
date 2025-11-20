export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-primary-500">0</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Active Chats</h3>
          <p className="text-3xl font-bold text-accent-500">0</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Reviews</h3>
          <p className="text-3xl font-bold text-primary-500">0</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-3xl font-bold text-accent-500">0</p>
        </div>
      </div>
    </div>
  );
}