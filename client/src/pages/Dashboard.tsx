import { CARD_STYLE, COLORS, responsiveGrid } from '../styles/theme';
import { StatCard }     from '../components/ui/StatCard';
import { Badge }        from '../components/ui/Badge';
import { Icon, ICONS }  from '../components/ui/Icon';
import { useResidents } from '../hooks/useResidents';
import { useSurgeries } from '../hooks/useSurgeries';
import { usePatients }  from '../hooks/usePatients';
import { useRequiredTasks } from '../hooks/useRequiredTasks';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { getNextResident, getLastResident, getTaskStatus } from '../utils/surgeryDistribution';

const FEATURED_SURGERY = 'Redução de fratura de mandíbula';
const THIS_MONTH       = new Date().toISOString().slice(0, 7);

export function Dashboard() {
  const { data: residents     = [] } = useResidents();
  const { data: surgeries     = [] } = useSurgeries();
  const { data: patients      = [] } = usePatients();
  const { data: requiredTasks = [] } = useRequiredTasks();
  const { isMobile, isTablet }       = useBreakpoint();

  const nextRes        = getNextResident(FEATURED_SURGERY, surgeries, residents);
  const lastRes        = getLastResident(FEATURED_SURGERY, surgeries, residents);
  const thisMonthCount = surgeries.filter((s) => s.date.startsWith(THIS_MONTH)).length;

  const card = { ...CARD_STYLE, padding: isMobile ? 16 : 24, borderRadius: isMobile ? 12 : 16 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>

      {/* KPI cards */}
      <div style={responsiveGrid(4, isMobile, isTablet)}>
        <StatCard label="Total de Cirurgias"    value={surgeries.length} icon="surgery"   accent={COLORS.teal}  sub="Registradas" />
        <StatCard label="Residentes Ativos"     value={residents.length} icon="residents" accent={COLORS.gold}  sub="R1 e R2" />
        <StatCard label="Pacientes"             value={patients.length}  icon="patient"   accent="#8B5CF6"      sub="Cadastrados" />
        <StatCard label="Este mês"              value={thisMonthCount}   icon="report"    accent="#EC4899"      sub="Cirurgias" />
      </div>

      {/* Distribution suggestion */}
      {nextRes && (
        <div style={{ ...card, borderLeft: `4px solid ${COLORS.teal}`, background: `linear-gradient(120deg, ${COLORS.cardBg}, #0D3049)` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: `${COLORS.teal}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon d={ICONS.rotate} size={20} color={COLORS.tealLight} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Sugestão de Distribuição
              </div>
              <div style={{ fontSize: isMobile ? 13 : 15, color: COLORS.cream, lineHeight: 1.6 }}>
                Próxima <strong style={{ color: COLORS.tealLight }}>{FEATURED_SURGERY}</strong>:{' '}
                <strong style={{ color: COLORS.gold }}>{nextRes.label} — {nextRes.name}</strong>
                {lastRes && (
                  <span style={{ color: COLORS.slateLight }}> · último: {lastRes.label}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-resident summary */}
      <div>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: isMobile ? 10 : 16 }}>
          Resumo por Residente
        </div>
        <div style={responsiveGrid(2, isMobile, isTablet)}>
          {residents.map((r) => {
            const tasks = getTaskStatus(r.id, residents, surgeries, requiredTasks);
            const done  = tasks.filter((t) => t.done).length;
            const pct   = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
            const count = surgeries.filter((s) => s.residentId === r.id).length;

            return (
              <div key={r.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />
                    </div>
                    <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: COLORS.cream }}>{r.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: COLORS.tealLight }}>{count}</div>
                    <div style={{ fontSize: 10, color: COLORS.slateLight }}>cirurgias</div>
                  </div>
                </div>

                {tasks.length > 0 && (
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: COLORS.slateLight }}>Obrigações</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? COLORS.green : COLORS.cream }}>
                          {done}/{tasks.length}
                        </span>
                      </div>
                      <div style={{ height: 5, background: COLORS.cardBorder, borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? COLORS.green : COLORS.teal, borderRadius: 3, transition: 'width .5s' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {tasks.map((t) => (
                        <span key={t.task} style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                          background: t.done ? `${COLORS.green}22` : `${COLORS.slateLight}22`,
                          color:      t.done ? COLORS.green : COLORS.slateLight,
                          border:     `1px solid ${t.done ? COLORS.green : COLORS.cardBorder}44`,
                        }}>
                          {t.done ? '✓ ' : ''}{t.task}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {tasks.length === 0 && (
                  <div style={{ fontSize: 11, color: COLORS.slateLight, fontStyle: 'italic' }}>
                    Nenhuma obrigação definida para este nível.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
