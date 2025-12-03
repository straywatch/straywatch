import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Plus, Dog, AlertTriangle, Trash2, User, LogOut, Menu, AlertCircle } from 'lucide-react';
import { LeafletMap } from './LeafletMap';
import { AuthModal } from './AuthModal';
import { ReportForm } from './ReportForm';
import { ToastContainer } from './ui/Toast';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuthStore, useUIStore } from '@/lib/store';
import { fetchReports, getReportStats } from '@/lib/api';
import { signOut, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function StatsBar({ sightings, bites, garbage }: { sightings: number; bites: number; garbage: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Card className="flex items-center gap-2 px-4 py-2 flex-shrink-0">
        <Dog className="w-5 h-5 text-amber-500" />
        <div>
          <p className="text-xs text-gray-500">Sightings</p>
          <p className="text-lg font-semibold">{sightings}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-2 px-4 py-2 flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-xs text-gray-500">Bites</p>
          <p className="text-lg font-semibold">{bites}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-2 px-4 py-2 flex-shrink-0">
        <Trash2 className="w-5 h-5 text-emerald-500" />
        <div>
          <p className="text-xs text-gray-500">Garbage</p>
          <p className="text-lg font-semibold">{garbage}</p>
        </div>
      </Card>
    </div>
  );
}

function HomeContent() {
  const { user, loading: authLoading, initialize } = useAuthStore();
  const { openAuthModal, openReportForm } = useUIStore();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { data: reports = [], refetch, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  const stats = getReportStats(reports);

  const handleAddReport = () => {
    if (!user) {
      openAuthModal();
      toast({ title: 'Please sign in to submit a report', type: 'info' });
    } else {
      openReportForm();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed out successfully', type: 'success' });
      setMenuOpen(false);
    } catch (error) {
      toast({ title: 'Failed to sign out', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">Supabase not configured</p>
            <p className="text-xs text-amber-600">Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables to enable all features.</p>
          </div>
        </div>
      )}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Dog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-heading">StrayWatch</h1>
            <p className="text-xs text-gray-500">Leh, Ladakh</p>
          </div>
        </div>
        
        <div className="relative">
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <Menu className="w-4 h-4 text-gray-500" />
              </button>
              
              {menuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-30 py-1">
                    <p className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user.email}
                    </p>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      My Reports
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={openAuthModal}>
              Sign In
            </Button>
          )}
        </div>
      </header>

      <div className="px-4 py-3 bg-gray-50">
        <StatsBar {...stats} />
      </div>

      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        ) : (
          <LeafletMap reports={reports} />
        )}

        <button
          onClick={handleAddReport}
          className="absolute bottom-6 right-6 z-10 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <AuthModal />
      <ReportForm onSuccess={refetch} />
      <ToastContainer />
    </div>
  );
}

export function HomeIsland() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}
