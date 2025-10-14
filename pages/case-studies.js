import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(null);

  const cases = [
    {
      id: 'sarah',
      name: 'Sarah Chen',
      handle: '@sarah_fitness',
      niche: 'Fitness & Wellness',
      avatar: '💪',
      timeline: '90 days',
      startPoint: {
        followers: 200,
        income: '$0',
        experience: 'Complete beginner, never made a TikTok'
      },
      endPoint: {
        followers: '15.2K',
        monthlyIncome: '$2,400',
        topVideo: '850K views'
      },
      breakdown: {
        week1: {
          action: 'Analyzed 10 fitness supplement videos using our tool',
          result: 'Found 3 proven formats (before-after, day-in-life, product review)'
        },
        week2: {
          action: 'Generated first 5 scripts, filmed with iPhone',
          result: '200 average views, learned what worked'
        },
        week3: {
          action: 'Posted "3-day protein powder test" video',
          result: '850K views, gained 3K followers overnight'
        },
        week4: {
          action: 'Added affiliate links, posted 7 more videos',
          result: 'First commission: $127'
        },
        month2: {
          action: 'Scaled to 5 videos/week, tested different products',
          result: '$680 in commissions'
        },
        month3: {
          action: 'Got first brand deal ($500), optimized top-performing formats',
          result: '$2,400 total (affiliates + brand deals)'
        }
      },
      strategy: {
        products: ['Protein powder', 'Resistance bands', 'Meal prep containers'],
        format: 'Authentic UGC style, 3-day test format',
        postingSchedule: '7am & 7pm daily',
        keyInsight: 'Show real results, not perfect body. Relatability > Production quality'
      },
      income: [
        { month: 'Month 1', amount: 127, source: 'Amazon Affiliates' },
        { month: 'Month 2', amount: 680, source: 'Affiliates' },
        { month: 'Month 3', amount: 2400, source: 'Affiliates + Brand Deals' }
      ],
      quote: "I was skeptical. I'm not a videographer, I'm a nurse. But the 7-day challenge broke it down so simply. By week 3 I had my first viral video. Now I'm making more than my part-time nursing shifts.",
      tools: ['TikTok Analyzer Pro', 'Amazon Associates', 'CapCut'],
      lessonsLearned: [
        'Consistency beats perfection',
        'Test 5+ products before scaling',
        'Engage in comments = more views',
        'Post at same times daily'
      ]
    },
    {
      id: 'mike',
      name: 'Mike Rodriguez',
      handle: '@mike_crypto',
      niche: 'Crypto Education',
      avatar: '🪙',
      timeline: '120 days',
      startPoint: {
        followers: 0,
        income: '$0',
        experience: 'Knew crypto, never made content'
      },
      endPoint: {
        followers: '28.5K',
        monthlyIncome: '$3,200',
        topVideo: '1.2M views'
      },
      breakdown: {
        week1: {
          action: 'Studied 20 crypto education videos',
          result: 'Identified "myth-busting" format as most viral'
        },
        week2: {
          action: 'Posted first 5 myth-busting videos',
          result: 'Average 5K views, gained 500 followers'
        },
        week3: {
          action: '"Why Bitcoin will hit $100K" video',
          result: '1.2M views, 5K followers in 24 hours'
        },
        week4: {
          action: 'Launched Gumroad ebook ($27)',
          result: '8 sales = $216'
        },
        month2: {
          action: 'Posted daily, refined hook formats',
          result: '$890 (ebook sales + Creator Fund)'
        },
        month3: {
          action: 'Launched full course ($97), brand deals',
          result: '$3,200 (course + brands + fund)'
        },
        month4: {
          action: 'Hit 25K followers, course optimization',
          result: '$4,100 consistent income'
        }
      },
      strategy: {
        products: ['Ebook: "Crypto for Beginners"', 'Course: "DeFi Mastery"'],
        format: 'Myth-busting, educational, contrarian takes',
        postingSchedule: '9am, 2pm, 8pm daily (3x/day)',
        keyInsight: 'Strong opinions + educational value = engagement. Be controversial but accurate.'
      },
      income: [
        { month: 'Month 1', amount: 216, source: 'Ebook' },
        { month: 'Month 2', amount: 890, source: 'Ebook + Creator Fund' },
        { month: 'Month 3', amount: 3200, source: 'Course + Brands' },
        { month: 'Month 4', amount: 4100, source: 'Course optimized' }
      ],
      quote: "Everyone said crypto education was saturated. But our tool showed me the exact angles that were working. I focused on myth-busting instead of explaining basics. Within 4 months I quit my job.",
      tools: ['TikTok Analyzer Pro', 'Gumroad', 'Teachable'],
      lessonsLearned: [
        'Contrarian takes get more engagement',
        'Build email list from day 1',
        'Course > ebook for profit margins',
        'Batch film content (film 10 in one session)'
      ]
    },
    {
      id: 'lisa',
      name: 'Lisa Thompson',
      handle: '@lisa_beauty',
      niche: 'Beauty & Skincare',
      avatar: '💄',
      timeline: '75 days',
      startPoint: {
        followers: 1200,
        income: '$0',
        experience: 'Had account, no strategy'
      },
      endPoint: {
        followers: '18.7K',
        monthlyIncome: '$1,800',
        topVideo: '620K views'
      },
      breakdown: {
        week1: {
          action: 'Analyzed competitors, found "morning routine" trend',
          result: 'Generated 10 scripts around AM skincare'
        },
        week2: {
          action: 'Posted 5 morning routine videos',
          result: 'One hit 620K views'
        },
        week3: {
          action: 'Capitalized on viral video, posted 10 more',
          result: 'Gained 8K followers in 1 week'
        },
        week4: {
          action: 'Added affiliate links to trending products',
          result: 'First sales: $340'
        },
        month2: {
          action: 'Reached out to 15 beauty brands',
          result: 'Got 3 replies, first deal $500'
        },
        month3: {
          action: 'Established as micro-influencer, raised rates',
          result: '$1,800 (3 brand deals + affiliates)'
        }
      },
      strategy: {
        products: ['Vitamin C serum', 'Jade roller', 'Sheet masks', 'Sunscreen'],
        format: 'GRWM (Get Ready With Me), quick tips, product reviews',
        postingSchedule: '6am & 8pm daily',
        keyInsight: 'Morning content performs best. Show your real face, not filtered perfection.'
      },
      income: [
        { month: 'Month 1', amount: 340, source: 'Amazon Affiliates' },
        { month: 'Month 2', amount: 920, source: 'Affiliates + First Brand Deal' },
        { month: 'Month 3', amount: 1800, source: 'Brand Deals + Affiliates' }
      ],
      quote: "I had 1,200 followers for 2 years with no strategy. The analyzer showed me exactly what formats were working in my niche. Within 2 months I had brands reaching out to ME.",
      tools: ['TikTok Analyzer Pro', 'Amazon Associates', 'AspireIQ'],
      lessonsLearned: [
        'One viral video changes everything',
        'Strike while hot - post 2x/day after viral hit',
        'Brands care about engagement rate > followers',
        'Respond to every DM - builds community'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Success Stories - Real People Making Real Money | TikTok Money System</title>
        <meta name="description" content="See how complete beginners went from $0 to $1K-4K/month in 90-120 days using our system." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="text-2xl font-black text-white hover:text-yellow-300 transition">
                  ← TikTok Money System
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Real Success Stories
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
              Complete beginners who went from $0 to consistent income in 60-120 days
            </p>
            <p className="text-white/70">
              No special skills, no large budgets, just following the system
            </p>
          </div>

          {/* Case Study Cards */}
          <div className="space-y-12">
            {cases.map((caseStudy, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-5xl">
                      {caseStudy.avatar}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-black mb-1">{caseStudy.name}</h2>
                      <p className="text-white/90 text-lg mb-1">{caseStudy.handle}</p>
                      <p className="text-white/70">{caseStudy.niche}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">Timeline</div>
                      <div className="text-4xl font-black">{caseStudy.timeline}</div>
                    </div>
                  </div>

                  {/* Before & After */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-2">Starting Point</div>
                      <div className="space-y-1">
                        <div className="font-bold">{caseStudy.startPoint.followers} followers</div>
                        <div className="font-bold text-red-300">{caseStudy.startPoint.income} income</div>
                        <div className="text-sm">{caseStudy.startPoint.experience}</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-2">After {caseStudy.timeline}</div>
                      <div className="space-y-1">
                        <div className="font-bold text-green-300">{caseStudy.endPoint.followers} followers</div>
                        <div className="font-bold text-green-300">{caseStudy.endPoint.monthlyIncome}/mo income</div>
                        <div className="text-sm">Top video: {caseStudy.endPoint.topVideo}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  
                  {/* Quote */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-300">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-gray-800 text-lg italic">
                      "{caseStudy.quote}"
                    </p>
                    <p className="text-gray-600 text-sm mt-3">
                      — {caseStudy.name}, {caseStudy.niche}
                    </p>
                  </div>

                  {/* Week-by-Week Breakdown */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">📅 Week-by-Week Breakdown</h3>
                    <div className="space-y-4">
                      {Object.entries(caseStudy.breakdown).map(([week, data], i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-24 text-right">
                            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold text-sm">
                              {week.replace(/(\d+)/, ' $1').toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-xl p-4 border-l-4 border-purple-600">
                            <div className="font-bold text-gray-900 mb-1">Action: {data.action}</div>
                            <div className="text-green-600 font-semibold text-sm">Result: {data.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategy Breakdown */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">🎯 Strategy That Worked</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>📦</span> Products/Services
                        </div>
                        <div className="space-y-2">
                          {caseStudy.strategy.products.map((product, i) => (
                            <div key={i} className="text-sm text-gray-700">• {product}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🎬</span> Content Format
                        </div>
                        <p className="text-sm text-gray-700">{caseStudy.strategy.format}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>⏰</span> Posting Schedule
                        </div>
                        <p className="text-sm text-gray-700">{caseStudy.strategy.postingSchedule}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>💡</span> Key Insight
                        </div>
                        <p className="text-sm text-gray-700">{caseStudy.strategy.keyInsight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Income Growth Chart */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">💰 Income Growth</h3>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                      <div className="space-y-4">
                        {caseStudy.income.map((month, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-bold text-gray-700">{month.month}</div>
                            <div className="flex-1">
                              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-8 rounded-lg flex items-center px-4 text-white font-bold" 
                                   style={{ width: `${(month.amount / Math.max(...caseStudy.income.map(m => m.amount))) * 100}%` }}>
                                ${month.amount.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 w-32">{month.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🛠️ Tools Used</h3>
                    <div className="flex gap-3 flex-wrap">
                      {caseStudy.tools.map((tool, i) => (
                        <span key={i} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lessons Learned */}
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">📚 Lessons Learned</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {caseStudy.lessonsLearned.map((lesson, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <span className="text-xl flex-shrink-0">✓</span>
                          <span className="text-gray-700">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              These aren't special people. They're regular folks who followed the 7-day system. 
              Your story could be next.
            </p>
            <Link href="/">
              <a className="inline-block px-12 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 text-xl">
                💰 Start Your 7-Day Challenge (Free)
              </a>
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • 3 free analyses • Join 12,847+ creators
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
