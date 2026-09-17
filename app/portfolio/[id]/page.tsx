import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/project';
import PortfolioList from '@/components/PortfolioList';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projects = projectsData as unknown as Project[];
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="w-full">
      <PortfolioList focusProjectId={project.id} />
    </main>
  );
}
