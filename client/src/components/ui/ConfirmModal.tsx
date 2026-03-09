import { CARD_STYLE, COLORS, BTN_SECONDARY } from '../../styles/theme';

interface ConfirmModalProps {
  title:      string;
  message:    string;
  confirmLabel?: string;
  danger?:    boolean;
  onConfirm:  () => void;
  onCancel:   () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      animation: 'fadeIn .2s ease',
    }}>
      <div style={{ ...CARD_STYLE, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,.6)' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: COLORS.cream, marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: COLORS.slateLight, marginBottom: 24, lineHeight: 1.6 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center' }} onClick={onCancel}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center',
              background: danger ? COLORS.red : COLORS.teal,
              color: 'white', border: 'none', borderRadius: 10,
              padding: '10px 20px', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
