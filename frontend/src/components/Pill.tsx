/**
 * Score pill component (Green/Amber/Red based on percentage)
 */

interface PillProps {
  value: number;
}

export function Pill({ value }: PillProps) {
  const getClass = (v: number): string => {
    if (v >= 75) return 'pill-green';
    if (v >= 60) return 'pill-amber';
    return 'pill-red';
  };

  // Format to 2 decimal places
  const formattedValue = value.toFixed(2);

  return <span className={`pill ${getClass(value)}`}>{formattedValue}%</span>;
}
