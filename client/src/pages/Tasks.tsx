import { CARD_STYLE, COLORS } from '../styles/theme';
import { Badge }       from '../components/ui/Badge';
import { Icon, ICONS } from '../components/ui/Icon';
import { useResidents } from '../hooks/useResidents';
import { useSurgeries } from '../hooks/useSurgeries';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { getTaskStatus } from '../utils/surgeryDistribution';
import { REQUIRED_TASKS } from '../utils/constants';

export function Tasks() {
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { isMobile }             = useBreakpoint();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {residents.map((r) => {
        const tasks = getTaskStatus(r.id, residents, surgeries, REQUIRED_TASKS);
        const done  = tasks.filter((t) => t.done).length;

        return (
          <div key={r.id} style={{ ...CARD_STYLE, padding: isMobile ? 16 : 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 14 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />
                <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: COLORS.cream }}>{isMobile ? r.name.split(' ')[0] + ' ' + r.name.split(' ')[1] : r.name}</span>
              </div>
              <span style={{ fontSize: 12, color: done === tasks.length ? COLORS.green : COLORS.slateLight, fontWeight: 600 }}>
                {done}/{tasks.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: isMobile ? 8 : 10 }}>
              {tasks.map((t) => (
                <div key={t.task} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? '10px 12px' : '12px 16px',
                  borderRadius: 10,
                  background: t.done ? `${COLORS.green}11` : '#0B1F3A',
                  border: `1px solid ${t.done ? COLORS.green + '44' : COLORS.cardBorder}`,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    background: t.done ? COLORS.green : 'transparent',
                    border: `2px solid ${t.done ? COLORS.green : COLORS.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {t.done && <Icon d={ICONS.check} size={11} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 12, color: t.done ? COLORS.green : COLORS.slateLight, fontWeight: t.done ? 600 : 400, flex: 1 }}>
                    {t.task}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.done ? COLORS.green : COLORS.slateLight, whiteSpace: 'nowrap' }}>
                    {t.done ? '✓' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
