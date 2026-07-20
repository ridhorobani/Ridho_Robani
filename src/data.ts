import { FinanceAsset, TradingJournalEntry, GeopoliticalCountry, HistoricalEra, PersonalNote, Project } from "./types";

export const initialFinanceAssets: FinanceAsset[] = [
  {
    id: "gold",
    name: "Gold",
    symbol: "XAUUSD",
    price: "2412.50",
    change: "+1.24%",
    isUp: true,
    marketNotes: "Gold remains supported by persistent geopolitical premiums and structural central bank purchasing. Despite high nominal rates, physical accumulation by sovereigns acts as a strong macro floor. Long-term de-dollarization trends continue to drive hedging flow.",
    personalAnalysis: "Looking for daily demand validation around $2,380. If inflation data comes in softer, expect a fast expansion towards the $2,450 key resistance block. The broader trend remains heavily bullish across all high timeframes (Weekly, Monthly).",
    support: ["$2,380", "$2,350", "$2,300"],
    resistance: ["$2,430", "$2,450", "$2,500"],
    liquidityNotes: "Major resting sell stops accumulated above $2,435. Buy stops are heavily clustered below the structural pivot of $2,380. Expect sweep-and-reverse behavior if we touch the lower boundary during London session.",
    riskNotes: "Limit maximum leverage. Do not enter full size before the New York opening bell. If $2,370 is broken on a daily closing basis, invalidation is active; immediately reduce position exposure by 80%."
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTCUSD",
    price: "67,450.00",
    change: "+3.85%",
    isUp: true,
    marketNotes: "Institutional capital inflows through spot ETFs continue to absorb spot order book liquidity. Halving cycles are pricing in with structural deficits on OTC desks. Correlation to high-beta tech remains high but is decoupling during risk-off events.",
    personalAnalysis: "Consolidation inside a bullish flag pattern on the 4H chart. A clean breakout of $68,200 targets the psychological $70K handle. Order flow indicates massive institutional buy-walls around the $64.5K level.",
    support: ["$65,000", "$64,200", "$62,000"],
    resistance: ["$68,500", "$70,000", "$73,500"],
    liquidityNotes: "Massive high-leverage liquidation pools are currently sitting at $68,900 (short liquidations) and $63,800 (long liquidations). Price is magnetically drawn to the upside cluster.",
    riskNotes: "Extremely high volatility expected around FOMC minutes. Maintain tight risk sizing. Max risk per trade set to 1.5% of overall speculative capital."
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETHUSD",
    price: "3,520.40",
    change: "-0.45%",
    isUp: false,
    marketNotes: "Layer-2 gas consumption remains high, driving deflationary pressure on ETH supply via EIP-1559. However, near-term rotation into BTC has temporarily slowed Ethereum's momentum.",
    personalAnalysis: "Range-bound between $3,400 and $3,650. ETHBTC is hovering near structural lows, showing potential for a strong reversion-to-mean bounce in the next 14 days.",
    support: ["$3,400", "$3,250", "$3,100"],
    resistance: ["$3,680", "$3,850", "$4,000"],
    liquidityNotes: "Liquidity is concentrated around the swing high of $3,620. If swept, look for support retests to enter spot long positions.",
    riskNotes: "L2 scaling solutions are capturing mindshare; watch competitor activity. Keep an eye on ETH gas fees as a proxy for network health."
  },
  {
    id: "forex",
    name: "Euro / US Dollar",
    symbol: "EURUSD",
    price: "1.0890",
    change: "+0.15%",
    isUp: true,
    marketNotes: "Macro divergence between the ECB and Federal Reserve is driving medium-term range-bound behavior. Rate cut timing projections are largely aligned, keeping currency volatility contained.",
    personalAnalysis: "Hovering near the daily 200 EMA. A successful daily candle close above 1.0920 opens up a clear run to 1.1000. Failure to hold 1.0850 invalidates short-term bullish continuation.",
    support: ["1.0850", "1.0800", "1.0720"],
    resistance: ["1.0920", "1.0980", "1.1050"],
    liquidityNotes: "Major bank orders are stacked around 1.0820. Retail sentiment is 62% short, providing contrarian fuel for a potential squeeze upwards.",
    riskNotes: "Forex spreads can widen dramatically during Asian session roll-over. Strictly avoid market execution between 17:00 and 18:00 EST."
  },
  {
    id: "stocks",
    name: "S&P 500 Index",
    symbol: "SPX",
    price: "5,432.20",
    change: "+0.68%",
    isUp: true,
    marketNotes: "Semiconductor and AI-adjacent megacap stocks continue to lead index expansion. Earnings season yield reports remain highly positive, showing robust consumer balance sheets.",
    personalAnalysis: "The index is inside an ascending broadening wedge. Standard reversion protocols suggest caution near local highs, but shorting the trend remains highly dangerous.",
    support: ["5,350", "5,280", "5,150"],
    resistance: ["5,480", "5,550", "5,600"],
    liquidityNotes: "Heavy volume nodes are concentrated at 5,380. A structural retest of this node would offer a high-probability buy response.",
    riskNotes: "Earnings announcements of top-5 capitalizations (AAPL, MSFT, GOOG, AMZN, NVDA) can gap the entire index overnight. Guard positions with deep index options hedge."
  }
];

