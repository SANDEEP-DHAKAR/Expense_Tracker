export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">{actions}</div> : null}
      </div>
    </section>
  );
}

export const controlClass =
  "rounded-lg border border-slate-200 bg-white text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900";

export const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200";

export const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800";
