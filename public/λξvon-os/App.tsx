
import React, { useState, useCallback, useEffect, DragEvent } from 'react';
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { IconProps, COLORS, FONTS } from './config';
// Removed geminiGenerateContent import as it's no longer used in App.tsx after AI Insight card removal
// import { geminiGenerateContent } from './services/geminiService'; 

// --- Icon Components (existing icons - truncated for brevity, assume they are unchanged) ---
const LogoSymbol: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L95 40L75 95H25L5 40L50 5Z" stroke={COLORS.imperialPurple} strokeWidth="8" />
    <path d="M50 25L75 45L62.5 75H37.5L25 45L50 25Z" stroke={COLORS.romanAqua} strokeWidth="6" />
    <circle cx="50" cy="50" r="10" fill={COLORS.patinaGreen} />
  </svg>
);
const HomeIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg className={`${className} chevron-animated`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const SearchIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CommandIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);
const LightningIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
const LayoutGridIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
 <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>
  </svg>
);
const ClockIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const UserIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const BellIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);
const MoreHorizontalIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);
const PinIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const MinimizeIcon: React.FC<IconProps> = ({ className, size = 18 }) => ( // Keep for "minimize" action
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const MaximizeIcon: React.FC<IconProps> = ({ className, size = 18 }) => ( // Repurpose for "restore" action
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);
const AppWindowIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
 <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="M2 8h20"></path>
    <path d="M6 4v-.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V4"></path>
  </svg>
);
const CpuIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);
const MemoryChipIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
 <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"></path>
    <path d="M2 14v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"></path>
    <path d="M20 12H4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z"></path>
    <path d="M6 12V8h2v4"></path><path d="M10 12V8h2v4"></path><path d="M14 12V8h2v4"></path>
    <path d="M18 12V8h2v4"></path>
  </svg>
);
const LayersIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);
const BroadcastIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
 <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12a10 10 0 0 1 20 0"></path><path d="M6 12a6 6 0 0 1 12 0"></path>
    <path d="M10 12a2 2 0 0 1 4 0"></path><line x1="12" y1="12" x2="12" y2="22"></line>
  </svg>
);
const CheckCircleIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const XCircleIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
const AlertCircleIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);
const RefreshCwIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15A9 9 0 0 0 18.36 18.36"></path>
  </svg>
);
const ChartBarIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);
const ChartLineIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 17 10 7 8 12 2 12"></polyline><path d="M16 6l2-2 4 4"></path>
  </svg>
);
const MiniDotIcon: React.FC<IconProps> = ({ className, size = 8 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="4" />
    </svg>
);


// --- Layout Components ---
const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: true }) + ' UTC');
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-6 bg-vitreous-white/10 backdrop-blur-xl border-b border-vitreous-white/20 sticky top-0 z-20 shadow-glass-DEFAULT">
      {/* Left Section: Logo, Title, Home Link */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <LogoSymbol className="text-imperial-purple" size={36}/>
        <h1 className="text-2xl font-comfortaa font-bold text-vitreous-white whitespace-nowrap">ΛΞVOS</h1>
        <div 
            className="flex items-center ml-2 px-3 py-1.5 bg-roman-aqua/10 hover:bg-roman-aqua/20 rounded-lg cursor-pointer transition-colors"
            role="button"
            tabIndex={0}
            onClick={() => console.log("Home Dashboard clicked")}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') console.log("Home Dashboard clicked"); }}
            title="Go to Home Dashboard"
            aria-label="Home Dashboard Navigation"
        >
          <HomeIcon className="text-vitreous-white mr-1.5 sm:mr-2" size={18}/>
          <span className="text-vitreous-white font-lexend text-sm hidden sm:inline">Home Dashboard</span>
          <ChevronDownIcon className="text-conchoidal-gray ml-1" size={14}/>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden md:flex">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-conchoidal-gray" size={18}/>
          </div>
          <input
            type="text"
            placeholder="Command or Search (Ctrl+K)..."
            className="w-full bg-obsidian-black/50 placeholder-conchoidal-gray text-vitreous-white font-lexend text-sm rounded-lg border border-vitreous-white/20 focus:ring-1 focus:ring-roman-aqua focus:border-roman-aqua transition-all py-2.5 pl-10 pr-10"
            aria-label="Command or Search input"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd className="inline-flex items-center px-2 py-0.5 border border-vitreous-white/30 rounded text-xs font-sans text-conchoidal-gray">
              <CommandIcon size={14} className="mr-1"/> K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Actions, Time, User Profile */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button type="button" className="p-1.5 sm:p-2 rounded-full hover:bg-roman-aqua/20 text-conchoidal-gray hover:text-vitreous-white transition-colors" aria-label="Quick Actions" title="Quick Actions">
          <LightningIcon size={18}/>
        </button>
        <button type="button" className="p-1.5 sm:p-2 rounded-full hover:bg-roman-aqua/20 text-conchoidal-gray hover:text-vitreous-white transition-colors" aria-label="View Modules" title="View Modules">
          <LayoutGridIcon size={18}/>
        </button>
        <button type="button" className="p-1.5 sm:p-2 rounded-full hover:bg-roman-aqua/20 text-conchoidal-gray hover:text-vitreous-white relative transition-colors" aria-label="Notifications" title="Notifications">
          <BellIcon size={18}/>
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 bg-patina-green rounded-full"></span>
        </button>
        
        <div className="hidden md:flex items-center space-x-2 text-xs font-lexend text-conchoidal-gray border-l border-vitreous-white/20 pl-2 sm:pl-3 ml-1 sm:ml-2">
          <ClockIcon size={16}/>
          <span className="whitespace-nowrap">{currentTime}</span>
        </div>

        <button 
          type="button"
          className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-lg hover:bg-roman-aqua/20 transition-colors md:border-l md:border-vitreous-white/20 md:pl-2 sm:md:pl-3 md:ml-1 sm:md:ml-2 focus:outline-none focus:ring-1 focus:ring-roman-aqua" 
          aria-label="User account and settings"
          title="User Account: Admin User"
        >
          <div className="w-8 h-8 rounded-full bg-imperial-purple flex items-center justify-center border border-vitreous-white/30 flex-shrink-0">
            <UserIcon className="w-4 h-4 text-vitreous-white" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-sm font-medium text-vitreous-white font-lexend leading-tight">Admin User</span>
            <span className="text-xs text-conchoidal-gray font-lexend leading-tight">Session: 28m</span>
          </div>
          <ChevronDownIcon className="hidden lg:block text-conchoidal-gray w-4 h-4 ml-auto sm:ml-1" />
        </button>
      </div>
    </header>
  );
};


