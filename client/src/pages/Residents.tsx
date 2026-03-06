import { useState } from 'react';
import { CARD_STYLE, COLORS, BTN_PRIMARY, BTN_SECONDARY, INPUT_STYLE, LABEL_STYLE, responsiveGrid } from '../styles/theme';
import { Badge }       from '../components/ui/Badge';
import { Icon, ICONS } from '../components/ui/Icon';
import { Modal }       from '../components/ui/Modal';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useResidents, useCreateResident, useUpdateResident, useDeleteResident } from '../hooks/useResidents';
import { useSurgeries }  from '../hooks/useSurgeries';
import { useNotification } from '../hooks/useNotification';
import type { Resident }   from '../types';

type ResidentForm = Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>;

function ResidentModal({ mode, resident, onClose }: { mode: 'add' | 'edit'; resident?: Resident; onClose: () => void }) {
  const isEdit = mode === 'edit';
  const { mutate: create, isPending: creating } = useCreateResident();
  const { mutate: update, isPending: updating } = useUpdateResident();
  const { notify } = useNotification();

  const [form, setForm] = useState<ResidentForm>(
    isEdit && resident
      ? { label: resident.label, name: resident.name, year: resident.year, position: resident.position }
      : { label: 'R1-1', name: '', year: 1, position: 1 },
  );

  const set = <K extends keyof ResidentForm>(k: K, v: ResidentForm[K]) =>
    setForm((f) => {
      const u = { ...f, [k]: v };
      if (!isEdit && (k === 'year' || k === 'position')) u.label = `R${u.year}-${u.position}`;
      return u;
    });

  const isPending = creating || updating;
  const valid     = form.name.trim().length > 1;

  const handleSave = () => {
    if (!valid) return;
    if (isEdit && resident) {
      update({ id: resident.id, data: form }, { onSuccess: () => { notify('Dados atualizados!'); onClose(); }, onError: (e) => notify(e.message, 'error') });
    } else {
      create(form, { onSuccess: () => { notify('Residente cadastrado!'); onClose(); }, onError: (e) => notify(e.message, 'error') });
    }
  };

  return (
    <Modal title={isEdit ? 'Editar Residente' : 'Novo Residente'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><div style={LABEL_STYLE}>Nome Completo</div>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} style={INPUT_STYLE} placeholder="Ex: Dr. Roberto Alves" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><div style={LABEL_STYLE}>Ano</div>
            <select value={form.year} onChange={(e) => set('year', Number(e.target.value) as 1 | 2)} style={INPUT_STYLE}>
              <option value={1}>R1 — 1º Ano</option>
              <option value={2}>R2 — 2º Ano</option>
            </select></div>
          <div><div style={LABEL_STYLE}>Posição</div>
            <select value={form.position} onChange={(e) => set('position', Number(e.target.value))} style={INPUT_STYLE}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}º</option>)}
            </select></div>
        </div>
        <div><div style={LABEL_STYLE}>Identificação</div>
          <input value={form.label} onChange={(e) => set('label', e.target.value)} style={INPUT_STYLE} placeholder="Ex: R1-1" /></div>
        <div style={{ background: '#0B1F3A', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${COLORS.cardBorder}` }}>
          <Badge label={form.label || '—'} color={form.year === 1 ? COLORS.teal : COLORS.gold} />
          <span style={{ fontSize: 14, color: COLORS.cream, fontWeight: 600 }}>{form.name || 'Nome do residente'}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
          <button style={{ ...BTN_PRIMARY, flex: 1, justifyContent: 'center', opacity: valid && !isPending ? 1 : 0.5 }} onClick={handleSave} disabled={!valid || isPending}>
            {isPending ? 'Salvando…' : isEdit ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Residents({ openModal, onModalClose }: { openModal: boolean; onModalClose: () => void }) {
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { mutate: remove }       = useDeleteResident();
  const { notify }               = useNotification();
  const { isMobile, isTablet }   = useBreakpoint();

  const [editTarget,    setEditTarget]    = useState<Resident | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Resident | null>(null);

  const handleDelete = (r: Resident) => {
    remove(r.id, { onSuccess: () => { notify(`${r.name} removido.`, 'error'); setConfirmDelete(null); }, onError: (e) => notify(e.message, 'error') });
  };

  const card = { ...CARD_STYLE, padding: isMobile ? 16 : 24 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>
      {/* Cards */}
      <div style={responsiveGrid(4, isMobile, isTablet)}>
        {residents.map((r) => {
          const count = surgeries.filter((s) => s.residentId === r.id).length;
          return (
            <div key={r.id} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setEditTarget(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slateLight, padding: 4 }}>
                    <Icon d={ICONS.edit} size={15} />
                  </button>
                  <button onClick={() => setConfirmDelete(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.red, padding: 4 }}>
                    <Icon d={ICONS.trash} size={15} color={COLORS.red} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: COLORS.cream }}>{r.name}</div>
              <div style={{ fontSize: 11, color: COLORS.slateLight }}>Ano {r.year} · Posição {r.position}</div>
              <div style={{ borderTop: `1px solid ${COLORS.cardBorder}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: COLORS.slateLight }}>Cirurgias</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.tealLight }}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table (desktop only) */}
      {!isMobile && ([1, 2] as const).map((year) => {
        const list = residents.filter((r) => r.year === year);
        if (!list.length) return null;
        return (
          <div key={year}>
            <div style={{ fontSize: 12, fontWeight: 700, color: year === 1 ? COLORS.teal : COLORS.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              R{year} — {year === 1 ? 'Primeiro Ano' : 'Segundo Ano'}
            </div>
            <div style={{ ...CARD_STYLE, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0B1F3A' }}>
                    {['ID', 'Nome', 'Ano', 'Posição', 'Cirurgias', 'Ações'].map((h) => (
                      <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.slateLight, letterSpacing: 1, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
                      <td style={{ padding: '14px 20px' }}><Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} /></td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: COLORS.cream, fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: COLORS.slateLight }}>R{r.year}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: COLORS.slateLight }}>{r.position}º</td>
                      <td style={{ padding: '14px 20px', fontSize: 16, fontWeight: 800, color: COLORS.tealLight }}>{surgeries.filter((s) => s.residentId === r.id).length}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setEditTarget(r)} style={{ ...BTN_SECONDARY, padding: '6px 12px', fontSize: 12 }}>
                            <Icon d={ICONS.edit} size={13} color={COLORS.tealLight} /> Editar
                          </button>
                          <button onClick={() => setConfirmDelete(r)} style={{ background: 'transparent', color: COLORS.red, border: `1px solid ${COLORS.red}55`, borderRadius: 10, padding: '6px 12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon d={ICONS.trash} size={13} color={COLORS.red} /> Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {openModal   && <ResidentModal mode="add" onClose={onModalClose} />}
      {editTarget  && <ResidentModal mode="edit" resident={editTarget} onClose={() => setEditTarget(null)} />}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ ...CARD_STYLE, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,.6)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.cream, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 10 }}>Confirmar remoção</div>
            <div style={{ fontSize: 14, color: COLORS.slateLight, marginBottom: 24, lineHeight: 1.6 }}>
              Remover <strong style={{ color: COLORS.cream }}>{confirmDelete.name} ({confirmDelete.label})</strong>? Esta ação não pode ser desfeita.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ background: COLORS.red, color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', flex: 1 }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
