type ButtonProps = {
  variant?: "primary" | "secondary" | "destructive" | "basic";
  size?: "extrasmall" | "small" | "medium" | "large";
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  variant = "primary",
  size = "medium",
  type = "button",
  text,
  disabled,
  onClick,
}: ButtonProps) {
  const variants = {
    primary: disabled
      ? "bg-faded-green/70 text-black"
      : "bg-green text-black shadow-[0_20px_40px_rgba(190,255,68,0.22)]",
    secondary:
      "border border-[var(--border)] bg-[var(--surface-elevated)] text-foreground",
    destructive: "bg-red text-white",
    basic: "bg-transparent text-foreground",
  };

  const sizes = {
    extrasmall: "text-xs px-3 py-2 min-w-[68px]",
    small: "text-sm px-4 py-2.5 min-w-[92px]",
    medium: "text-sm px-5 py-3 min-w-[120px]",
    large: "text-base px-6 py-4 min-w-[140px]",
  };

  return (
    <button
      type={type}
      className={`${variants[variant]} ${sizes[size]} rounded-[18px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${
        disabled ? "cursor-not-allowed opacity-80" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
