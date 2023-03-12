import jiraClient from '@/services/jiraClient';
import { Project } from 'jira.js/out/version3/models';
import Link from 'next/link';
import Card from './components/Card';

export const metadata = {
  title: 'LXC Extension Jira Viewer',
  description: 'LXC - Client Extensions and Next 13',
};

async function getProjects(): Promise<Project[]> {
  const projects = await jiraClient.projects.getAllProjects();

  return projects as Project[];
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <>
      <h1 className="title my-2">Projects</h1>

      <div className="columns is-multiline mt-3">
        {projects.map((project, index) => (
          <Card
            className="column is-4 mb-4"
            title={`[${project.key}] ${project.name}`}
            key={index}
            footer={
              <footer className="card-footer">
                <Link
                  href={`/issues/${project.id}`}
                  className="card-footer-item"
                >
                  Go to issues
                </Link>
              </footer>
            }
          >
            {project.name}
          </Card>
        ))}
      </div>
    </>
  );
}
