
import React, { useState, useMemo, useEffect, useCallback, ForwardRefExoticComponent, RefAttributes } from 'react';
import HomeIcon from './components/icons/HomeIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import UserIcon from './components/icons/UserIcon';
import BellIcon from './components/icons/BellIcon';
import SearchIcon from './components/icons/SearchIcon';
import ChevronDownIcon from './components/icons/ChevronDownIcon';
import FileIcon from './components/icons/FileIcon';
import FolderIcon from './components/icons/FolderIcon';
import CalendarIcon from './components/icons/CalendarIcon';
import ClockIcon from './components/icons/ClockIcon';
import MailIcon from './components/icons/MailIcon';
import ChartBarIcon from './components/icons/ChartBarIcon';
import MapPinIcon from './components/icons/MapPinIcon';
import CameraIcon from './components/icons/CameraIcon';
import MicIcon from './components/icons/MicIcon';
import PlayIcon from './components/icons/PlayIcon';
import TrashIcon from './components/icons/TrashIcon';
import EditIcon from './components/icons/EditIcon';
import LinkIcon from './components/icons/LinkIcon';
import LogoutIcon from './components/icons/LogoutIcon';
import PlusCircleIcon from './components/icons/PlusCircleIcon';
import ArchiveIcon from './components/icons/ArchiveIcon';
import BookmarkIcon from './components/icons/BookmarkIcon';
import BriefcaseIcon from './components/icons/BriefcaseIcon';
import ClipboardIcon from './components/icons/ClipboardIcon';
import CompassIcon from './components/icons/CompassIcon';
import CreditCardIcon from './components/icons/CreditCardIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ExternalLinkIcon from './components/icons/ExternalLinkIcon';
import FilterIcon from './components/icons/FilterIcon';
import FlagIcon from './components/icons/FlagIcon';
import GiftIcon from './components/icons/GiftIcon';
import ImageIcon from './components/icons/ImageIcon';
import LayersIcon from './components/icons/LayersIcon';
import MaximizeIcon from './components/icons/MaximizeIcon';
import ShieldIcon from './components/icons/ShieldIcon';
import UploadIcon from './components/icons/UploadIcon';
import CheckCircleIcon from './components/icons/CheckCircleIcon';
import XCircleIcon from './components/icons/XCircleIcon';
import InfoCircleIcon from './components/icons/InfoCircleIcon';
import StarIcon from './components/icons/StarIcon';
import { IconProps } from './types';
import SearchBar from './components/SearchBar';
import IconDetailModal from './components/IconDetailModal'; // New Import

// Icons - Batch 1
import PauseIcon from './components/icons/PauseIcon';
import StopIcon from './components/icons/StopIcon';
import VolumeUpIcon from './components/icons/VolumeUpIcon';
import VolumeDownIcon from './components/icons/VolumeDownIcon';
import MuteIcon from './components/icons/MuteIcon';
import CopyIcon from './components/icons/CopyIcon';
import SaveIcon from './components/icons/SaveIcon';
import PrintIcon from './components/icons/PrintIcon';
import MenuIcon from './components/icons/MenuIcon';
import CloudIcon from './components/icons/CloudIcon';
import LaptopIcon from './components/icons/LaptopIcon';
import PhoneIcon from './components/icons/PhoneIcon';
import ShoppingCartIcon from './components/icons/ShoppingCartIcon';
import AlertTriangleIcon from './components/icons/AlertTriangleIcon';
import CodeIcon from './components/icons/CodeIcon';
import TerminalIcon from './components/icons/TerminalIcon';
import RefreshIcon from './components/icons/RefreshIcon';
import EyeIcon from './components/icons/EyeIcon';
import EyeSlashIcon from './components/icons/EyeSlashIcon';
import ShareIcon from './components/icons/ShareIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import HeartIcon from './components/icons/HeartIcon';
import GlobeIcon from './components/icons/GlobeIcon';
import LockIcon from './components/icons/LockIcon';
import UnlockIcon from './components/icons/UnlockIcon';
import ServerIcon from './components/icons/ServerIcon';
import TrendingUpIcon from './components/icons/TrendingUpIcon';
import WrenchIcon from './components/icons/WrenchIcon';
import ZapIcon from './components/icons/ZapIcon';
import ActivityIcon from './components/icons/ActivityIcon';

