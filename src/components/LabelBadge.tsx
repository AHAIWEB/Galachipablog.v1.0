interface LabelBadgeProps {
  label: string;
  className?: string;
}

const LabelBadge = ({ label, className = "" }: LabelBadgeProps) => (
  <span className={`inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-sm text-xs font-bold ${className}`}>
    {label}
  </span>
);

export default LabelBadge;
