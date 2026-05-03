import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEO from '@/components/seo/SEO';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const logoSrc = '/WhatsApp%20Image%202026-03-21%20at%203.15.06%20PM.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState('login');

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => navigate('/');

  return (
    <>
      <SEO title="Login or Sign Up | Jugraj Son's Hive" description="Sign in or create an account for Jugraj Son's Hive — premium raw forest honey." />
      <main className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb] px-4 py-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-[#E6A817]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#1F3D2B]/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-[1] w-full min-w-0 max-w-md"
        >
          <div className="rounded-3xl border-2 border-[#E6A817]/25 bg-white/95 p-6 shadow-[0_20px_48px_rgba(43,29,14,0.12)] backdrop-blur-sm sm:p-8">
            <div className="mb-8 text-center">
              <Link to="/" className="inline-flex flex-col items-center gap-2">
                <img
                  src={logoSrc}
                  alt="Jugraj Son's Hive"
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[#E6A817]/35"
                />
                <span className="font-display text-xl font-bold text-[#2B1D0E]">Jugraj Son&apos;s Hive</span>
              </Link>
              <h1 className="mt-4 font-display text-2xl font-bold text-[#2B1D0E]">Welcome back</h1>
              <p className="mt-2 text-sm text-[#2B1D0E]/70">
                Pure forest honey — sign in to shop or track your orders.
              </p>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList
                className={cn(
                  'grid h-11 w-full grid-cols-2 gap-1 rounded-full border border-[#E6A817]/25 bg-[#F5E9D7]/90 p-1',
                  'text-[#2B1D0E]/65',
                )}
              >
                <TabsTrigger
                  value="login"
                  className={cn(
                    'rounded-full text-sm font-semibold transition-all',
                    'data-[state=active]:bg-[#1F3D2B] data-[state=active]:text-[#F5E9D7] data-[state=active]:shadow-md',
                    'data-[state=inactive]:text-[#2B1D0E]/75',
                  )}
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className={cn(
                    'rounded-full text-sm font-semibold transition-all',
                    'data-[state=active]:bg-[#1F3D2B] data-[state=active]:text-[#F5E9D7] data-[state=active]:shadow-md',
                    'data-[state=inactive]:text-[#2B1D0E]/75',
                  )}
                >
                  Sign up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6 outline-none">
                <LoginForm onSuccess={handleSuccess} />
              </TabsContent>
              <TabsContent value="register" className="mt-6 outline-none">
                <RegisterForm onSuccess={handleSuccess} />
              </TabsContent>
            </Tabs>

            <p className="mt-8 text-center text-xs text-[#2B1D0E]/55">
              <Link to="/" className="font-medium text-[#1F3D2B] underline-offset-4 hover:underline">
                ← Back to home
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default Login;
