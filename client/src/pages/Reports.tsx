import { useState } from 'react';
import { CARD_STYLE, COLORS, responsiveGrid } from '../styles/theme';
import { Badge }           from '../components/ui/Badge';
import { Icon, ICONS }     from '../components/ui/Icon';
import { ConfirmModal }    from '../components/ui/ConfirmModal';
import { SurgeryFormModal } from '../components/ui/SurgeryFormModal';
import { useResidents }    from '../hooks/useResidents';
import { useSurgeries, useDeleteSurgery } from '../hooks/useSurgeries';
import { useRequiredTasks } from '../hooks/useRequiredTasks';
import { useBreakpoint }   from '../hooks/useBreakpoint';
import { useNotification } from '../hooks/useNotification';
import { getTaskStatus }   from '../utils/surgeryDistribution';
import { SURGERY_TYPES }   from '../utils/constants';
import type { Surgery }    from '../types';

function SurgeryRow({ s, residents, onEdit, onDelete }: {
  s: Surgery;
  residents: ReturnType<typeof useResidents>['data'] & object[];
  onEdit:    (s: Surgery) => void;
  onDelete:  (s: Surgery) => void;
}) {
  const r = (residents as any[]).find((r: any) => r.id === s.residentId);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      borderTop: `1px solid ${COLORS.cardBorder}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: COLORS.cream, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.patient}
        </div>
        <div style={{ fontSize: 10, color: COLORS.slateLight, marginTop: 2 }}>
          {new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR')}
          {s.notes && <span style={{ marginLeft: 6, fontStyle: 'italic' }}>{s.notes}</span>}
        </div>
      </div>
      {r && <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button onClick={() => onEdit(s)} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slateLight, padding: 4 }}>
          <Icon d={ICONS.edit} size={14} />
        </button>
        <button onClick={() => onDelete(s)} title="Excluir" style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.red, padding: 4 }}>
          <Icon d={ICONS.trash} size={14} color={COLORS.red} />
        </button>
      </div>
    </div>
  );
}

export function Reports() {
  const { data: residents     = [] } = useResidents();
  const { data: surgeries     = [] } = useSurgeries();
  const { data: requiredTasks = [] } = useRequiredTasks();
  const { mutate: deleteSurgery }    = useDeleteSurgery();
  const { notify }                   = useNotification();
  const { isMobile, isTablet }       = useBreakpoint();

  const [editSurgery,  setEditSurgery]  = useState<Surgery | null>(null);
  const [deleteSurg,   setDeleteSurg]   = useState<Surgery | null>(null);
  const [expandedRes,  setExpandedRes]  = useState<string | null>(null); // residentId
  const [expandedType, setExpandedType] = useState<string | null>(null); // surgery type

  const handleDelete = (s: Surgery) => {
    deleteSurgery(s.id, {
      onSuccess: () => { notify('Cirurgia excluída.', 'error'); setDeleteSurg(null); },
      onError:   (e) => notify(e.message, 'error'),
    });
  };

  const byType   = SURGERY_TYPES.map((type) => ({ type, count: surgeries.filter((s) => s.type === type).length })).sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...byType.map((b) => b.count), 1);
  const card     = { ...CARD_STYLE, padding: isMobile ? 16 : 24 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>

      {/* ── Cirurgias por Residente ─────────────────────────────── */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>
          Cirurgias por Residente
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {residents.map((r) => {
            const rSurgeries = surgeries.filter((s) => s.residentId === r.id);
            const count      = rSurgeries.length;
            const pct        = surgeries.length ? Math.round((count / surgeries.length) * 100) : 0;
            const isOpen     = expandedRes === r.id;

            return (
              <div key={r.id}>
                {/* Bar row */}
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedRes(isOpen ? null : r.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: COLORS.cream }}>
                        {r.label} — {isMobile ? r.name.split(' ').slice(0, 2).join(' ') : r.name}
                      </span>
                      <Icon d={isOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={13} color={COLORS.slateLight} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.tealLight }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 7, background: COLORS.cardBorder, borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: r.year === 1 ? COLORS.teal : COLORS.gold, borderRadius: 4, transition: 'width .6s' }} />
                  </div>
                </div>

                {/* Expanded surgery list */}
                {isOpen && (
                  <div style={{
                    marginTop: 10, background: '#0B1F3A', borderRadius: 10,
                    border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: COLORS.slateLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {count} cirurgia{count !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditSurgery({ id: '', type: SURGERY_TYPES[0], patient: '', date: new Date().toISOString().split('T')[0], residentId: r.id }); }}
                        style={{ background: 'none', border: `1px solid ${COLORS.teal}55`, borderRadius: 7, padding: '4px 10px', color: COLORS.tealLight, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                      >
                        <Icon d={ICONS.plus} size={11} color={COLORS.tealLight} /> Nova
                      </button>
                    </div>
                    {rSurgeries.length === 0 && (
                      <div style={{ padding: '14px', fontSize: 12, color: COLORS.slateLight, textAlign: 'center' }}>Nenhuma cirurgia registrada</div>
                    )}
                    {rSurgeries.map((s) => (
                      <SurgeryRow key={s.id} s={s} residents={residents as any} onEdit={setEditSurgery} onDelete={setDeleteSurg} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Por Tipo de Procedimento ────────────────────────────── */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>
          Por Tipo de Procedimento
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {byType.filter((b) => b.count > 0).map((b) => {
            const typeSurgeries = surgeries.filter((s) => s.type === b.type);
            const isOpen        = expandedType === b.type;

            return (
              <div key={b.type}>
                <div style={{ cursor: 'pointer' }} onClick={() => setExpandedType(isOpen ? null : b.type)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: isMobile ? 11 : 13, color: COLORS.slateLight }}>{b.type}</span>
                      <Icon d={isOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={12} color={COLORS.slateLight} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.cream }}>{b.count}</span>
                  </div>
                  <div style={{ height: 5, background: COLORS.cardBorder, borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(b.count / maxCount) * 100}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.tealLight})`, borderRadius: 3 }} />
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 8, background: '#0B1F3A', borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                    {typeSurgeries.map((s) => (
                      <SurgeryRow key={s.id} s={s} residents={residents as any} onEdit={setEditSurgery} onDelete={setDeleteSurg} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Obrigações por Residente ────────────────────────────── */}
      <div style={card}>
        <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: COLORS.cream, marginBottom: 16 }}>
          Cumprimento de Obrigações
        </div>
        <div style={responsiveGrid(4, isMobile, isTablet)}>
          {residents.map((r) => {
            const tasks = getTaskStatus(r.id, residents, surgeries, requiredTasks);
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

      {/* Modals */}
      {editSurgery && (
        editSurgery.id
          ? <SurgeryFormModal surgery={editSurgery}  onClose={() => setEditSurgery(null)} />
          : <SurgeryFormModal defaultResidentId={editSurgery.residentId} onClose={() => setEditSurgery(null)} />
      )}
      {deleteSurg && (
        <ConfirmModal
          title="Excluir Cirurgia"
          message={`Excluir "${deleteSurg.type}" do paciente ${deleteSurg.patient}? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={() => handleDelete(deleteSurg)}
          onCancel={() => setDeleteSurg(null)}
        />
      )}
    </div>
  );
}