export const initialTradingJournal: TradingJournalEntry[] = [
  {
    id: "trade-1",
    date: "2026-07-15",
    market: "Gold (XAUUSD)",
    bias: "LONG",
    entry: 2385.50,
    exit: 2410.00,
    sl: 2375.00,
    tp: 2415.00,
    risk: 1.0,
    reward: 2.33,
    reason: "Daily demand zone retest coinciding with London session liquidity sweep. Price swept the Asian low, rejected with a strong 15M displacement candle, leaving a Fair Value Gap (FVG). Entered on the FVG fill.",
    emotion: "Disciplined",
    lessons: "Patience paid off. Waiting for the sweep instead of chasing the breakout saved me from being caught in the initial stop run. Sticking to 1H order blocks works consistently.",
    status: "WIN"
  },
  {
    id: "trade-2",
    date: "2026-07-16",
    market: "Bitcoin (BTCUSD)",
    bias: "LONG",
    entry: 65200.00,
    exit: 67800.00,
    sl: 64100.00,
    tp: 68000.00,
    risk: 1.5,
    reward: 2.36,
    reason: "H4 bullish order block retest + Bullish divergence on 1H RSI. Price consolidated for 12 hours above major support of $65K, showing structural absorption of sell orders.",
    emotion: "Neutral",
    lessons: "Maintained sizing strictly. Did not experience anxiety during the $300 pullback after entry because risk was well-proportioned. Executed TP manual override $200 below target to guarantee lock-in.",
    status: "WIN"
  },
  {
    id: "trade-3",
    date: "2026-07-18",
    market: "S&P 500 (SPX)",
    bias: "SHORT",
    entry: 5440.00,
    exit: 5462.00,
    sl: 5460.00,
    tp: 5390.00,
    risk: 1.0,
    reward: -1.0,
    reason: "Attempted to catch a macro trend reversal near the psychological 5,450 wedge resistance. Entered on a 5M market structure shift, but index momentum crushed the setup.",
    emotion: "Greed",
    lessons: "Never short an aggressive bull market without substantial daily structural invalidation. The 5M structure shift was a false trap. Always align execution with H4/D1 trends.",
    status: "LOSS"
  },
  {
    id: "trade-4",
    date: "2026-07-19",
    market: "Euro / US Dollar (EURUSD)",
    bias: "SHORT",
    entry: 1.0910,
    exit: 1.0890,
    sl: 1.0945,
    tp: 1.0840,
    risk: 1.0,
    reward: 0.57,
    reason: "Range high resistance sweep. Rejected from 1.0920 multiple times on the 1H timeframe. Scalped some units when the price shifted market structure.",
    emotion: "Anxious",
    lessons: "Exited early because of upcoming CPI news volatility. In retrospect, the trade would have hit TP beautifully, but preserving capital before high-impact macro reports is always the mathematically superior decision.",
    status: "WIN"
  }
];