// Icons - Batch 2 (AI, Medical, Business, Construction, LOOM)
import AIBrainIcon from './components/icons/AIBrainIcon';
import AgentHeadIcon from './components/icons/AgentHeadIcon';
import AIProcessingIcon from './components/icons/AIProcessingIcon';
import ChatbotIcon from './components/icons/ChatbotIcon';
import StethoscopeIcon from './components/icons/StethoscopeIcon';
import CaduceusIcon from './components/icons/CaduceusIcon';
import PillCapsuleIcon from './components/icons/PillCapsuleIcon';
import HeartbeatLineIcon from './components/icons/HeartbeatLineIcon';
import DNAStrandIcon from './components/icons/DNAStrandIcon';
import TeamIcon from './components/icons/TeamIcon';
import InvoiceIcon from './components/icons/InvoiceIcon';
import HandshakeIcon from './components/icons/HandshakeIcon';
import HardHatIcon from './components/icons/HardHatIcon';
import BlueprintIcon from './components/icons/BlueprintIcon';
import CraneIcon from './components/icons/CraneIcon';
import HammerIcon from './components/icons/HammerIcon';
import LoomWeaveIcon from './components/icons/LoomWeaveIcon';
import LoomShuttleIcon from './components/icons/LoomShuttleIcon';

// Icons - Batch 3 (Game Changing Custom Icons)
import AIEthicsIcon from './components/icons/AIEthicsIcon';
import AICollaborationIcon from './components/icons/AICollaborationIcon';
import AutonomousDecisionIcon from './components/icons/AutonomousDecisionIcon';
import RoboticSurgeryArmIcon from './components/icons/RoboticSurgeryArmIcon';
import TelemedicineIcon from './components/icons/TelemedicineIcon';
import PersonalizedMedicineIcon from './components/icons/PersonalizedMedicineIcon';
import MedicalNanobotIcon from './components/icons/MedicalNanobotIcon';
import CRMIcon from './components/icons/CRMIcon';
import SupplyChainIcon from './components/icons/SupplyChainIcon';
import AutomatedWorkflowIcon from './components/icons/AutomatedWorkflowIcon';
import DataAnalyticsDeepDiveIcon from './components/icons/DataAnalyticsDeepDiveIcon';
import DroneSurveyingIcon from './components/icons/DroneSurveyingIcon';
import ThreeDPrintedStructureIcon from './components/icons/ThreeDPrintedStructureIcon';
import SmartBuildingIcon from './components/icons/SmartBuildingIcon';
import ModularConstructionIcon from './components/icons/ModularConstructionIcon';
import ConstructionSafetyGearIcon from './components/icons/ConstructionSafetyGearIcon';
import LoomNexusIcon from './components/icons/LoomNexusIcon';
import FirewallIcon from './components/icons/FirewallIcon';
import VirtualMachineIcon from './components/icons/VirtualMachineIcon';
import APIIcon from './components/icons/APIIcon';

