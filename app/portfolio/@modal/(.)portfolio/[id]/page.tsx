import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/project';
import { getProjectImages } from '@/lib/utils';
import ProjectGallery from '@/components/ProjectGallery';

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

  const images = getProjectImages(project.id);

  return <ProjectGallery project={project} images={images} />;
}
