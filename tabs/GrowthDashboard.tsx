import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { TrendingUp, Activity, Brain, Shield, Crosshair, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { cn } from '../utils';

// Mock History Data
const mockHistory = [
  { date: 'Mar 01', score: 4.2, realism: 5.5, protocol: 'WAT' },
  { date: 'Mar 05', score: 5.1, realism: 6.0, protocol: 'SRT' },
  { date: 'Mar 10', score: 5.8, realism: 6.5, protocol: 'TAT' },
  { date: 'Mar 15', score: 6.5, realism: 7.2, protocol: 'WAT' },
  { date: 'Mar 20', score: 7.1, realism: 7.8, protocol: 'SRT' },
  { date: 'Mar 25', score: 7.9, realism: 8.5, protocol: 'TAT' },
  { date: 'Mar 30', score: 8.4, realism: 8.9, protocol: 'WAT' },
];

const olqStrengthData = [
  { name: 'Reasoning', score: 85 },
  { name: 'Responsibility', score: 90 },
  { name: 'Confidence', score: 70 },
  { name: 'Adaptability', score: 65 },
  { name: 'Initiative', score: 80 },
];

export default function GrowthDashboard() {
  const currentProbability = useMemo(() => {
    const latestScore = mockHistory[mockHistory.length - 1].score;
    const probability = (latestScore / 10) * 100 * 0.95; // Custom weighting
    return Math.min(Math.round(probability), 99);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-12 w-full">
      
      {/* Header Widget */}
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-olq-green/5 blur-[100px] pointer-events-none" />
        
        <div className="z-10 w-full md:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-widest font-display flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-olq-green" />
            Selection Intelligence
          </h2>
          <p className="text-sm text-gray-400">Comprehensive analysis of your SSB readiness trajectory.</p>
        </div>

        <div className="bg-olq-bg/80 border border-olq-green/20 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(132,141,98,0.1)] w-full md:w-auto relative z-10 shrink-0">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-display mb-2">Predicted Probability</p>
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl sm:text-6xl font-bold font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{currentProbability}</span>
            <span className="text-2xl font-mono text-olq-green mb-1">%</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0">
        
        {/* Readiness Trend Chart */}
        <div className="lg:col-span-2 bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm min-w-0">
          <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Historical Readiness Curve
          </h3>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#555" tick={{ fill: '#777', fontSize: 10 }} tickMargin={10} axisLine={false} />
                <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0c0e0c', borderColor: '#1f221c', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#C5A059', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#aaa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="score" name="Readiness Score" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#C5A059', stroke: '#0c0e0c', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="realism" name="Realism Index" stroke="#848D62" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-olq-gold" /> Readiness Score
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-olq-green" /> Realism Index
            </div>
          </div>
        </div>

        {/* OLQ Radar / Bar */}
        <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm min-w-0">
          <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-6 flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Core Competencies
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={olqStrengthData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#aaa', fontSize: 10 }} width={90} />
                <RechartsTooltip cursor={{ fill: '#1f221c' }} contentStyle={{ backgroundColor: '#0c0e0c', borderColor: '#1f221c', borderRadius: '8px' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                  {olqStrengthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 75 ? '#848D62' : entry.score > 65 ? '#C5A059' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-6 italic">Derived from the last 15 active attempts.</p>
        </div>

      </div>

      {/* AI Behavioral Insights (Warnings & Recommendations) */}
      <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display flex items-center gap-2 pl-2">
        <Brain className="w-4 h-4" />
        AI Behavioral Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h4 className="text-[11px] font-bold text-red-500 uppercase tracking-widest font-display">Pattern Warnings</h4>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Hesitant Decision Making (SRT)</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Your reaction times and action plans in crisis scenarios are consistently convoluted. Simplify your approach to take direct responsibility.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Artificial Themes (TAT)</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Last 3 stories depicted unrealistic superhuman success. Ground your characters in practical reality.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-olq-green/5 border border-olq-green/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-olq-green/10 flex items-center justify-center border border-olq-green/20">
              <Lightbulb className="w-4 h-4 text-olq-green" />
            </div>
            <h4 className="text-[11px] font-bold text-olq-green uppercase tracking-widest font-display">Targeted Solutions</h4>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-olq-green mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Practice Time-Bound SRTs</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Limit yourself to exactly 15 seconds per situation response to eliminate overthinking.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-olq-green mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Focus on Everyday Realism</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">When observing a TAT image, assign standard civilian or student roles rather than immediate combat scenarios.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
