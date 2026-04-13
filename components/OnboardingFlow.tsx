import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronRight, ChevronLeft, Target, Calendar, CheckCircle2, Crosshair, Sparkles } from 'lucide-react';
import { useOnboardingStore, OLQ_LIST, UserProfile } from '../stores/onboardingStore';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils';

const ENTRY_TYPES = [
  { id: 'NDA', title: 'NDA', subtitle: 'National Defence Academy', desc: '10+2 Entry for Army, Navy & Air Force' },
  { id: 'CDS', title: 'CDS', subtitle: 'Combined Defence Services', desc: 'Graduate Entry for IMA, OTA, INA, AFA' },
  { id: 'AFCAT', title: 'AFCAT', subtitle: 'Air Force Common Admission Test', desc: 'Graduate Entry for Indian Air Force' },
  { id: 'TES', title: 'TES', subtitle: 'Technical Entry Scheme', desc: '10+2 Technical Entry for Indian Army' },
] as const;

const CONFERENCE_OPTIONS = [
  { id: 'none', label: 'First Attempt' },
  { id: 'screened_out', label: 'Screened Out (Day 1)' },
  { id: 'conference_out', label: 'Conference Out' },
  { id: 'recommended', label: 'Previously Recommended' },
] as const;

export default function OnboardingFlow() {
  const { user } = useAuthStore();
  const { saveProfile } = useOnboardingStore();

  const [step, setStep] = useState(0);
  const [entryType, setEntryType] = useState<'NDA'|'CDS'|'AFCAT'|'TES'|''>('');
  const [previousAttempts, setPreviousAttempts] = useState(0);
  const [conferenceStatus, setConferenceStatus] = useState<'none'|'screened_out'|'conference_out'|'recommended'>('none');
  const [targetDate, setTargetDate] = useState('');
  const [motivation, setMotivation] = useState('');
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>(
    Object.fromEntries(OLQ_LIST.map(olq => [olq, 5]))
  );
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 0: return entryType !== '';
      case 1: return true;
      case 2: return targetDate !== '';
      case 3: return true;
      default: return false;
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSaving(true);

    const profile: UserProfile = {
      entryType: entryType as any,
      previousAttempts,
      conferenceStatus,
      targetDate,
      motivation,
      selfAssessment,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };

    await saveProfile(user.uid, profile);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-olq-bg flex items-center justify-center p-4 selection:bg-olq-gold/30">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "h-full rounded-full",
                  i < step ? "bg-olq-gold" : i === step ? "bg-olq-gold/60" : "bg-gray-800"
                )}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Entry Type Selection */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-olq-olive rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20 shadow-[0_0_30px_rgba(61,68,30,0.5)]">
                  <Shield className="text-olq-gold w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-display">Select Your Entry</h1>
                <p className="text-sm text-gray-400">Choose your SSB entry pathway to personalize your preparation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENTRY_TYPES.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setEntryType(entry.id)}
                    className={cn(
                      "p-6 rounded-xl border text-left transition-all duration-300 group",
                      entryType === entry.id
                        ? "bg-olq-gold/10 border-olq-gold/50 shadow-[0_0_25px_rgba(197,160,89,0.15)]"
                        : "bg-olq-card border-olq-border hover:border-olq-gold/30 hover:bg-olq-card/80"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn(
                        "text-xl font-bold font-display tracking-wider",
                        entryType === entry.id ? "text-olq-gold" : "text-white"
                      )}>
                        {entry.title}
                      </span>
                      {entryType === entry.id && <CheckCircle2 className="w-5 h-5 text-olq-gold" />}
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{entry.subtitle}</p>
                    <p className="text-xs text-gray-500">{entry.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Attempt History */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <Target className="text-olq-gold w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-display">Attempt History</h1>
                <p className="text-sm text-gray-400">Share your SSB background so we can tailor your plan.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Previous SSB Attempts</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPreviousAttempts(Math.max(0, previousAttempts - 1))} className="w-10 h-10 rounded-lg bg-olq-bg border border-olq-border flex items-center justify-center text-white text-xl hover:border-olq-gold/40 transition-colors">−</button>
                    <span className="text-3xl font-bold font-mono text-white w-12 text-center">{previousAttempts}</span>
                    <button onClick={() => setPreviousAttempts(previousAttempts + 1)} className="w-10 h-10 rounded-lg bg-olq-bg border border-olq-border flex items-center justify-center text-white text-xl hover:border-olq-gold/40 transition-colors">+</button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Best Result So Far</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONFERENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setConferenceStatus(opt.id as any)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border text-left",
                          conferenceStatus === opt.id
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Target & Motivation */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <Calendar className="text-olq-gold w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-display">Your Target</h1>
                <p className="text-sm text-gray-400">Set your SSB date and define your mission.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Target SSB Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors"
                  />
                  {targetDate && (
                    <p className="text-xs text-olq-gold mt-2 font-mono">
                      {Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 86400000))} days remaining
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Why do you want to join the forces? (Optional)</label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Your motivation drives your preparation..."
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[100px] placeholder:text-gray-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Self Assessment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <Crosshair className="text-olq-gold w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-display">Self Assessment</h1>
                <p className="text-sm text-gray-400">Rate yourself honestly on each OLQ. This helps us find your focus areas.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                {OLQ_LIST.map((olq) => (
                  <div key={olq} className="flex items-center justify-between gap-4 py-3 border-b border-olq-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{olq}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={selfAssessment[olq]}
                        onChange={(e) => setSelfAssessment({ ...selfAssessment, [olq]: parseInt(e.target.value) })}
                        className="w-24 sm:w-32 accent-olq-gold appearance-none h-1 bg-gray-700 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-olq-gold [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <span className={cn(
                        "text-sm font-bold font-mono w-6 text-right",
                        selfAssessment[olq] >= 8 ? "text-olq-green" :
                        selfAssessment[olq] >= 5 ? "text-olq-gold" : "text-red-500"
                      )}>
                        {selfAssessment[olq]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs font-display transition-all",
              step === 0
                ? "opacity-0 cursor-default"
                : "text-gray-400 hover:text-white border border-olq-border hover:border-olq-gold/30"
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs font-display transition-all",
                canProceed()
                  ? "bg-olq-olive text-white border border-olq-gold/20 hover:border-olq-gold/50 shadow-[0_0_20px_rgba(61,68,30,0.3)]"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              )}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-olq-gold text-olq-bg font-bold uppercase tracking-widest text-xs font-display shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:shadow-[0_0_40px_rgba(197,160,89,0.6)] transition-all"
            >
              {isSaving ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Launch Command Center
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
