
'use server';

// This service simulates fetching real-time security data. In a production environment,
// this would connect to actual security monitoring tools and APIs.

// --- Data Interfaces ---
export interface CloudSecurityMetric {
  id: string;
  title: string;
  value: number;
  status: string;
  details: string;
}

export interface EdrDataPoint {
  day: string;
  Malware: number;
  Ransomware: number;
  LateralMovement: number;
}

export interface PhishingData {
  clickResistance: number;
  emailsBlocked: { day: string; count: number }[];
  trainingRequired: 'Low' | 'Medium' | 'High';
}

export interface AegisData {
    cyberHealthScore: number;
    cloudSecurity: CloudSecurityMetric[];
    edrSummary: EdrDataPoint[];
    phishingResilience: PhishingData;
}


// --- Simulated Data Source ---
// This represents the current state that our service would fetch from a database or live API.
let currentCyberHealthScore = 88;
let currentCloudSecurityData: CloudSecurityMetric[] = [
  { id: 'iam', title: 'IAM Hygiene', value: 92, status: 'Optimized', details: 'Identity and Access Management policies are well-configured.' },
  { id: 's3', title: 'S3 Bucket Exposure', value: 100, status: 'Secure', details: 'No public-facing S3 buckets found.' },
  { id: 'misconfig', title: 'Misconfigured Resources', value: 75, status: 'Action Required', details: '3 resources have non-standard configurations.' },
  { id: 'network', title: 'Network Security', value: 80, status: 'Good', details: 'Firewall rules are mostly compliant.' },
];
let currentEdrData: EdrDataPoint[] = [
  { day: 'Mon', Malware: 2, Ransomware: 0, LateralMovement: 1 },
  { day: 'Tue', Malware: 3, Ransomware: 1, LateralMovement: 2 },
  { day: 'Wed', Malware: 1, Ransomware: 0, LateralMovement: 0 },
  { day: 'Thu', Malware: 4, Ransomware: 0, LateralMovement: 3 },
  { day: 'Fri', Malware: 2, Ransomware: 1, LateralMovement: 1 },
  { day: 'Sat', Malware: 0, Ransomware: 0, LateralMovement: 0 },
  { day: 'Sun', Malware: 1, Ransomware: 0, LateralMovement: 1 },
];

// --- Service Functions ---

/**
 * Simulates a small fluctuation in data to make the UI feel live.
 */
function simulateDataFluctuation() {
    // Score
    const scoreChange = (Math.random() - 0.45) * 5;
    currentCyberHealthScore = Math.max(40, Math.min(100, Math.round(currentCyberHealthScore + scoreChange)));

    // Cloud Security
    currentCloudSecurityData = currentCloudSecurityData.map(item => ({
        ...item,
        value: Math.min(100, Math.max(70, item.value + Math.floor(Math.random() * 5) - 2)),
    }));

    // EDR
    currentEdrData = currentEdrData.map(item => ({
        ...item,
        Malware: Math.max(0, item.Malware + Math.floor(Math.random() * 3) - 1),
        LateralMovement: Math.max(0, item.LateralMovement + Math.floor(Math.random() * 3) - 1),
        Ransomware: Math.random() > 0.9 ? Math.max(0, item.Ransomware + (Math.random() > 0.6 ? 1 : -1)) : item.Ransomware,
    }));
}


/**
 * Fetches the complete, up-to-date security data for the Aegis dashboard.
 * @returns An object containing all necessary data for the Aegis UI.
 */
export async function getAegisData(): Promise<AegisData> {
    // Simulate live data changes on each fetch
    simulateDataFluctuation();
    
    const clickResistance = Math.round(currentCloudSecurityData.reduce((acc, item) => acc + item.value, 0) / currentCloudSecurityData.length);
    let trainingRequired: 'Low' | 'Medium' | 'High' = 'Low';
    if (clickResistance < 75) trainingRequired = 'High';
    else if (clickResistance < 85) trainingRequired = 'Medium';

    return {
        cyberHealthScore: currentCyberHealthScore,
        cloudSecurity: [...currentCloudSecurityData],
        edrSummary: [...currentEdrData],
        phishingResilience: {
            clickResistance,
            trainingRequired,
            emailsBlocked: currentEdrData.map(d => ({ day: d.day, count: d.Malware + d.Ransomware })),
        }
    };
}
