import jiraClient from '@/services/jiraClient';
import { Project } from 'jira.js/out/version3/models';
import Link from 'next/link';
import Card from './components/Card';

export const metadata = {
  title: 'LXC Extension Jira Viewer',
  description: 'LXC - Client Extensions and Next 13',
};

async function getProjects(): Promise<{ projects: Project[]; error: string | null }> {
  try {
    console.log('Attempting to fetch all projects from Jira...');
    const projects = await jiraClient.projects.getAllProjects();
    console.log('Fetched projects:', projects?.length || 0);
    
    if (!projects || projects.length === 0) {
      console.warn('No projects returned from Jira. This could mean:');
      console.warn('1. The credentials do not have permission to view projects');
      console.warn('2. The Jira instance has no projects');
      console.warn('3. The API endpoint is incorrect');
    }
    
    return { projects: projects as Project[], error: null };
  } catch (error: any) {
    console.error('Error fetching projects from Jira:');
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error response:', error?.response?.status, error?.response?.statusText);
    
    const errorMessage = error?.message || 'Unknown error occurred while connecting to Jira';
    return { projects: [], error: errorMessage };
  }
}

export default async function Page() {
  const { projects, error } = await getProjects();

  return (
    <>
      <h1 className="title my-2">Projects</h1>

      {error ? (
        <div className="notification is-danger mt-5">
          <p className="is-size-5 mb-3">Failed to connect to Jira</p>
          <p className="mb-3"><strong>Error:</strong> {error}</p>
          <p>Please check:</p>
          <ul className="ml-5 mt-2">
            <li>Your Jira host URL is correct (JIRA_HOST)</li>
            <li>Your API token is valid (JIRA_API_TOKEN)</li>
            <li>Your username/email is correct (JIRA_API_USERNAME)</li>
            <li>The API version matches your Jira instance (JIRA_CLIENT_VERSION)</li>
          </ul>
        </div>
      ) : projects.length === 0 ? (
        <div className="notification is-info mt-5">
          <p className="is-size-5 mb-3">No projects found</p>
          <p>This could be because:</p>
          <ul className="ml-5 mt-2">
            <li>Your Jira account doesn't have permission to view any projects</li>
            <li>Your Jira instance has no projects created yet</li>
          </ul>
          <p className="mt-3">
            <strong>Next steps:</strong> Check your Jira credentials and make sure the account has access to at least one project.
          </p>
        </div>
      ) : (
        <div className="columns is-multiline mt-3">
          {projects.map((project, index) => (
            <Card
              className="column is-4 mb-4"
              title={`[${project.key}] ${project.name}`}
              key={index}
              footer={
                <footer className="card-footer">
                  <Link
                    href={`/issues/${project.key}`}
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
      )}
    </>
  );
}
