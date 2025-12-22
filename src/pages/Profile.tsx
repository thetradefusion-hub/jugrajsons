import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Bell, HelpCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import SEO from "@/components/seo/SEO";

const menuItems = [
  { icon: Package, label: "My Orders", path: "/orders", badge: "2" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: MapPin, label: "Saved Addresses", path: "/addresses" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: HelpCircle, label: "Help & Support", path: "/support" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <SEO
        title="My Profile | Atharva Health Solutions"
        description="Manage your account and orders"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-ayurveda-cream to-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 pt-6 pb-8 rounded-b-3xl">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-white/20 text-lg">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{user?.name || "User"}</h1>
                <p className="text-sm opacity-90">{user?.email}</p>
                <p className="text-xs opacity-75 mt-0.5">{user?.phone || "Add phone number"}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-white/30">
                <AvatarFallback className="bg-white/20">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold mb-1">Welcome Guest</h1>
              <p className="text-sm opacity-90 mb-4">Login for personalized experience</p>
              <Link to="/login">
                <Button variant="secondary" className="rounded-full px-8">
                  Login / Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {isAuthenticated && (
          <div className="px-4 -mt-4">
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Wishlist</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">₹500</p>
                    <p className="text-xs text-muted-foreground">Wallet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-4 mt-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <div className="px-4 mt-6">
            <Button
              variant="outline"
              className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        )}

        {/* App Version */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>Atharva Health Solutions</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
