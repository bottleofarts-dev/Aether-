import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  BarChart3, 
  Bell, 
  Search, 
  ChevronRight, 
  Plus, 
  X, 
  Maximize2,
  Activity,
  Cpu,
  Zap,
  MousePointer2,
  Box,
  Globe,
  Shield,
  Database,
  Terminal,
  RefreshCcw,
  Trash2,
  Download,
  Share2,
  Brain
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---
type Tab = { id: string; label: string; icon: React.ElementType };

// --- Constants ---
const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'Assets', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PALETTES = [
  {
    id: 'emerald-dark',
    name: 'Emerald Dark',
    colors: {
      '--accent-color': '#10b981',
      '--accent-muted': 'rgba(16, 185, 129, 0.1)',
      '--accent-glow': 'rgba(16, 185, 129, 0.3)',
      '--bg-color': '#050505',
      '--text-color': '#ffffff',
      '--glass-color': 'rgba(255, 255, 255, 0.05)',
      '--glass-border-color': 'rgba(255, 255, 255, 0.1)',
    }
  },
  {
    id: 'sapphire-dark',
    name: 'Sapphire Dark',
    colors: {
      '--accent-color': '#3b82f6',
      '--accent-muted': 'rgba(59, 130, 246, 0.1)',
      '--accent-glow': 'rgba(59, 130, 246, 0.3)',
      '--bg-color': '#020617',
      '--text-color': '#ffffff',
      '--glass-color': 'rgba(255, 255, 255, 0.05)',
      '--glass-border-color': 'rgba(255, 255, 255, 0.1)',
    }
  },
  {
    id: 'rose-light',
    name: 'Rose Light',
    colors: {
      '--accent-color': '#e11d48',
      '--accent-muted': 'rgba(225, 29, 72, 0.1)',
      '--accent-glow': 'rgba(225, 29, 72, 0.15)',
      '--bg-color': '#fff1f2',
      '--text-color': '#1f2937',
      '--glass-color': 'rgba(255, 255, 255, 0.4)',
      '--glass-border-color': 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'amber-light',
    name: 'Amber Light',
    colors: {
      '--accent-color': '#d97706',
      '--accent-muted': 'rgba(217, 119, 6, 0.1)',
      '--accent-glow': 'rgba(217, 119, 6, 0.15)',
      '--bg-color': '#fffbeb',
      '--text-color': '#1f2937',
      '--glass-color': 'rgba(255, 255, 255, 0.4)',
      '--glass-border-color': 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: {
      '--accent-color': '#ffffff',
      '--accent-muted': 'rgba(255, 255, 255, 0.1)',
      '--accent-glow': 'rgba(255, 255, 255, 0.2)',
      '--bg-color': '#000000',
      '--text-color': '#ffffff',
      '--glass-color': 'rgba(255, 255, 255, 0.05)',
      '--glass-border-color': 'rgba(255, 255, 255, 0.2)',
    }
  }
];

const CHART_DATA = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 1 };

// --- Components ---

/**
 * 1. Navigation System
 * Floating glass morphism sidebar with spring physics
 * Responsive: Bottom nav on mobile
 */
const Sidebar = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        layout
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        className="fixed left-6 top-1/2 -translate-y-1/2 glass-panel rounded-3xl p-3 z-50 hidden md:flex flex-col gap-4 overflow-hidden"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center gap-4 px-3 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-neon">
            <Zap className="text-bg w-6 h-6" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display font-bold text-lg tracking-tight"
              >
                AETHER
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2 relative">
          {/* Active Indicator */}
          <motion.div
            layoutId="active-pill-desktop"
            className="absolute left-0 right-0 h-12 bg-accent/10 rounded-xl border border-accent/10"
            transition={SPRING_CONFIG}
            style={{
              top: TABS.findIndex(t => t.id === activeTab) * (48 + 8),
            }}
          />

          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex items-center gap-4 h-12 px-3 rounded-xl transition-colors z-10",
                  isActive ? "text-text" : "text-text/40 hover:text-text/70"
                )}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <div className="glass-panel rounded-2xl p-2 flex justify-around items-center">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative p-3 rounded-xl transition-colors",
                  isActive ? "text-accent bg-accent/10" : "text-text/40"
                )}
              >
                <Icon className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    layoutId="active-pill-mobile"
                    className="absolute inset-0 bg-accent/10 rounded-xl border border-accent/10"
                    transition={SPRING_CONFIG}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * 2. Dashboard Cards
 * Layered cards with 3D tilt and staggered entrance
 */
const TiltCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt on mobile/touch
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, ...SPRING_CONFIG }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("glass-card p-6 group cursor-pointer", className)}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

/**
 * 3. Smart Sliders
 * Elastic drag physics and haptic visual feedback
 */
const SmartSlider = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-xs font-mono uppercase tracking-widest text-text/40">{label}</span>
        <span className="text-xl font-display font-light">{Math.round(value)}%</span>
      </div>
      <div className="relative h-8 flex items-center" ref={constraintsRef}>
        <div className="absolute inset-0 h-1 bg-text/5 rounded-full top-1/2 -translate-y-1/2" />
        <motion.div 
          className="absolute h-1 bg-accent rounded-full top-1/2 -translate-y-1/2 shadow-neon"
          style={{ width: `${value}%` }}
        />
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(_, info) => {
            const rect = (constraintsRef.current as any).getBoundingClientRect();
            const newValue = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
            onChange(newValue);
          }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          className="absolute w-6 h-6 bg-text rounded-full shadow-xl border-4 border-accent cursor-grab active:cursor-grabbing z-10"
          style={{ left: `calc(${value}% - 12px)` }}
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -40, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 bg-text text-bg text-[10px] font-bold px-2 py-1 rounded-md"
              >
                {Math.round(value)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * 4. Buttons
 * Liquid press and morphing states
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className,
  onClick
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'ghost'; 
  isLoading?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden group",
        variant === 'primary' && "bg-accent text-bg shadow-neon hover:opacity-90",
        variant === 'secondary' && "bg-text/5 text-text border border-text/10 hover:bg-text/10",
        variant === 'ghost' && "text-text/60 hover:text-text hover:bg-text/5",
        className
      )}
    >
      {ripples.map(ripple => (
        <span 
          key={ripple.id}
          className="liquid-ripple"
          style={{ left: ripple.x, top: ripple.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
        />
      ))}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            />
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* Liquid Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
};

/**
 * Color Palette Dialer - Circular Version
 */
const PaletteDialer = ({ currentPalette, onPaletteChange }: { currentPalette: string; onPaletteChange: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-accent/20 shadow-neon group"
      >
        <div 
          className="w-6 h-6 rounded-full transition-colors duration-500" 
          style={{ backgroundColor: PALETTES.find(p => p.id === currentPalette)?.colors['--accent-color'] }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: -180 }}
              className="absolute top-0 right-0 z-[70] origin-top-right"
            >
              <div className="relative w-48 h-48">
                {PALETTES.map((palette, index) => {
                  const angle = (index / PALETTES.length) * Math.PI * 2;
                  const radius = 70;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.button
                      key={palette.id}
                      onClick={() => {
                        onPaletteChange(palette.id);
                        setIsOpen(false);
                      }}
                      initial={{ opacity: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, x, y }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 transition-all shadow-lg",
                        currentPalette === palette.id ? "border-text scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: palette.colors['--accent-color'] }}
                      title={palette.name}
                    />
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 6. Modal System
 * Backdrop blur and spring entrance
 */
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={SPRING_CONFIG}
            className="relative w-full max-w-lg glass-panel rounded-[32px] p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-text/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 7. Notification Toast
 */
interface ToastProps {
  message: string;
  onRemove: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border-accent/20"
    >
      <div className="w-2 h-2 rounded-full bg-accent shadow-neon" />
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sliderValue, setSliderValue] = useState(65);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [currentPalette, setCurrentPalette] = useState('emerald-dark');

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAction = (msg: string = "System parameters synchronized") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast(msg);
    }, 1500);
  };

  const handlePaletteChange = (id: string) => {
    const palette = PALETTES.find(p => p.id === id);
    if (palette) {
      setCurrentPalette(id);
      Object.entries(palette.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      addToast(`Theme switched to ${palette.name}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Main Chart */}
            <HolographicCard className="col-span-12 lg:col-span-8 h-[300px] md:h-[400px] flex flex-col" delay={0.1}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold mb-1">Network Throughput</h3>
                  <p className="text-sm text-text/40">Real-time packet analysis</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent/20">
                    Live
                  </div>
                </div>
              </div>
              <div className="flex-1 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--glass-border-color)', borderRadius: '12px', color: 'var(--text-color)' }}
                      itemStyle={{ color: 'var(--accent-color)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--accent-color)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </HolographicCard>

            {/* Stats Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <TiltCard delay={0.2}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <Cpu className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Core Load</h4>
                    <p className="text-xs text-text/40">8-Core Neural Engine</p>
                  </div>
                </div>
                <SmartSlider 
                  label="Utilization" 
                  value={sliderValue} 
                  onChange={setSliderValue} 
                />
              </TiltCard>

              <TiltCard delay={0.3}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <Activity className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">System Health</h4>
                    <p className="text-xs text-text/40">All nodes operational</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-display font-bold">99.9</span>
                  <span className="text-accent font-mono text-xs mb-1.5">%</span>
                </div>
                <div className="w-full h-1.5 bg-text/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.9%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-accent shadow-neon"
                  />
                </div>
              </TiltCard>
            </div>

            {/* Secondary Grid */}
            <TiltCard className="col-span-12 lg:col-span-4" delay={0.4}>
              <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="w-full justify-center" onClick={() => setIsModalOpen(true)}>
                  Deploy
                </Button>
                <Button variant="secondary" className="w-full justify-center" onClick={() => handleAction()} isLoading={isLoading}>
                  Sync
                </Button>
              </div>
            </TiltCard>

            <TiltCard className="col-span-12 lg:col-span-8" delay={0.5}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Recent Nodes</h3>
                <Button variant="ghost" className="text-xs py-1 px-3" onClick={() => addToast("Loading node history...")}>View All</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Alpha-7', status: 'Active', load: '12%' },
                  { name: 'Beta-X', status: 'Idle', load: '0%' },
                  { name: 'Gamma-9', status: 'Active', load: '84%' },
                ].map((node) => (
                  <motion.div 
                    key={node.name}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => addToast(`Inspecting ${node.name}`)}
                    className="flex items-center justify-between p-4 rounded-xl border border-text/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        node.status === 'Active' ? "bg-accent shadow-neon" : "bg-text/20"
                      )} />
                      <span className="font-medium">{node.name}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-xs font-mono text-text/40">{node.status}</span>
                      <span className="text-sm font-bold w-12 text-right">{node.load}</span>
                      <ChevronRight className="w-4 h-4 text-text/20" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </div>
        );
      case 'assets':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Neural Model v4', type: 'AI Core', size: '2.4 GB', icon: Brain },
              { name: 'Global Mesh', type: 'Network', size: '156 MB', icon: Globe },
              { name: 'Secure Vault', type: 'Storage', size: '1.2 TB', icon: Shield },
              { name: 'Data Stream', type: 'Pipeline', size: '45 MB/s', icon: Database },
              { name: 'Edge Node', type: 'Compute', size: '16 Cores', icon: Box },
              { name: 'Terminal Access', type: 'Interface', size: 'v2.1.0', icon: Terminal },
            ].map((asset, i) => (
              <TiltCard key={asset.name} delay={i * 0.1}>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <asset.icon className="text-accent w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-text/5 rounded-lg transition-colors"><Download className="w-4 h-4 text-text/40" /></button>
                    <button className="p-2 hover:bg-text/5 rounded-lg transition-colors"><Share2 className="w-4 h-4 text-text/40" /></button>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{asset.name}</h3>
                <p className="text-sm text-text/40 mb-4">{asset.type}</p>
                <div className="flex justify-between items-center pt-4 border-t border-text/5">
                  <span className="text-xs font-mono text-text/30 uppercase tracking-wider">{asset.size}</span>
                  <Button variant="ghost" className="text-xs py-1 px-3">Manage</Button>
                </div>
              </TiltCard>
            ))}
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <HolographicCard className="col-span-12 lg:col-span-8 h-[400px]" delay={0.1}>
                <h3 className="text-lg font-bold mb-8">Performance Heatmap</h3>
                <div className="grid grid-cols-7 gap-2 h-full pb-12">
                  {[...Array(49)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="rounded-md bg-accent"
                      style={{ opacity: Math.random() * 0.8 + 0.2 }}
                    />
                  ))}
                </div>
              </HolographicCard>
              <TiltCard className="col-span-12 lg:col-span-4" delay={0.2}>
                <h3 className="text-lg font-bold mb-6">Resource Allocation</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Compute', value: 75 },
                    { label: 'Memory', value: 45 },
                    { label: 'Bandwidth', value: 90 },
                    { label: 'Storage', value: 30 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-text/40">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-text/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Requests', value: '1.2M', change: '+12%' },
                { label: 'Avg Latency', value: '24ms', change: '-4ms' },
                { label: 'Uptime', value: '99.99%', change: 'Stable' },
              ].map((stat, i) => (
                <TiltCard key={stat.label} delay={0.3 + i * 0.1}>
                  <p className="text-xs font-mono uppercase tracking-widest text-text/40 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <h4 className="text-3xl font-display font-bold">{stat.value}</h4>
                    <span className="text-xs font-bold text-accent">{stat.change}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { title: 'System Update', desc: 'Aether Core v2.4.1 has been deployed successfully.', time: '2m ago', type: 'info' },
              { title: 'Security Alert', desc: 'Unusual login attempt detected from node 192.168.1.45.', time: '15m ago', type: 'warning' },
              { title: 'Resource Warning', desc: 'Compute cluster Alpha-7 is reaching 90% utilization.', time: '1h ago', type: 'warning' },
              { title: 'New Asset', desc: 'Neural Model v4 is now available for deployment.', time: '3h ago', type: 'success' },
              { title: 'Sync Complete', desc: 'All edge nodes are now synchronized with the primary vault.', time: '5h ago', type: 'success' },
            ].map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-accent/50 flex items-start gap-6 group cursor-pointer hover:bg-text/5 transition-colors"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  note.type === 'warning' ? "bg-amber-500/20 text-amber-500" : "bg-accent/20 text-accent"
                )}>
                  {note.type === 'warning' ? <Bell className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold">{note.title}</h4>
                    <span className="text-xs text-text/30 font-mono">{note.time}</span>
                  </div>
                  <p className="text-sm text-text/60 leading-relaxed">{note.desc}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-text/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4 text-text/40" />
                </button>
              </motion.div>
            ))}
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-accent" /> System Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
                    <div>
                      <p className="font-bold">Neural Acceleration</p>
                      <p className="text-xs text-text/40">Optimize for high-speed inference</p>
                    </div>
                    <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                      <motion.div className="absolute top-1 left-1 w-4 h-4 bg-bg rounded-full" animate={{ x: 24 }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
                    <div>
                      <p className="font-bold">Auto-Sync Nodes</p>
                      <p className="text-xs text-text/40">Propagate changes automatically</p>
                    </div>
                    <div className="w-12 h-6 bg-text/10 rounded-full relative cursor-pointer">
                      <motion.div className="absolute top-1 left-1 w-4 h-4 bg-bg rounded-full" />
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" /> Security
                </h3>
                <div className="space-y-4">
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <RefreshCcw className="w-4 h-4" /> Rotate API Keys
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <Database className="w-4 h-4" /> Purge Cache
                  </Button>
                </div>
              </section>
            </div>
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" /> Interface
                </h3>
                <div className="space-y-6">
                  <SmartSlider label="UI Scale" value={80} onChange={() => {}} />
                  <SmartSlider label="Animation Speed" value={50} onChange={() => {}} />
                </div>
              </section>
              <TiltCard className="bg-accent/5 border-accent/20">
                <h4 className="font-bold mb-2">Aether Pro</h4>
                <p className="text-sm text-text/60 mb-6">Unlock advanced neural diagnostics and unlimited edge nodes.</p>
                <Button variant="primary" className="w-full">Upgrade Now</Button>
              </TiltCard>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-accent/30 pb-24 md:pb-0">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 px-6 md:pl-32 md:pr-12 py-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
              {TABS.find(t => t.id === activeTab)?.label} <span className="text-accent">Overview</span>
            </h1>
            <p className="text-text/40 font-mono text-xs uppercase tracking-widest">
              Last sync: 2026.02.25 // 04:30:12
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <PaletteDialer currentPalette={currentPalette} onPaletteChange={handlePaletteChange} />
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search nodes..."
                className="bg-text/5 border border-text/10 rounded-xl py-3 pl-12 pr-6 focus:outline-none focus:border-accent/50 w-full md:w-64 transition-all"
              />
            </div>
            <Button variant="secondary" className="px-4" onClick={() => addToast("New node initialized")}>
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Deploy Protocol"
      >
        <div className="space-y-6">
          <p className="text-text/60 leading-relaxed">
            You are about to initiate the deployment sequence for <span className="text-text font-bold">Aether-Core-v2</span>. This will synchronize all edge nodes and propagate the latest neural weights.
          </p>
          <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-start gap-4">
            <Zap className="text-accent w-5 h-5 shrink-0 mt-1" />
            <div className="text-sm">
              <p className="font-bold text-accent mb-1">Neural Optimization Active</p>
              <p className="text-accent/60">Deployment will be 40% faster than previous iterations.</p>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={() => {
              setIsModalOpen(false);
              handleAction("Deployment sequence initiated");
            }}>Initiate</Button>
          </div>
        </div>
      </Modal>

      {/* Toasts Container */}
      <div className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[200] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast: { id: number; message: string }) => (
            <Toast 
              key={toast.id} 
              message={toast.message} 
              onRemove={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Custom Cursor */}
      <CustomCursor />
    </div>
  );
}

/**
 * Extraordinary Feature: Holographic Depth Card
 * Creates a 3D "window" effect with multi-layer parallax and visible side-walls.
 */
const HolographicCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Parallax offsets for internal layers
  const layer1X = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const layer1Y = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);
  
  const layer2X = useTransform(mouseXSpring, [-0.5, 0.5], ["-40px", "40px"]);
  const layer2Y = useTransform(mouseYSpring, [-0.5, 0.5], ["-40px", "40px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (window.innerWidth / 2));
    y.set((e.clientY - centerY) / (window.innerHeight / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        perspective: "1200px"
      }}
      className={cn("relative glass-panel rounded-[40px] p-8 overflow-hidden group cursor-none", className)}
    >
      {/* 3D Depth Walls */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: "translateZ(-50px)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50" />
        <div className="absolute inset-0 border-[20px] border-white/5 rounded-[40px]" />
      </div>

      {/* Layer 1: Background Grid (Deepest) */}
      <motion.div 
        style={{ x: layer2X, y: layer2Y, translateZ: "-100px" }}
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </motion.div>

      {/* Layer 2: Floating Particles (Middle) */}
      <motion.div 
        style={{ x: layer1X, y: layer1Y, translateZ: "-50px" }}
        className="absolute inset-0 pointer-events-none"
      >
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full blur-[1px]"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3: Content (Top) */}
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full">
        {children}
      </div>

      {/* Holographic Glint */}
      <motion.div 
        style={{ 
          x: useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]),
          opacity: useTransform(mouseXSpring, [-0.5, 0.5], [0, 0.3])
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/2 skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
};

/**
 * Extraordinary Feature: Magnetic Liquid Cursor
 * A cursor that "snaps" to interactive elements and morphs its shape.
 */
const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoveredElement, setHoveredElement] = useState<DOMRect | null>(null);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, input, [role="button"], .cursor-pointer');
      if (interactive) {
        setHoveredElement(interactive.getBoundingClientRect());
      } else {
        setHoveredElement(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  const cursorX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference hidden lg:block"
      animate={{
        width: hoveredElement ? hoveredElement.width + 8 : 32,
        height: hoveredElement ? hoveredElement.height + 8 : 32,
        x: hoveredElement ? hoveredElement.left - 4 : cursorX.get() - 16,
        y: hoveredElement ? hoveredElement.top - 4 : cursorY.get() - 16,
        borderRadius: hoveredElement ? "12px" : "100%",
        scale: isClicking ? 0.9 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      style={{
        border: "1px solid var(--accent-color)",
        backgroundColor: hoveredElement ? "var(--accent-muted)" : "transparent",
      }}
    >
      {!hoveredElement && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-accent rounded-full" />
      )}
    </motion.div>
  );
}
