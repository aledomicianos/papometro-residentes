import { useState } from 'react';
import { Modal }   from './Modal';
import { BTN_PRIMARY, BTN_SECONDARY, INPUT_STYLE, LABEL_STYLE, COLORS } from '../../styles/theme';
import { useResidents }   from '../../hooks/useResidents';
import { usePatients }    from '../../hooks/usePatients';
import { useCreateSurgery, useUpdateSurgery } from '../../hooks/useSurgeries';
import { useNotification } from '../../hooks/useNotification';
import { SURGERY_TYPES }   from '../../utils/constants';
import type { Surgery }    from '../../types';

interface SurgeryFormModalProps {
  /** If provided, opens in edit mode */
  surgery?: Surgery;
  /** Pre-selected resident (for create) */
  defaultResidentId?: string;
  onClose: () => void;
}

export function SurgeryFormModal({ surgery, defaultResidentId, onClose }: SurgeryFormModalProps) {
  const isEdit = Boolean(surgery);
  const { data: residents = [] } = useResidents();
  const { data: patients  = [] } = usePatients();
  const { mutate: create, isPending: creating } = useCreateSurgery();
  const { mutate: update, isPending: updating } = useUpdateSurgery();
  const { notify } = useNotification();

  const [form, setForm] = useState({
    residentId: surgery?.residentId ?? defaultResidentId ?? residents[0]?.id ?? '',
    type:       surgery?.type       ?? SURGERY_TYPES[0],
    patient:    surgery?.patient    ?? patients[0]?.name ?? '',
    date:       surgery?.date
      ? surgery.date.slice(0, 10)
      : new Date().toISOString().split('T')[0],
    notes: surgery?.notes ?? '',
  });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (isEdit && surgery) {
      update(
        { id: surgery.id, data: { ...form, notes: form.notes || null } },
        { onSuccess: () => { notify('Cirurgia atualizada!'); onClose(); }, onError: (e) => notify(e.message, 'error') },
      );
    } else {
      create(
        { ...form, notes: form.notes || null },
        { onSuccess: () => { notify('Cirurgia registrada!'); onClose(); }, onError: (e) => notify(e.message, 'error') },
      );
    }
  };

  return (
    <Modal title={isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
        <div>
          <div style={LABEL_STYLE}>Observações (opcional)</div>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            style={{ ...INPUT_STYLE, minHeight: 72, resize: 'vertical' }}
            placeholder="Detalhes adicionais sobre o procedimento…"
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...BTN_PRIMARY, flex: 1, justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Registrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
