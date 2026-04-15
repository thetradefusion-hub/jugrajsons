import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BottomNav from "@/components/common/BottomNav";
import ScrollToTop from "@/components/common/ScrollToTop";
import Onboarding from "@/components/onboarding/Onboarding";
import NotificationPrompt from "@/components/notifications/NotificationPrompt";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Login from "@/pages/Login";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";
import MyOrders from "@/pages/MyOrders";
import Addresses from "@/pages/Addresses";
import Notifications from "@/pages/Notifications";
import Support from "@/pages/Support";
import Privacy from "@/pages/Privacy";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQs from "@/pages/FAQs";
import Shipping from "@/pages/Shipping";
import Returns from "@/pages/Returns";
import TrackOrder from "@/pages/TrackOrder";
import Terms from "@/pages/Terms";
import Press from "@/pages/Press";
import UserSettings from "@/pages/UserSettings";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAddProduct from "@/pages/admin/AdminAddProduct";
import AdminEditProduct from "@/pages/admin/AdminEditProduct";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminInventory from "@/pages/admin/AdminInventory";
import AdminReports from "@/pages/admin/AdminReports";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminActivityLogs from "@/pages/admin/AdminActivityLogs";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      // Show notification prompt after a delay if not already shown
      const hasSeenNotification = localStorage.getItem("hasSeenNotificationPrompt");
      if (!hasSeenNotification) {
        const timer = setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    // Show notification prompt after onboarding
    setTimeout(() => {
      const hasSeenNotification = localStorage.getItem("hasSeenNotificationPrompt");
      if (!hasSeenNotification) {
        setShowNotificationPrompt(true);
      }
    }, 2000);
  };

  const handleNotificationAllow = () => {
    localStorage.setItem("hasSeenNotificationPrompt", "true");
    localStorage.setItem("notificationsEnabled", "true");
    setShowNotificationPrompt(false);
  };

  const handleNotificationDismiss = () => {
    localStorage.setItem("hasSeenNotificationPrompt", "true");
    setShowNotificationPrompt(false);
  };

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {showNotificationPrompt && (
          <NotificationPrompt
            onAllow={handleNotificationAllow}
            onDismiss={handleNotificationDismiss}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-background">
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        <div className={`flex-1 ${isAdminRoute ? "" : "pb-16 md:pb-0"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/press" element={<Press />} />
            <Route path="/settings" element={<UserSettings />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminAddProduct />} />
            <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <BottomNav />}
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter
                  future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
                >
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
