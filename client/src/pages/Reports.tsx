import { CARD_STYLE, COLORS, responsiveGrid } from '../styles/theme';
import { Badge } from '../components/ui/Badge';
import { useResidents } from '../hooks/useResidents';
import { useSurgeries } from '../hooks/useSurgeries';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { getTaskStatus } from '../utils/surgeryDistribution';
import { REQUIRED_TASKS, SURGERY_TYPES } from '../utils/constants';

export function Reports() {
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { isMobile, isTablet }   = useBreakpoint();

  const byType   = SURGERY_TYPES.map((type) => ({ type, count: surgeries.filter((s) => s.type === type).length })).sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...byType.map((b) => b.count), 1);
  const card     = { ...CARD_STYLE, padding: isMobile ? 16 : 24 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>
      {/* By resident */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>Cirurgias por Residente</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {residents.map((r) => {
            const count = surgeries.filter((s) => s.residentId === r.id).length;
            const pct   = surgeries.length ? Math.round((count / surgeries.length) * 100) : 0;
            return (
              <div key={r.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: COLORS.cream }}>{r.label} — {isMobile ? r.name.split(' ').slice(0, 2).join(' ') : r.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.tealLight }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 7, background: COLORS.cardBorder, borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: r.year === 1 ? COLORS.teal : COLORS.gold, borderRadius: 4, transition: 'width .6s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By type */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>Por Tipo de Procedimento</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {byType.filter((b) => b.count > 0).map((b) => (
            <div key={b.type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: isMobile ? 11 : 13, color: COLORS.slateLight }}>{b.type}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.cream }}>{b.count}</span>
              </div>
              <div style={{ height: 5, background: COLORS.cardBorder, borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${(b.count / maxCount) * 100}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.tealLight})`, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task completion radial */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>Obrigações por Residente</div>
        <div style={responsiveGrid(4, isMobile, isTablet)}>
          {residents.map((r) => {
            const tasks = getTaskStatus(r.id, residents, surgeries, REQUIRED_TASKS);
            const done  = tasks.filter((t) => t.done).length;
            const pct   = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
            const size  = isMobile ? 68 : 80;
            return (
              <div key={r.id} style={{ textAlign: 'center' }}>
                <div style={{
                  width: size, height: size, borderRadius: '50%',
                  background: `conic-gradient(${pct === 100 ? COLORS.green : COLORS.teal} ${pct * 3.6}deg, ${COLORS.cardBorder} 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', boxShadow: `0 0 0 3px ${COLORS.cardBg}`,
                }}>
                  <div style={{ width: size * 0.75, height: size * 0.75, borderRadius: '50%', background: COLORS.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: isMobile ? 13 : 16, fontWeight: 800, color: pct === 100 ? COLORS.green : COLORS.cream }}>{pct}%</span>
                  </div>
                </div>
                <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />
                <div style={{ fontSize: 11, color: COLORS.slateLight, marginTop: 6 }}>{r.name.split(' ')[0]}</div>
                <div style={{ fontSize: 10, color: COLORS.slateLight, marginTop: 2 }}>{done}/{tasks.length} tarefas</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
