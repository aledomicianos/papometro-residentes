import { COLORS } from '../../styles/theme';
import { Icon, ICONS } from '../ui/Icon';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import type { NavTab } from '../../types';

const NAV_ITEMS: { key: NavTab; label: string; icon: keyof typeof ICONS }[] = [
  { key: 'dashboard', label: 'Painel',     icon: 'dashboard' },
  { key: 'surgeries', label: 'Cirurgias',  icon: 'surgery'   },
  { key: 'patients',  label: 'Pacientes',  icon: 'patient'   },
  { key: 'residents', label: 'Residentes', icon: 'residents' },
  { key: 'tasks',     label: 'Tarefas',    icon: 'tasks'     },
  { key: 'reports',   label: 'Relatórios', icon: 'report'    },
];

interface SidebarProps {
  activeTab:   NavTab;
  onTabChange: (tab: NavTab) => void;
}

function DesktopSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside style={{
      width: 230, minHeight: '100vh', background: COLORS.sidebarBg,
      borderRight: `1px solid ${COLORS.cardBorder}`,
      display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 4,
      flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      <div style={{ padding: '0 8px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: COLORS.cream, lineHeight: 1 }}>Papômetro</div>
            <div style={{ fontSize: 10, color: COLORS.tealLight, fontWeight: 600, letterSpacing: 1 }}>RESIDÊNCIA MÉDICA</div>
          </div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button key={item.key} onClick={() => onTabChange(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: isActive ? `${COLORS.teal}22` : 'transparent',
            color: isActive ? COLORS.tealLight : COLORS.slateLight,
            fontSize: 14, fontWeight: isActive ? 700 : 500,
            fontFamily: "'DM Sans', sans-serif", transition: 'all .15s',
            borderLeft: isActive ? `3px solid ${COLORS.teal}` : '3px solid transparent',
            textAlign: 'left',
          }}>
            <Icon d={ICONS[item.icon]} size={17} color={isActive ? COLORS.tealLight : COLORS.slateLight} />
            {item.label}
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', padding: '20px 8px 0' }}>
        <div style={{ borderTop: `1px solid ${COLORS.cardBorder}`, paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: COLORS.slateLight }}>Programa de Residência</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.cream, marginTop: 2 }}>Cirurgia Bucomaxilofacial</div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: COLORS.sidebarBg, borderBottom: `1px solid ${COLORS.cardBorder}`,
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 800, color: COLORS.cream, lineHeight: 1 }}>Papômetro</div>
        <div style={{ fontSize: 9, color: COLORS.tealLight, fontWeight: 600, letterSpacing: 1 }}>RESIDÊNCIA MÉDICA</div>
      </div>
    </div>
  );
}

function MobileTabBar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: COLORS.sidebarBg, borderTop: `1px solid ${COLORS.cardBorder}`,
      display: 'flex', alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button key={item.key} onClick={() => onTabChange(item.key)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '8px 2px', border: 'none',
            background: 'transparent', cursor: 'pointer', gap: 3, position: 'relative',
            color: isActive ? COLORS.tealLight : COLORS.slateLight,
          }}>
            {isActive && (
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 2, background: COLORS.teal, borderRadius: '0 0 2px 2px' }} />
            )}
            <Icon d={ICONS[item.icon]} size={20} color={isActive ? COLORS.tealLight : COLORS.slateLight} />
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, fontFamily: "'DM Sans', sans-serif" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function Sidebar(props: SidebarProps) {
  const { isMobile } = useBreakpoint();
  if (isMobile) return <><MobileHeader /><MobileTabBar {...props} /></>;
  return <DesktopSidebar {...props} />;
}