// --- Dashboard Card Component ---
interface DashboardCardProps {
  id: string;
  title: string;
  icon: React.ComponentType<IconProps>;
  actionIcons?: React.ReactNode;
  children: React.ReactNode;
  className?: string; // For grid spans like 'lg:col-span-2'
  cardBg?: string;
  cardBorder?: string;
  isMinimized: boolean;
  onToggleMinimize: (id: string) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  id, title, icon: Icon, actionIcons, children, className = '', 
  cardBg = 'bg-vitreous-white/5', cardBorder = 'border-vitreous-white/20',
  isMinimized, onToggleMinimize,
  onDragStart, onDragOver, onDrop, onDragEnter, onDragLeave
}) => {
  const defaultActionButtons = (
    <>
      <button type="button" className="p-1.5 text-conchoidal-gray hover:text-vitreous-white hover:bg-roman-aqua/30 rounded-md" title="More options"><MoreHorizontalIcon size={18}/></button>
      <button type="button" className="p-1.5 text-conchoidal-gray hover:text-vitreous-white hover:bg-roman-aqua/30 rounded-md" title="Pin card"><PinIcon size={16}/></button>
    </>
  );

  return (
    <div
      id={id}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`${cardBg} ${cardBorder} backdrop-blur-lg shadow-glass-DEFAULT rounded-xl flex flex-col subtle-noise ${className} ${isMinimized ? 'h-14 overflow-hidden' : ''} transition-all duration-300 ease-in-out`}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-vitreous-white/10 bg-vitreous-white/10 rounded-t-xl cursor-grab">
        <div className="flex items-center space-x-2">
          <Icon className="text-patina-green" size={20} />
          <h3 className="font-comfortaa text-md font-medium text-vitreous-white tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {actionIcons}
          {actionIcons === undefined && defaultActionButtons} 
          <button 
            type="button" 
            onClick={() => onToggleMinimize(id)} 
            className="p-1.5 text-conchoidal-gray hover:text-vitreous-white hover:bg-roman-aqua/30 rounded-md" 
            title={isMinimized ? "Restore card" : "Minimize card"}
          >
            {isMinimized ? <MaximizeIcon size={16}/> : <MinimizeIcon size={16}/>}
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className="p-4 flex-grow overflow-y-auto" style={{ minHeight: '100px' }}> {/* Ensure content area has some base height */}
          {children}
        </div>
      )}
    </div>
  );
};


