import { useState } from 'react';
import {
  CARD_STYLE, COLORS, BTN_PRIMARY, BTN_SECONDARY,
  INPUT_STYLE, LABEL_STYLE,
} from '../styles/theme';
import { Icon, ICONS }     from '../components/ui/Icon';
import { Badge }           from '../components/ui/Badge';
import { Modal }           from '../components/ui/Modal';
import { ConfirmModal }    from '../components/ui/ConfirmModal';
import { useBreakpoint }   from '../hooks/useBreakpoint';
import { useNotification } from '../hooks/useNotification';
import { useResidents }    from '../hooks/useResidents';
import { useSurgeries }    from '../hooks/useSurgeries';
import {
  useRequiredTasks,
  useCreateRequiredTask,
  useUpdateRequiredTask,
  useDeleteRequiredTask,
} from '../hooks/useRequiredTasks';
import { SURGERY_TYPES } from '../utils/constants';
import { LEVEL_LABELS }  from '../utils/constants';
import type { RequiredTask } from '../types';

// ─── Add / Edit modal ────────────────────────────────────────────────────────
function TaskFormModal({
  task,
  defaultLevel,
  onClose,
}: {
  task?:         RequiredTask;
  defaultLevel?: 1 | 2;
  onClose:       () => void;
}) {
  const isEdit = Boolean(task);
  const { mutate: create, isPending: creating } = useCreateRequiredTask();
  const { mutate: update, isPending: updating } = useUpdateRequiredTask();
  const { notify } = useNotification();

  const [name,  setName]  = useState(task?.name  ?? '');
  const [level, setLevel] = useState<1 | 2>(task?.level ?? defaultLevel ?? 1);
  const [useCustom, setUseCustom] = useState(
    task ? !SURGERY_TYPES.includes(task.name as any) : false,
  );

  const isPending = creating || updating;
  const valid     = name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    if (isEdit && task) {
      update(
        { id: task.id, data: { name: name.trim(), level } },
        {
          onSuccess: () => { notify('Obrigação atualizada!'); onClose(); },
          onError:   (e) => notify(e.message, 'error'),
        },
      );
    } else {
      create(
        { name: name.trim(), level },
        {
          onSuccess: () => { notify('Obrigação cadastrada!'); onClose(); },
          onError:   (e) => notify(e.message, 'error'),
        },
      );
    }
  };

  return (
    <Modal title={isEdit ? 'Editar Obrigação' : 'Nova Obrigação'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Level selector */}
        <div>
          <div style={LABEL_STYLE}>Nível de Residência</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([1, 2] as const).map((lv) => (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 13,
                  background: level === lv
                    ? (lv === 1 ? `${COLORS.teal}33` : `${COLORS.gold}33`)
                    : '#0B1F3A',
                  color: level === lv
                    ? (lv === 1 ? COLORS.tealLight : COLORS.gold)
                    : COLORS.slateLight,
                  border: `2px solid ${level === lv
                    ? (lv === 1 ? COLORS.teal : COLORS.gold)
                    : COLORS.cardBorder}`,
                }}
              >
                {LEVEL_LABELS[lv]}
              </button>
            ))}
          </div>
        </div>

        {/* Source toggle */}
        <div>
          <div style={LABEL_STYLE}>Tipo de Cirurgia</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => setUseCustom(false)}
              style={{
                flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${!useCustom ? COLORS.teal : COLORS.cardBorder}`,
                background: !useCustom ? `${COLORS.teal}22` : 'transparent',
                color: !useCustom ? COLORS.tealLight : COLORS.slateLight,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
              }}
            >
              Lista de cirurgias
            </button>
            <button
              onClick={() => setUseCustom(true)}
              style={{
                flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${useCustom ? COLORS.teal : COLORS.cardBorder}`,
                background: useCustom ? `${COLORS.teal}22` : 'transparent',
                color: useCustom ? COLORS.tealLight : COLORS.slateLight,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
              }}
            >
              Nome personalizado
            </button>
          </div>

          {!useCustom ? (
            <select
              value={SURGERY_TYPES.includes(name as any) ? name : SURGERY_TYPES[0]}
              onChange={(e) => setName(e.target.value)}
              style={INPUT_STYLE}
            >
              {SURGERY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          ) : (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={INPUT_STYLE}
              placeholder="Ex: Cirurgia de cisto odontogênico"
            />
          )}
        </div>

        {/* Preview */}
        <div style={{
          background: '#0B1F3A', borderRadius: 10, padding: '12px 14px',
          border: `1px solid ${COLORS.cardBorder}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5, flexShrink: 0,
            border: `2px solid ${COLORS.cardBorder}`,
          }} />
          <span style={{ fontSize: 13, color: COLORS.slateLight }}>
            {name || <em>Nome da obrigação…</em>}
          </span>
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <Badge
              label={level === 1 ? 'R1' : 'R2'}
              color={level === 1 ? COLORS.teal : COLORS.gold}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={{ ...BTN_PRIMARY, flex: 1, justifyContent: 'center', opacity: valid && !isPending ? 1 : 0.5 }}
            onClick={handleSave}
            disabled={!valid || isPending}
          >
            {isPending ? 'Salvando…' : isEdit ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function Obligations() {
  const { data: tasks     = [] } = useRequiredTasks();
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { mutate: remove }       = useDeleteRequiredTask();
  const { notify }               = useNotification();
  const { isMobile }             = useBreakpoint();

  const [modal,   setModal]   = useState<{ mode: 'add'; level: 1|2 } | { mode: 'edit'; task: RequiredTask } | null>(null);
  const [delTask, setDelTask] = useState<RequiredTask | null>(null);

  const handleDelete = (t: RequiredTask) => {
    remove(t.id, {
      onSuccess: () => { notify(`"${t.name}" removida.`, 'error'); setDelTask(null); },
      onError:   (e) => notify(e.message, 'error'),
    });
  };

  const card = { ...CARD_STYLE, padding: isMobile ? 16 : 24 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>

      {/* ── Explicação ─────────────────────────────────────────── */}
      <div style={{
        ...card,
        borderLeft: `4px solid ${COLORS.teal}`,
        background: `linear-gradient(120deg, ${COLORS.cardBg}, #0D3049)`,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${COLORS.teal}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.obligations} size={18} color={COLORS.tealLight} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>
              Obrigações por Nível
            </div>
            <div style={{ fontSize: 12, color: COLORS.slateLight, lineHeight: 1.7 }}>
              Defina quais tipos de cirurgia cada nível de residente <strong style={{ color: COLORS.tealLight }}>precisa realizar obrigatoriamente</strong>.
              O sistema compara automaticamente com as cirurgias registradas e marca as tarefas como concluídas.
            </div>
          </div>
        </div>
      </div>

      {/* ── R1 e R2 blocos ─────────────────────────────────────── */}
      {([1, 2] as const).map((level) => {
        const levelTasks   = tasks.filter((t) => t.level === level);
        const levelResidents = residents.filter((r) => r.year === level);
        const accentColor  = level === 1 ? COLORS.teal : COLORS.gold;

        return (
          <div key={level} style={card}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 32, borderRadius: 4,
                  background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}88)`,
                }} />
                <div>
                  <div style={{
                    fontSize: isMobile ? 15 : 17, fontWeight: 800,
                    color: COLORS.cream, fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {LEVEL_LABELS[level]}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.slateLight, marginTop: 1 }}>
                    {levelTasks.length} obrigação{levelTasks.length !== 1 ? 'ões' : ''} cadastrada{levelTasks.length !== 1 ? 's' : ''}
                    {levelResidents.length > 0 && ` · ${levelResidents.map(r => r.label).join(', ')}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModal({ mode: 'add', level })}
                style={{ ...BTN_PRIMARY, padding: isMobile ? '8px 14px' : '9px 18px', fontSize: 13 }}
              >
                <Icon d={ICONS.plus} size={14} color="white" />
                {!isMobile && 'Nova Obrigação'}
                {isMobile && 'Nova'}
              </button>
            </div>

            {/* Stats bar: how many residents have completed each */}
            {levelTasks.length === 0 ? (
              <div style={{
                padding: '24px', textAlign: 'center',
                border: `2px dashed ${COLORS.cardBorder}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 13, color: COLORS.slateLight, marginBottom: 10 }}>
                  Nenhuma obrigação cadastrada para este nível.
                </div>
                <button
                  onClick={() => setModal({ mode: 'add', level })}
                  style={{ ...BTN_SECONDARY, margin: '0 auto', fontSize: 12, padding: '7px 16px' }}
                >
                  <Icon d={ICONS.plus} size={13} color={COLORS.tealLight} />
                  Cadastrar primeira
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {levelTasks.map((t) => {
                  // Count how many level residents have performed this surgery
                  const levelResidentIds = levelResidents.map(r => r.id);
                  const completedBy = levelResidentIds.filter((rid) =>
                    surgeries.some((s) => s.residentId === rid && s.type === t.name),
                  );
                  const total = levelResidents.length;
                  const pct   = total > 0 ? Math.round((completedBy.length / total) * 100) : 0;

                  return (
                    <div
                      key={t.id}
                      style={{
                        background: '#0B1F3A',
                        border: `1px solid ${COLORS.cardBorder}`,
                        borderRadius: 12,
                        padding: isMobile ? '12px 14px' : '14px 18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Checkbox visual */}
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          border: `2px solid ${accentColor}66`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon d={ICONS.obligations} size={11} color={accentColor} />
                        </div>

                        {/* Name */}
                        <span style={{ flex: 1, fontSize: 13, color: COLORS.cream, fontWeight: 600 }}>
                          {t.name}
                        </span>

                        {/* Resident completion pills */}
                        {!isMobile && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            {levelResidents.map((r) => {
                              const done = surgeries.some(
                                (s) => s.residentId === r.id && s.type === t.name,
                              );
                              return (
                                <span
                                  key={r.id}
                                  title={`${r.name}: ${done ? 'Concluído' : 'Pendente'}`}
                                  style={{
                                    fontSize: 10, fontWeight: 700,
                                    padding: '2px 8px', borderRadius: 6,
                                    background: done ? `${COLORS.green}22` : `${COLORS.slateLight}22`,
                                    color:      done ? COLORS.green      : COLORS.slateLight,
                                    border:     `1px solid ${done ? COLORS.green + '44' : COLORS.cardBorder}`,
                                  }}
                                >
                                  {done ? '✓' : '○'} {r.label}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          <button
                            onClick={() => setModal({ mode: 'edit', task: t })}
                            title="Editar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: COLORS.slateLight }}
                          >
                            <Icon d={ICONS.edit} size={14} />
                          </button>
                          <button
                            onClick={() => setDelTask(t)}
                            title="Excluir"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: COLORS.red }}
                          >
                            <Icon d={ICONS.trash} size={14} color={COLORS.red} />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar: % of residents who completed */}
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: COLORS.slateLight }}>
                            {completedBy.length}/{total} residente{total !== 1 ? 's' : ''} concluíu
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: pct === 100 ? COLORS.green : COLORS.slateLight }}>
                            {pct}%
                          </span>
                        </div>
                        <div style={{ height: 4, background: COLORS.cardBorder, borderRadius: 3 }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${pct}%`,
                            background: pct === 100
                              ? COLORS.green
                              : `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)`,
                            transition: 'width .5s',
                          }} />
                        </div>
                      </div>

                      {/* Mobile resident pills */}
                      {isMobile && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                          {levelResidents.map((r) => {
                            const done = surgeries.some(
                              (s) => s.residentId === r.id && s.type === t.name,
                            );
                            return (
                              <span
                                key={r.id}
                                style={{
                                  fontSize: 10, fontWeight: 700,
                                  padding: '2px 8px', borderRadius: 6,
                                  background: done ? `${COLORS.green}22` : `${COLORS.slateLight}22`,
                                  color:      done ? COLORS.green      : COLORS.slateLight,
                                  border:     `1px solid ${done ? COLORS.green + '44' : COLORS.cardBorder}`,
                                }}
                              >
                                {done ? '✓' : '○'} {r.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Modals ─────────────────────────────────────────────── */}
      {modal?.mode === 'add' && (
        <TaskFormModal defaultLevel={modal.level} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <TaskFormModal task={modal.task} onClose={() => setModal(null)} />
      )}
      {delTask && (
        <ConfirmModal
          title="Remover Obrigação"
          message={`Remover "${delTask.name}" das obrigações do ${LEVEL_LABELS[delTask.level]}? As cirurgias já registradas não serão afetadas.`}
          confirmLabel="Remover"
          onConfirm={() => handleDelete(delTask)}
          onCancel={() => setDelTask(null)}
        />
      )}
    </div>
  );
}
