import React, { useState } from 'react';
import { BookOpen, Search, Shield, FileText, Globe, Brain, ChevronRight, Star, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

type Category = 'all' | 'ssb_process' | 'olq_guide' | 'model_answers' | 'defence_knowledge' | 'current_affairs';

interface KBArticle {
  id: string;
  title: string;
  category: Category;
  summary: string;
  content: string;
  readTime: string;
  tags: string[];
}

const ARTICLES: KBArticle[] = [
  {
    id: '1', category: 'ssb_process', title: 'Complete SSB Interview Process — 5-Day Breakdown',
    summary: 'A detailed walkthrough of what happens each day at the Services Selection Board.',
    readTime: '8 min',
    tags: ['SSB', 'Process', 'Overview'],
    content: `**Day 1 — Screening Test**\nThe first day involves Officer Intelligence Rating (OIR) tests and Picture Perception & Discussion Test (PPDT). Around 50-60% of candidates are screened out on Day 1.\n\n**Day 2 — Psychological Tests**\nThis includes Thematic Apperception Test (TAT), Word Association Test (WAT), Situation Reaction Test (SRT), and Self Description Test (SDT). These tests reveal your subconscious personality traits.\n\n**Day 3 — Group Testing Officer (GTO) Tasks - Part 1**\nGroup Discussion, Group Planning Exercise, Progressive Group Tasks, and Half Group Tasks. Your teamwork, leadership, and initiative are observed.\n\n**Day 4 — GTO Tasks Part 2 + Interview**\nIndividual obstacles, lecturette, command task, and final group task. Personal interview with the Interviewing Officer covering PIQ-based and general questions.\n\n**Day 5 — Conference**\nThe President, Deputy President, GTO, IO, and Psychologist discuss each candidate's performance. Final recommendations are made.`
  },
  {
    id: '2', category: 'olq_guide', title: 'The 15 OLQs — What SSB Really Looks For',
    summary: 'Understand the 15 Officer Like Qualities that SSB assessors evaluate.',
    readTime: '10 min',
    tags: ['OLQ', 'Assessment', 'Qualities'],
    content: `The SSB evaluates candidates on 15 Officer Like Qualities grouped into 4 clusters:\n\n**Planning & Organizing**\n1. Effective Intelligence — Ability to understand, apply, and adapt\n2. Reasoning Ability — Logical and analytical thinking\n3. Organising Ability — Planning, prioritizing, and executing\n\n**Social Adjustment**\n4. Social Adaptability — Getting along with diverse people\n5. Cooperation — Working in teams\n6. Sense of Responsibility — Dependability and duty\n\n**Social Effectiveness**\n7. Initiative — Taking action proactively\n8. Self Confidence — Belief in one's abilities\n9. Speed of Decision — Timely and correct decisions\n10. Ability to Influence Group — Leadership impact\n11. Liveliness — Energy, enthusiasm, optimism\n\n**Dynamic Qualities**\n12. Determination — Persistence despite obstacles\n13. Courage — Physical and moral bravery\n14. Stamina — Physical and mental endurance\n15. Power of Expression — Clear, effective communication`
  },
  {
    id: '3', category: 'model_answers', title: 'WAT Best Practices — Writing Effective Responses',
    summary: 'Learn the correct approach to the Word Association Test with examples.',
    readTime: '5 min',
    tags: ['WAT', 'Tips', 'Examples'],
    content: `**Do's:**\n- Write the first natural thought that comes to mind\n- Keep sentences positive and action-oriented\n- Show initiative, responsibility, and problem-solving\n- Be genuine — don't write memorized "ideal" answers\n\n**Don'ts:**\n- Don't write negative or passive sentences\n- Don't overthink — authenticity matters more than perfection\n- Don't repeat sentence structures\n\n**Examples:**\nWord: FAILURE\n❌ Bad: "Failure is bad and should be avoided"\n✅ Good: "He analyzed his failure and worked twice as hard"\n\nWord: DANGER\n❌ Bad: "Danger is everywhere in life"\n✅ Good: "He assessed the danger calmly and evacuated civilians first"`
  },
  {
    id: '4', category: 'model_answers', title: 'SRT — How to Write Officer-Quality Responses',
    summary: 'Structured approach to Situation Reaction Test with scoring criteria.',
    readTime: '6 min',
    tags: ['SRT', 'Tips', 'Examples'],
    content: `**The Ideal SRT Response Formula:**\n1. Assess the situation quickly\n2. Take immediate necessary action\n3. Involve relevant authorities/help\n4. Ensure long-term resolution\n\n**Key Principles:**\n- Show initiative (don't wait for orders)\n- Take responsibility\n- Be practical and realistic\n- Consider safety of others\n- Demonstrate leadership\n\n**Example:**\nSituation: "While on a train, you notice smoke coming from the next compartment."\n\nResponse: "I immediately pulled the chain, alerted passengers to evacuate calmly, used the fire extinguisher to control the fire, informed the guard, and ensured first aid for any affected passengers."`
  },
  {
    id: '5', category: 'defence_knowledge', title: 'Indian Armed Forces — Structure & Commands',
    summary: 'Basic knowledge of Indian Army, Navy, and Air Force structure every candidate should know.',
    readTime: '7 min',
    tags: ['Defence', 'Armed Forces', 'Structure'],
    content: `**Indian Army Commands:**\n- Northern Command (Udhampur)\n- Western Command (Chandimandir)\n- South Western Command (Jaipur)\n- Southern Command (Pune)\n- Eastern Command (Kolkata)\n- Central Command (Lucknow)\n- Army Training Command (Shimla)\n\n**Indian Navy Commands:**\n- Western Naval Command (Mumbai)\n- Eastern Naval Command (Visakhapatnam)\n- Southern Naval Command (Kochi)\n\n**Indian Air Force Commands:**\n- Western Air Command (New Delhi)\n- Eastern Air Command (Shillong)\n- Central Air Command (Prayagraj)\n- South Western Air Command (Gandhinagar)\n- Southern Air Command (Thiruvananthapuram)\n- Training Command (Bengaluru)\n- Maintenance Command (Nagpur)\n\n**Chief of Defence Staff (CDS):** Heads the Department of Military Affairs\n**COAS, CNS, CAS:** Chiefs of Army, Naval, and Air Staff respectively`
  },
  {
    id: '6', category: 'current_affairs', title: 'Key Defence Updates — What to Know for SSB',
    summary: 'Recent defence developments, exercises, and achievements relevant to SSB interviews.',
    readTime: '5 min',
    tags: ['Current Affairs', 'Defence Updates'],
    content: `**Key Areas to Cover:**\n\n1. **Recent Military Exercises** — Know names and participating countries of recent joint exercises (e.g., Malabar, Yudh Abhyas, Tarang Shakti)\n\n2. **Indigenous Defence Production** — Tejas Mk2, INS Vikrant, Arjun Mk1A, BrahMos variants\n\n3. **Border Security** — LAC/LOC developments, infrastructure projects\n\n4. **Space & Cyber** — DRDO achievements, Defence Space Agency updates\n\n5. **Operational Achievements** — Recent rescue operations, disaster relief, peacekeeping missions\n\n**Pro Tip:** Keep a daily 15-minute news reading habit focused on defence publications like Indian Defence Review, Raksha Anirveda, and PIB Defence updates.`
  },
];

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'ssb_process', label: 'SSB Process', icon: Shield },
  { id: 'olq_guide', label: 'OLQ Guide', icon: Brain },
  { id: 'model_answers', label: 'Model Answers', icon: FileText },
  { id: 'defence_knowledge', label: 'Defence Knowledge', icon: Star },
  { id: 'current_affairs', label: 'Current Affairs', icon: Globe },
];

