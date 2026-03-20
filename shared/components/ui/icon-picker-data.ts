import type { FC } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  // Communication
  MessageSquare, MessageCircle, Mail, MailOpen, Send, Inbox, Bell, BellRing,
  Phone, PhoneCall, Video, Mic, Headphones, Radio, Megaphone, Rss,
  // Navigation
  Map, MapPin, Compass, Globe, Navigation, Route,
  // Analytics
  BarChart2, BarChart3, PieChart, LineChart, TrendingUp, TrendingDown,
  Activity, Target, Gauge,
  // Content & Files
  FileText, File, FilePlus, Folder, FolderOpen, BookOpen, Book, Library,
  Newspaper, Hash, AtSign, Link as LucideLink, ExternalLink, Paperclip,
  // Actions
  RefreshCw, RotateCcw, Download, Upload, Share2, Copy, Edit2, Pencil,
  Plus, Minus, Trash2, Filter,
  // UI & Layout
  Settings, Settings2, Sliders, Layout, Grid, Columns, Layers, Sidebar,
  // Dev & Tech
  Code2, Code, Terminal, Database, Server, Cloud, CloudUpload, Cpu, Wifi,
  Lock, Shield, Key, Bug, GitBranch,
  // People & Social
  Users, User, UserPlus, UserCheck, Heart, Star, ThumbsUp, Award, Crown, Smile,
  // Time & Status
  Clock, Calendar, CalendarDays, Timer, CheckCircle, XCircle, AlertCircle,
  AlertTriangle, Info, HelpCircle,
  // Commerce
  Package, ShoppingCart, CreditCard, DollarSign, Tag, Gift,
  // Misc
  Flag, Bookmark, BookMarked, Archive, Box, Lightbulb, Rocket, Sparkles,
  Home, Building, Briefcase, Coffee, Flame, Zap, Sun, Moon, ClipboardList,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IconEntry {
  name:      string;
  label:     string;
  keywords?: string[];
  component: FC<LucideProps>;
}

// ── Icon registry ──────────────────────────────────────────────────────────────

