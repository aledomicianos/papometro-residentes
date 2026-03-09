import { COLORS, BTN_PRIMARY } from '../../styles/theme';
import { Icon, ICONS } from '../ui/Icon';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import type { NavTab } from '../../types';

const TAB_LABELS: Record<NavTab, string> = {
  dashboard:   'Painel',
  surgeries:   'Cirurgias',
  patients:    'Pacientes',
  residents:   'Residentes',
  tasks:       'Tarefas',
  reports:     'Relatórios',
  obligations: 'Obrigações',
};

interface TopBarProps {
  activeTab:      NavTab;
  onNewSurgery?:  () => void;
  onNewPatient?:  () => void;
  onNewResident?: () => void;
}

export function TopBar({ activeTab, onNewSurgery, onNewPatient, onNewResident }: TopBarProps) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: isMobile ? 16 : 28,
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isMobile ? 20 : 24,
          fontWeight: 800, color: COLORS.cream, margin: 0,
        }}>
          {TAB_LABELS[activeTab]}
        </h1>
        {!isMobile && (
          <p style={{ fontSize: 13, color: COLORS.slateLight, marginTop: 4, marginBottom: 0 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {activeTab === 'surgeries' && (
          <button style={{ ...BTN_PRIMARY, padding: isMobile ? '8px 14px' : '10px 20px', fontSize: 13 }} onClick={onNewSurgery}>
            <Icon d={ICONS.plus} size={15} color="white" />
            {isMobile ? '+' : 'Nova Cirurgia'}
          </button>
        )}
        {activeTab === 'patients' && (
          <button style={{ ...BTN_PRIMARY, padding: isMobile ? '8px 14px' : '10px 20px', fontSize: 13 }} onClick={onNewPatient}>
            <Icon d={ICONS.plus} size={15} color="white" />
            {isMobile ? '+' : 'Novo Paciente'}
          </button>
        )}
        {activeTab === 'residents' && (
          <button style={{ ...BTN_PRIMARY, padding: isMobile ? '8px 14px' : '10px 20px', fontSize: 13 }} onClick={onNewResident}>
            <Icon d={ICONS.plus} size={15} color="white" />
            {isMobile ? '+' : 'Novo Residente'}
          </button>
        )}
      </div>
    </div>
  );
}
