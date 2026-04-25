import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Destinations from './pages/public/Destinations';
import Cuisines from './pages/public/Cuisines';
import CuisineDetails from "./pages/public/CuisineDetails";
import Guides from './pages/public/Guides';
import Profile from "./pages/Profile";

// Tourist pages
import TouristDashboard from './pages/tourist/Dashboard';

// Guide pages
import GuideDashboard from './pages/guide/Dashboard';

// Admin pages
import AdminDashboard from './pages/admin/ashboard';

//DestinationDetails
import DestinationDetails from "./pages/public/DestinationDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/cuisines" element={<Cuisines />} />
              <Route path="/cuisine/:id" element={<CuisineDetails />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/destinations/:id" element={<DestinationDetails />} />
<<<<<<< Updated upstream
            
=======
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
>>>>>>> Stashed changes

              {/* Tourist Routes */}
              <Route
                path="/tourist/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['tourist']}>
                    <TouristDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Guide Routes */}
              <Route
                path="/guide/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideDashboard />
                  </ProtectedRoute>
                }
              />
<<<<<<< Updated upstream
=======
              <Route
                path="/guide/license"
                element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideLicense />
                  </ProtectedRoute>
                }
              />
>>>>>>> Stashed changes

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
<<<<<<< Updated upstream
                 {/* Profile Route */}
                 <Route
=======

              <Route
                path="/admin/guides"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PendingGuides />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UsersManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/destinations"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DestinationsManagement />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route */}
              <Route
>>>>>>> Stashed changes
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['tourist', 'guide', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;