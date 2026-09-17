export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="glass-heavy rounded-2xl border border-white/[0.08] p-6 shadow-glass-sm sm:p-7 animate-fade-in bg-slate-900/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {eyebrow}
            </div>
          ) : null}

          <h1 className="mt-2.5 text-2xl font-black tracking-tight text-gradient sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:justify-end">
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
  "min-w-0 appearance-none rounded-xl border border-white/[0.1] bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-500/60 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60";

/* =========================
   PRIMARY BUTTON
========================= */

export const primaryButtonClass =
  "btn-primary inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs sm:text-sm font-semibold text-white shadow-emerald-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

/* =========================
   SECONDARY BUTTON
========================= */

export const secondaryButtonClass =
  "btn-secondary inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-slate-900/60 px-4 text-xs sm:text-sm font-medium text-slate-300 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";