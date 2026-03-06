import { useState } from 'react';
import { CARD_STYLE, COLORS, BTN_PRIMARY, BTN_SECONDARY, INPUT_STYLE, LABEL_STYLE } from '../styles/theme';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useBreakpoint }  from '../hooks/useBreakpoint';
import { useResidents }   from '../hooks/useResidents';
import { useSurgeries }   from '../hooks/useSurgeries';
import { usePatients, useCreatePatient } from '../hooks/usePatients';
import { useNotification } from '../hooks/useNotification';

function AddPatientModal({ onClose }: { onClose: () => void }) {
  const { data: residents = [] }      = useResidents();
  const { mutate: create, isPending } = useCreatePatient();
  const { notify }                    = useNotification();

  const [form, setForm] = useState({ name: '', age: '', prontuario: '', residentId: residents[0]?.id ?? '' });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal title="Novo Paciente" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><div style={LABEL_STYLE}>Nome Completo</div>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} style={INPUT_STYLE} placeholder="Nome do paciente" /></div>
        <div><div style={LABEL_STYLE}>Idade</div>
          <input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} style={INPUT_STYLE} placeholder="Idade" /></div>
        <div><div style={LABEL_STYLE}>Prontuário</div>
          <input value={form.prontuario} onChange={(e) => set('prontuario', e.target.value)} style={INPUT_STYLE} placeholder="Ex: P-007" /></div>
        <div><div style={LABEL_STYLE}>Residente Responsável</div>
          <select value={form.residentId} onChange={(e) => set('residentId', e.target.value)} style={INPUT_STYLE}>
            {residents.map((r) => <option key={r.id} value={r.id}>{r.label} — {r.name}</option>)}
          </select></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...BTN_PRIMARY, flex: 1, justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}
            onClick={() => create({ ...form, age: Number(form.age) }, {
              onSuccess: () => { notify('Paciente cadastrado!'); onClose(); },
              onError:   (e) => notify(e.message, 'error'),
            })}
            disabled={isPending}
          >
            {isPending ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Patients({ openModal, onModalClose }: { openModal: boolean; onModalClose: () => void }) {
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { data: patients  = [] } = usePatients();
  const { isMobile }             = useBreakpoint();

  if (isMobile) {
    // Card list layout on mobile
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {patients.map((p) => {
          const r     = residents.find((r) => r.id === p.residentId);
          const procs = surgeries.filter((s) => s.patient === p.name);
          return (
            <div key={p.id} style={{ ...CARD_STYLE, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.cream }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.tealLight, fontWeight: 600, marginTop: 2 }}>{p.prontuario}</div>
                </div>
                <div style={{ fontSize: 13, color: COLORS.slateLight }}>{p.age} anos</div>
              </div>
              {r && <div style={{ marginBottom: 8 }}><Badge label={`${r.label} — ${r.name}`} color={r.year === 1 ? COLORS.teal : COLORS.gold} /></div>}
              {procs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {procs.map((proc) => (
                    <span key={proc.id} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${COLORS.teal}22`, color: COLORS.tealLight, border: `1px solid ${COLORS.teal}33` }}>
                      {proc.type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {openModal && <AddPatientModal onClose={onModalClose} />}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ ...CARD_STYLE, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0B1F3A' }}>
                {['Prontuário', 'Nome', 'Idade', 'Residente Responsável', 'Procedimentos'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.slateLight, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const r     = residents.find((r) => r.id === p.residentId);
                const procs = surgeries.filter((s) => s.patient === p.name);
                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: COLORS.tealLight, fontWeight: 600 }}>{p.prontuario}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: COLORS.cream, fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: COLORS.slateLight }}>{p.age} anos</td>
                    <td style={{ padding: '14px 20px' }}>
                      {r ? <Badge label={`${r.label} — ${r.name}`} color={r.year === 1 ? COLORS.teal : COLORS.gold} /> : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {procs.length ? procs.map((proc) => (
                          <span key={proc.id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: `${COLORS.teal}22`, color: COLORS.tealLight, border: `1px solid ${COLORS.teal}33` }}>{proc.type}</span>
                        )) : <span style={{ fontSize: 12, color: COLORS.slateLight }}>Nenhum</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {openModal && <AddPatientModal onClose={onModalClose} />}
    </div>
  );
}