export const initialGeopoliticalCountries: GeopoliticalCountry[] = [
  {
    id: "usa",
    name: "United States",
    region: "North America",
    flag: "🇺🇸",
    history: "Founded in 1776 following the American Revolution. Developed into a constitutional republic, surviving a civil war to emerge as a global superpower following World War I and II, cementing hegemony after the collapse of the Soviet Union in 1991.",
    economy: "The world's largest economy by nominal GDP. Characterized by high technological innovation, advanced capital markets, global reserve currency status (USD), and a service-oriented infrastructure with strong manufacturing hubs.",
    military: "The absolute dominant global power. Supported by eleven active nuclear supercarriers, unmatched global logistics networks, advanced stealth technology, and a massive defense budget exceeding $850B annually.",
    naturalResources: ["Shale Oil & Gas", "Coal", "Copper", "Lead", "Arable Land", "Phosphates", "Uranium"],
    currency: "United States Dollar (USD)",
    trade: "Major exporter of refined petroleum, aircraft, vehicles, integrated circuits, and agricultural goods. Major importer of electronics, consumer machinery, and pharmaceutical products.",
    politicalSystem: "Constitutional Federal Republic with a bicameral legislature (Congress: Senate & House of Representatives) and a strong executive presidency.",
    internationalRelations: "Core founder of NATO, Five Eyes, G7, and OECD. Highly integrated alliance networks globally, with deep strategic commitments across Europe, East Asia, and the Middle East.",
    marketImpact: "Federal Reserve interest rate decisions dictate global capital yields and asset prices. Changes in US treasury yields act as the risk-free rate anchor for all global valuations.",
    timeline: [
      { year: "1776", event: "Declaration of Independence", description: "Colonies break away from Great Britain." },
      { year: "1944", event: "Bretton Woods Agreement", description: "The USD is established as the global reserve currency backed by gold." },
      { year: "1971", event: "Nixon Shock", description: "Unilateral cancellation of direct convertibility of the USD to gold, ushering in the modern fiat era." },
      { year: "2008", event: "Global Financial Crisis", description: "Subprime mortgage collapse triggers worldwide credit freeze, prompting massive Fed quantitative easing." }
    ]
  },
  {
    id: "china",
    name: "China",
    region: "East Asia",
    flag: "🇨🇳",
    history: "One of the world's oldest continuous civilizations. Modern state established in 1949 after the Chinese Civil War. Initiated massive economic reforms in 1978 under Deng Xiaoping, leading to unprecedented industrial expansion.",
    economy: "The world's largest economy by Purchasing Power Parity (PPP). Known as 'The World's Factory', boasting highly integrated supply chains, massive steel production, and dominant market shares in battery minerals and green tech.",
    military: "People's Liberation Army (PLA) possesses the world's largest active military personnel force, a rapidly expanding naval fleet, and a growing nuclear arsenal with advanced anti-ship hypersonic missile capabilities.",
    naturalResources: ["Rare Earth Elements", "Coal", "Iron Ore", "Petroleum", "Natural Gas", "Bauxite"],
    currency: "Renminbi / Yuan (CNY)",
    trade: "The undisputed leader in global merchandise exports. Exports consumer electronics, solar arrays, heavy machinery, and apparel. Imports crude oil, agricultural commodities, and high-end semiconductors.",
    politicalSystem: "Single-party socialist republic led by the Communist Party of China (CPC). Highly centralized leadership structure.",
    internationalRelations: "Leads the Belt and Road Initiative (BRI), BRICS, and Shanghai Cooperation Organisation (SCO). Expanding influence aggressively across Africa, Central Asia, and Latin America.",
    marketImpact: "Economic demand in China drives global bulk commodity prices (Iron Ore, Copper, Soybeans). Industrial output policy influences worldwide deflation/inflation dynamics.",
    timeline: [
      { year: "1949", event: "Proclamation of the PRC", description: "Mao Zedong declares the establishment of the People's Republic of China." },
      { year: "1978", event: "Reform and Opening Up", description: "Deng Xiaoping launches market reforms, opening China to global investments." },
      { year: "2001", event: "Accession to the WTO", description: "China joins the World Trade Organization, accelerating its integration into global supply chains." },
      { year: "2013", event: "Belt and Road Initiative Launched", description: "President Xi Jinping outlines the transcontinental infrastructure development strategy." }
    ]
  },
  {
    id: "saudi_arabia",
    name: "Saudi Arabia",
    region: "Middle East",
    flag: "🇸🇦",
    history: "Unified as a modern kingdom in 1932 by Ibn Saud. The discovery of oil in 1938 transformed the nation from a desert domain into a wealthy global energy powerhouse.",
    economy: "A dominant rentier state economy undergoing massive structural shifts under 'Vision 2030'. Dominated by Saudi Aramco, the world's most profitable oil company, with massive sovereign wealth reserves (PIF) targeting AI, sports, and tourism diversification.",
    military: "Equipped with state-of-the-art Western military hardware, advanced fighter fleets (F-15S), and strong air-defense architecture. Focuses heavily on regional containment protocols.",
    naturalResources: ["Petroleum", "Natural Gas", "Gold", "Copper", "Iron Ore", "Phosphate"],
    currency: "Saudi Riyal (SAR)",
    trade: "Heavily reliant on crude petroleum exports, petrochemicals, and plastics. Major importer of heavy transport vehicles, military hardware, and food supplies.",
    politicalSystem: "Absolute monarchy led by the House of Saud, with the Crown Prince serving as Prime Minister.",
    internationalRelations: "De facto leader of OPEC. Core member of the GCC, Arab League, and BRICS. Traditionally allied with the US under the historic 'Oil-for-Security' framework, now diversifying relations toward China.",
    marketImpact: "Saudi oil production capacity acts as the global swing producer for energy. Statements regarding oil supply cuts or extensions dictate global CPI calculations.",
    timeline: [
      { year: "1932", event: "Unification of the Kingdom", description: "Modern Saudi Arabia is declared." },
      { year: "1938", event: "Discovery of Commercial Oil", description: "Dammam No. 7 strikes oil, changing global energy geopolitics forever." },
      { year: "1973", event: "Oil Embargo", description: "OPEC imposes oil export restrictions, triggering a global energy crisis and establishing OPEC's cartel power." },
      { year: "2016", event: "Vision 2030 Unveiled", description: "Crown Prince Mohammed bin Salman announces a sweeping economic blueprint to reduce oil dependence." }
    ]
  }
];

