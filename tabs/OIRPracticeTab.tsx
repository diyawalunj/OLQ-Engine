import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Clock, Check, X, Target, Zap, ChevronRight, RotateCcw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { getRandomQuestions, OIRQuestion } from '../data/oirQuestions';

type TestState = 'setup' | 'active' | 'review';

export default function OIRPracticeTab() {
  const [testState, setTestState] = useState<TestState>('setup');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [questionCount, setQuestionCount] = useState(15);
  const [questions, setQuestions] = useState<OIRQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timePerQuestion] = useState(30); // seconds per question

  const startTest = () => {
    const qs = getRandomQuestions(questionCount, difficulty);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIdx(0);
    setTimeLeft(timePerQuestion);
    setTestState('active');
  };

  useEffect(() => {
    if (testState !== 'active') return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(timePerQuestion);
    } else {
      setTestState('review');
    }
  };

  const score = useMemo(() => {
    if (questions.length === 0) return { correct: 0, total: 0, pct: 0 };
    const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
    return { correct, total: questions.length, pct: Math.round((correct / questions.length) * 100) };
  }, [answers, questions, testState]);

  const resetTest = () => {
    setTestState('setup');
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AnimatePresence mode="wait">
        {/* SETUP */}
        {testState === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 bg-olq-gold/10 rounded-xl flex items-center justify-center border border-olq-gold/20">
                  <Brain className="text-olq-gold w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">OIR Test</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Officer Intelligence Rating</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Difficulty Level</label>
                  <div className="flex gap-3">
                    {([1, 2, 3] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          "flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border",
                          difficulty === d
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold shadow-[0_0_10px_rgba(197,160,89,0.2)]"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Questions</label>
                  <div className="flex gap-3">
                    {[10, 15, 25].map((c) => (
                      <button
                        key={c}
                        onClick={() => setQuestionCount(c)}
                        className={cn(
                          "flex-1 py-3 rounded-lg text-xs font-bold tracking-widest transition-all border font-mono",
                          questionCount === c
                            ? "bg-olq-gold/10 border-olq-gold/40 text-olq-gold"
                            : "bg-olq-bg border-olq-border text-gray-400 hover:border-olq-gold/20"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startTest}
                className="mt-8 w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-sm bg-olq-olive text-white border border-olq-gold/20 hover:border-olq-gold/50 transition-all shadow-[0_0_20px_rgba(61,68,30,0.3)] flex items-center justify-center gap-3 font-display"
              >
                <Zap className="w-4 h-4" /> Begin OIR Test
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE TEST */}
        {testState === 'active' && questions.length > 0 && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">
                  Q {currentIdx + 1} / {questions.length}
                </span>
                <span className="text-[9px] font-bold text-olq-gold/60 uppercase tracking-widest px-2 py-1 bg-olq-gold/10 rounded border border-olq-gold/20">{questions[currentIdx].subtype}</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                timeLeft <= 5 ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-olq-bg border-olq-border text-olq-gold"
              )}>
                <Clock className="w-4 h-4" />
                <span className="text-lg font-mono font-bold">{timeLeft}s</span>
              </div>
            </div>

            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-olq-gold transition-all duration-300" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
            </div>

            {/* Question Card */}
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <p className="text-lg sm:text-xl text-white font-medium leading-relaxed mb-8">
                    {questions[currentIdx].question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {questions[currentIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "px-5 py-4 rounded-lg text-left text-sm transition-all border group",
                          answers[currentIdx] === idx
                            ? "bg-olq-gold/10 border-olq-gold/50 text-white shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                            : "bg-olq-bg border-olq-border text-gray-300 hover:border-olq-gold/30 hover:bg-olq-bg/80"
                        )}
                      >
                        <span className={cn(
                          "inline-block w-6 h-6 rounded text-center text-xs font-bold leading-6 mr-3 transition-all",
                          answers[currentIdx] === idx ? "bg-olq-gold text-olq-bg" : "bg-olq-card text-gray-500 group-hover:text-olq-gold"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest text-xs border border-olq-gold/20 hover:border-olq-gold/50 transition-all flex items-center justify-center gap-2 font-display"
            >
              {currentIdx < questions.length - 1 ? <><span>Next</span> <ChevronRight className="w-4 h-4" /></> : <><span>Submit Test</span> <Check className="w-4 h-4" /></>}
            </button>
          </motion.div>
        )}

        {/* REVIEW */}
        {testState === 'review' && (
          <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Score Card */}
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-sm font-bold text-olq-gold uppercase tracking-[0.3em] font-display mb-6">OIR Assessment Complete</h2>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className="text-6xl font-bold font-mono text-white">{score.pct}</span>
                  <span className="text-2xl font-mono text-gray-500 mb-1">%</span>
                </div>
                <p className="text-sm text-gray-400">{score.correct} correct out of {score.total} questions</p>
                <p className={cn(
                  "text-sm font-bold uppercase tracking-widest mt-3 font-display",
                  score.pct >= 80 ? "text-olq-green" : score.pct >= 60 ? "text-olq-gold" : "text-red-500"
                )}>
                  {score.pct >= 80 ? 'Outstanding Performance' : score.pct >= 60 ? 'Good Potential' : 'Needs Improvement'}
                </p>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-olq-gold uppercase tracking-[0.2em] font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Detailed Review
              </h3>
              {questions.map((q, idx) => {
                const isCorrect = answers[idx] === q.correctIndex;
                return (
                  <div key={idx} className={cn(
                    "bg-olq-card border rounded-xl p-5 transition-all",
                    isCorrect ? "border-olq-green/30" : "border-red-500/30"
                  )}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5",
                        isCorrect ? "bg-olq-green/20 text-olq-green" : "bg-red-500/20 text-red-500"
                      )}>
                        {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white mb-1">{q.question}</p>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span className="text-gray-500 uppercase tracking-widest">{q.subtype}</span>
                          <span className="text-gray-600">•</span>
                          <span className={cn(
                            "uppercase tracking-widest",
                            q.difficulty === 1 ? "text-blue-400" : q.difficulty === 2 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {q.difficulty === 1 ? 'Easy' : q.difficulty === 2 ? 'Medium' : 'Hard'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isCorrect && (
                      <div className="ml-9 mt-2 text-xs text-gray-400 bg-olq-bg/50 rounded-lg p-3 border border-olq-border">
                        <span className="text-olq-gold font-bold">Correct: </span>{q.options[q.correctIndex]}
                        <p className="mt-1 text-gray-500 italic">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={resetTest}
              className="w-full py-3 rounded-lg border border-olq-border text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-olq-card hover:text-white transition-all flex items-center justify-center gap-2 font-display"
            >
              <RotateCcw className="w-4 h-4" /> Take Another Test
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
