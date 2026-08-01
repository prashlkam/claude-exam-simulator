/**
 * The runner deliberately does not inherit the app chrome's nav links — a live exam
 * should not offer one-click routes away from itself. (PLAN.md §9.4)
 */
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return <div className="pb-10">{children}</div>;
}