export const LUCIDE_ICONS: IconEntry[] = [
  // Communication
  { name: 'MessageSquare', label: 'Chat',           keywords: ['feedback', 'message', 'comment'],       component: MessageSquare },
  { name: 'MessageCircle', label: 'Bubble',          keywords: ['message', 'chat', 'comment'],           component: MessageCircle },
  { name: 'Mail',          label: 'Email',           keywords: ['mail', 'message', 'inbox'],             component: Mail },
  { name: 'MailOpen',      label: 'Mail Open',       keywords: ['email', 'read'],                        component: MailOpen },
  { name: 'Send',          label: 'Send',            keywords: ['submit', 'share', 'forward'],           component: Send },
  { name: 'Inbox',         label: 'Inbox',           keywords: ['mail', 'receive', 'tray'],              component: Inbox },
  { name: 'Bell',          label: 'Bell',            keywords: ['notification', 'alert', 'reminder'],    component: Bell },
  { name: 'BellRing',      label: 'Bell Ring',       keywords: ['notification', 'alert', 'ringing'],     component: BellRing },
  { name: 'Phone',         label: 'Phone',           keywords: ['call', 'telephone', 'support'],         component: Phone },
  { name: 'PhoneCall',     label: 'Phone Call',      keywords: ['call', 'telephone'],                    component: PhoneCall },
  { name: 'Video',         label: 'Video',           keywords: ['call', 'meeting', 'camera'],            component: Video },
  { name: 'Mic',           label: 'Microphone',      keywords: ['audio', 'voice', 'record'],             component: Mic },
  { name: 'Headphones',    label: 'Headphones',      keywords: ['audio', 'listen', 'music'],             component: Headphones },
  { name: 'Radio',         label: 'Radio',           keywords: ['broadcast', 'signal'],                  component: Radio },
  { name: 'Megaphone',     label: 'Megaphone',       keywords: ['announce', 'broadcast', 'loud'],        component: Megaphone },
  { name: 'Rss',           label: 'RSS',             keywords: ['feed', 'subscribe', 'blog'],            component: Rss },
  // Navigation
  { name: 'Map',           label: 'Map',             keywords: ['roadmap', 'location', 'travel'],        component: Map },
  { name: 'MapPin',        label: 'Map Pin',          keywords: ['location', 'place', 'marker'],          component: MapPin },
  { name: 'Compass',       label: 'Compass',          keywords: ['explore', 'direction', 'navigate'],     component: Compass },
  { name: 'Globe',         label: 'Globe',            keywords: ['world', 'internet', 'portal', 'web'],   component: Globe },
  { name: 'Navigation',    label: 'Navigate',         keywords: ['direction', 'gps', 'arrow'],            component: Navigation },
  { name: 'Route',         label: 'Route',            keywords: ['path', 'roadmap', 'journey'],           component: Route },
  // Analytics
  { name: 'BarChart2',     label: 'Bar Chart',        keywords: ['analytics', 'stats', 'data'],           component: BarChart2 },
  { name: 'BarChart3',     label: 'Bar Chart 3',      keywords: ['analytics', 'stats', 'graph'],          component: BarChart3 },
  { name: 'PieChart',      label: 'Pie Chart',        keywords: ['analytics', 'stats', 'graph'],          component: PieChart },
  { name: 'LineChart',     label: 'Line Chart',       keywords: ['analytics', 'trend', 'graph'],          component: LineChart },
  { name: 'TrendingUp',    label: 'Trending Up',      keywords: ['growth', 'increase', 'rising'],         component: TrendingUp },
  { name: 'TrendingDown',  label: 'Trending Down',    keywords: ['decline', 'decrease', 'falling'],       component: TrendingDown },
  { name: 'Activity',      label: 'Activity',         keywords: ['analytics', 'pulse', 'stats'],          component: Activity },
  { name: 'Target',        label: 'Target',           keywords: ['goal', 'aim', 'focus'],                 component: Target },
  { name: 'Gauge',         label: 'Gauge',            keywords: ['speed', 'performance', 'meter'],        component: Gauge },
  // Content & Files
  { name: 'FileText',      label: 'Document',         keywords: ['file', 'doc', 'text', 'page'],          component: FileText },
  { name: 'File',          label: 'File',             keywords: ['document', 'page', 'blank'],            component: File },
  { name: 'FilePlus',      label: 'New File',         keywords: ['create', 'document', 'add'],            component: FilePlus },
  { name: 'Folder',        label: 'Folder',           keywords: ['directory', 'category'],                component: Folder },
  { name: 'FolderOpen',    label: 'Open Folder',      keywords: ['directory', 'browse'],                  component: FolderOpen },
  { name: 'BookOpen',      label: 'Docs',             keywords: ['documentation', 'read', 'book'],        component: BookOpen },
  { name: 'Book',          label: 'Book',             keywords: ['read', 'guide', 'manual'],              component: Book },
  { name: 'Library',       label: 'Library',          keywords: ['books', 'knowledge', 'collection'],     component: Library },
  { name: 'Newspaper',     label: 'Newspaper',        keywords: ['news', 'article', 'blog'],              component: Newspaper },
  { name: 'Hash',          label: 'Hashtag',          keywords: ['tag', 'category', 'label'],             component: Hash },
  { name: 'AtSign',        label: 'At Sign',          keywords: ['email', 'mention', 'contact'],          component: AtSign },
  { name: 'Link',          label: 'Link',             keywords: ['url', 'hyperlink', 'connect'],          component: LucideLink },
  { name: 'ExternalLink',  label: 'External Link',    keywords: ['link', 'url', 'open', 'external'],      component: ExternalLink },
  { name: 'Paperclip',     label: 'Attachment',       keywords: ['attach', 'file', 'clip'],               component: Paperclip },
  // Actions
  { name: 'RefreshCw',     label: 'Refresh',          keywords: ['reload', 'sync', 'update', 'changelog'],component: RefreshCw },
  { name: 'RotateCcw',     label: 'Undo',             keywords: ['reset', 'back', 'revert'],              component: RotateCcw },
  { name: 'Download',      label: 'Download',         keywords: ['save', 'export', 'get'],                component: Download },
  { name: 'Upload',        label: 'Upload',           keywords: ['import', 'send', 'publish'],            component: Upload },
  { name: 'Share2',        label: 'Share',            keywords: ['social', 'distribute', 'export'],       component: Share2 },
  { name: 'Copy',          label: 'Copy',             keywords: ['duplicate', 'clipboard', 'clone'],      component: Copy },
  { name: 'Edit2',         label: 'Edit',             keywords: ['write', 'modify', 'pencil'],            component: Edit2 },
  { name: 'Pencil',        label: 'Pencil',           keywords: ['write', 'draw', 'edit'],                component: Pencil },
  { name: 'Plus',          label: 'Plus',             keywords: ['add', 'create', 'new'],                 component: Plus },
  { name: 'Minus',         label: 'Minus',            keywords: ['remove', 'subtract', 'less'],           component: Minus },
  { name: 'Trash2',        label: 'Delete',           keywords: ['remove', 'trash', 'bin'],               component: Trash2 },
  { name: 'Filter',        label: 'Filter',           keywords: ['sort', 'search', 'refine'],             component: Filter },
  // UI & Layout
  { name: 'Settings',      label: 'Settings',         keywords: ['config', 'preferences', 'gear'],        component: Settings },
  { name: 'Settings2',     label: 'Settings 2',       keywords: ['config', 'sliders', 'options'],         component: Settings2 },
  { name: 'Sliders',       label: 'Sliders',          keywords: ['settings', 'adjust', 'controls'],       component: Sliders },
  { name: 'Layout',        label: 'Layout',           keywords: ['design', 'page', 'structure'],          component: Layout },
  { name: 'Grid',          label: 'Grid',             keywords: ['table', 'blocks', 'layout'],            component: Grid },
  { name: 'Columns',       label: 'Columns',          keywords: ['layout', 'panel', 'split'],             component: Columns },
  { name: 'Layers',        label: 'Layers',           keywords: ['stack', 'pages', 'depth'],              component: Layers },
  { name: 'Sidebar',       label: 'Sidebar',          keywords: ['panel', 'nav', 'layout'],               component: Sidebar },
  // Dev & Tech
  { name: 'Code2',         label: 'Code',             keywords: ['dev', 'programming', 'developer'],      component: Code2 },
  { name: 'Code',          label: 'Brackets',         keywords: ['dev', 'html', 'programming'],           component: Code },
  { name: 'Terminal',      label: 'Terminal',         keywords: ['cli', 'console', 'dev'],                component: Terminal },
  { name: 'Database',      label: 'Database',         keywords: ['storage', 'data', 'sql'],               component: Database },
  { name: 'Server',        label: 'Server',           keywords: ['backend', 'hosting', 'api'],            component: Server },
  { name: 'Cloud',         label: 'Cloud',            keywords: ['hosting', 'storage', 'saas'],           component: Cloud },
  { name: 'CloudUpload',   label: 'Cloud Upload',     keywords: ['deploy', 'storage', 'sync'],            component: CloudUpload },
  { name: 'Cpu',           label: 'CPU',              keywords: ['processor', 'hardware', 'compute'],     component: Cpu },
  { name: 'Wifi',          label: 'Wifi',             keywords: ['network', 'internet', 'connect'],       component: Wifi },
  { name: 'Lock',          label: 'Lock',             keywords: ['security', 'private', 'password'],      component: Lock },
  { name: 'Shield',        label: 'Shield',           keywords: ['security', 'protect', 'safe'],          component: Shield },
  { name: 'Key',           label: 'Key',              keywords: ['password', 'access', 'auth'],           component: Key },
  { name: 'Bug',           label: 'Bug',              keywords: ['error', 'issue', 'debug'],              component: Bug },
  { name: 'GitBranch',     label: 'Git Branch',       keywords: ['version', 'code', 'branch'],            component: GitBranch },
  // People & Social
  { name: 'Users',         label: 'Team',             keywords: ['people', 'group', 'community'],         component: Users },
  { name: 'User',          label: 'User',             keywords: ['person', 'profile', 'account'],         component: User },
  { name: 'UserPlus',      label: 'Add User',         keywords: ['invite', 'member', 'join'],             component: UserPlus },
  { name: 'UserCheck',     label: 'Verified User',    keywords: ['approve', 'confirm', 'member'],         component: UserCheck },
  { name: 'Heart',         label: 'Heart',            keywords: ['love', 'like', 'favorite'],             component: Heart },
  { name: 'Star',          label: 'Star',             keywords: ['favorite', 'rating', 'featured'],       component: Star },
  { name: 'ThumbsUp',      label: 'Thumbs Up',        keywords: ['upvote', 'like', 'vote'],               component: ThumbsUp },
  { name: 'Award',         label: 'Award',            keywords: ['badge', 'prize', 'achievement'],        component: Award },
  { name: 'Crown',         label: 'Crown',            keywords: ['premium', 'top', 'king'],               component: Crown },
  { name: 'Smile',         label: 'Smile',            keywords: ['happy', 'emoji', 'face'],               component: Smile },
  // Time & Status
  { name: 'Clock',         label: 'Clock',            keywords: ['time', 'schedule', 'duration'],         component: Clock },
  { name: 'Calendar',      label: 'Calendar',         keywords: ['date', 'schedule', 'event'],            component: Calendar },
  { name: 'CalendarDays',  label: 'Calendar Days',    keywords: ['date', 'planner', 'days'],              component: CalendarDays },
  { name: 'Timer',         label: 'Timer',            keywords: ['countdown', 'stopwatch', 'time'],       component: Timer },
  { name: 'CheckCircle',   label: 'Check Circle',     keywords: ['done', 'complete', 'success'],          component: CheckCircle },
  { name: 'XCircle',       label: 'X Circle',         keywords: ['error', 'cancel', 'reject'],            component: XCircle },
  { name: 'AlertCircle',   label: 'Alert',            keywords: ['warning', 'error', 'important'],        component: AlertCircle },
  { name: 'AlertTriangle', label: 'Warning',          keywords: ['caution', 'danger', 'alert'],           component: AlertTriangle },
  { name: 'Info',          label: 'Info',             keywords: ['information', 'help', 'about'],         component: Info },
  { name: 'HelpCircle',    label: 'Help',             keywords: ['question', 'support', 'faq'],           component: HelpCircle },
  // Commerce
  { name: 'Package',       label: 'Package',          keywords: ['box', 'product', 'delivery'],           component: Package },
  { name: 'ShoppingCart',  label: 'Cart',             keywords: ['shop', 'buy', 'commerce'],              component: ShoppingCart },
  { name: 'CreditCard',    label: 'Payment',          keywords: ['billing', 'card', 'pay'],               component: CreditCard },
  { name: 'DollarSign',    label: 'Dollar',           keywords: ['money', 'price', 'cost'],               component: DollarSign },
  { name: 'Tag',           label: 'Tag',              keywords: ['label', 'price', 'category'],           component: Tag },
  { name: 'Gift',          label: 'Gift',             keywords: ['present', 'reward', 'bonus'],           component: Gift },
  // Misc
  { name: 'Flag',          label: 'Flag',             keywords: ['goal', 'milestone', 'report'],          component: Flag },
  { name: 'Bookmark',      label: 'Bookmark',         keywords: ['save', 'favorite', 'mark'],             component: Bookmark },
  { name: 'BookMarked',    label: 'Marked Book',      keywords: ['save', 'read', 'reference'],            component: BookMarked },
  { name: 'Archive',       label: 'Archive',          keywords: ['store', 'history', 'old'],              component: Archive },
  { name: 'Box',           label: 'Box',              keywords: ['container', 'storage', 'item'],         component: Box },
  { name: 'Lightbulb',     label: 'Ideas',            keywords: ['idea', 'suggestion', 'innovation'],     component: Lightbulb },
  { name: 'Rocket',        label: 'Rocket',           keywords: ['launch', 'startup', 'release'],         component: Rocket },
  { name: 'Sparkles',      label: 'Sparkles',         keywords: ['magic', 'new', 'highlight'],            component: Sparkles },
  { name: 'Home',          label: 'Home',             keywords: ['main', 'dashboard', 'start'],           component: Home },
  { name: 'Building',      label: 'Building',         keywords: ['company', 'office', 'org'],             component: Building },
  { name: 'Briefcase',     label: 'Briefcase',        keywords: ['work', 'job', 'business'],              component: Briefcase },
  { name: 'Coffee',        label: 'Coffee',           keywords: ['break', 'casual', 'drink'],             component: Coffee },
  { name: 'Flame',         label: 'Flame',            keywords: ['hot', 'trending', 'popular'],           component: Flame },
  { name: 'Zap',           label: 'Zap',              keywords: ['fast', 'power', 'quick', 'launches'],   component: Zap },
  { name: 'Sun',           label: 'Sun',              keywords: ['light', 'day', 'theme'],                component: Sun },
  { name: 'Moon',          label: 'Moon',             keywords: ['night', 'dark', 'theme'],               component: Moon },
  { name: 'ClipboardList', label: 'Checklist',        keywords: ['survey', 'list', 'tasks', 'todo'],      component: ClipboardList },
];

// ── Derived utilities ──────────────────────────────────────────────────────────

/** Icon name → Lucide component map. Single source of truth for rendering. */
export const ICON_MAP: Record<string, FC<LucideProps>> = Object.fromEntries(
  LUCIDE_ICONS.map(({ name, component }) => [name, component]),
);

/** True when the string is an emoji character rather than a Lucide icon name. */
export function isEmoji(str: string): boolean {
  if (!str || /^[A-Z]/.test(str)) return false;
  return /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(str);
}

/** True when the string is an uploaded image URL (HTTP/HTTPS) or image extension. */
export function isImageUrl(str: string): boolean {
  if (!str) return false;
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(str)
  );
}
