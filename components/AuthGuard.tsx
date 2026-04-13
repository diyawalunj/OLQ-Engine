import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, Mail, Lock, Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email || '',
          isAdmin: user.email === 'diyawalunj@gmail.com'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (isLogin) {
        // MOCK bypass for dev
        if (auth.app.options.apiKey === 'mock_api_key') {
          setTimeout(() => {
            setUser({
              uid: 'mock_uid',
              email: email,
              isAdmin: email === 'diyawalunj@gmail.com'
            });
            setIsProcessing(false);
          }, 1000);
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (auth.app.options.apiKey === 'mock_api_key') {
          setTimeout(() => {
            setUser({
              uid: 'mock_uid_new',
              email: email,
              isAdmin: email === 'diyawalunj@gmail.com'
            });
            setIsProcessing(false);
          }, 1000);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login instead.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-olq-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-olq-gold animate-spin" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-olq-bg flex flex-col items-center justify-center p-4 selection:bg-olq-gold/30">
      <div className="w-full max-w-md bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-olq-olive/10 blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 bg-olq-olive rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20 mb-6 shadow-[0_0_30px_rgba(61,68,30,0.5)]">
            <Shield className="text-olq-gold w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider font-display mb-2">SSB Portal</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] font-display">
            {isLogin ? 'Secure Login' : 'Create Account'}
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 relative z-10"
        >
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full bg-olq-bg border border-olq-border rounded-lg pl-12 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-olq-bg border border-olq-border rounded-lg pl-12 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                required
                minLength={6}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isProcessing || !email || password.length < 6}
            className="w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 font-display bg-olq-olive text-white hover:bg-olq-olive/90 disabled:opacity-50 disabled:cursor-not-allowed border border-olq-gold/20 hover:border-olq-gold/50 shadow-[0_0_20px_rgba(61,68,30,0.3)]"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Grant Access' : 'Register Profile')}
            {!isProcessing && <ArrowRight className="w-4 h-4" />}
          </button>
        </motion.form>

        <div className="relative z-10 mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }} 
            className="text-[10px] text-olq-gold/60 hover:text-olq-gold font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
          >
             {isLogin ? (
               <><UserPlus className="w-3 h-3" /> Initialize New Candidate Profile</>
             ) : (
               <><Shield className="w-3 h-3" /> Authenticate Existing Profile</>
             )}
          </button>
        </div>
      </div>
    </div>
  );
}
