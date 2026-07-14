import { Award } from '@/types/project';

export default function ProjectAwards({ awards }: { awards?: Award[] }) {
  if (!awards?.length) return null;

  return (
    <div className="mt-3 flex flex-col gap-1">
      {awards.map((award, i) => (
        <a
          key={i}
          href={award.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 underline transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          {award.label}
        </a>
      ))}
    </div>
  );
}