export const initialHistoricalEras: HistoricalEra[] = [
  {
    id: "ancient",
    name: "Ancient Era",
    period: "3000 BCE - 500 CE",
    description: "The foundations of human civilization. Characterized by the rise of writing systems, organized agriculture, massive city-states, the codification of laws, and the birth of classic philosophy and major world religions.",
    events: [
      { id: "e-1", year: "c. 1750 BCE", title: "Code of Hammurabi", description: "One of the earliest and most complete written legal codes, proclaimed by the Babylonian king Hammurabi, establishing concepts of justice and proportional punishment.", impact: "Standardized contract laws, liability, and currency equivalents (shekels of silver), laying the earliest groundwork for commercial trust." },
      { id: "e-2", year: "27 BCE", title: "Establishment of the Roman Empire", description: "Augustus Caesar becomes the first Emperor of Rome, starting the Pax Romana, a 200-year period of relative stability, monumental architecture, and massive trade expansion.", impact: "Roman law, currency (denarius), and roads formed the standard socio-economic infrastructure for Europe and the Mediterranean basin for centuries." },
      { id: "e-3", year: "476 CE", title: "Fall of the Western Roman Empire", description: "The last Western Roman Emperor, Romulus Augustulus, is deposed by Odoacer, signaling the fracturing of centralized European authority.", impact: "Initiated localized feudalism, trade contraction, and decentralized currency issuance, transitioning Europe into the Middle Ages." }
    ]
  },
  {
    id: "middle-ages",
    name: "Middle Ages",
    period: "500 CE - 1500 CE",
    description: "An era of localized feudal power structures, religious consolidation, transcontinental plague cycles, and the gradual resurgence of international trading routes like the Silk Road.",
    events: [
      { id: "e-4", year: "1215", title: "Signing of the Magna Carta", description: "English barons force King John to sign the Great Charter, establishing the principle that everyone, including the monarch, is subject to the rule of law.", impact: "Laid the intellectual foundations for constitutional democracy, personal property rights, and protection against arbitrary state confiscation." },
      { id: "e-5", year: "1346 - 1353", title: "The Black Death", description: "A devastating bubonic plague pandemic sweeps through Eurasia, wiping out 30-60% of the European population.", impact: "Severe labor shortages broke the back of feudalism. Surviving peasants successfully demanded wages, giving rise to early capitalism and localized manufacturing hubs." },
      { id: "e-6", year: "1453", title: "Fall of Constantinople", description: "The Ottoman Empire captures the capital of the Byzantine Empire, closing land-based European access to the trade-rich Silk Road.", impact: "Forced European powers to look westward, triggering the Age of Discovery and maritime exploration." }
    ]
  },
  {
    id: "modern",
    name: "Modern Era",
    period: "1500 CE - 1914 CE",
    description: "Characterized by the scientific revolution, global colonization, industrialization, the rise of sovereign nation-states, and central banking institutions.",
    events: [
      { id: "e-7", year: "1694", title: "Founding of the Bank of England", description: "Established as a private institution to fund the sovereign debt of William III. It became the world's first modern central bank.", impact: "Introduced fractional reserve banking and institutionalized government bond markets, creating the blueprint for national debt-based fiat finance." },
      { id: "e-8", year: "1760 - 1840", title: "The First Industrial Revolution", description: "Transition from manual labor to steam-powered manufacturing, coal energy, and extensive railway networks.", impact: "Unprecedented productivity gains, urbanization of labor, and the rapid expansion of capital market structures and international raw material trade." }
    ]
  },
  {
    id: "world-war",
    name: "World War",
    period: "1914 CE - 1945 CE",
    description: "The age of total warfare. Characterized by mass mobilization, industrial-scale warfare, ideological conflicts, and the transition of global economic power from Europe to the United States.",
    events: [
      { id: "e-9", year: "1914", title: "Outbreak of World War I", description: "The assassination of Archduke Franz Ferdinand triggers systemic treaty obligations, resulting in global military mobilization.", impact: "Broke the classical gold standard as warring nations printed fiat currency to finance military endeavors, ushering in catastrophic hyperinflation cycles (e.g. Weimar Republic)." },
      { id: "e-10", year: "1944", title: "Bretton Woods Conference", description: "Delegates from 44 Allied nations gather in New Hampshire to design the post-war international monetary system.", impact: "Created the IMF and World Bank, and established the US Dollar as the world's primary anchor currency, pegged to Gold at $35/ounce." }
    ]
  },
  {
    id: "cold-war",
    name: "Cold War",
    period: "1945 CE - 1991 CE",
    description: "Bipolar geopolitical struggle between the capitalist United States and the communist Soviet Union. Characterized by the nuclear arms race, proxy wars, and the space race.",
    events: [
      { id: "e-11", year: "1971", title: "The End of Bretton Woods", description: "US President Richard Nixon closes the gold window, ending direct convertibility of dollars to gold.", impact: "Allowed sovereign nations to expand credit infinitely, giving rise to floating exchange rates, severe inflation spikes, and the birth of modern financial speculation." },
      { id: "e-12", year: "1991", title: "Collapse of the Soviet Union", description: "Mikhail Gorbachev resigns, and the USSR is dissolved into 15 sovereign nations, ending the bipolar cold war era.", impact: "Cemented US unilateral hegemony, leading to rapid globalization, hyper-capitalism, and open-market expansions into Eastern Europe." }
    ]
  },
  {
    id: "digital",
    name: "Digital Era",
    period: "1991 CE - Present",
    description: "The information revolution. Characterized by the internet, mobile connectivity, decentralized computing protocols, advanced machine learning models, and complex geopolitical multipolarity.",
    events: [
      { id: "e-13", year: "2008", title: "Release of the Bitcoin Whitepaper", description: "An anonymous cryptographer under the pseudonym Satoshi Nakamoto publishes the blueprint for a peer-to-peer electronic cash system.", impact: "Introduced the world to trustless blockchain consensus and absolute mathematical digital scarcity, presenting a parallel financial framework to central bank fiat networks." },
      { id: "e-14", year: "2022", title: "The Generative AI Explosion", description: "Advanced transformer-based language models enter mainstream usage, showcasing near-human cognitive writing and reasoning capabilities.", impact: "Accelerated the automation of cognitive labor, transforming software engineering, content creation, and personal knowledge management." }
    ]
  }
];

