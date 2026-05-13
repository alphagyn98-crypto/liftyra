type TextareaProps = {
  name?: string;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
  value?: string;
};

export default function Textarea({
  name,
  placeholder,
  label,
  maxLength,
  rows,
  defaultValue,
  value,
}: TextareaProps) {
  return (
    <div className="relative">
      {label && (
        <label className="text-foreground mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        name={name}
        className="text-foreground placeholder:text-subtle w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm focus:outline-none"
        placeholder={placeholder || "Tulis catatan Anda di sini"}
        maxLength={maxLength}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
      />
    </div>
  );
}
