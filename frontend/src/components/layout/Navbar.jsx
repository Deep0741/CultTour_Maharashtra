import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHome, FaMapMarkedAlt, FaUtensils, FaUsers } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

 const getDashboardLink = () => {

 if(user?.role === "admin")
   return "/admin/dashboard"

 if(user?.role === "guide")
   return "/guide/dashboard"

 if(user?.role === "tourist")
   return "/tourist/dashboard"

 return "/"

}

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">CulTour</span>
            <span className="text-xl font-semibold text-gray-700">Maharashtra</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/destinations" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FaMapMarkedAlt />
              <span>Destinations</span>
            </Link>
            <Link to="/cuisines" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FaUtensils />
              <span>Cuisines</span>
            </Link>
            <Link to="/guides" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FaUsers />
              <span>Guides</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <img
                    src={user?.image || 'https://via.placeholder.com/40'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user?.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <MdDashboard />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
                <Link to="/profile">Profile</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
