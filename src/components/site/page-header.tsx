import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("relative overflow-hidden", className)}>
      <div className="hero-aurora pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="container-page pb-12 pt-16 md:pb-16 md:pt-24">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] text-ink-900 md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
