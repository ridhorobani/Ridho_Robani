export interface TradingJournalEntry {
  id: string;
  date: string;
  market: string;
  bias: "LONG" | "SHORT";
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  risk: number; // percentage, e.g. 1%
  reward: number; // R-multiple, e.g. 2.5
  screenshot?: string;
  reason: string;
  emotion: "Disciplined" | "Greed" | "Fear" | "Neutral" | "Anxious" | "Excited";
  lessons: string;
  status: "WIN" | "LOSS" | "BREAKEVEN";
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  gallery: string[];
  techStack: string[];
  status: "Active" | "Completed" | "Researching" | "On Hold";
  progress: number; // 0 to 100
  type: "Software" | "AI" | "Design" | "Research" | "Experiment";
}

export interface GeopoliticalCountry {
  id: string;
  name: string;
  region: string;
  flag: string;
  history: string;
  economy: string;
  military: string;
  naturalResources: string[];
  currency: string;
  trade: string;
  politicalSystem: string;
  internationalRelations: string;
  marketImpact: string;
  timeline: Array<{ year: string; event: string; description: string }>;
}

export interface HistoricalEra {
  id: string;
  name: "Ancient Era" | "Middle Ages" | "Modern Era" | "World War" | "Cold War" | "Digital Era";
  period: string;
  description: string;
  events: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
    impact: string;
  }>;
}

export interface FinanceAsset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
  marketNotes: string;
  personalAnalysis: string;
  support: string[];
  resistance: string[];
  liquidityNotes: string;
  riskNotes: string;
}

export interface Settings {
  darkMode: boolean;
  language: "EN" | "DE" | "ID" | "FR";
  notifications: boolean;
  backupInterval: "Daily" | "Weekly" | "Manual";
}
