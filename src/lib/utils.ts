import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReportType } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LEH_CENTER = { lat: 34.1526, lng: 77.5771 };
export const DEFAULT_ZOOM = 13;

export const REPORT_COLORS: Record<ReportType, string> = {
  sighting: '#F59E0B',
  bite: '#EF4444',
  garbage: '#10B981',
};

export const REPORT_LABELS: Record<ReportType, string> = {
  sighting: 'Stray Dog Sighting',
  bite: 'Bite Incident',
  garbage: 'Garbage Hotspot',
};

export const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMarkerRadius(count: number): number {
  return Math.min(8 + count * 2, 25);
}
