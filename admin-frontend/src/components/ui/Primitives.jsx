export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="glass-heavy rounded-2xl border border-glass-medium p-6 shadow-glass-sm sm:p-8 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* =========================
   INPUT / SELECT / DATE
========================= */

export const controlClass =
  "min-w-0 appearance-none rounded-xl border border-glass-medium glass-heavy px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60";

/* =========================
   PRIMARY BUTTON
========================= */

export const primaryButtonClass =
  "btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-gold-glow transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60";

/* =========================
   SECONDARY BUTTON
========================= */

export const secondaryButtonClass =
  "btn-secondary inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-glass-medium glass-heavy px-4 text-sm font-medium text-slate-300 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60";