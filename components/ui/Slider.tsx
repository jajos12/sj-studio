"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export default function Slider({
  label,
  value,
  min,
  max,
  suffix = "",
  onChange,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-3">{label}</span>
        <span className="text-[11px] font-mono text-fg-mute">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}