export const initialPersonalNotes: PersonalNote[] = [
  {
    id: "note-1",
    title: "The Gold-Dollar Hegemony & Petrodollar System",
    content: "### Macroeconomic Architecture of Sovereign Debt\n\nThe global financial system rests on the foundational mechanics of the **petrodollar agreement** established in 1974. Under this framework, Saudi Arabia priced its oil exports exclusively in USD in exchange for US security guarantees. This created a permanent, synthetic global demand for United States dollars, allowing the US to run perpetual twin deficits (fiscal and trade) without experiencing classical inflationary currency collapses.\n\n#### Structural Realities:\n1. **Foreign Exchange Reserves**: Sovereign central banks hold US Treasuries as their primary interest-bearing liquid assets, acting as systemic lenders to the US government.\n2. **De-Dollarization Triggers**: The weaponization of SWIFT networks and asset freezes (e.g., Russian central bank reserves in 2022) accelerated the search for neutral settlement assets.\n3. **Sovereign Accumulation of Gold**: Over the past 36 months, non-Western central banks have shifted from treasuries to physical gold bars at an unprecedented pace, establishing a structural hard-floor underneath gold prices.\n\n*Strategic Takeaway*: Gold is reclaiming its role as a trustless, sovereign collateral asset. Allocation should favor physical gold and BTC to hedge against potential fiat system resets.",
    category: "Macroeconomics",
    tags: ["Gold", "USD", "Hegemony", "Geopolitics"],
    date: "2026-07-18"
  },
  {
    id: "note-2",
    title: "AI Agents & Autonomous Cognition Architectures",
    content: "### Engineering Next-Generation Digital Minds\n\nTransitioning from static Large Language Model prompting to **Autonomous Agentic Workflows** represents the defining paradigm shift of the mid-2020s. \n\n#### Key Components of Agentic Orchestration:\n- **Perception Layer**: Translating unstructured inputs (speech, vision, terminal text) into dense embedding spaces.\n- **Cognitive Planner**: Implementing Chain-of-Thought (CoT), Tree-of-Thoughts (ToT), or self-correcting reflection loops before output production.\n- **Memory Architecture**:\n  - *Short-Term Memory*: Highly dynamic in-context window state (KV Cache optimization).\n  - *Long-Term Memory*: Structured vector databases (vector embeddings retrieved via Cosine Similarity / HNSW algorithms).\n- **Tool Executor**: Allowing the agent to interact with shell environments, external APIs, code compilers, and databases.\n\n#### Current Bottlenecks:\n1. **Context Window Drift**: Agent attention decays as context fills with historical tool logs.\n2. **Infinite Refinement Loops**: Agents getting stuck correcting trivial typos while wasting valuable token budgets.\n3. **Latency**: Multi-agent debates increase response times exponentially, making them unsuitable for real-time web UI integration.",
    category: "Artificial Intelligence",
    tags: ["LLM", "Agents", "Architecture", "Engineering"],
    date: "2026-07-19"
  },
  {
    id: "note-3",
    title: "Mental Models of Elite Financial Risk Management",
    content: "### Staving Off Ruin in Speculative Trading\n\nElite trading is not a game of predicting where prices will go; it is a game of managing **probability distributions** and preserving capital so you can execute the next high-edge setup. \n\n#### Core Principles:\n\n1. **Kelly Criterion for Sizing**:\n   $$\\text{Sizing Fraction} = \\frac{W \\cdot R - (1 - W)}{R}$$\n   Where:\n   - $W$ = Historical Win Rate\n   - $R$ = Average Risk-Reward Ratio (RR)\n   - *Note*: Never run full Kelly in live markets due to model estimation errors. Default to 'Half-Kelly' or 'Quarter-Kelly' (e.g., max 1% to 2% risk per position).\n\n2. **Risk of Ruin (RoR)**:\n   If you risk 10% per trade, 10 consecutive losses completely wipe out your account. If you risk 1% per trade, 10 consecutive losses leave you with 90.4% of your starting capital. The math of geometric recovery makes recovering from a 50% draw-down require a **100% gain** just to reach breakeven.\n\n3. **Cognitive Blindspots**:\n   - *Recency Bias*: Overweighting the outcomes of the last 3 trades.\n   - *Sunk Cost Fallacy*: Widening stop losses because 'I know the price will turn around soon.'\n   - *FOMO*: Entering on impulse after a massive breakout has already swept liquidity pools.\n\n*Actionable Protocol*: If you suffer 3 consecutive losses in a single week, immediately cut your position sizing by 50% for the next 5 trades until psychological equilibrium is restored.",
    category: "Trading",
    tags: ["Risk", "Mathematics", "Psychology", "Kelly-Criterion"],
    date: "2026-07-20"
  }
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "ROBANI Core",
    description: "An advanced multi-agent orchestrator executing complex quantitative modeling, deep macroeconomic data-scraping, and automated geopolitical risk alerts.",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop"
    ],
    techStack: ["React", "Express", "Google GenAI", "Typescript", "Tailwind CSS"],
    status: "Active",
    progress: 85,
    type: "AI"
  },
  {
    id: "proj-2",
    name: "Gold-Quantum Forecast",
    description: "An experimental time-series predictive engine leveraging Fourier transforms and neural networks to model potential liquidity pools and resting orders on XAUUSD.",
    gallery: [
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=600&auto=format&fit=crop"
    ],
    techStack: ["Python", "TensorFlow", "FastAPI", "Docker", "D3.js"],
    status: "Researching",
    progress: 45,
    type: "Research"
  },
  {
    id: "proj-3",
    name: "Chronos Archivist",
    description: "A sleek knowledge management network utilizing semantic cross-linking to reconstruct historical causal loops and structural macro trends.",
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
    ],
    techStack: ["Next.js", "Neo4j", "Tailwind CSS", "Framer Motion"],
    status: "Completed",
    progress: 100,
    type: "Software"
  },
  {
    id: "proj-4",
    name: "Luxury Slate UI Kit",
    description: "A premium, minimalist, responsive visual design framework inspired by Apple, Stripe, and high-end automotive instrument clusters.",
    gallery: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop"
    ],
    techStack: ["Framer", "CSS Grid", "Tailwind CSS", "React"],
    status: "Active",
    progress: 95,
    type: "Design"
  }
];
