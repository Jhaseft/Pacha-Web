'use client';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  highlight?: boolean;
  disabled?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  highlight = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="mb-5">
      <label
        className={`block text-xs font-bold mb-2 uppercase tracking-wider ${
          highlight ? 'text-secondary' : 'text-brand'
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full px-3.5 py-3 rounded-lg border text-sm resize-none ${
            highlight
              ? 'border-secondary bg-secondary/5'
              : 'border-brand/30 bg-brand/5'
          } text-ink placeholder-ink/30 focus:outline-none focus:ring-2 ${
            highlight ? 'focus:ring-secondary' : 'focus:ring-brand'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3.5 py-3 rounded-lg border text-sm ${
            highlight
              ? 'border-secondary bg-secondary/5'
              : 'border-brand/30 bg-brand/5'
          } text-ink placeholder-ink/30 focus:outline-none focus:ring-2 ${
            highlight ? 'focus:ring-secondary' : 'focus:ring-brand'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      )}
    </div>
  );
}
