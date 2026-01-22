
export type AnalysisStatus = 'Safe' | 'Suspicious' | 'Scam';

export type ScamCategory = 
  | 'Job Scam' 
  | 'Payment Fraud' 
  | 'Fake Shopping Website' 
  | 'Lottery / Reward Scam' 
  | 'OTP / Account Takeover Scam' 
  | 'General'
  | 'None';

export interface ThreatFlag {
  category: 'Semantic' | 'Technical' | 'Financial' | 'Social';
  reason: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface EducationModule {
  scamDescription: string;
  dangerReason: string;
  safetyTips: string[];
  redFlags: string[];
}

export interface HelpCenter {
  name: string;
  address: string;
  phone?: string;
  mapUri: string;
  distance?: string;
}

export interface AnalysisResult {
  status: AnalysisStatus;
  category: ScamCategory;
  score: number;
  explanation: string;
  flags: ThreatFlag[];
  education?: EducationModule;
  metadata: {
    urgencyLevel: string;
    isFinancialThreat: boolean;
    isImpersonation: boolean;
    domainAge?: string;
  };
}

export interface HistoryItem {
  id: string;
  input: string;
  type: 'text' | 'url';
  result: AnalysisResult;
  timestamp: Date;
}
