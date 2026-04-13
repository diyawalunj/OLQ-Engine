import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, Phone, Lock, Loader2, ArrowRight, X, Eye, EyeOff, Mail, UserPlus } from 'lucide-react';
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
      if (err.code === 'auth/invalid-credential') setError('Invalid credentials. Check and retry.');
      else if (err.code === 'auth/email-already-in-use') setError('Account exists. Sign in instead.');
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.');
      else if (err.code === 'auth/user-not-found') setError('No account found. Create one below.');
      else setError(err.message || 'Authentication failed.');
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
      if (err.code !== 'auth/popup-closed-by-user') setError('Google sign-in failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotPassword = async () => {
    const authEmail = getAuthEmail();
    if (!authEmail || authEmail.endsWith('@ssbengine.in')) {
      setError('Enter a valid email address to reset password.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      if (auth.app.options.apiKey !== 'mock_api_key') {
        await sendPasswordResetEmail(auth, authEmail);
      }
      setSuccessMsg('Reset link sent. Check your inbox.');
    } catch {
      setError('Failed to send reset email.');
    } finally {
      setIsProcessing(false);
    }
  };

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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-olq-gold/30"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-[420px] bg-olq-card border border-olq-border rounded-xl shadow-2xl relative overflow-hidden"
            >
              {/* Glow accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-olq-olive/10 blur-[80px] -ml-24 -mb-24 pointer-events-none" />

              {/* Close */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors z-20 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 relative z-10">
                {/* Logo + Title */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-olq-olive rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20 mb-5 shadow-[0_0_25px_rgba(61,68,30,0.5)]">
                    <Shield className="text-olq-gold w-7 h-7" />
                  </div>
                  <h1 className="text-xl font-bold text-white uppercase tracking-wider font-display mb-1.5">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] font-display">
                    {isLogin ? 'Sign in to continue your journey' : 'Begin your SSB preparation'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name (signup only) */}
                  {!isLogin && (
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2.5 block font-display">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                        required
                      />
                    </div>
                  )}

                  {/* Mobile (login) / Email (signup) */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2.5 block font-display">
                      {isLogin ? 'Mobile Number' : 'Email Address'}
                    </label>
                    {isLogin ? (
                      <div className="relative">
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit mobile number"
                          className="w-full bg-olq-bg border border-olq-border rounded-lg pl-11 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700 tracking-wider"
                          required
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="candidate@example.com"
                          className="w-full bg-olq-bg border border-olq-border rounded-lg pl-11 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                          required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-display">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[10px] text-olq-gold/70 hover:text-olq-gold font-bold uppercase tracking-wider transition-colors"
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
                        className="w-full bg-olq-bg border border-olq-border rounded-lg pl-11 pr-12 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                        required
                        minLength={6}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-olq-gold/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                      <p className="text-red-400 text-[11px] text-center font-mono">{error}</p>
                    </div>
                  )}
                  {successMsg && (
                    <div className="bg-olq-green/10 border border-olq-green/30 rounded-lg px-4 py-2.5">
                      <p className="text-olq-green text-[11px] text-center font-mono">{successMsg}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isProcessing || !canSubmit}
                    className="w-full py-3.5 rounded-lg font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2.5 font-display bg-olq-olive text-white border border-olq-gold/20 hover:border-olq-gold/50 shadow-[0_0_20px_rgba(61,68,30,0.4)] hover:shadow-[0_0_30px_rgba(61,68,30,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-olq-border" />
                  <span className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-display">or</span>
                  <div className="flex-1 h-px bg-olq-border" />
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg border border-olq-border bg-olq-bg hover:border-olq-gold/30 hover:bg-olq-card transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-display">Sign in with Google</span>
                </button>

                {/* Toggle */}
                <div className="mt-6 text-center">
                  <span className="text-[11px] text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }}
                    className="text-[11px] text-olq-gold font-bold uppercase tracking-wider hover:text-olq-gold/80 transition-colors"
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
