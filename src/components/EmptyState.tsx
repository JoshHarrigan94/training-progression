export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="empty-state card">
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </section>
  );
}