// Icons - Batch 4 (Refactor & Expand)
import AIModelTrainingIcon from './components/icons/AIModelTrainingIcon';
import AIPredictionIcon from './components/icons/AIPredictionIcon';
import AgentTaskManagementIcon from './components/icons/AgentTaskManagementIcon';
import HumanAIInteractionIcon from './components/icons/HumanAIInteractionIcon';
import MedicalRecordsIcon from './components/icons/MedicalRecordsIcon';
import MicroscopeIcon from './components/icons/MicroscopeIcon';
import RXPharmaIcon from './components/icons/RXPharmaIcon';
import GenomicSequencingIcon from './components/icons/GenomicSequencingIcon';
import MedicalImagingIcon from './components/icons/MedicalImagingIcon';
import ProjectManagementIcon from './components/icons/ProjectManagementIcon';
import FinancialReportIcon from './components/icons/FinancialReportIcon';
import ECommercePlatformIcon from './components/icons/ECommercePlatformIcon';
import LogisticsTruckIcon from './components/icons/LogisticsTruckIcon';
import BIDashboardIcon from './components/icons/BIDashboardIcon';
import CADDesignIcon from './components/icons/CADDesignIcon';
import BIMIcon from './components/icons/BIMIcon';
import TheodoliteIcon from './components/icons/TheodoliteIcon';
import ExcavatorIcon from './components/icons/ExcavatorIcon';
import LoomDataFlowIcon from './components/icons/LoomDataFlowIcon';
import LoomOrchestrationIcon from './components/icons/LoomOrchestrationIcon';
import SystemDiagnosticsIcon from './components/icons/SystemDiagnosticsIcon';
import BackupRecoveryIcon from './components/icons/BackupRecoveryIcon';
import UserPermissionsIcon from './components/icons/UserPermissionsIcon';
import PluginIcon from './components/icons/PluginIcon';


export interface IconDisplayInfo {
  name: string;
  component: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  defaultSize: number;
  defaultStrokeWidth: number;
  isNew?: boolean;
  tags?: string[];
  id: string; 
  views?: number;
}

