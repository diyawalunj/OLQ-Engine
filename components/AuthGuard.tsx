import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, Phone, Lock, Loader2, ArrowRight, UserPlus, X, Eye, EyeOff, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { cn } from '../utils';

const googleProvider = new GoogleAuthProvider();

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setLoading, showAuthModal, setShowAuthModal } = useAuthStore();
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email || user.phoneNumber || '',
          isAdmin: user.email === 'diyawalunj@gmail.com'
        });
        setShowAuthModal(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setShowAuthModal]);

  // Convert mobile to email format for Firebase (phone auth needs Blaze plan, so we use email workaround)
  const getAuthEmail = () => {
    if (email) return email;
    if (mobile) return `${mobile}@ssbengine.in`;
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsProcessing(true);

    const authEmail = getAuthEmail();

    try {
      if (isLogin) {
        if (auth.app.options.apiKey === 'mock_api_key') {
          setTimeout(() => {
            setUser({ uid: 'mock_uid', email: authEmail, isAdmin: authEmail === 'diyawalunj@gmail.com' });
            setShowAuthModal(false);
            setIsProcessing(false);
          }, 1000);
          return;
        }
        await signInWithEmailAndPassword(auth, authEmail, password);
      } else {
        if (auth.app.options.apiKey === 'mock_api_key') {
          setTimeout(() => {
            setUser({ uid: 'mock_uid_new', email: authEmail, isAdmin: false });
            setShowAuthModal(false);
            setIsProcessing(false);
          }, 1000);
          return;
        }
        await createUserWithEmailAndPassword(auth, authEmail, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Account already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found. Please create one.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      if (auth.app.options.apiKey === 'mock_api_key') {
        setTimeout(() => {
          setUser({ uid: 'mock_google_uid', email: 'user@gmail.com', isAdmin: false });
          setShowAuthModal(false);
          setIsProcessing(false);
        }, 1000);
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotPassword = async () => {
    const authEmail = getAuthEmail();
    if (!authEmail || authEmail.endsWith('@ssbengine.in')) {
      setError('Please enter a valid email to reset password.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      if (auth.app.options.apiKey !== 'mock_api_key') {
        await sendPasswordResetEmail(auth, authEmail);
      }
      setSuccessMsg('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError('Failed to send reset email. Please check the email address.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isMobileMode = !isLogin ? false : true; // Sign in uses mobile, Sign up uses email
  const canSubmit = isLogin
    ? (mobile.length >= 10 || email) && password.length >= 6
    : email && password.length >= 6 && name;

  return (
    <>
      {children}

      <AnimatePresence>
        {!user && showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 selection:bg-olq-gold/30"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[420px] bg-olq-card border border-olq-border rounded-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Top gradient accent */}
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Close Button */}
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pt-7">
                {/* Title */}
                <div className="text-center mb-8">
                  <h1 className="text-[22px] font-bold text-white mb-1.5">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {isLogin ? 'Sign in to continue your journey' : 'Start your SSB preparation'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Sign Up: Name field */}
                  {!isLogin && (
                    <div>
                      <label className="text-[13px] font-semibold text-gray-300 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-olq-bg border border-olq-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  )}

                  {/* Sign In: Mobile Number | Sign Up: Email */}
                  <div>
                    <label className="text-[13px] font-semibold text-gray-300 mb-2 block">
                      {isLogin ? 'Mobile Number' : 'Email Address'}
                    </label>
                    {isLogin ? (
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setMobile(val);
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full bg-olq-bg border border-olq-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-gray-600 font-mono tracking-wider"
                        required
                      />
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-olq-bg border border-olq-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                        required
                      />
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] font-semibold text-gray-300">Password</label>
                      {isLogin && (
                        <button 
                          type="button" 
                          onClick={handleForgotPassword}
                          className="text-[12px] text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-olq-bg border border-olq-border rounded-xl px-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error / Success Messages */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                      <p className="text-red-400 text-xs text-center">{error}</p>
                    </div>
                  )}
                  {successMsg && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
                      <p className="text-green-400 text-xs text-center">{successMsg}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing || !canSubmit}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-olq-border" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-olq-border" />
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl border border-olq-border bg-olq-bg hover:bg-olq-card transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-300">Sign in with Google</span>
                </button>

                {/* Toggle Login/Register */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                        setSuccessMsg(null);
                      }} 
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      {isLogin ? 'Create Account' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
