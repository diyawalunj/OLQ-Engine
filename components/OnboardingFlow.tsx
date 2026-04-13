import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, GraduationCap, MapPin, Clock, AlertTriangle, Users } from 'lucide-react';
import { useOnboardingStore, UserProfile, ENTRY_TYPES, SSB_STAGES, EDUCATION_LEVELS, STRUGGLE_AREAS, DAILY_HOURS_OPTIONS } from '../stores/onboardingStore';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils';

export default function OnboardingFlow() {
  const { user } = useAuthStore();
  const { saveProfile } = useOnboardingStore();

  const [step, setStep] = useState(0);
  const [entryTypes, setEntryTypes] = useState<string[]>([]);
  const [ssbStage, setSsbStage] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [education, setEducation] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [isNCC, setIsNCC] = useState<boolean | null>(null);
  const [struggleAreas, setStruggleAreas] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 6;

  const toggleEntry = (entry: string) => {
    setEntryTypes(prev => prev.includes(entry) ? prev.filter(e => e !== entry) : [...prev, entry]);
  };

  const toggleStruggle = (area: string) => {
    setStruggleAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return entryTypes.length > 0;
      case 1: return ssbStage !== '';
      case 2: return age !== '' && city !== '';
      case 3: return education !== '';
      case 4: return isNCC !== null;
      case 5: return struggleAreas.length > 0 && dailyHours !== '';
      default: return false;
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSaving(true);

    const profile: UserProfile = {
      entryTypes,
      ssbStage,
      age,
      city,
      education,
      collegeName,
      passoutYear,
      isNCC: isNCC ?? false,
      struggleAreas,
      dailyHours,
      selfAssessment: {},
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };

    await saveProfile(user.uid, profile);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-olq-bg flex items-center justify-center p-4 selection:bg-olq-gold/30">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] font-bold text-olq-gold/60 uppercase tracking-[0.3em] font-display">SSB Command Center</p>
          <h1 className="text-lg font-bold text-white uppercase tracking-wider font-display mt-1">Personal Information Questionnaire</h1>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={cn(
                  "h-full rounded-full",
                  i < step ? "bg-olq-gold" : i === step ? "bg-olq-gold/60" : "bg-gray-800"
                )}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-600 mb-6 font-mono">Step {step + 1} of {totalSteps}</p>

        <AnimatePresence mode="wait">
          {/* Step 0: Entry Type Selection (Multi-select) */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20 shadow-[0_0_30px_rgba(61,68,30,0.5)]">
                  <Shield className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Select Your Entry</h2>
                <p className="text-xs text-gray-400">Choose all applicable SSB entry pathways. <span className="text-olq-gold/60">(Multiple select)</span></p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ENTRY_TYPES.map((entry) => (
                  <button
                    key={entry}
                    onClick={() => toggleEntry(entry)}
                    className={cn(
                      "px-4 py-4 rounded-xl border text-center transition-all duration-200",
                      entryTypes.includes(entry)
                        ? "bg-olq-gold/10 border-olq-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                        : "bg-olq-card border-olq-border hover:border-olq-gold/30"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className={cn("text-sm font-bold font-display tracking-wider", entryTypes.includes(entry) ? "text-olq-gold" : "text-white")}>{entry}</span>
                      {entryTypes.includes(entry) && <CheckCircle2 className="w-4 h-4 text-olq-gold" />}
                    </div>
                  </button>
                ))}
              </div>
              {entryTypes.length > 0 && (
                <p className="text-center text-[10px] text-olq-gold/60 font-mono">{entryTypes.length} selected</p>
              )}
            </motion.div>
          )}

          {/* Step 1: SSB Stage */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <Users className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">SSB Preparation Stage</h2>
                <p className="text-xs text-gray-400">What stage are you at in SSB preparation?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SSB_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setSsbStage(stage.id)}
                    className={cn(
                      "px-5 py-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3",
                      ssbStage === stage.id
                        ? "bg-olq-gold/10 border-olq-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                        : "bg-olq-card border-olq-border hover:border-olq-gold/30"
                    )}
                  >
                    {ssbStage === stage.id ? <CheckCircle2 className="w-4 h-4 text-olq-gold shrink-0" /> : <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />}
                    <span className={cn("text-sm font-bold", ssbStage === stage.id ? "text-olq-gold" : "text-white")}>{stage.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Info (Age + City) */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <MapPin className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Personal Details</h2>
                <p className="text-xs text-gray-400">Basic information for your PIQ profile.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block font-display">Age *</label>
                  <input
                    type="number"
                    min="14"
                    max="40"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block font-display">City of Residence *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <GraduationCap className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Education</h2>
                <p className="text-xs text-gray-400">Your academic background.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Highest Level of Education *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {EDUCATION_LEVELS.map((edu) => (
                      <button
                        key={edu}
                        onClick={() => setEducation(edu)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-bold transition-all border",
                          education === edu
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {edu}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block font-display">College / School Name <span className="text-gray-700">(Optional)</span></label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Enter your institution name"
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block font-display">Passout Year <span className="text-gray-700">(Optional)</span></label>
                  <input
                    type="number"
                    min="2000"
                    max="2035"
                    value={passoutYear}
                    onChange={(e) => setPassoutYear(e.target.value)}
                    placeholder="e.g., 2025"
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: NCC */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <Shield className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">NCC Background</h2>
                <p className="text-xs text-gray-400">Are you part of NCC (National Cadet Corps)?</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => setIsNCC(true)}
                  className={cn(
                    "py-6 rounded-xl border text-center transition-all duration-200",
                    isNCC === true
                      ? "bg-olq-green/10 border-olq-green/50 shadow-[0_0_20px_rgba(132,141,98,0.2)]"
                      : "bg-olq-card border-olq-border hover:border-olq-green/30"
                  )}
                >
                  <span className={cn("text-xl font-bold font-display", isNCC === true ? "text-olq-green" : "text-white")}>Yes</span>
                </button>
                <button
                  onClick={() => setIsNCC(false)}
                  className={cn(
                    "py-6 rounded-xl border text-center transition-all duration-200",
                    isNCC === false
                      ? "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                      : "bg-olq-card border-olq-border hover:border-red-500/30"
                  )}
                >
                  <span className={cn("text-xl font-bold font-display", isNCC === false ? "text-red-400" : "text-white")}>No</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Struggle Areas + Daily Hours */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-olq-olive/50 rounded-xl mx-auto flex items-center justify-center border border-olq-gold/20">
                  <AlertTriangle className="text-olq-gold w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Your Challenges</h2>
                <p className="text-xs text-gray-400">Help us understand your focus areas.</p>
              </div>

              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Which area do you struggle with the most? * <span className="text-olq-gold/60">(Multiple select)</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {STRUGGLE_AREAS.map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleStruggle(area)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border text-left flex items-center gap-2",
                          struggleAreas.includes(area)
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {struggleAreas.includes(area) ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <div className="w-3 h-3 rounded border border-gray-600 shrink-0" />}
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">How many hours can you dedicate daily? *</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {DAILY_HOURS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setDailyHours(opt)}
                        className={cn(
                          "px-3 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border text-center",
                          dailyHours === opt
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
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
