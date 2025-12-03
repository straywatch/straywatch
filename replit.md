# StrayWatch - Community Safety for Leh, Ladakh

## Overview
StrayWatch is a community safety web application for tracking stray dog populations, bite incidents, and garbage/litter hotspots in Leh, Ladakh. The app uses Astro framework with React islands and Supabase for backend.

## Tech Stack
- **Framework**: Astro 5.x with React islands architecture
- **Backend**: Supabase (authentication + PostgreSQL database)
- **Styling**: Tailwind CSS v4 with custom Shadcn/ui-style components
- **Map**: Leaflet with OpenStreetMap tiles
- **State Management**: Zustand for auth, TanStack Query for data fetching

## Project Structure
```
src/
├── pages/
│   ├── index.astro        # Main map page
│   ├── landing.astro      # Landing/welcome page
│   └── profile.astro      # User profile page
├── layouts/
│   └── Layout.astro       # Common HTML layout
├── components/
│   ├── HomeIsland.tsx     # Main map React island
│   ├── LeafletMap.tsx     # Map component
│   ├── ReportForm.tsx     # Report submission form
│   ├── AuthModal.tsx      # Sign in/sign up modal
│   ├── ProfileIsland.tsx  # Profile page island
│   └── ui/                # UI components (Button, Dialog, etc.)
├── lib/
│   ├── supabase.ts        # Supabase client + auth helpers
│   ├── api.ts             # Data fetching functions
│   ├── store.ts           # Zustand auth store
│   └── utils.ts           # Utility functions
├── hooks/
│   ├── use-toast.ts       # Toast notifications
│   └── use-mobile.tsx     # Mobile detection
└── styles/
    └── index.css          # Tailwind + custom styles
```

## Environment Variables
Required secrets for Supabase connection:
- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Database Schema (Supabase)
```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('sighting', 'bite', 'garbage')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  count INTEGER DEFAULT 1 NOT NULL,
  severity TEXT,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow users to update own" ON reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own" ON reports FOR DELETE USING (auth.uid() = user_id);
```

## Features
- Interactive map centered on Leh, Ladakh (34.1526, 77.5771)
- Color-coded markers: Amber (sightings), Red (bites), Green (garbage)
- Report submission with location selection (GPS or map click)
- Email/password authentication
- User profile with own reports management
- Real-time stats dashboard

## Running the App
```bash
npm run dev
```
The app runs on port 5000.

## Recent Changes
- Initial project setup (December 2024)
- Created full Astro + React project structure
- Implemented Supabase auth and data fetching
- Built interactive Leaflet map with report markers
- Added report submission form with location picker
- Created profile page for managing user reports
