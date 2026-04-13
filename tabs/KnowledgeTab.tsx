import React, { useState } from 'react';
import { BookOpen, Search, Shield, FileText, Globe, Brain, ChevronRight, Star, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

type Category = 'all' | 'ssb_process' | 'olq_guide' | 'model_answers' | 'defence_knowledge' | 'current_affairs' | 'self_improvement';

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
  // ---- SELF-IMPROVEMENT ARTICLES (Original content) ----
  {
    id: '7', category: 'self_improvement', title: 'How to Improve Your English for SSB — A Practical Guide',
    summary: 'Actionable strategies to strengthen your English vocabulary, grammar, and fluency for SSB communication.',
    readTime: '7 min',
    tags: ['English', 'Vocabulary', 'Fluency'],
    content: `**Why English Matters at SSB**\nWhile SSB tests personality — not English — clear communication in English gives you an edge in Group Discussions, Lecturettes, and Interviews. Assessors notice fluency, clarity, and confidence.\n\n**Daily Habits That Work**\n- Read one English editorial daily (any major newspaper). Note 5 new words and use them in sentences.\n- Listen to English podcasts or news for 15 minutes — this trains your ear and improves natural phrasing.\n- Write a short paragraph daily on any topic (100-150 words). Focus on clear, simple sentences over complex vocabulary.\n\n**Vocabulary Building Strategy**\n- Learn words in context, not from word lists. When you encounter a new word, write down the full sentence.\n- Focus on words useful for SSB: leadership, initiative, strategic, coordination, resilience, adaptability, etc.\n- Use the "Use it 3 times" rule: use each new word 3 times in conversation within 24 hours to retain it.\n\n**Grammar Essentials**\n- Master subject-verb agreement, tense consistency, and article usage first — these are the most common errors.\n- Practice converting passive sentences to active voice. Officers speak in active voice: "I organized" not "It was organized by me."\n\n**Speaking Practice**\n- Read aloud for 10 minutes daily. This builds mouth muscle memory for English sounds.\n- Record yourself speaking on random topics for 2 minutes. Listen back and note filler words (um, like, basically).\n- Think in English. Narrate your daily activities mentally in English.\n\n**Common Mistakes to Avoid**\n- Don't translate from your mother tongue — it creates unnatural sentence structures.\n- Don't use unnecessarily complex words to "impress." Clear and simple wins over complicated and confused.\n- Don't be afraid of making mistakes while speaking. Confidence with minor errors beats silence.`
  },
  {
    id: '8', category: 'self_improvement', title: 'Building Unshakeable Communication Skills for SSB',
    summary: 'Master verbal and non-verbal communication techniques that SSB assessors look for in officer candidates.',
    readTime: '8 min',
    tags: ['Communication', 'Speaking', 'Body Language'],
    content: `**The Communication Triangle**\nEffective communication at SSB consists of three elements: Content (what you say), Delivery (how you say it), and Presence (how you carry yourself while saying it).\n\n**Content — What to Say**\n- Structure your thoughts using the PREP method: Point, Reason, Example, Point (restate).\n- In group discussions, always add value. Don't repeat what someone else said. Build on it or offer a new angle.\n- Keep statements concise. A powerful 2-sentence point beats a rambling 2-minute speech.\n\n**Delivery — How to Say It**\n- Speak at a moderate pace. Rushing signals nervousness; speaking too slowly signals low energy.\n- Modulate your voice. Vary your pitch, emphasize key words, and use strategic pauses.\n- Eliminate filler words: "um," "basically," "like," "actually." Replace them with a brief pause instead.\n- Project your voice. Speak from your diaphragm, not your throat. Everyone in the group should hear you without you shouting.\n\n**Presence — Non-Verbal Communication**\n- Maintain natural eye contact. In a group, rotate your gaze across all members. In an interview, maintain steady (not staring) eye contact.\n- Sit upright with shoulders back. Your posture signals confidence before you speak a word.\n- Use controlled hand gestures to emphasize points. Avoid fidgeting, crossing arms, or touching your face.\n- Smile naturally. A slight smile signals approachability and warmth.\n\n**Practice Exercises**\n- Mirror practice: Stand before a mirror and speak on any topic for 2 minutes. Watch your expressions, posture, and gestures.\n- Group practice: Form study groups and have impromptu discussion sessions on random topics.\n- News analysis: Pick a news headline and present a 1-minute analysis. Practice structuring thoughts quickly.\n\n**Listening — The Forgotten Skill**\n- Active listening is as important as speaking. Assessors notice candidates who build on others' points.\n- Don't plan your response while someone is speaking. Listen fully, then respond.\n- Acknowledge others' points before adding your own: "That's a valid point about X, and I'd like to add..."`
  },
  {
    id: '9', category: 'self_improvement', title: 'How to Build Genuine Confidence for SSB',
    summary: 'Practical techniques to develop lasting self-confidence that assessors can see in your behavior, not just your words.',
    readTime: '8 min',
    tags: ['Confidence', 'Self Improvement', 'Mindset'],
    content: `**Understanding Real Confidence**\nSSB assessors can distinguish between real confidence and fake bravado. Real confidence is quiet — it's visible in your calm decision-making, your willingness to admit you don't know something, and your composure under pressure.\n\n**Building Physical Confidence**\n- Exercise daily. Even 30 minutes of running, push-ups, or sports changes your posture and energy levels.\n- Maintain good hygiene and grooming. When you know you look presentable, you feel more confident.\n- Practice power postures. Standing tall with chest open for 2 minutes before stressful situations has measurable effects on your stress hormones.\n\n**Building Mental Confidence**\n- Set small daily goals and complete them. Each completed task builds evidence that you are capable.\n- Keep a "wins journal." Write down 3 things you did well each day, no matter how small.\n- Study and prepare thoroughly. Nothing builds confidence faster than knowing your material.\n- Visualize success. Before SSB, mentally rehearse yourself performing calmly and effectively.\n\n**Handling Self-Doubt**\n- Accept that nervousness is normal. Even experienced officers feel nervous. The difference is they act despite nerves.\n- Reframe negative self-talk: "I can't do this" becomes "I haven't mastered this yet, but I'm working on it."\n- Compare yourself to your past self, not others. Measure progress, not perfection.\n\n**Social Confidence**\n- Start conversations with strangers regularly. In a queue, at a shop, during travel. Each interaction reduces social anxiety.\n- Volunteer for leadership roles in any group setting — college projects, community events, sports teams.\n- Practice introducing yourself confidently. State your name clearly, make eye contact, and offer a firm handshake.\n\n**Confidence Killers to Avoid**\n- Don't memorize "ideal" responses. Assessors see through scripted answers immediately.\n- Don't try to dominate Group Discussions. Confident people don't need to talk the loudest.\n- Don't compare yourself to other candidates during SSB. Focus on being the best version of yourself.`
  },
  {
    id: '10', category: 'self_improvement', title: 'How to Speak Effectively in a Group — GD & GTO Tips',
    summary: 'Strategies for making impactful contributions in group discussions and GTO tasks without being aggressive.',
    readTime: '6 min',
    tags: ['Group Discussion', 'GTO', 'Leadership'],
    content: `**The Group Dynamics Mindset**\nSSB group tasks test whether you can work with a team, not whether you can dominate one. An officer leads by enabling the group, not by overpowering it.\n\n**Entry Strategies for Group Discussions**\n- If you want to initiate, prepare a clear opening statement. Don't ramble. State a clear position in 2 sentences.\n- If someone else initiates, listen carefully and add a new dimension. "Building on that point, I think we should also consider..."\n- Don't wait too long. After 3-4 people have spoken, enter with your perspective or you may be seen as passive.\n\n**Making Impactful Points**\n- Quality over quantity. 4 strong points beat 10 weak ones.\n- Use real-world examples to support arguments. "For instance, during the recent disaster relief operation, we saw how..."\n- Summarize periodically: "So far we've discussed X and Y. I think we should also explore Z." This shows organizing ability.\n\n**Handling Conflicts**\n- Disagree respectfully: "I see your perspective, but I'd like to offer an alternative view..."\n- Never get personal. Attack ideas, not individuals.\n- Be a mediator when two members clash. "Both points have merit. Let's find a middle ground."\n\n**GTO-Specific Group Speaking**\n- In Group Planning Exercise, present your plan clearly with a structured approach: problem identification, resource allocation, timeline.\n- In PGT/HGT, communicate your ideas for obstacle solutions verbally and clearly. "I suggest we use this plank as a bridge. Let me demonstrate."\n- Always include quieter members: "What do you think about this approach?" This shows social adaptability.\n\n**Body Language in Groups**\n- Face the group, not one person.\n- Lean slightly forward to show engagement.\n- Nod when others make good points — it shows you're listening.\n- Avoid side conversations or distracted looks.`
  },
  {
    id: '11', category: 'self_improvement', title: 'Time Management Mastery for SSB Preparation',
    summary: 'Organize your daily schedule effectively to cover all SSB components without burnout.',
    readTime: '5 min',
    tags: ['Time Management', 'Planning', 'Productivity'],
    content: `**The 3-Block System**\nDivide your day into three blocks and assign SSB preparation areas to each:\n- Morning Block (1 hour): Physical fitness + GK/current affairs reading\n- Afternoon Block (1-2 hours): Practice tests (OIR, WAT, SRT, TAT rotation)\n- Evening Block (1 hour): Self-improvement (communication practice, reading, reflection)\n\n**Weekly Focus Areas**\n- Monday/Thursday: Psychology tests (WAT, TAT, SRT, SDT)\n- Tuesday/Friday: GTO practice (Group planning, lecturette topics, GD)\n- Wednesday/Saturday: OIR + General knowledge\n- Sunday: Full mock test or self-assessment review\n\n**The 25-5 Technique**\nPractice in 25-minute focused sessions with 5-minute breaks. This matches the intense, timed nature of SSB tests and trains your concentration stamina.\n\n**Avoiding Burnout**\n- Take one complete rest day per week. Overtraining leads to mechanical, rehearsed responses.\n- Mix activities. Don't spend 3 hours on psychology tests alone. Variety keeps your brain sharp.\n- Sleep 7-8 hours. Your subconscious mind processes and consolidates learning during sleep.\n\n**Progress Tracking**\n- Review your scores weekly. Look for patterns — which test types are improving? Which are stagnant?\n- Focus 60% of practice time on weak areas, 40% on maintaining strengths.\n- Keep a preparation journal. Write down what you practiced, what went well, and what needs improvement.`
  },
  {
    id: '12', category: 'self_improvement', title: 'Physical Fitness Guide for SSB Aspirants',
    summary: 'A structured fitness routine to build stamina, endurance, and the physical confidence needed for SSB.',
    readTime: '6 min',
    tags: ['Fitness', 'Stamina', 'Physical Training'],
    content: `**Why Fitness Matters at SSB**\nPhysical fitness impacts your energy levels during the grueling 5-day SSB process. A fit candidate appears more energetic, alert, and confident. GTO outdoor tasks directly test physical capabilities.\n\n**Daily Minimum Routine (30 minutes)**\n- 5 min warm-up: Stretching and joint rotations\n- 10 min cardio: Running, skipping, or brisk walking\n- 10 min bodyweight strength: Push-ups (3x15), squats (3x20), planks (3x30 sec), burpees (3x10)\n- 5 min cool-down: Deep breathing and stretching\n\n**Building Running Stamina**\n- Week 1-2: Run 2 km at comfortable pace, daily\n- Week 3-4: Run 3 km, aim to complete in under 18 minutes\n- Week 5-8: Run 5 km, aim to complete in under 30 minutes\n- Do interval sprints once a week: 200m sprint, 200m walk, repeat 6 times\n\n**Obstacle Course Preparation**\n- Practice basic movements: jumping over waist-height objects, balancing on narrow surfaces, climbing\n- Upper body strength is crucial: pull-ups, rope climbing motion, hanging exercises\n- Core strength: side planks, leg raises, mountain climbers\n\n**Nutrition Basics**\n- Eat balanced meals with protein, complex carbs, and vegetables\n- Stay hydrated — drink at least 3 liters of water daily\n- Avoid heavy, oily food that makes you sluggish\n- During SSB week, eat light meals to stay mentally sharp\n\n**Mental Endurance Connection**\n- Physical training teaches you to push through discomfort — a quality assessors look for.\n- Group sports (cricket, football, basketball) build teamwork and competitiveness simultaneously.\n- Set fitness goals and track them. The discipline of physical training mirrors the discipline of an officer.`
  },
];

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'ssb_process', label: 'SSB Process', icon: Shield },
  { id: 'olq_guide', label: 'OLQ Guide', icon: Brain },
  { id: 'model_answers', label: 'Model Answers', icon: FileText },
  { id: 'self_improvement', label: 'Self Improvement', icon: Star },
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
