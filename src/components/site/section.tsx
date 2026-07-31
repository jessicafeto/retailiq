import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("container-page py-12 md:py-16", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-600">{lead}</p>}
    </Reveal>
  );
}

/** Long-form readable prose block. */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl text-[1.02rem] leading-relaxed text-ink-600 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-ink-800",
        className,
      )}
    >
      {children}
    </div>
  );
}