const allIconsData: Omit<IconDisplayInfo, 'id' | 'views' | 'component'> & { component: any }[] = [
  { name: "Home", component: HomeIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["house", "main", "dashboard"] },
  { name: "Settings", component: SettingsIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["options", "gear", "configuration"] },
  { name: "User", component: UserIcon, defaultSize: 32, defaultStrokeWidth: 1.8, tags: ["profile", "account", "person"] },
  { name: "File", component: FileIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["document", "page", "text"] },
  { name: "Search", component: SearchIcon, defaultSize: 28, defaultStrokeWidth: 2.5, tags: ["find", "magnify", "query"] },
  { name: "Shield", component: ShieldIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["security", "protection", "guard"] },
  { name: "Bell", component: BellIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["notification", "alert", "alarm"] },
  { name: "Chevron Down", component: ChevronDownIcon, defaultSize: 28, defaultStrokeWidth: 2.8, tags: ["arrow", "dropdown", "expand"] },
  { name: "Folder", component: FolderIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["directory", "collection", "group"] },
  { name: "Calendar", component: CalendarIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["date", "event", "schedule"] },
  { name: "Clock", component: ClockIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["time", "watch", "hour"] },
  { name: "Mail", component: MailIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["email", "message", "inbox"] },
  { name: "Chart Bar", component: ChartBarIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["statistics", "graph", "analytics"] },
  { name: "Map Pin", component: MapPinIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["location", "address", "gps"] },
  { name: "Camera", component: CameraIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["photo", "image", "picture"] },
  { name: "Microphone", component: MicIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["audio", "record", "sound", "voice"] },
  { name: "Play", component: PlayIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["video", "music", "start", "run"] },
  { name: "Trash", component: TrashIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["delete", "remove", "bin"] },
  { name: "Edit", component: EditIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["pencil", "modify", "write", "change"] },
  { name: "Link", component: LinkIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["url", "connect", "chain"] },
  { name: "Logout", component: LogoutIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["exit", "sign out", "leave"] },
  { name: "Plus Circle", component: PlusCircleIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["add", "new", "create"] },
  { name: "Archive", component: ArchiveIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["box", "storage", "backup"] },
  { name: "Bookmark", component: BookmarkIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["save", "favorite", "ribbon"] },
  { name: "Briefcase", component: BriefcaseIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["work", "business", "portfolio", "case"] },
  { name: "Clipboard", component: ClipboardIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["copy", "paste", "notes"] },
  { name: "Compass", component: CompassIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["navigation", "direction", "explore", "orientation"] },
  { name: "Credit Card", component: CreditCardIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["payment", "finance", "money", "purchase"] },
  { name: "Database", component: DatabaseIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["data", "storage", "server", "sql"] },
  { name: "Download", component: DownloadIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["save", "get", "arrow down"] },
  { name: "External Link", component: ExternalLinkIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["open new", "redirect", "url"] },
  { name: "Filter", component: FilterIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["sort", "funnel", "refine"] },
  { name: "Flag", component: FlagIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["report", "mark", "banner"] },
  { name: "Gift", component: GiftIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["present", "reward", "bonus", "surprise"] },
  { name: "Image", component: ImageIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["picture", "photo", "gallery", "landscape"] },
  { name: "Layers", component: LayersIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["stack", "levels", "arrange", "order"] },
  { name: "Maximize", component: MaximizeIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["fullscreen", "expand", "enlarge"] },
  { name: "Upload", component: UploadIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["send", "submit", "arrow up"] },
  { name: "Check Circle", component: CheckCircleIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["success", "done", "complete", "valid"] },
  { name: "X Circle", component: XCircleIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["error", "fail", "cancel", "invalid", "close"] },
  { name: "Info Circle", component: InfoCircleIcon, defaultSize: 32, defaultStrokeWidth: 2, tags: ["information", "details", "help", "about"] },
  { name: "Star", component: StarIcon, defaultSize: 30, defaultStrokeWidth: 2, isNew: true, tags: ["favorite", "rating", "highlight", "important"] },

  // Icons Batch 1
  { name: "Pause", component: PauseIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["media", "control", "hold", "stop"] },
  { name: "Stop", component: StopIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["media", "control", "end", "halt"] },
  { name: "Volume Up", component: VolumeUpIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["sound", "audio", "increase", "loud"] },
  { name: "Volume Down", component: VolumeDownIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["sound", "audio", "decrease", "quiet"] },
  { name: "Mute", component: MuteIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["sound", "audio", "silent", "off"] },
  { name: "Copy", component: CopyIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["duplicate", "clone", "content"] },
  { name: "Save", component: SaveIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["disk", "floppy", "store", "data"] },
  { name: "Print", component: PrintIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["document", "paper", "output"] },
  { name: "Menu", component: MenuIcon, defaultSize: 32, defaultStrokeWidth: 2.2, isNew: true, tags: ["hamburger", "navigation", "options", "list"] },
  { name: "Cloud", component: CloudIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["storage", "online", "weather", "network"] },
  { name: "Laptop", component: LaptopIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["computer", "pc", "device", "notebook"] },
  { name: "Phone", component: PhoneIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["call", "mobile", "contact", "communication"] },
  { name: "Shopping Cart", component: ShoppingCartIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["ecommerce", "buy", "purchase", "store"] },
  { name: "Alert Triangle", component: AlertTriangleIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["warning", "caution", "error", "danger", "notification"] },
  { name: "Code", component: CodeIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["develop", "programming", "script", "html", "css"] },
  { name: "Terminal", component: TerminalIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["console", "command", "cli", "shell", "prompt"] },
  { name: "Refresh", component: RefreshIcon, defaultSize: 32, defaultStrokeWidth: 2.2, isNew: true, tags: ["reload", "sync", "update", "spin"] },
  { name: "Eye", component: EyeIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["view", "visible", "show", "preview"] },
  { name: "Eye Slash", component: EyeSlashIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["hide", "hidden", "invisible", "preview off"] },
  { name: "Share", component: ShareIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["connect", "network", "send", "social"] },
  { name: "Sun", component: SunIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["light mode", "day", "brightness", "weather", "clear"] },
  { name: "Moon", component: MoonIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["dark mode", "night", "brightness", "sleep"] },
  { name: "Heart", component: HeartIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["love", "like", "favorite", "emotion"] },
  { name: "Globe", component: GlobeIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["world", "internet", "language", "international", "map"] },
  { name: "Lock", component: LockIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["secure", "password", "protect", "closed", "privacy"] },
  { name: "Unlock", component: UnlockIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["open", "access", "unsecure", "public"] },
  { name: "Server", component: ServerIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["hosting", "network", "data center", "backend"] },
  { name: "Trending Up", component: TrendingUpIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["growth", "increase", "analytics", "statistics", "performance"] },
  { name: "Wrench", component: WrenchIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["tool", "fix", "repair", "configure", "spanner"] },
  { name: "Zap", component: ZapIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["lightning", "flash", "energy", "quick", "action"] },
  { name: "Activity", component: ActivityIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["pulse", "health", "graph", "stats", "monitoring"] },

  // Icons Batch 2 - AI, Medical, Business, Construction, LOOM
  { name: "AI Brain", component: AIBrainIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "artificial intelligence", "neural network", "machine learning", "mind", "compute"] },
  { name: "Agent Head", component: AgentHeadIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "agent", "bot", "robot", "assistant", "automation", "profile"] },
  { name: "AI Processing", component: AIProcessingIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "processing", "thinking", "learning", "data flow", "algorithm"] },
  { name: "Chatbot", component: ChatbotIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["ai", "chat", "assistant", "support", "conversation", "message", "bot"] },
  { name: "Stethoscope", component: StethoscopeIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["medical", "doctor", "health", "diagnose", "heart", "listen"] },
  { name: "Caduceus", component: CaduceusIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["medical", "health", "doctor", "pharmacy", "symbol", "staff", "serpent"] },
  { name: "Pill/Capsule", component: PillCapsuleIcon, defaultSize: 30, defaultStrokeWidth: 1.5, isNew: true, tags: ["medical", "drug", "medicine", "pharmacy", "treatment", "health"] },
  { name: "Heartbeat Line", component: HeartbeatLineIcon, defaultSize: 32, defaultStrokeWidth: 2.2, isNew: true, tags: ["medical", "ecg", "ekg", "pulse", "health", "cardiology", "monitor", "heart"] },
  { name: "DNA Strand", component: DNAStrandIcon, defaultSize: 34, defaultStrokeWidth: 1.5, isNew: true, tags: ["medical", "genetics", "biology", "science", "research", "helix"] },
  { name: "Team", component: TeamIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "collaboration", "group", "users", "people", "organization"] },
  { name: "Invoice", component: InvoiceIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["business", "finance", "billing", "document", "money", "payment", "smb"] },
  { name: "Handshake", component: HandshakeIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "agreement", "deal", "partnership", "collaboration", "smb"] },
  { name: "Hard Hat", component: HardHatIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["construction", "safety", "build", "helmet", "engineer", "worker"] },
  { name: "Blueprint", component: BlueprintIcon, defaultSize: 32, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "plan", "architecture", "design", "drawing", "engineer"] },
  { name: "Crane", component: CraneIcon, defaultSize: 38, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "build", "lift", "heavy machinery", "site"] },
  { name: "Hammer", component: HammerIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["construction", "tool", "build", "repair", "carpentry", "smb"] },
  { name: "Loom Weave", component: LoomWeaveIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["loom", "abstract", "network", "interconnected", "fabric", "pattern", "system", "framework"] },
  { name: "Loom Shuttle", component: LoomShuttleIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["loom", "tool", "create", "process", "data", "weave", "framework"] },

  // Icons Batch 3 - Game Changing Custom Icons
  { name: "AI Ethics", component: AIEthicsIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "ethics", "guardrail", "security", "responsible ai", "governance"] },
  { name: "AI Collaboration", component: AICollaborationIcon, defaultSize: 38, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "collaboration", "multi-agent", "teamwork", "swarm", "network"] },
  { name: "Autonomous Decision", component: AutonomousDecisionIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "autonomy", "decision making", "automation", "process", "logic"] },
  { name: "Robotic Surgery Arm", component: RoboticSurgeryArmIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["medical", "surgery", "robotics", "automation", "precision", "health tech"] },
  { name: "Telemedicine", component: TelemedicineIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["medical", "remote", "virtual healthcare", "doctor", "consultation", "screen"] },
  { name: "Personalized Medicine", component: PersonalizedMedicineIcon, defaultSize: 36, defaultStrokeWidth: 1.6, isNew: true, tags: ["medical", "dna", "genetics", "custom", "treatment", "profile", "health"] },
  { name: "Medical Nanobot", component: MedicalNanobotIcon, defaultSize: 32, defaultStrokeWidth: 1.5, isNew: true, tags: ["medical", "nanotechnology", "future tech", "microscopic", "treatment", "health"] },
  { name: "CRM", component: CRMIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "customer relationship", "management", "network", "users", "sales"] },
  { name: "Supply Chain", component: SupplyChainIcon, defaultSize: 38, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "logistics", "inventory", "transport", "nodes", "flow", "smb"] },
  { name: "Automated Workflow", component: AutomatedWorkflowIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "automation", "process", "gears", "flowchart", "efficiency", "smb"] },
  { name: "Data Analytics Deep Dive", component: DataAnalyticsDeepDiveIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "data", "analytics", "magnify", "search", "insights", "bi"] },
  { name: "Drone Surveying", component: DroneSurveyingIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["construction", "drone", "survey", "mapping", "aerial", "technology"] },
  { name: "3D Printed Structure", component: ThreeDPrintedStructureIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "3d printing", "additive manufacturing", "build", "architecture", "technology"] },
  { name: "Smart Building", component: SmartBuildingIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "iot", "smart home", "automation", "building", "technology", "connectivity"] },
  { name: "Modular Construction", component: ModularConstructionIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "modular", "blocks", "prefabricated", "build", "assemble"] },
  { name: "Construction Safety Gear", component: ConstructionSafetyGearIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "safety", "ppe", "hardhat", "goggles", "protection"] },
  { name: "Loom Nexus", component: LoomNexusIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["loom", "network", "hub", "central", "connections", "data flow", "system"] },
  { name: "Firewall", component: FirewallIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["security", "network", "protection", "cybersecurity", "shield", "defense"] },
  { name: "Virtual Machine", component: VirtualMachineIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["os", "virtualization", "server", "container", "software", "system"] },
  { name: "API", component: APIIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["development", "integration", "interface", "connect", "software", "code"] },

  // Icons Batch 4 - Refactor & Expand
  { name: "AI Model Training", component: AIModelTrainingIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "training", "model", "data", "refinement", "machine learning"] },
  { name: "AI Prediction", component: AIPredictionIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "prediction", "forecast", "analytics", "crystal ball", "trend"] },
  { name: "Agent Task Management", component: AgentTaskManagementIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["ai", "agent", "tasks", "management", "organize", "multitask"] },
  { name: "Human-AI Interaction", component: HumanAIInteractionIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["ai", "human", "collaboration", "interface", "communication", "symbiosis"] },
  { name: "Medical Records", component: MedicalRecordsIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["medical", "ehr", "health records", "patient data", "document", "caduceus"] },
  { name: "Microscope", component: MicroscopeIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["medical", "science", "research", "laboratory", "magnify", "biology"] },
  { name: "RX Pharma", component: RXPharmaIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["medical", "prescription", "pharmacy", "drugs", "medicine", "rx"] },
  { name: "Genomic Sequencing", component: GenomicSequencingIcon, defaultSize: 36, defaultStrokeWidth: 1.6, isNew: true, tags: ["medical", "dna", "genetics", "sequence", "genome", "research", "biology"] },
  { name: "Medical Imaging", component: MedicalImagingIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["medical", "mri", "x-ray", "scan", "radiology", "diagnostics", "body"] },
  { name: "Project Management", component: ProjectManagementIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "gantt", "tasks", "board", "planning", "organization", "smb"] },
  { name: "Financial Report", component: FinancialReportIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "finance", "report", "document", "analytics", "charts", "smb"] },
  { name: "E-Commerce Platform", component: ECommercePlatformIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["business", "ecommerce", "storefront", "online shopping", "cart", "network", "smb"] },
  { name: "Logistics Truck", component: LogisticsTruckIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["business", "logistics", "transport", "delivery", "fleet", "truck", "smb"] },
  { name: "BI Dashboard", component: BIDashboardIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["business", "bi", "dashboard", "analytics", "charts", "data visualization", "smb"] },
  { name: "CAD Design", component: CADDesignIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "engineering", "cad", "design", "3d model", "architecture", "software"] },
  { name: "BIM", component: BIMIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["construction", "bim", "building information modeling", "architecture", "layers", "data"] },
  { name: "Theodolite", component: TheodoliteIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["construction", "surveying", "measurement", "land", "engineering", "theodolite"] },
  { name: "Excavator", component: ExcavatorIcon, defaultSize: 40, defaultStrokeWidth: 1.6, isNew: true, tags: ["construction", "heavy machinery", "excavator", "digger", "build"] },
  { name: "Loom Data Flow", component: LoomDataFlowIcon, defaultSize: 36, defaultStrokeWidth: 1.8, isNew: true, tags: ["loom", "data flow", "streams", "intertwined", "network", "process"] },
  { name: "Loom Orchestration", component: LoomOrchestrationIcon, defaultSize: 38, defaultStrokeWidth: 1.7, isNew: true, tags: ["loom", "orchestration", "workflow", "process management", "connected nodes", "shuttle"] },
  { name: "System Diagnostics", component: SystemDiagnosticsIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["os", "system", "diagnostics", "wrench", "graph", "health check", "utility"] },
  { name: "Backup & Recovery", component: BackupRecoveryIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["os", "backup", "recovery", "archive", "refresh arrow", "data protection"] },
  { name: "User Permissions", component: UserPermissionsIcon, defaultSize: 34, defaultStrokeWidth: 1.8, isNew: true, tags: ["os", "security", "permissions", "user roles", "access control", "key", "shield"] },
  { name: "Plugin", component: PluginIcon, defaultSize: 32, defaultStrokeWidth: 2, isNew: true, tags: ["os", "extension", "add-on", "module", "puzzle piece", "integration"] },
];

