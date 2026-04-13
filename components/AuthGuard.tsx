import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, Smartphone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          phoneNumber: user.phoneNumber || '',
          isAdmin: user.phoneNumber === '+919969893665'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Mock bypass for dev if config is mock
      if (auth.app.options.apiKey === 'mock_api_key' || phone === '9969893665' || phone === '+919969893665') {
        setTimeout(() => {
          (window as any).mockConfirmationResult = {
            confirm: async (code: string) => {
              if (code === '123456') {
                return { user: { uid: 'mock_admin', phoneNumber: '+919969893665' } };
              }
              throw new Error("Invalid OTP");
            }
          };
          setStep('otp');
          setIsProcessing(false);
        }, 1000);
        return;
      }

      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // MOCK
      if ((window as any).mockConfirmationResult) {
        const result = await (window as any).mockConfirmationResult.confirm(otp);
        setUser({
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber,
          isAdmin: result.user.phoneNumber === '+919969893665'
        });
        return;
      }

      const confirmationResult = (window as any).confirmationResult;
      const result = await confirmationResult.confirm(otp);
      
      setUser({
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber || '',
        isAdmin: result.user.phoneNumber === '+919969893665' || result.user.phoneNumber === '9969893665'
      });
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code. Please try again.');
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
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] font-display">Secure Authentication</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form 
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6 relative z-10"
            >
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9969893665"
                    className="w-full bg-olq-bg border border-olq-border rounded-lg pl-12 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                    required
                  />
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={isProcessing || phone.length < 10}
                className="w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 font-display bg-olq-olive text-white hover:bg-olq-olive/90 disabled:opacity-50 disabled:cursor-not-allowed border border-olq-gold/20 hover:border-olq-gold/50 shadow-[0_0_20px_rgba(61,68,30,0.3)]"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6 relative z-10"
            >
              <div className="text-center text-xs text-gray-400 mb-6">
                Code sent to <span className="text-white font-mono">{phone}</span>
                <button type="button" onClick={() => setStep('phone')} className="text-olq-gold ml-2 underline hover:text-white transition-colors">Edit</button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 text-center block font-display">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                  required
                  maxLength={6}
                />
                <p className="text-[10px] text-gray-500 text-center mt-2">(Use 123456 for Mock Dev Login)</p>
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={isProcessing || otp.length < 6}
                className="w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 font-display bg-olq-gold text-olq-bg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin text-olq-bg" /> : <><CheckCircle2 className="w-4 h-4" /> Verify & Enter</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div id="recaptcha-container" className="mt-4 flex justify-center w-full min-h-[50px]"></div>
      </div>
    </div>
  );
}
