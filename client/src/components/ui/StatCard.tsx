import { CARD_STYLE, COLORS } from '../../styles/theme';
import { Icon, ICONS } from './Icon';
import type { IconName } from './Icon';

interface StatCardProps {
  label:  string;
  value:  string | number;
  sub?:   string;
  icon:   IconName;
  accent: string;
}

export function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div style={{ ...CARD_STYLE, display: 'flex', alignItems: 'center', gap: 18 }}>
      <div
        style={{
          width:          52,
          height:         52,
          borderRadius:   14,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     `${accent}22`,
          flexShrink:     0,
        }}
      >
        <Icon d={ICONS[icon]} size={24} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.cream, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: COLORS.slateLight, marginTop: 4 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 11, color: accent, marginTop: 2, fontWeight: 600 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}