// --- Specific Card Content Implementations ---
type AgentStatus = 'processing' | 'idle' | 'error'; 
interface Agent {
  id: string;
  name: string;
  task: string;
  status: AgentStatus;
  lastActive?: string;
}
interface AgentStatusConfigItem {
  icon: React.FC<IconProps>;
  color: string;
  label: string;
  spin: boolean;
  iconSize?: number;
}

const AgentPresenceCardContent: React.FC = () => {
  const agents: Agent[] = [
    { id: 'agent1', name: 'OrionCore_7B', task: 'Optimizing dynamic resource allocation across Kubernetes clusters using predictive scaling models.', status: 'processing', lastActive: 'Now' },
    { id: 'agent2', name: 'NexusGuard_Alpha', task: 'Actively monitoring inbound/outbound network patterns for anomalies based on heuristic analysis.', status: 'idle', lastActive: '2m ago' },
    { id: 'agent3', name: 'Helios_Stream_Processor', task: 'Continuously analyzing high-volume sentiment data streams for emerging market trends.', status: 'processing', lastActive: 'Now'},
    { id: 'agent4', name: 'NovaSys_QueryEngine', task: 'Awaiting complex user queries and data retrieval tasks from the primary data lake.', status: 'idle', lastActive: '10s ago' },
    { id: 'agent5', name: 'Cygnus_BackupAgent', task: 'Scheduled integrity check failed on target DB. Initiating rollback.', status: 'error', lastActive: '5m ago' },
  ];
  const statusConfig: Record<AgentStatus, AgentStatusConfigItem> = {
    processing: { icon: RefreshCwIcon, color: 'text-roman-aqua', label: 'Processing', spin: true, iconSize: 18 },
    idle: { icon: MiniDotIcon, color: 'text-patina-green', label: 'Idle', spin: false, iconSize: 12 },
    error: { icon: AlertCircleIcon, color: 'text-red-500', label: 'Error', spin: false, iconSize: 18 },
  };

  return (
    <div className="space-y-3">
      {agents.map(agent => {
        const currentStatus = statusConfig[agent.status];
        const StatusIcon = currentStatus.icon;
        return (
          <div 
            key={agent.id} 
            className="p-3 bg-obsidian-black/40 hover:bg-obsidian-black/60 rounded-lg flex items-start sm:items-center border border-vitreous-white/10 transition-colors duration-150 cursor-default"
            role="listitem"
            aria-label={`Agent ${agent.name}, status ${currentStatus.label}, task ${agent.task}`}
          >
            <div className="flex-grow pr-2 sm:pr-3 overflow-hidden">
              <p className="font-lexend text-md font-semibold text-vitreous-white truncate" title={agent.name}>{agent.name}</p>
              <p className="font-lexend text-xs text-conchoidal-gray truncate pt-0.5" title={agent.task}>{agent.task}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0">
              <div className={`flex items-center space-x-1.5 ${currentStatus.color}`}>
                <StatusIcon 
                  className={`${currentStatus.spin ? 'animate-spin' : ''}`} 
                  size={currentStatus.iconSize || 18} 
                />
                <span className="font-lexend text-xs hidden sm:inline">{currentStatus.label}</span>
              </div>
              {agent.lastActive && <span className="font-lexend text-[11px] text-conchoidal-gray/70 hidden sm:inline whitespace-nowrap">({agent.lastActive})</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LiveOrchestrationFeedCardContent: React.FC = () => {
  const feedItems = [
    { id: 1, task: 'Agent Task: Analyze User Sentiment', timestamp: '0 seconds ago', status: 'failure' as 'failure' | 'success', details: "Error code: 503, Service Unavailable. Retrying in 30s." },
    { id: 2, task: 'Agent Task: Deploy Microservice v1.2', timestamp: '3 minutes ago', status: 'success' as 'failure' | 'success', details: "Deployment ID: dpl_xyz789, Duration: 45s, Target: Production Cluster A" },
    { id: 3, task: 'Agent Task: Backup Database Cluster', timestamp: '15 minutes ago', status: 'success' as 'failure' | 'success', details: "Snapshot ID: snp_abc123, Size: 1.2TB, Verification: Passed" },
  ];
  return (
    <div className="space-y-3">
      {feedItems.map(item => (
        <div key={item.id} className={`p-3 rounded-lg border flex items-start space-x-3 ${item.status === 'failure' ? 'bg-red-900/30 border-red-500/50' : 'bg-green-900/30 border-green-500/50'}`}>
          {item.status === 'failure' ? <XCircleIcon className="text-red-400 mt-0.5 flex-shrink-0" size={18} /> : <CheckCircleIcon className="text-green-400 mt-0.5 flex-shrink-0" size={18} />}
          <div className="flex-grow">
            <p className="font-lexend text-sm text-vitreous-white">{item.task}</p>
            <p className="font-lexend text-xs text-conchoidal-gray">{item.timestamp}</p>
            <details className="text-xs mt-1 group">
              <summary className="cursor-pointer text-roman-aqua/80 hover:text-roman-aqua flex items-center p-1 -ml-1 hover:bg-obsidian-black/20 rounded transition-colors w-fit">
                {item.status === 'failure' ? 'Failure Details' : 'Success Details'}
                <ChevronDownIcon className="ml-1 text-conchoidal-gray group-open:rotate-180" size={14}/>
              </summary>
              <p className="text-conchoidal-gray/90 mt-1 p-2 bg-obsidian-black/30 rounded">{item.details}</p>
            </details>
          </div>
          <div className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full self-start ${item.status === 'failure' ? 'bg-red-500/70 text-white' : 'bg-patina-green/70 text-white'}`}>
            {item.status}
          </div>
        </div>
      ))}
    </div>
  );
};

const SystemSnapshotCardContent: React.FC = () => { 
  const metrics = [
      { name: 'CPU Load', value: '35%', icon: CpuIcon, color: 'text-patina-green' },
      { name: 'Memory Usage', value: '62%', icon: MemoryChipIcon, color: 'text-roman-aqua' },
      { name: 'Active Agents', value: '5', icon: LayersIcon, color: 'text-gilded-accent' } 
  ];
  return (
    <div className="grid grid-cols-1 gap-3">
      {metrics.map(metric => (
          <div key={metric.name} className="p-3 bg-obsidian-black/50 rounded-lg flex justify-between items-center border border-vitreous-white/10">
              <div className="flex items-center space-x-2">
                  <metric.icon className={`${metric.color}`} size={20}/>
                  <span className="font-lexend text-sm text-vitreous-white">{metric.name}</span>
              </div>
              <span className={`font-lexend text-sm font-bold ${metric.color}`}>{metric.value}</span>
          </div>
      ))}
    </div>
  );
};

interface MicroAppsCardContentProps {
  onLaunchApp: (appName: string) => void;
}
const MicroAppsCardContent: React.FC<MicroAppsCardContentProps> = ({ onLaunchApp }) => {
  const apps = [
      { name: 'Data Visualizer', icon: ChartBarIcon },
      { name: 'Performance Monitor', icon: CpuIcon },
      { name: 'Security Monitor', icon: AlertCircleIcon }
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {apps.map(app => (
          <button 
              type="button"
              key={app.name} 
              onClick={() => onLaunchApp(app.name)}
              className="p-3 bg-roman-aqua/10 hover:bg-roman-aqua/20 border border-roman-aqua/50 shadow-inner-roman-aqua-soft focus:ring-2 focus:ring-roman-aqua focus:ring-opacity-50 focus:outline-none rounded-lg flex flex-col items-center justify-center space-y-1.5 aspect-square transition-all group"
              aria-label={`Launch ${app.name}`}
          >
              <app.icon className="text-roman-aqua transition-all duration-200 ease-out group-hover:scale-105" size={28} style={{ filter: 'drop-shadow(0 0 3px rgba(32,178,170,0.7))' }}/>
              <span className="font-lexend text-xs text-vitreous-white text-center">Launch</span>
          </button>
      ))}
    </div>
  );
};

interface ApplicationViewCardContentProps {
  activeApp: string | null;
  onCloseApp: () => void;
}
const ApplicationViewCardContent: React.FC<ApplicationViewCardContentProps> = ({ activeApp, onCloseApp }) => {
  return activeApp ? (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <AppWindowIcon className="text-patina-green mb-4" size={48} />
        <p className="font-lexend text-lg text-vitreous-white mb-2">Viewing: <span className="font-bold">{activeApp}</span></p>
        <p className="font-lexend text-sm text-conchoidal-gray">
          Content for '{activeApp}' would be rendered here.
        </p>
        <button 
          type="button"
          onClick={onCloseApp}
          className="mt-6 px-4 py-2 bg-imperial-purple/70 hover:bg-imperial-purple text-vitreous-white font-lexend text-xs rounded-lg transition-colors duration-150"
        >
          Close {activeApp}
        </button>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <LayoutGridIcon className="text-conchoidal-gray/50 mb-4" size={48} />
        <p className="font-lexend text-md text-vitreous-white mb-1">No micro-app launched.</p>
        <p className="font-lexend text-sm text-conchoidal-gray">Select an app from the 'Micro-Apps' launcher.</p>
      </div>
    );
};


// --- Dashboard Content ---
interface DashboardLayoutItem {
  id: string;
  title: string;
  icon: React.ComponentType<IconProps>;
  content: React.ReactNode;
  className?: string; // For grid spans
  isMinimized: boolean;
  actionIcons?: React.ReactNode; // For custom actions like close button
  cardBg?: string;
  cardBorder?: string;
}

const DashboardContent: React.FC = () => {
  const [activeMicroApp, setActiveMicroApp] = useState<string | null>(null);
  
  const [dashboardCards, setDashboardCards] = useState<DashboardLayoutItem[]>([]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);


  const handleLaunchApp = useCallback((appName: string) => {
    setActiveMicroApp(appName);
  }, []);

  const handleCloseApp = useCallback(() => {
    setActiveMicroApp(null);
  }, []);

  // Initialize dashboard cards configuration
  useEffect(() => {
    const initialCardsConfig: DashboardLayoutItem[] = [
      { 
        id: 'systemSnapshot', title: 'System Snapshot', icon: LayoutGridIcon, 
        content: <SystemSnapshotCardContent />, 
        className: 'lg:col-span-1', isMinimized: false 
      },
      { 
        id: 'agentPresence', title: 'Agent Presence', icon: CpuIcon, 
        content: <AgentPresenceCardContent />, 
        className: 'lg:col-span-1', isMinimized: false 
      },
      { 
        id: 'microApps', title: 'Micro-Apps', icon: LayersIcon, 
        content: <MicroAppsCardContent onLaunchApp={handleLaunchApp} />, 
        className: 'lg:col-span-1', isMinimized: false 
      },
      { 
        id: 'liveFeed', title: 'Live Orchestration Feed', icon: BroadcastIcon, 
        content: <LiveOrchestrationFeedCardContent />, 
        className: 'md:col-span-2 lg:col-span-1 lg:row-span-2', isMinimized: false 
      },
      { 
        id: 'appView', title: activeMicroApp ? `App: ${activeMicroApp}` : "Application View", icon: AppWindowIcon, 
        content: <ApplicationViewCardContent activeApp={activeMicroApp} onCloseApp={handleCloseApp} />, 
        className: 'md:col-span-2 lg:col-span-2 lg:row-span-2', 
        actionIcons: activeMicroApp ? (
            <button type="button" onClick={handleCloseApp} className="p-1.5 text-conchoidal-gray hover:text-vitreous-white hover:bg-red-700/30 rounded-md" title="Close App">
              <XCircleIcon size={18}/>
            </button>
          ) : undefined,
        isMinimized: false 
      },
    ];
    setDashboardCards(initialCardsConfig);
  }, [activeMicroApp, handleLaunchApp, handleCloseApp]);

  const handleToggleMinimize = (id: string) => {
    setDashboardCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isMinimized: !card.isMinimized } : card
      )
    );
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedCardId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    document.body.classList.add('dragging-active');
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const targetElement = e.currentTarget as HTMLDivElement;
    if (targetElement.id !== draggedCardId) {
       targetElement.classList.add('drag-over-target'); 
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
     const targetElement = e.currentTarget as HTMLDivElement;
     targetElement.classList.remove('drag-over-target');
  };


  const handleDrop = (e: DragEvent<HTMLDivElement>, targetCardId: string) => {
    e.preventDefault();
    document.body.classList.remove('dragging-active');
    const targetElement = e.currentTarget as HTMLDivElement;
    targetElement.classList.remove('drag-over-target');

    if (!draggedCardId || draggedCardId === targetCardId) {
      setDraggedCardId(null);
      return;
    }

    const draggedIndex = dashboardCards.findIndex(card => card.id === draggedCardId);
    const targetIndex = dashboardCards.findIndex(card => card.id === targetCardId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedCardId(null);
      return;
    }

    const newCards = [...dashboardCards];
    const [draggedItem] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, draggedItem);

    setDashboardCards(newCards);
    setDraggedCardId(null);
  };
  
  useEffect(() => {
    return () => {
      document.body.classList.remove('dragging-active');
    };
  }, []);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1" style={{gridAutoRows: "minmax(min-content, max-content)"}}>
      {dashboardCards.map(cardConfig => (
        <DashboardCard
          key={cardConfig.id}
          id={cardConfig.id}
          title={cardConfig.title}
          icon={cardConfig.icon}
          isMinimized={cardConfig.isMinimized}
          onToggleMinimize={handleToggleMinimize}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`${cardConfig.className || 'lg:col-span-1'} ${draggedCardId === cardConfig.id ? 'opacity-50' : ''}`}
          actionIcons={cardConfig.actionIcons}
          cardBg={cardConfig.cardBg}
          cardBorder={cardConfig.cardBorder}
        >
          {cardConfig.content}
        </DashboardCard>
      ))}
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-obsidian-black via-imperial-purple/80 to-roman-aqua/70 bg-[length:200%_200%] animate-aurora-bg text-vitreous-white">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <DashboardContent />
      </main>
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-3 sm:right-3 sm:left-auto bg-obsidian-black/50 backdrop-blur-sm py-2.5 px-3 rounded-none sm:rounded-lg text-center text-xs shadow-glass-DEFAULT border-t sm:border border-vitreous-white/10">
          <p className="font-comfortaa text-sm text-vitreous-white">ΛΞVOS <span className="text-xs text-roman-aqua/80">v1.0</span></p>
          <p className="text-conchoidal-gray/70 text-[0.65rem] tracking-wider">SILENT AUTOMATION</p>
      </div>
    </div>
  );
};

export default App;