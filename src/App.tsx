import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BottomNav from "@/components/common/BottomNav";
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
