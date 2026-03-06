import { useState } from 'react';
import { CARD_STYLE, COLORS, BTN_PRIMARY, BTN_SECONDARY, INPUT_STYLE, LABEL_STYLE, responsiveGrid } from '../styles/theme';
import { Badge }    from '../components/ui/Badge';
import { Modal }    from '../components/ui/Modal';
import { useBreakpoint }   from '../hooks/useBreakpoint';
import { useResidents }    from '../hooks/useResidents';
import { useSurgeries, useCreateSurgery } from '../hooks/useSurgeries';
import { usePatients }     from '../hooks/usePatients';
import { useNotification } from '../hooks/useNotification';
import { getNextResident } from '../utils/surgeryDistribution';
import { SURGERY_TYPES }   from '../utils/constants';
import type { Resident }   from '../types';

function AddSurgeryModal({ residents, onClose }: { residents: Resident[]; onClose: () => void }) {
  const { data: patients = [] }       = usePatients();
  const { mutate: create, isPending } = useCreateSurgery();
  const { notify }                    = useNotification();

  const [form, setForm] = useState({
    residentId: residents[0]?.id ?? '',
    type:       SURGERY_TYPES[0],
    patient:    patients[0]?.name ?? '',
    date:       new Date().toISOString().split('T')[0],
  });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal title="Nova Cirurgia" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={LABEL_STYLE}>Residente</div>
          <select value={form.residentId} onChange={(e) => set('residentId', e.target.value)} style={INPUT_STYLE}>
            {residents.map((r) => <option key={r.id} value={r.id}>{r.label} — {r.name}</option>)}
          </select>
        </div>
        <div>
          <div style={LABEL_STYLE}>Tipo de Cirurgia</div>
          <select value={form.type} onChange={(e) => set('type', e.target.value)} style={INPUT_STYLE}>
            {SURGERY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={LABEL_STYLE}>Paciente</div>
          {patients.length ? (
            <select value={form.patient} onChange={(e) => set('patient', e.target.value)} style={INPUT_STYLE}>
              {patients.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          ) : (
            <input value={form.patient} onChange={(e) => set('patient', e.target.value)} style={INPUT_STYLE} placeholder="Nome do paciente" />
          )}
        </div>
        <div>
          <div style={LABEL_STYLE}>Data</div>
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} style={INPUT_STYLE} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...BTN_PRIMARY, flex: 1, justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}
            onClick={() => create(form, {
              onSuccess: () => { notify('Cirurgia registrada!'); onClose(); },
              onError:   (e) => notify(e.message, 'error'),
            })}
            disabled={isPending}
          >
            {isPending ? 'Registrando…' : 'Registrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Surgeries({ openModal, onModalClose }: { openModal: boolean; onModalClose: () => void }) {
  const { data: residents = [] } = useResidents();
  const { data: surgeries = [] } = useSurgeries();
  const { isMobile, isTablet }   = useBreakpoint();
  const [filter, setFilter]      = useState<string>('all');

  const filtered = filter === 'all' ? surgeries : surgeries.filter((s) => s.residentId === filter);
  const card = { ...CARD_STYLE, padding: isMobile ? 16 : 24 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>
      {/* Suggestions */}
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Próxima Sugestão</div>
        <div style={responsiveGrid(2, isMobile, isTablet)}>
          {SURGERY_TYPES.slice(0, isMobile ? 2 : 4).map((type) => {
            const next = getNextResident(type, surgeries, residents);
            return (
              <div key={type} style={{ background: '#0B1F3A', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: COLORS.slateLight, marginBottom: 6 }}>{type}</div>
                {next && <Badge label={`${next.label} — ${next.name.split(' ')[0]}`} color={next.year === 1 ? COLORS.teal : COLORS.gold} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter pills — horizontal scroll on mobile */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {[{ id: 'all', label: 'Todos' }, ...residents.map((r) => ({ id: r.id, label: r.label }))].map((item) => (
          <button key={item.id} onClick={() => setFilter(item.id)} style={{
            ...BTN_SECONDARY, padding: '6px 14px', fontSize: 12, flexShrink: 0,
            background:  filter === item.id ? `${COLORS.teal}33` : 'transparent',
            color:       filter === item.id ? COLORS.tealLight : COLORS.slateLight,
            borderColor: filter === item.id ? COLORS.teal : COLORS.cardBorder,
          }}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div style={{ ...CARD_STYLE, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 500 : undefined }}>
            <thead>
              <tr style={{ background: '#0B1F3A' }}>
                {['#', 'Tipo', 'Paciente', 'Residente', 'Data'].map((h) => (
                  <th key={h} style={{ padding: isMobile ? '12px 14px' : '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.slateLight, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const r = residents.find((r) => r.id === s.residentId);
                return (
                  <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
                    <td style={{ padding: isMobile ? '12px 14px' : '14px 20px', fontSize: 12, color: COLORS.slateLight }}>{i + 1}</td>
                    <td style={{ padding: isMobile ? '12px 14px' : '14px 20px', fontSize: 13, color: COLORS.cream, fontWeight: 500, whiteSpace: 'nowrap' }}>{s.type}</td>
                    <td style={{ padding: isMobile ? '12px 14px' : '14px 20px', fontSize: 12, color: COLORS.slateLight }}>{s.patient}</td>
                    <td style={{ padding: isMobile ? '12px 14px' : '14px 20px' }}>
                      {r && <Badge label={r.label} color={r.year === 1 ? COLORS.teal : COLORS.gold} />}
                    </td>
                    <td style={{ padding: isMobile ? '12px 14px' : '14px 20px', fontSize: 12, color: COLORS.slateLight, whiteSpace: 'nowrap' }}>
                      {new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && residents.length > 0 && <AddSurgeryModal residents={residents} onClose={onModalClose} />}
    </div>
  );
}
