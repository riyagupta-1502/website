import type { Metadata } from 'next';
import './globals.css';
import Cursor from './components/Cursor';
import SmoothScroll from './components/SmoothScroll';
export const metadata: Metadata = {
  title: 'Riya Gupta | Analytics & Business Intelligence',
  description: 'Riya Gupta is an analytics professional in Bangalore, bringing together data analytics, business intelligence, banking operations and AI-driven solutions.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Cursor /><SmoothScroll /></body></html>;
}