export default function KnowledgeTab() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles = ARTICLES.filter(a => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <BookOpen className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">Knowledge Hub</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">SSB Preparation Library</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics, keywords..."
            className="w-full bg-olq-bg border border-olq-border rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-olq-gold/40 transition-colors placeholder:text-gray-700"
          />
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

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <motion.div
            key={article.id}
            layout
            className="bg-olq-card border border-olq-border rounded-xl overflow-hidden shadow-sm hover:border-olq-gold/20 transition-all"
          >
            <button
              onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
              className="w-full p-5 text-left flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white mb-1">{article.title}</h3>
                <p className="text-[11px] text-gray-400 mb-2">{article.summary}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="text-[8px] font-bold text-olq-gold/50 uppercase tracking-widest bg-olq-gold/5 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                  <span className="text-[9px] text-gray-600 font-mono ml-2">{article.readTime} read</span>
                </div>
              </div>
              <ChevronRight className={cn("w-4 h-4 text-gray-500 transition-transform shrink-0 mt-1", expandedArticle === article.id && "rotate-90")} />
            </button>

            <AnimatePresence>
              {expandedArticle === article.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-olq-border pt-4">
                    <div className="prose prose-sm prose-invert max-w-none">
                      {article.content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={i} className="text-sm font-bold text-olq-gold mt-4 mb-2 font-display uppercase tracking-wider">{line.replace(/\*\*/g, '')}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={i} className="text-xs text-gray-300 ml-4 mb-1 list-disc">{line.substring(2)}</li>;
                        }
                        if (line.startsWith('❌') || line.startsWith('✅')) {
                          return <p key={i} className="text-xs text-gray-300 ml-4 mb-1 font-mono">{line}</p>;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="text-xs text-gray-300 leading-relaxed mb-2">{line.replace(/\*\*/g, '')}</p>;
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-sm text-gray-500 uppercase tracking-widest font-display">No articles found</p>
          </div>
        )}
      </div>
    </div>
  );
}
