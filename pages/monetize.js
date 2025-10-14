import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Monetize() {
  const [selectedPath, setSelectedPath] = useState(null);

  const paths = [
    {
      id: 'products',
      icon: '📦',
      title: 'Product Promotion (Fastest)',
      subtitle: 'Promote Amazon/Shopify products for commission',
      difficulty: '⭐ Easy',
      timeToMoney: '2-4 weeks',
      expectedROI: '$500-2,000/mo',
      timeline: '3-6 months',
      requirements: [
        '1,000+ followers (optional)',
        'Choose high-commission products',
        'Post 3-5 videos/week'
      ],
      steps: [
        {
          title: 'Choose Product Category',
          desc: 'Use our product finder tool to discover trending products',
          tools: ['Amazon Associates', 'TikTok Shop', 'Shopify Affiliate']
        },
        {
          title: 'Analyze Competitor Videos',
          desc: 'Find viral videos already selling this product',
          action: 'Use our tool to analyze 3-5 similar product videos'
        },
        {
          title: 'Copy Success Format',
          desc: 'AI generates customized script',
          action: 'Generate script → Film → Post'
        },
        {
          title: 'Add Links to Monetize',
          desc: 'Add product links to bio or TikTok Shop',
          tips: 'Test with first 3 videos, find best-performing product'
        }
      ],
      caseStudy: {
        name: '@sarah_fitness',
        story: 'Fitness supplements promo, week 3 first video hit 850K views, earned $680 that month',
        products: ['Protein powder', 'Fitness equipment', 'Athletic wear'],
        commission: '8-15%'
      },
      pros: [
        '✅ Start without large following',
        '✅ Fastest earnings',
        '✅ Highly scalable'
      ],
      cons: [
        '⚠️ Requires consistent content',
        '⚠️ Limited commission rates'
      ]
    },
    {
      id: 'brands',
      icon: '🤝',
      title: 'Brand Partnerships',
      subtitle: 'Get paid by brands for sponsored content',
      difficulty: '⭐⭐ Medium',
      timeToMoney: '2-3 months',
      expectedROI: '$200-1,000/video',
      timeline: 'Need 10K+ followers',
      requirements: [
        '10,000+ followers',
        'Stable views (avg 50K+)',
        'Clear niche positioning'
      ],
      steps: [
        {
          title: 'Build Personal Brand',
          desc: 'Establish influence in specific niche',
          action: 'Consistent vertical content, build professional image'
        },
        {
          title: 'Prepare Media Kit',
          desc: 'Showcase your data and audience demographics',
          download: 'Download our Media Kit template'
        },
        {
          title: 'Reach Out to Brands',
          desc: 'Use our pitch email templates',
          tools: ['Brand database', 'Pitch templates', 'Rate calculator']
        },
        {
          title: 'Negotiate & Execute',
          desc: 'Price fairly, deliver high-quality content',
          tips: 'Can lower first-time rates to build trust'
        }
      ],
      caseStudy: {
        name: '@lisa_beauty',
        story: 'Beauty creator, got first brand deal at 15K followers for $500',
        brands: ['Skincare brands', 'Beauty tools', 'Fashion brands'],
        rate: '$200-500/video (at 15K followers)'
      },
      pros: [
        '✅ High single earnings',
        '✅ Build long-term partnerships',
        '✅ Increase personal brand value'
      ],
      cons: [
        '⚠️ Need larger follower base',
        '⚠️ Requires negotiation skills',
        '⚠️ Unstable (need constant outreach)'
      ]
    },
    {
      id: 'creator-fund',
      icon: '💰',
      title: 'Creator Fund',
      subtitle: 'TikTok official creator monetization',
      difficulty: '⭐ Easy',
      timeToMoney: 'Immediate after qualifying',
      expectedROI: '$20-200/1M views',
      timeline: 'Passive income',
      requirements: [
        '10,000+ followers',
        '100,000 views in past 30 days',
        '18+ years old',
        'Follow community guidelines'
      ],
      steps: [
        {
          title: 'Reach Requirements',
          desc: '10K followers + 100K views (30 days)',
          action: 'Keep posting until you qualify'
        },
        {
          title: 'Submit Application',
          desc: 'Apply in TikTok Creator Portal',
          tips: 'Usually 2-3 days review'
        },
        {
          title: 'Keep Creating',
          desc: 'More views = more earnings',
          earnings: '$0.02-0.04/1000 views'
        }
      ],
      caseStudy: {
        name: '@mike_crypto',
        story: 'Crypto content, avg 5M views/mo, Creator Fund income $800-1,200',
        note: 'Creator Fund not main income, more like bonus earnings'
      },
      pros: [
        '✅ Passive income',
        '✅ Easy application',
        '✅ No extra work needed'
      ],
      cons: [
        '⚠️ Lower earnings',
        '⚠️ Need sustained high views',
        '⚠️ Varies by region'
      ]
    },
    {
      id: 'own-products',
      icon: '📚',
      title: 'Sell Your Own Products',
      subtitle: 'Courses, ebooks, consulting services',
      difficulty: '⭐⭐⭐ Hard',
      timeToMoney: '3-6 months',
      expectedROI: '$2,000-10,000+/mo',
      timeline: 'Need to build trust',
      requirements: [
        '5,000+ loyal followers',
        'Clear expertise area',
        'Consistent value delivery',
        'Strong engagement rate'
      ],
      steps: [
        {
          title: 'Identify Your Expertise',
          desc: 'Find skills you can teach others',
          examples: ['Personal finance', 'Fitness methods', 'Side hustles', 'Beauty techniques']
        },
        {
          title: 'Validate Demand',
          desc: 'Test audience demand through content',
          action: 'Post related content, watch engagement and DMs'
        },
        {
          title: 'Create Product',
          desc: 'Courses, ebooks, consulting services',
          platforms: ['Gumroad', 'Teachable', 'Notion', 'Google Forms']
        },
        {
          title: 'Sales Funnel',
          desc: 'Free content → Drive to DMs → Paid product',
          conversion: 'Expected conversion: 1-3%'
        }
      ],
      caseStudy: {
        name: '@crypto_educator',
        story: 'Crypto education, launched $97 course at 8K followers, earned $14,550 first month (150 students)',
        note: 'Highest ceiling but requires most work upfront'
      },
      pros: [
        '✅ Highest profit margins',
        '✅ Full control over pricing',
        '✅ Builds real business',
        '✅ Most sustainable long-term'
      ],
      cons: [
        '⚠️ Takes longest to launch',
        '⚠️ Need proven expertise',
        '⚠️ Requires building trust first',
        '⚠️ More upfront work'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>4 Ways to Make Money on TikTok | TikTok Money System</title>
        <meta name="description" content="Compare 4 proven monetization strategies on TikTok. From fastest (product promo) to most profitable (your own products)." />
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
              4 Ways to Make Money
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
              Choose your path based on your timeline, skills, and goals
            </p>
            <p className="text-white/70">
              Most successful creators use a combination of these methods
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-black text-gray-900">Method</th>
                  <th className="text-center py-4 px-4 font-black text-gray-900">Difficulty</th>
                  <th className="text-center py-4 px-4 font-black text-gray-900">Time to $</th>
                  <th className="text-center py-4 px-4 font-black text-gray-900">Expected ROI</th>
                  <th className="text-center py-4 px-4 font-black text-gray-900">Best For</th>
                </tr>
              </thead>
              <tbody>
                {paths.map((path, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-purple-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{path.icon}</span>
                        <span className="font-bold text-gray-900">{path.title}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">{path.difficulty}</td>
                    <td className="text-center py-4 px-4 text-sm font-semibold text-green-600">{path.timeToMoney}</td>
                    <td className="text-center py-4 px-4 text-sm font-bold text-purple-600">{path.expectedROI}</td>
                    <td className="text-center py-4 px-4 text-sm text-gray-600">{path.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Path Cards */}
          <div className="space-y-8">
            {paths.map((path, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{path.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-black mb-2">{path.title}</h2>
                      <p className="text-white/90 text-lg">{path.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">Expected</div>
                      <div className="text-3xl font-black">{path.expectedROI}</div>
                      <div className="text-sm opacity-80">{path.timeToMoney}</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-80">Difficulty</div>
                      <div className="font-bold">{path.difficulty}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-80">Time to $</div>
                      <div className="font-bold">{path.timeToMoney}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-80">Timeline</div>
                      <div className="font-bold">{path.timeline}</div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  
                  {/* Requirements */}
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                      <span>📋</span> Requirements
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {path.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <span className="text-purple-600">✓</span>
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎯</span> Step-by-Step Process
                    </h3>
                    <div className="space-y-4">
                      {path.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 mb-1">{step.title}</div>
                            <div className="text-sm text-gray-600 mb-2">{step.desc}</div>
                            {step.action && (
                              <div className="text-sm text-purple-600 font-semibold">
                                → {step.action}
                              </div>
                            )}
                            {step.tools && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {step.tools.map((tool, j) => (
                                  <span key={j} className="px-2 py-1 bg-white rounded text-xs border border-purple-200 text-purple-700">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                            {step.tips && (
                              <div className="mt-2 text-xs text-gray-500 italic">
                                💡 {step.tips}
                              </div>
                            )}
                            {step.earnings && (
                              <div className="mt-2 text-sm font-bold text-green-600">
                                💰 {step.earnings}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Study */}
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                      <span>🌟</span> Real Success Story
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"></div>
                        <div>
                          <div className="font-black text-gray-900">{path.caseStudy.name}</div>
                          <div className="text-sm text-gray-600">Creator</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">"{path.caseStudy.story}"</p>
                      {path.caseStudy.products && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="text-sm text-gray-600">Products:</span>
                          {path.caseStudy.products.map((prod, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded text-xs border border-green-200 text-green-700">
                              {prod}
                            </span>
                          ))}
                        </div>
                      )}
                      {path.caseStudy.commission && (
                        <div className="text-sm font-bold text-green-700">
                          Commission: {path.caseStudy.commission}
                        </div>
                      )}
                      {path.caseStudy.brands && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="text-sm text-gray-600">Brands:</span>
                          {path.caseStudy.brands.map((brand, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded text-xs border border-green-200 text-green-700">
                              {brand}
                            </span>
                          ))}
                        </div>
                      )}
                      {path.caseStudy.rate && (
                        <div className="text-sm font-bold text-green-700">
                          Rate: {path.caseStudy.rate}
                        </div>
                      )}
                      {path.caseStudy.note && (
                        <div className="mt-3 text-xs text-gray-500 italic">
                          💡 {path.caseStudy.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Pros</h4>
                      <div className="space-y-2">
                        {path.pros.map((pro, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="flex-shrink-0">{pro.split(' ')[0]}</span>
                            <span>{pro.substring(pro.indexOf(' ') + 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Cons</h4>
                      <div className="space-y-2">
                        {path.cons.map((con, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="flex-shrink-0">{con.split(' ')[0]}</span>
                            <span>{con.substring(con.indexOf(' ') + 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Path */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              🎯 Recommended Path for Beginners
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                Start with <span className="font-bold text-purple-600">Product Promotion</span> to make your first dollar fast, 
                then layer in <span className="font-bold text-blue-600">Brand Partnerships</span> as you grow, 
                and eventually create <span className="font-bold text-green-600">Your Own Products</span> for maximum profit.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl mb-1">📦</div>
                    <div className="text-xs font-bold text-gray-700">Month 1-2</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                  <div className="text-center">
                    <div className="text-3xl mb-1">🤝</div>
                    <div className="text-xs font-bold text-gray-700">Month 3-4</div>
                    <div className="text-sm text-gray-600">Brands</div>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                  <div className="text-center">
                    <div className="text-3xl mb-1">📚</div>
                    <div className="text-xs font-bold text-gray-700">Month 5-6</div>
                    <div className="text-sm text-gray-600">Own Products</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This layered approach builds income stability while maximizing long-term profit potential
                </p>
              </div>

              <Link href="/">
                <a className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg">
                  Start Your 7-Day Challenge
                </a>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
