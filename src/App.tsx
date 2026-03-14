export default function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1a243a,_#09090b_60%)] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          elite-run-db
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Vite + React + TypeScript scaffold is ready.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          The real app can now be developed under <code>src/</code>. Treat{" "}
          <code>docs/mocks/submit-page-ui-prototype.html</code> as the temporary migration reference, not the final implementation target.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
              Available now
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>`npm run dev` for local development</li>
              <li>`npm run build` for production build checks</li>
              <li>`npm run preview` for built output review</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
              Next migration target
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>Move the current prototype flow into semantic React components</li>
              <li>Keep `docs/mocks/*.mock.tsx` as layout references only</li>
              <li>Start with submission flow and shared data models</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
