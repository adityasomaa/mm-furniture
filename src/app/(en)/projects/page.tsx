import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { pageMeta } from '@/lib/meta';
import { projectsCopy, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';
import { hasProjects } from '@/lib/projects';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'projects',
  title: projectsCopy.metaTitle.en,
  description: projectsCopy.metaDescription.en,
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
            { name: ui.home.en, path: '/' },
            { name: projectsCopy.kicker.en, path: '/projects' },
          ]),
        ]}
      />
      <ProjectsPage locale="en" />
    </>
  );
}
