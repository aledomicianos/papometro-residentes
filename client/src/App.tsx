import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Sidebar }     from './components/layout/Sidebar';
import { TopBar }      from './components/layout/TopBar';
import { NotificationProvider } from './hooks/useNotification';
import { useBreakpoint } from './hooks/useBreakpoint';

import { Dashboard }   from './pages/Dashboard';
import { Surgeries }   from './pages/Surgeries';
import { Patients }    from './pages/Patients';
import { Residents }   from './pages/Residents';
import { Tasks }       from './pages/Tasks';
import { Reports }     from './pages/Reports';
import { Obligations } from './pages/Obligations';

import { COLORS } from './styles/theme';
import type { NavTab } from './types';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 30, retry: 1 } },
});

function AppShell() {
  const [activeTab,     setActiveTab]     = useState<NavTab>('dashboard');
  const [surgeryModal,  setSurgeryModal]  = useState(false);
  const [patientModal,  setPatientModal]  = useState(false);
  const [residentModal, setResidentModal] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.navy,
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.cream,
      display: 'flex',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.cardBorder}; border-radius: 4px; }
        select option { background: ${COLORS.navy}; }
        select, input, textarea { -webkit-appearance: none; appearance: none; }
        @keyframes slideIn { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        button { -webkit-tap-highlight-color: transparent; }
        html { -webkit-text-size-adjust: 100%; }
        textarea { font-family: inherit; }
      `}</style>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0,
        padding: isMobile ? '68px 16px 88px' : '32px 36px',
      }}>
        <TopBar
          activeTab={activeTab}
          onNewSurgery={()  => setSurgeryModal(true)}
          onNewPatient={()  => setPatientModal(true)}
          onNewResident={() => setResidentModal(true)}
        />

        {activeTab === 'dashboard'   && <Dashboard />}
        {activeTab === 'surgeries'   && <Surgeries  openModal={surgeryModal}  onModalClose={() => setSurgeryModal(false)} />}
        {activeTab === 'patients'    && <Patients   openModal={patientModal}  onModalClose={() => setPatientModal(false)} />}
        {activeTab === 'residents'   && <Residents  openModal={residentModal} onModalClose={() => setResidentModal(false)} />}
        {activeTab === 'tasks'       && <Tasks />}
        {activeTab === 'reports'     && <Reports />}
        {activeTab === 'obligations' && <Obligations />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AppShell />
      </NotificationProvider>
    </QueryClientProvider>
  );
}
