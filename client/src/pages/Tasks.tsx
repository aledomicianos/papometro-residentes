import { useState } from 'react';
import { CARD_STYLE, COLORS, BTN_SECONDARY } from '../styles/theme';
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
import type { Surgery }    from '../types';

export function Tasks() {
  const { data: residents     = [] } = useResidents();
  const { data: surgeries     = [] } = useSurgeries();
  const { data: requiredTasks = [] } = useRequiredTasks();
  const { mutate: deleteSurgery }    = useDeleteSurgery();
  const { notify }                   = useNotification();
  const { isMobile }                 = useBreakpoint();

  const [editSurgery,   setEditSurgery]   = useState<Surgery | null>(null);
  const [deleteSurg,    setDeleteSurg]    = useState<Surgery | null>(null);
  const [expandedTask,  setExpandedTask]  = useState<string | null>(null); // "residentId:taskName"

  const handleDelete = (s: Surgery) => {
    deleteSurgery(s.id, {
      onSuccess: () => { notify('Cirurgia removida. Tarefa marcada como pendente.', 'error'); setDeleteSurg(null); },
      onError:   (e) => notify(e.message, 'error'),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {residents.map((r) => {
        const tasks = getTaskStatus(r.id, residents, surgeries, requiredTasks);
        const done  = tasks.filter((t) => t.done).length;
        const pct   = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

        return (
          <div key={r.id} style={{ ...CARD_STYLE, padding: isMobile ? 16 : 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 14 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />
                <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: COLORS.cream }}>
                  {isMobile ? r.name.split(' ').slice(0, 2).join(' ') : r.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Mini progress bar */}
                <div style={{ width: 60, height: 5, background: COLORS.cardBorder, borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? COLORS.green : COLORS.teal, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, color: done === tasks.length ? COLORS.green : COLORS.slateLight, fontWeight: 700 }}>
                  {done}/{tasks.length}
                </span>
              </div>
            </div>

            {/* Task list */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: isMobile ? 8 : 10 }}>
              {tasks.map((t) => {
                const expandKey = `${r.id}:${t.task}`;
                const isExpanded = expandedTask === expandKey;

                return (
                  <div key={t.task}>
                    {/* Task row */}
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: isMobile ? '10px 12px' : '12px 16px', borderRadius: isExpanded ? '10px 10px 0 0' : 10,
                        background: t.done ? `${COLORS.green}11` : '#0B1F3A',
                        border: `1px solid ${t.done ? COLORS.green + '44' : COLORS.cardBorder}`,
                        cursor: t.done ? 'pointer' : 'default',
                        borderBottom: isExpanded ? 'none' : undefined,
                      }}
                      onClick={() => t.done && setExpandedTask(isExpanded ? null : expandKey)}
                    >
                      {/* Checkbox */}
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

                      {t.done ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, color: COLORS.green, fontWeight: 700 }}>
                            {t.surgeries.length}x
                          </span>
                          <Icon
                            d={isExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                            size={13} color={COLORS.green}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: 10, color: COLORS.slateLight, fontWeight: 700 }}>Pendente</span>
                      )}
                    </div>

                    {/* Expanded — surgeries that completed this task */}
                    {isExpanded && t.done && (
                      <div style={{
                        background: `${COLORS.green}08`,
                        border: `1px solid ${COLORS.green}44`,
                        borderTop: 'none',
                        borderRadius: '0 0 10px 10px',
                        overflow: 'hidden',
                      }}>
                        {t.surgeries.map((s, idx) => (
                          <div
                            key={s.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 14px',
                              borderTop: idx > 0 ? `1px solid ${COLORS.green}22` : undefined,
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: COLORS.cream, fontWeight: 600 }}>{s.patient}</div>
                              <div style={{ fontSize: 10, color: COLORS.slateLight }}>
                                {new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                                {s.notes && <span> · {s.notes}</span>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditSurgery(s); }}
                                title="Editar cirurgia"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slateLight, padding: 4 }}
                              >
                                <Icon d={ICONS.edit} size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeleteSurg(s); }}
                                title="Excluir (desfaz conclusão)"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.red, padding: 4 }}
                              >
                                <Icon d={ICONS.trash} size={14} color={COLORS.red} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div style={{ padding: '8px 14px', borderTop: `1px solid ${COLORS.green}22` }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); /* open add surgery pre-filled for this resident */ setEditSurgery({ id: '', type: t.task, patient: '', date: new Date().toISOString().split('T')[0], residentId: r.id }); }}
                            style={{ ...BTN_SECONDARY, padding: '5px 12px', fontSize: 11, borderColor: `${COLORS.green}44`, color: COLORS.green }}
                          >
                            <Icon d={ICONS.plus} size={12} color={COLORS.green} />
                            Registrar mais uma
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Edit surgery modal */}
      {editSurgery && (
        editSurgery.id
          ? <SurgeryFormModal surgery={editSurgery} onClose={() => setEditSurgery(null)} />
          : <SurgeryFormModal defaultResidentId={editSurgery.residentId} onClose={() => setEditSurgery(null)} />
      )}

      {/* Confirm delete */}
      {deleteSurg && (
        <ConfirmModal
          title="Excluir Cirurgia"
          message={`Excluir a cirurgia "${deleteSurg.type}" do paciente ${deleteSurg.patient}? Isso marcará a tarefa como pendente novamente.`}
          confirmLabel="Excluir"
          onConfirm={() => handleDelete(deleteSurg)}
          onCancel={() => setDeleteSurg(null)}
        />
      )}
    </div>
  );
}
