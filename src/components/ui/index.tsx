import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "tonal" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg" | "create";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "border border-[#111827] bg-[#111827] text-white hover:bg-[#263142]",
  secondary: "border border-[#d8dde6] bg-white text-[#333333] hover:bg-[#f7f8fa]",
  ghost: "border border-transparent bg-transparent text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#111827]",
  tonal: "border border-[#d8dde6] bg-[#f7f8fa] text-[#333333] hover:bg-[#eef1f5]",
  danger: "border border-[#f0ccd3] bg-[#fff4f7] text-[#d24b5a] hover:bg-[#ffeaf0]",
  link: "border border-transparent bg-transparent text-[#4d49fc] hover:text-[#111827]",
};

const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-[12px]",
  md: "min-h-9 px-4 py-2 text-[13px] md:text-[14px]",
  lg: "min-h-11 px-5 py-2.5 text-[15px] md:text-[16px]",
  create: "min-h-[56px] px-6 py-4 text-[18px] md:text-[24px]",
};

export function Button({
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40 disabled:cursor-not-allowed disabled:opacity-55",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type IconButtonVariant = "surface" | "ghost" | "dark" | "overlay";
type IconButtonSize = "sm" | "md" | "lg";

const iconButtonVariantClass: Record<IconButtonVariant, string> = {
  surface: "border border-[#d8dde6] bg-[#f7f8fa] text-[#333333] hover:bg-[#eef1f5]",
  ghost: "border border-transparent bg-transparent text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#111827]",
  dark: "border border-[#343434] bg-[#272727] text-[#d9d9d9] hover:bg-[#313131]",
  overlay: "border border-white/20 bg-black/70 text-white hover:bg-black",
};

const iconButtonSizeClass: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

export function IconButton({
  children,
  className,
  size = "md",
  variant = "surface",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}) {
  return (
    <button
      type="button"
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40 disabled:cursor-not-allowed disabled:opacity-55",
        iconButtonVariantClass[variant],
        iconButtonSizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function BackButton({
  label,
  showLabel = false,
  className,
  icon = "chevron",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  showLabel?: boolean;
  icon?: "chevron" | "arrow";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full text-[#5f6678] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40",
        showLabel ? "px-2 py-2 text-[14px] font-medium" : "h-9 w-9 justify-center border border-[#d8dde6] bg-[#f7f8fa] hover:bg-[#eef1f5]",
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon === "arrow" ? (
          <>
            <path d="M19 12H5" />
            <path d="M11 6 5 12l6 6" />
          </>
        ) : (
          <path d="M15 5 8 12l7 7" />
        )}
      </svg>
      {showLabel ? <span>{label}</span> : null}
    </button>
  );
}

export function SelectControl({
  className,
  children,
  variant = "compact",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  variant?: "compact" | "create";
}) {
  return (
    <span className="relative inline-flex min-w-0">
      <select
        className={cn(
          "w-full appearance-none border text-[#111827] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#111116]/20",
          variant === "create"
            ? "rounded-[8px] border-transparent bg-transparent py-1 pr-9 text-[20px] md:text-[24px]"
            : "h-11 min-w-[112px] rounded-full border-[#d8dde6] bg-white py-2 pl-5 pr-10 text-[13px] font-black hover:bg-[#eef1f5] focus:border-[#111116] md:text-[14px]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8493]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

export function FormField({
  children,
  className,
  error,
  helper,
  label,
  labelClassName,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  error?: ReactNode;
  helper?: ReactNode;
  label?: ReactNode;
  labelClassName?: string;
}) {
  return (
    <label className={cn("block", className)} {...props}>
      {label ? <div className={cn("text-[14px] font-bold text-[#5f6678]", labelClassName)}>{label}</div> : null}
      {children}
      {helper && !error ? <p className="mt-2 text-[13px] leading-[1.6] text-[#8d93a3]">{helper}</p> : null}
      {error ? <p className="mt-2 text-[13px] leading-[1.5] text-[#d24b5a]">{error}</p> : null}
    </label>
  );
}

export function FieldShell({
  children,
  className,
  variant = "view",
}: {
  children: ReactNode;
  className?: string;
  variant?: "view" | "create";
}) {
  return (
    <div
      className={cn(
        "transition-colors focus-within:ring-2 focus-within:ring-[#111116]/15",
        variant === "create" ? "rounded-[8px] bg-[#f6f6f6] px-4 py-4 md:px-5" : "rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] px-4 py-3 focus-within:bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ChipVariant = "neutral" | "active" | "include" | "exclude" | "create";

const chipVariantClass: Record<ChipVariant, string> = {
  neutral: "border-[#d8dde6] bg-white text-[#5f6678]",
  active: "border-transparent bg-[#111827] text-white",
  include: "border-[#8fc7d8] bg-[#eef9fc] text-[#357f91]",
  exclude: "border-[#efc9b0] bg-[#fff7f2] text-[#b6611e]",
  create: "border-transparent bg-[#f2f2f2] text-[#9999b1]",
};

export function Chip({
  children,
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: ChipVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center rounded-full border px-3 py-1.5 text-[12px] font-medium leading-none",
        chipVariantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type BadgeVariant = "neutral" | "dark" | "count" | "warning" | "success";

const badgeVariantClass: Record<BadgeVariant, string> = {
  neutral: "border-[#d8dde6] bg-white text-[#5f6678]",
  dark: "border-white/40 bg-transparent text-[#d9d9d9]",
  count: "border-[#d8dde6] bg-white text-[#5f6678]",
  warning: "border-[#efc9b0] bg-[#fff7f2] text-[#b6611e]",
  success: "border-[#8fc7d8] bg-[#eef9fc] text-[#357f91]",
};

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 max-w-full items-center rounded-full border px-3 text-[12px] font-black leading-none",
        badgeVariantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function CardShell({
  children,
  className,
  interactive = false,
  selected = false,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
  selected?: boolean;
}) {
  return (
    <article
      className={cn(
        "border bg-white text-left shadow-[0_10px_24px_rgba(21,27,38,0.06)]",
        selected ? "border-[#9aa7ba] bg-[#eef1f5]" : "border-[#dfe3ea]",
        interactive && "cursor-pointer transition hover:-translate-y-0.5 hover:border-[#cfd6e2] hover:shadow-[0_18px_34px_rgba(21,27,38,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}

export function Panel({
  children,
  className,
  variant = "surface",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  variant?: "surface" | "muted" | "create";
}) {
  return (
    <section
      className={cn(
        "border",
        variant === "surface" && "border-[#e5e7eb] bg-white shadow-[0_12px_26px_rgba(21,27,38,0.06)]",
        variant === "muted" && "border-[#e5e7eb] bg-[#f7f8fa]",
        variant === "create" && "border-transparent bg-[#f6f6f6]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function ModalFrame({
  children,
  className,
  onClose,
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className={cn("flex max-h-[calc(100vh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-[#ebebeb] bg-white p-5 text-[#333333] shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-6", className)}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#ebebeb] pb-5">
            <div>
              <h3 className="text-[24px] font-bold leading-tight text-[#111827] md:text-[30px]">{title}</h3>
              {description ? <p className="mt-2 text-[14px] leading-[1.7] text-[#7b7b8d] md:text-[15px]">{description}</p> : null}
            </div>
            <IconButton type="button" onClick={onClose} aria-label="閉じる">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6 18 18" />
                <path d="M18 6 6 18" />
              </svg>
            </IconButton>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function DrawerFrame({
  children,
  className,
  side = "right",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col overflow-y-auto border bg-white text-[#333333]",
        side === "left" ? "left-0 border-r shadow-[18px_0_44px_rgba(31,41,55,0.12)]" : "right-0 border-l shadow-[-24px_0_60px_rgba(31,41,55,0.16)]",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function EmptyState({
  children,
  className,
  icon,
  title,
}: {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className={cn("rounded-[16px] border border-dashed border-[#d8dde6] bg-[#f7f8fa] px-4 py-8 text-center text-[13px] text-[#8d93a3]", className)}>
      {icon ? <div className="mb-3 flex justify-center text-[#dcdfe6]">{icon}</div> : null}
      <div className="font-black text-[#606266]">{title}</div>
      {children ? <div className="mt-2 font-bold leading-5 text-[#909399]">{children}</div> : null}
    </div>
  );
}

export function FloatingCta({
  badge,
  children,
  className,
  icon,
  leadingIcon,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
  badge?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  leadingIcon?: ReactNode;
}) {
  const content = (
    <>
      {badge ? (
        <span className="flex items-center gap-1.5 border border-white/35 px-2 py-1 text-[9px] font-bold uppercase leading-none text-white/60">
          {badge}
        </span>
      ) : null}
      {leadingIcon}
      <span className="cta-shine-text shrink-0 whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">{children}</span>
      {icon}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <a
        className={cn("fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]", className)}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn("fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]", className)}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
