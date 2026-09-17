import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/project';

interface ModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedProjectModal({ params }: ModalPageProps) {
  const { id } = await params;
  const projects = projectsData as unknown as Project[];
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Lista pod spodem (@children) jest już wyrównana do tego projektu przez klik w ProjectView.
  // Ten slot istnieje tylko po to, żeby nawigacja klientowa zmieniła URL/historię bez remountu listy.
  return null;
}