const allIcons: IconDisplayInfo[] = allIconsData.map(icon => ({
  ...icon,
  id: icon.name.toLowerCase().replace(/\s+/g, '-'), 
  views: Math.floor(Math.random() * 950) + 50,
}));


const featuredIconNames = [
    "AI Model Training", "Genomic Sequencing", "Loom Orchestration", "BIM", "Medical Imaging",
    "AI Ethics", "Robotic Surgery Arm", "Loom Nexus", "Agent Task Management", "System Diagnostics"
];


const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconDisplayInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((icon: IconDisplayInfo) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setSearchTerm(tag);
    closeModal();
    const searchBarElement = document.getElementById('icon-search');
    if (searchBarElement) {
      searchBarElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchBarElement.focus();
    }
  }, [closeModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);


  const featuredIcons = useMemo(() => {
    return featuredIconNames
      .map(name => allIcons.find(icon => icon.name === name))
      .filter(icon => icon !== undefined) as IconDisplayInfo[];
  }, []);


  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return allIcons;
    }
    return allIcons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };
  

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 selection:bg-purple-500 selection:text-white">
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-green-400">
          ΛΞVON OS
        </h1>
        <p className="text-xl sm:text-2xl text-slate-400 mt-2">Crystalline Glyph Showcase</p>
      </header>

      <section className="w-full max-w-6xl mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center text-sky-300/90 tracking-tight">Featured Glyphs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-5 sm:gap-6">
          {featuredIcons.map((icon) => {
            const { id, name, component: IconComponent, defaultSize, defaultStrokeWidth, isNew, views } = icon;
            return (
            <div
              key={`featured-${id}`}
              className="group relative bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl shadow-xl hover:shadow-purple-500/60 transition-all duration-300 flex flex-col items-center justify-center aspect-square transform hover:scale-110 border-2 border-transparent hover:border-purple-500/80 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Featured ${name} icon. Click to see details.`}
              onClick={() => openModal(icon)}
              onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? openModal(icon) : null}
              style={{ filter: 'drop-shadow(0px 2px 5px rgba(28, 25, 52, 0.6))' }}
            >
              <div className="absolute inset-0.5 rounded-lg bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
              <IconComponent size={defaultSize * 1.8} strokeWidth={defaultStrokeWidth} className="mb-2 relative z-10" />
              <p className="text-sm font-medium text-slate-200 capitalize text-center relative z-10" aria-hidden="true">{name}</p>
              <p className="text-xs text-slate-400 mt-1 relative z-10" aria-hidden="true">{`Sz: ${Math.round(defaultSize * 1.8)}`}</p>
              <p className="text-xs text-slate-500 mt-0.5 relative z-10" aria-hidden="true">Views: {views}</p>
              {isNew && (
                <span className="absolute top-2 right-2 bg-teal-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300 z-20">
                  NEW
                </span>
              )}
            </div>
          )})}
        </div>
      </section>

      <section className="w-full max-w-xl mb-12">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} onClearSearch={handleClearSearch} />
      </section>

      <section className="w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-8 text-center text-sky-300/80 tracking-tight">All Glyphs ({filteredIcons.length})</h2>
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 sm:gap-8">
            {filteredIcons.map((icon) => {
              const { id, name, component: IconComponent, defaultSize, defaultStrokeWidth, isNew, views } = icon;
              return (
              <div
                key={id}
                className="group relative bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 flex flex-col items-center justify-center aspect-square transform hover:scale-105 border-2 border-transparent hover:border-teal-500/80 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${name} icon. Click to see details.`}
                onClick={() => openModal(icon)}
                onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? openModal(icon) : null}
                style={{ filter: 'drop-shadow(0px 1px 2px rgba(28, 25, 52, 0.5))' }}
              >
                <div className="absolute inset-0.5 rounded-lg bg-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
                <IconComponent size={defaultSize * 1.5} strokeWidth={defaultStrokeWidth} className="mb-2 relative z-10" />
                <p className="text-sm font-medium text-slate-300 capitalize text-center relative z-10" aria-hidden="true">{name}</p>
                <p className="text-xs text-slate-500 mt-1 relative z-10" aria-hidden="true">{`Sz: ${Math.round(defaultSize * 1.5)}`}</p>
                <p className="text-xs text-slate-600 mt-0.5 relative z-10" aria-hidden="true">Views: {views}</p>
                {isNew && (
                  <span className="absolute top-2 right-2 bg-purple-600 text-white text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full shadow-md animate-pulse group-hover:scale-110 transition-transform duration-300 z-20">
                    NEW
                  </span>
                )}
              </div>
            )})}
          </div>
        ) : (
          <p className="text-center text-slate-400 text-lg">No icons found matching your search.</p>
        )}
      </section>

      <footer className="mt-16 py-8 border-t border-slate-700/50 w-full max-w-6xl text-center text-slate-500 text-sm space-y-3">
        <p>ΛΞVON OS Crystalline Glyphs: Icons feature custom-designed faceted forms, simulating a 3D crystalline structure with an engraved, polished texture and subtle dimensionality via drop shadow.</p>
        <p>Internal Glow Gradient: Deep Patina Green (#4A7A2A) ➔ Patina Green (#558B2F) ➔ Light Green-Aqua (#6BC4A7) ➔ Roman Aqua (#79F7FF).</p>
        <p className="mt-5">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="space-x-4">
          <a href="#" className="hover:text-teal-300 transition-colors duration-200">Designer's Portfolio</a>
          <span className="text-slate-600">|</span>
          <a href="#" className="hover:text-teal-300 transition-colors duration-200">Report an Issue</a>
        </div>
        <p className="mt-4 text-xs text-slate-600">&copy; {new Date().getFullYear()} ΛΞVON OS. All rights reserved.</p>
      </footer>

      {selectedIcon && (
        <IconDetailModal
          icon={selectedIcon}
          isOpen={isModalOpen}
          onClose={closeModal}
          onTagClick={handleTagClick}
        />
      )}
    </div>
  );
};

export default App;
