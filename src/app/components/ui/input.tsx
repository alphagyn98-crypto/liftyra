type InputProps = {
  label?: string;
  variant?: "outlined" | "filled" | "borderless" | "table";
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  value?: string | number;
  step?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  className?: string;
  labelRow?: boolean;
};

export default function Input({
  label,
  variant = "outlined",
  placeholder,
  type = "text",
  id,
  name,
  min,
  max,
  required = false,
  ref,
  disabled,
  defaultValue,
  step,
  value,
  onChange,
  onFocus,
  className,
  labelRow = false,
}: InputProps) {
  const variants = {
    outlined:
      "border border-[var(--border)] bg-[var(--surface-elevated)] rounded-[20px] px-4 py-3 text-foreground placeholder:text-subtle",
    filled:
      "bg-[var(--surface-elevated)] rounded-[20px] px-4 py-3 text-foreground placeholder:text-subtle",
    borderless: "bg-transparent p-2 text-center focus:outline-none text-lg",
    table: "bg-transparent text-center focus:outline-none w-full",
  };

  return (
    <div
      className={`flex ${labelRow ? "items-center gap-3" : "flex-col space-y-2"}`}
    >
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}
      <input
        step={step}
        className={`${variants[variant]} ${className ?? ""}`}
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
      />
    </div>
  );
}
