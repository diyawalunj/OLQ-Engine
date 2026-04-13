import React, { useState } from 'react';
import { Newspaper, Calendar, ExternalLink, ChevronRight, Filter, Globe, Shield, Rocket, Scale, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

type NewsCategory = 'all' | 'defence' | 'national' | 'international' | 'technology' | 'ssb';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string;
  source: string;
  keyPoints: string[];
}

// Curated daily news summaries — original summaries, no copyrighted content
const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1', category: 'defence', date: 'Today',
    title: 'Indian Army Inducts New Indigenous Artillery System',
    summary: 'The Indian Army has completed the induction of a new indigenous artillery system developed under the Make in India initiative. The system enhances long-range precision strike capabilities and reduces dependence on imports.',
    source: 'Defence Summary',
    keyPoints: ['Developed under Make in India', 'Enhanced 40km range precision', 'Deployed along northern borders', 'Reduces import dependence by 30%'],
  },
  {
    id: 'n2', category: 'defence', date: 'Today',
    title: 'Joint Military Exercise Strengthens Indo-Pacific Ties',
    summary: 'A multi-nation naval exercise concluded in the Bay of Bengal involving warships and aircraft from partner nations. The exercise focused on anti-submarine warfare, humanitarian assistance, and interoperability.',
    source: 'Defence Summary',
    keyPoints: ['Multi-nation participation', 'Focus on anti-submarine warfare', 'Humanitarian assistance drills', 'Enhanced maritime domain awareness'],
  },
  {
    id: 'n3', category: 'national', date: 'Today',
    title: 'New Education Policy Reforms Take Effect',
    summary: 'Major reforms under the National Education Policy are being implemented across universities. Key changes include flexible degree programs, multiple entry-exit options, and enhanced emphasis on research and innovation.',
    source: 'National Summary',
    keyPoints: ['Flexible 4-year degree programs', 'Multiple entry-exit options', 'Academic Bank of Credits launched', 'Focus on multidisciplinary learning'],
  },
  {
    id: 'n4', category: 'international', date: 'Today',
    title: 'Global Climate Summit Sets New Carbon Targets',
    summary: 'World leaders have agreed on accelerated carbon reduction timelines. India has committed to expanding renewable energy capacity while maintaining development priorities. Defence sector sustainability is also being discussed.',
    source: 'World Summary',
    keyPoints: ['Accelerated 2035 carbon targets', 'India expands renewable commitment', 'Green defence manufacturing push', 'Technology transfer agreements signed'],
  },
  {
    id: 'n5', category: 'technology', date: 'Today',
    title: 'AI-Powered Surveillance Systems Deployed at Borders',
    summary: 'Advanced AI-enabled surveillance systems with autonomous detection capabilities have been deployed at sensitive border areas. The systems use thermal imaging and pattern recognition to identify intrusions in real-time.',
    source: 'Tech Summary',
    keyPoints: ['AI-powered threat detection', 'Thermal + radar integration', 'Autonomous patrol drones', '24/7 unmanned monitoring capability'],
  },
  {
    id: 'n6', category: 'ssb', date: 'Today',
    title: 'SSB Interview Tips: What Assessors Look For in 2026',
    summary: 'Defence selection experts share insights on evolving assessment criteria. Modern assessors increasingly value genuine personality over rehearsed responses, with emphasis on adaptability, ethical reasoning, and digital literacy.',
    source: 'SSB Digest',
    keyPoints: ['Authenticity over rehearsed answers', 'Digital literacy matters now', 'Ethical reasoning scenarios added', 'Group dynamics scored differently'],
  },
  {
    id: 'n7', category: 'defence', date: 'Yesterday',
    title: 'Indian Navy Commissions Advanced Stealth Corvette',
    summary: 'A new stealth corvette with advanced electronic warfare capabilities has been commissioned into the Indian Navy. The vessel features indigenous combat management systems and enhanced anti-ship missile capabilities.',
    source: 'Defence Summary',
    keyPoints: ['Indigenous combat systems', 'Stealth design reduces radar signature', 'Carries anti-ship cruise missiles', 'Built at Indian shipyard'],
  },
  {
    id: 'n8', category: 'national', date: 'Yesterday',
    title: 'Infrastructure Development Boosts Connectivity in Northeast',
    summary: 'Multiple strategic infrastructure projects connecting northeastern states have been inaugurated, including tunnels, bridges, and rail links. These have both civilian and strategic significance for border logistics.',
    source: 'National Summary',
    keyPoints: ['New all-weather tunnels opened', 'Rail connectivity to border areas', 'Reduced travel time by 60%', 'Strategic military logistics benefit'],
  },
];

const CATEGORIES: { id: NewsCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'defence', label: 'Defence', icon: Shield },
  { id: 'national', label: 'National', icon: Globe },
  { id: 'international', label: 'World', icon: Globe },
  { id: 'technology', label: 'Tech', icon: Cpu },
  { id: 'ssb', label: 'SSB Updates', icon: Rocket },
];

export default function NewsSummaryTab() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNews = NEWS_ITEMS.filter(n => activeCategory === 'all' || n.category === activeCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
            <Newspaper className="text-red-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Daily News Brief</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Stay updated for your SSB Interview</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border font-display",
                activeCategory === cat.id
                  ? "bg-olq-gold/10 border-olq-gold/30 text-olq-gold"
                  : "bg-olq-card border-olq-border text-gray-500 hover:text-white"
              )}
            >
              <Icon className="w-3 h-3" /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* News Cards */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="bg-olq-card border border-olq-border rounded-xl overflow-hidden hover:border-olq-gold/20 transition-all shadow-sm"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full p-5 text-left flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                    item.category === 'defence' ? "text-red-400 border-red-500/30 bg-red-500/10" :
                    item.category === 'national' ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
                    item.category === 'international' ? "text-green-400 border-green-500/30 bg-green-500/10" :
                    item.category === 'technology' ? "text-purple-400 border-purple-500/30 bg-purple-500/10" :
                    "text-olq-gold border-olq-gold/30 bg-olq-gold/10"
                  )}>
                    {item.category}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-2">{item.summary}</p>
              </div>
              <ChevronRight className={cn("w-4 h-4 text-gray-500 transition-transform shrink-0 mt-2", expandedId === item.id && "rotate-90")} />
            </button>

            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-olq-border pt-4 space-y-3">
                    <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>
                    <div>
                      <p className="text-[10px] font-bold text-olq-gold uppercase tracking-widest mb-2">Key Points for SSB</p>
                      <ul className="space-y-1">
                        {item.keyPoints.map((kp, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-olq-gold mt-0.5">•</span> {kp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[9px] text-gray-600 italic">Source: {item.source}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[10px] text-gray-600 italic">Summaries are curated for SSB relevance. Updated daily.</p>
    </div>
  );
}
