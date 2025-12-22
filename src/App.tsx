import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BottomNav from "@/components/common/BottomNav";
import Onboarding from "@/components/onboarding/Onboarding";
import NotificationPrompt from "@/components/notifications/NotificationPrompt";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";
import Expert from "@/pages/Expert";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

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
        <Navbar />
        <div className="flex-1 pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expert" element={<Expert />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <BottomNav />
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
                <BrowserRouter>
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
