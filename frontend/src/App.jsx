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
import CuisineDetails from './pages/public/CuisineDetails';
import Guides from './pages/public/Guides';
import Profile from './pages/Profile';


// Tourist pages
import TouristDashboard from './pages/tourist/TouristDashboard';

// Guide pages
import GuideDashboard from './pages/guide/GuideDashboard';
import GuideLicense from "./pages/guide/GuideLicense";

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingGuides from "./pages/admin/PendingGuides";
import UsersManagement from "./pages/admin/UsersManagement";
import DestinationsManagement from "./pages/admin/DestinationsManagement";

//DestinationDetains
import DestinationDetails from "./pages/public/DestinationDetails";

//Booking Confirmation 
import BookingConfirmation from "./pages/booking/BookingConfirmation";

// Forget Password
import ForgotPassword from "./pages/auth/ForgotPassword";

// Reset Password
import ResetPassword from "./pages/auth/ResetPassword";

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/cuisines" element={<Cuisines />} />
              <Route path="/cuisine/:id" element={<CuisineDetails />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/destinations/:id" element={<DestinationDetails />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            

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
              <Route
                path="/guide/license"
                element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideLicense />
                  </ProtectedRoute>
                }
              />  

              {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

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
                    <UsersManagement/>
                    </ProtectedRoute>
                    }
                    />

                    <Route
                    path="/admin/destinations"
                    element={
                    <ProtectedRoute allowedRoles={['admin']}>
                    <DestinationsManagement/>
                    </ProtectedRoute>
                    }
                    />

                 {/* Profile Route */}
                 <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['tourist','guide','admin']}>
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
