export function TrackCard({ title, lessons }: { title: string; lessons: number }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{lessons} lessons, coding labs, AI tutor support</p>
    </article>
  );
}

