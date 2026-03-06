import type { ReactNode } from 'react';
import { CARD_STYLE, COLORS } from '../../styles/theme';
import { Icon, ICONS } from './Icon';

interface ModalProps {
  title:    string;
  children: ReactNode;
  onClose:  () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,.7)',
        zIndex:         500,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        animation:      'fadeIn .2s ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          ...CARD_STYLE,
          width:     480,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        }}
      >
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   24,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize:   18,
              fontWeight: 800,
              color:      COLORS.cream,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slateLight }}
          >
            <Icon d={ICONS.x} size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
