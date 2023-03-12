import Table from '@/app/components/Table';
import jiraClient from '@/services/jiraClient';

export const metadata = {
  title: 'LXC Extension Jira Viewer - Issues Types',
  description: 'LXC - Client Extensions and Next 13',
};

async function getIssueTypes(projectIdOrKey: string) {
  const project = await jiraClient.projects.getProject({
    projectIdOrKey,
  });

  return (project['issueTypes'] ?? []).sort((a, b) =>
    (a.name as string).localeCompare(b.name as string)
  );
}

type PageProps = {
  params: {
    [key: string]: string;
  };
};

export default async function Page({ params: { project } }: PageProps) {
  const issueTypes = await getIssueTypes(project);

  return (
    <div className="mt-2">
      <h1 className="title">Issues Types</h1>

      <Table
        columns={[
          { key: 'name', value: 'Name' },
          { key: 'description', value: 'Description' },
        ]}
        rows={issueTypes}
      />
    </div>
  );
}
