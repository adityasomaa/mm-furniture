import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { pageMeta } from '@/lib/meta';
import { projectsCopy, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';
import { hasProjects } from '@/lib/projects';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'projects',
  title: projectsCopy.metaTitle.id,
  description: projectsCopy.metaDescription.id,
});

export default function Page() {
  // The owner has not supplied project photographs yet, so this route does not exist.
  // See @/lib/projects: it switches on the moment the entries land.
  if (!hasProjects()) notFound();

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: ui.home.id, path: '/id' },
            { name: projectsCopy.kicker.id, path: '/id/projects' },
          ]),
        ]}
      />
      <ProjectsPage locale="id" />
    </>
  );
}
