import { COLORS } from '../../styles/theme';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = COLORS.teal }: BadgeProps) {
  return (
    <span
      style={{
        background:   `${color}22`,
        color,
        border:       `1px solid ${color}44`,
        borderRadius: 6,
        padding:      '2px 10px',
        fontSize:     12,
        fontWeight:   600,
      }}
    >
      {label}
    </span>
  );
}
