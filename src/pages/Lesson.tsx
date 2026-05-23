import { useParams } from "react-router-dom";

export default function Lesson() {
  const { lessonId } = useParams();
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Lesson
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Lesson <span className="tabular">{lessonId}</span> — Voice/chat UI coming next pass.
      </p>
    </div>
  );
}
