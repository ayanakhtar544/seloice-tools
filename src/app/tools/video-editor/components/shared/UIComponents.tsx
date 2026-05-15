'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ── IconButton ───────────────────────────────────────────────
interface IconButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'filled' | 'outline';
  className?: string;
  title?: string;
}

export function IconButton({
  icon,
  label,
  onClick,
  active,
  disabled,
  size = 'md',
  variant = 'ghost',
  className = '',
  title,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const variantClasses = {
    ghost: active
      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent',
    filled: active
      ? 'bg-violet-500 text-white'
      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white',
    outline: active
      ? 'border-violet-500 text-violet-400'
      : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0
        ${sizeClasses[size]} ${variantClasses[variant]}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon}
    </motion.button>
  );
}

// ── PanelSection ─────────────────────────────────────────────
interface PanelSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  defaultOpen?: boolean;
}

export function PanelSection({ title, children, action, defaultOpen = true }: PanelSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <span>{title}</span>
        <div className="flex items-center gap-2">
          {action}
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-3">{children}</div>
      </motion.div>
    </div>
  );
}

// ── Slider ───────────────────────────────────────────────────
interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
}

export function Slider({ value, min, max, step = 1, onChange, label, showValue = true, formatValue }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs text-zinc-500 min-w-[60px]">{label}</span>}
      <div className="flex-1 relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
            [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/30
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-300
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #27272a ${percentage}%, #27272a 100%)`,
          }}
        />
      </div>
      {showValue && (
        <span className="text-xs text-zinc-400 min-w-[40px] text-right font-mono">
          {formatValue ? formatValue(value) : value}
        </span>
      )}
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
  const [show, setShow] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className={`absolute z-50 px-2 py-1 text-[11px] font-medium text-white bg-zinc-800 border border-zinc-700 rounded-md whitespace-nowrap shadow-xl pointer-events-none ${positionClasses[side]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// ── ColorPicker ──────────────────────────────────────────────
interface ColorPickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  presets?: string[];
}

const DEFAULT_COLORS = [
  '#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#FFCC00',
  '#34C759', '#00C7BE', '#007AFF', '#5856D6', '#AF52DE',
  '#FF2D55', '#A2845E', '#8E8E93', '#636366',
];

export function ColorPicker({ value, onChange, label, presets = DEFAULT_COLORS }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <span className="text-xs text-zinc-500">{label}</span>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg border border-zinc-700 cursor-pointer bg-transparent [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch-wrapper]:p-0.5"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 px-2 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:border-violet-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-md border transition-all ${
              value === color ? 'border-violet-400 scale-110 ring-1 ring-violet-400/30' : 'border-zinc-700 hover:border-zinc-500'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

// ── SegmentedControl ─────────────────────────────────────────
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all flex-1 ${
            value === opt.value
              ? 'bg-violet-500/20 text-violet-300 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'ai' }) {
  const classes = {
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ai: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${classes[variant]}`}>
      {children}
    </span>
  );
}
