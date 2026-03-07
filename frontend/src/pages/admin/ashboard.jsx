import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUsers, FaMoneyBillWave, FaMapMarkedAlt, FaCalendar } from 'react-icons/fa';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const userStats = analytics?.userStats || [];
  const revenue = analytics?.revenue || { totalRevenue: 0, totalBookings: 0 };
  const topDestinations = analytics?.topDestinations || [];
  const recentBookings = analytics?.recentBookings || [];

  const getTotalUsers = () => {
    return userStats.reduce((sum, stat) => sum + stat.count, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform analytics and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{getTotalUsers()}</p>
              </div>
              <FaUsers className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Platform Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{revenue.totalRevenue}</p>
              </div>
              <FaMoneyBillWave className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{revenue.totalBookings}</p>
              </div>
              <FaCalendar className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Destinations</p>
                <p className="text-3xl font-bold text-gray-900">{topDestinations.length}</p>
              </div>
              <FaMapMarkedAlt className="text-4xl text-yellow-600" />
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userStats.map((stat) => (
            <div key={stat._id} className="card p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize">
                {stat._id}s
              </h3>
              <p className="text-3xl font-bold text-primary-600">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/users" className="card p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage all users</p>
          </Link>

          <Link to="/admin/destinations" className="card p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Destinations</h3>
            <p className="text-gray-600">Add and manage destinations</p>
          </Link>

          <Link to="/admin/cuisines" className="card p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Cuisines</h3>
            <p className="text-gray-600">Manage cuisine database</p>
          </Link>

          <Link to="/admin/guides/pending" className="card p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Pending Guides</h3>
            <p className="text-gray-600">Approve guide applications</p>
          </Link>
        </div>

        {/* Top Destinations */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Top Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDestinations.slice(0, 3).map((dest) => (
              <div key={dest._id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{dest.name}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Visits: {dest.visitCount}</span>
                  <span>Rating: {dest.rating}⭐</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tourist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.tourist?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.destination?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
