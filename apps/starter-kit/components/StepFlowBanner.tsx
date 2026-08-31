import React, { type ReactNode } from 'react';

export interface StepFlowItem {
  step?: number | string;
  label: ReactNode;
}

export interface StepFlowBannerProps {
  steps: Array<string | StepFlowItem>;
  className?: string;
  /** Depth of the chevron arrow head and notch in pixels. Defaults to 12 */
  arrowDepth?: number;
  /** Whether the last step should also end with a pointed arrow tip. Defaults to false */
  arrowEnd?: boolean;
}

function getClipPath(index: number, total: number, arrowDepth: number, arrowEnd: boolean): string {
  if (total <= 1) {
    return 'none';
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const d = `${arrowDepth}px`;

  if (isFirst) {
    // Flat left, pointed arrow right
    return `polygon(0% 0%, calc(100% - ${d}) 0%, 100% 50%, calc(100% - ${d}) 100%, 0% 100%)`;
  }

  if (isLast && !arrowEnd) {
    // Indented notch left, flat right
    return `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, ${d} 50%)`;
  }

  // Middle step or last step with arrowEnd: indented notch left, pointed arrow right
  return `polygon(0% 0%, calc(100% - ${d}) 0%, 100% 50%, calc(100% - ${d}) 100%, 0% 100%, ${d} 50%)`;
}

function getDefaultGridCols(count: number): string {
  switch (count) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-3';
    case 5:
      return 'grid-cols-2 md:grid-cols-5';
    case 4:
    default:
      return 'grid-cols-2 md:grid-cols-4';
  }
}

export function StepFlowBanner({
  steps,
  className = '',
  arrowDepth = 12,
  arrowEnd = false,
}: StepFlowBannerProps) {
  const hasCustomGridCols = className.includes('grid-cols-');
  const defaultGridCols = hasCustomGridCols ? '' : getDefaultGridCols(steps.length);
  const baseGridClass = `grid gap-2.5 ${defaultGridCols} ${className}`.trim();

  return (
    <div className={baseGridClass}>
      {steps.map((item, index) => {
        const isObject = typeof item === 'object' && item !== null && 'label' in item;
        const stepNumber = isObject && item.step !== undefined ? item.step : index + 1;
        const label = isObject ? item.label : item;
        const key = typeof label === 'string' ? `${stepNumber}-${label}` : index;

        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const clipPath = getClipPath(index, steps.length, arrowDepth, arrowEnd);

        // Adjust horizontal padding to avoid overlapping the notch on left and arrow on right
        let paddingClass = 'pl-5 pr-5 md:pl-6 md:pr-6';
        if (isFirst) {
          paddingClass = 'pl-3.5 pr-5 md:pl-4 md:pr-6';
        } else if (isLast && !arrowEnd) {
          paddingClass = 'pl-5 pr-3.5 md:pl-6 md:pr-4';
        }

        return (
          <div
            key={key}
            className="relative group transition-all duration-200"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))',
            }}
          >
            {/* Outer border layer (with clip-path) */}
            <div
              className="bg-zinc-800 transition-colors duration-200 group-hover:bg-accent/40"
              style={{
                clipPath,
                padding: '1px',
              }}
            >
              {/* Inner content layer (with clip-path) */}
              <div
                className={`bg-zinc-950/80 transition-colors duration-200 group-hover:bg-zinc-900/90 flex items-center gap-2.5 py-3 ${paddingClass}`}
                style={{
                  clipPath,
                }}
              >
                <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0 transition-transform duration-200 group-hover:scale-105">
                  {stepNumber}
                </span>
                <span className="text-xs text-zinc-300 font-medium group-hover:text-zinc-100 transition-colors truncate">
                  {label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StepFlowBanner;
