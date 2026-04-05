import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

// --- LAZY LOADED ROUTES FOR CODE SPLITTING ---
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const PlaceOrderScreen = lazy(() => import('./screens/PlaceOrderScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const MyOrdersScreen = lazy(() => import('./screens/MyOrdersScreen'));
const ShippingScreen = lazy(() => import('./screens/ShippingScreen'));
const PaymentScreen = lazy(() => import('./screens/PaymentScreen'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const OurStory = lazy(() => import('./pages/OurStory'));
const OrderDetailsScreen = lazy(() => import('./screens/OrderDetailsScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const ContactScreen = lazy(() => import('./screens/ContactScreen'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CategoryScreen = lazy(() => import('./screens/CategoryScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const NotFoundScreen = lazy(() => import('./screens/NotFoundScreen'));
const ServerErrorScreen = lazy(() => import('./screens/ServerErrorScreen'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <Router>
      <style>
        {`
          html.dark-mode {
            filter: invert(1) hue-rotate(180deg);
          }
          /* Re-invert media and specific elements so they look normal */
          html.dark-mode img, 
          html.dark-mode video,
          html.dark-mode .navbar,
          html.dark-mode .bg-dark,
          html.dark-mode .btn-dark,
          html.dark-mode .btn-place-order,
          html.dark-mode .cancel-alert,
          html.dark-mode .search-overlay,
          html.dark-mode th,
          html.dark-mode .carousel,
          html.dark-mode [style*="background-color: rgb(0, 0, 0)"],
          html.dark-mode [style*="background-color: #000"] {
            filter: invert(1) hue-rotate(180deg);
          }
          /* Ensure premium/dark-theme card components keep their intended dark look */
          html.dark-mode .dark-theme-card {
            filter: invert(1) hue-rotate(180deg);
          }

          /* Prevent double-inverting media inside already re-inverted containers */
          html.dark-mode .navbar img,
          html.dark-mode .bg-dark img,
          html.dark-mode .carousel img,
          html.dark-mode .dark-theme-card img,
          html.dark-mode [style*="background-color: rgb(0, 0, 0)"] img,
          html.dark-mode [style*="background-color: #000"] img {
            filter: none !important;
          }

          /* Grayscale image handling */
          .grayscale-img {
            filter: grayscale(100%) !important;
          }
          html.dark-mode img.grayscale-img {
            filter: invert(1) hue-rotate(180deg) grayscale(100%) !important;
          }
          html.dark-mode .dark-theme-card img.grayscale-img,
          html.dark-mode .carousel img.grayscale-img,
          html.dark-mode [style*="background-color: rgb(0, 0, 0)"] img.grayscale-img,
          html.dark-mode [style*="background-color: #000"] img.grayscale-img {
            filter: grayscale(100%) !important;
          }

          /* Create a deeply dark animated background by washing it in white before it gets globally inverted */
          html.dark-mode .animated-bg {
            background-image: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab) !important;
          }
          
          /* --- GLOBAL UI POLISH --- */
          ::selection { background: #000; color: #fff; }
          ::-webkit-scrollbar { width: 10px; }
          ::-webkit-scrollbar-track { background: #fdfdfd; border-left: 1px solid #eee; }
          ::-webkit-scrollbar-thumb { background: #000; }
          
          /* Brutalist Input Focus & Button Hovers */
          .form-control:focus, .form-select:focus {
            border-color: #000 !important;
            box-shadow: 4px 4px 0px #000 !important;
            outline: none !important;
          }
          .btn-dark, .btn-outline-dark, .btn-place-order, .black-btn-style, .add-to-cart-btn {
            transition: all 0.2s ease-in-out !important;
          }
          .btn-dark:hover, .btn-outline-dark:hover, .btn-place-order:hover, .black-btn-style:hover, .add-to-cart-btn:hover {
            transform: translate(-2px, -2px) !important;
            box-shadow: 4px 4px 0px #000 !important;
          }
          /* Dark Mode Button Hover - Turn White */
          html.dark-mode .btn-dark:hover, 
          html.dark-mode .btn-outline-dark:hover, 
          html.dark-mode .btn-place-order:hover, 
          html.dark-mode .black-btn-style:hover,
          html.dark-mode .add-to-cart-btn:hover {
            filter: none !important;
          }
          
          /* --- SMOOTH PAGE ENTRANCE --- */
          @keyframes pageFadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          main > div, main > section, .container {
            animation: pageFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Cool Streetwear Noise Texture Overlay */
          body::after {
            content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');
            opacity: 0.04; pointer-events: none; z-index: 9999;
          }

          /* Floating Theme Toggle */
          .theme-toggle-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 10000;
            background-color: #000;
            color: #fff;
            border: 2px solid #fff;
            padding: 12px 20px;
            font-weight: 900;
            letter-spacing: 1px;
            font-size: 12px;
            box-shadow: 4px 4px 0px #000;
            transition: 0.2s ease-in-out;
          }
          .theme-toggle-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000;
          }
          html.dark-mode .theme-toggle-btn {
            filter: invert(1) hue-rotate(180deg);
          }

          /* --- RESPONSIVE MOBILE OPTIMIZATIONS --- */
          @media (max-width: 768px) {
            /* Typography Scaling */
            h1 { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
            h2 { font-size: clamp(1.5rem, 6vw, 2.5rem) !important; }
            
            /* Navbar Mobile View Fix */
            .navbar-brand { font-size: 1.5rem !important; font-weight: 900 !important; }
            .navbar-toggler { border: 2px solid #000 !important; border-radius: 0 !important; padding: 5px 10px !important; }
            html.dark-mode .navbar-toggler { border-color: #fff !important; }
            .navbar-collapse { 
              background-color: #fff; border: 2px solid #000; padding: 15px; 
              position: absolute; top: 100%; left: 5%; width: 90%; z-index: 1050; 
              box-shadow: 4px 4px 0px #000; text-align: center;
            }
            html.dark-mode .navbar-collapse { background-color: #000; border-color: #fff; box-shadow: 4px 4px 0px #fff; }
            .navbar-nav .nav-link { font-size: 14px !important; font-weight: 800 !important; margin-bottom: 10px; border-bottom: 1px dashed #eee; }
            html.dark-mode .navbar-nav .nav-link { border-bottom-color: #333; }
          }
        `}
      </style>
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { borderRadius: '0', background: '#000', color: '#fff', border: '2px solid #fff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' },
          success: { iconTheme: { primary: '#fff', secondary: '#000' } },
          error: { iconTheme: { primary: '#ff4444', secondary: '#fff' } }
        }} 
      />
      <Navbar /> 
      <main style={{ minHeight: '85vh', backgroundColor: '#fdfdfd' }}>
        <Suspense fallback={<div style={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#000', fontWeight: '900', letterSpacing: '5px', textTransform: 'uppercase' }}>INITIALIZING SYSTEM...</div>}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/collection/:categoryName" element={<CategoryScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/myorders" element={<MyOrdersScreen />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/our-story' element={<OurStory />} />
            <Route path='/contact' element={<ContactScreen />} />
            <Route path='/order/:id' element={<OrderDetailsScreen />} />
            <Route path='/500' element={<ServerErrorScreen />} />
            <Route path='*' element={<NotFoundScreen />} />
          </Routes>
        </Suspense>
      </main>

      {/* GLOBAL THEME TOGGLE BUTTON */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {isDarkMode ? '☼ LIGHT MODE' : '☾ DARK MODE'}
      </button>
    </Router>
  );
}

export default App;