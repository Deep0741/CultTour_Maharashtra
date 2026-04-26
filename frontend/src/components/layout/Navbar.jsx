import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from "react";
import { FiHome, FiMapPin, FiCoffee, FiUsers, FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/admin/dashboard";
      case "guide": return "/guide/dashboard";
      case "tourist": return "/tourist/dashboard";
      default: return "/";
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome size={16} /> },
    { to: '/destinations', label: 'Destinations', icon: <FiMapPin size={16} /> },
    { to: '/cuisines', label: 'Cuisines', icon: <FiCoffee size={16} /> },
    { to: '/guides', label: 'Guides', icon: <FiUsers size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="text-2xl font-extrabold gradient-text tracking-tight">CulTour</span>
              <span className="text-lg font-semibold text-surface-600 group-hover:text-surface-800 transition-colors">Maharashtra</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.to)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-surface-600 hover:text-primary-600 hover:bg-surface-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-surface-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <img
                      src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=f97316&color=fff&bold=true`}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                      alt="avatar"
                    />
                    <span className="text-sm font-medium text-surface-700 hidden sm:block">{user?.name}</span>
                    <svg className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium-lg border border-surface-100 py-2 animate-scale-in origin-top-right">
                      <div className="px-4 py-2.5 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-800">{user?.name}</p>
                        <p className="text-xs text-surface-400">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-colors"
                      >
                        <FiUser size={16} />
                        Profile
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-colors"
                      >
                        <FiGrid size={16} />
                        Dashboard
                      </Link>
                      <div className="border-t border-surface-100 mt-1 pt-1">
                        <button
                          onClick={() => { handleLogout(); setShowDropdown(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors px-3 py-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !px-5 !py-2">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-surface-100 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
