import Table from '@/app/components/Table';
import Card from '@/app/components/Card';
import jiraClient from '@/services/jiraClient';
import { searchForIssuesUsingJql } from '@/services/jiraSearchJql';

export const metadata = {
  title: 'LXC Extension Jira Viewer - Issues Types',
  description: 'LXC - Client Extensions and Next 16',
};

async function getIssueTypes(projectIdOrKey: string) {
  const project = await jiraClient.projects.getProject({ projectIdOrKey });
  return (project['issueTypes'] ?? []).sort((a, b) =>
    (a.name as string).localeCompare(b.name as string)
  );
}

async function getIssues(projectIdOrKey: string) {
  // Quote the project value so keys with letters work in JQL
  const jql = `project = "${projectIdOrKey}" ORDER BY created DESC`;

  const searchResult = await searchForIssuesUsingJql({ jql });

  const issueArray: any[] = [];

  if (Array.isArray(searchResult.issues)) {
    for (const issue of searchResult.issues) {
      const fields =
        issue?.fields ?? { issuetype: { name: '' }, status: { name: '' }, description: '', summary: '' };

      issueArray.push({
        id: issue.id,
        key: issue.key,
        status: fields.status?.name ?? '',
        type: fields.issuetype?.name ?? '',
        summary: fields.summary ?? '',
        description:
          typeof fields.description === 'string'
            ? fields.description
            : fields.description
            ? '[Rich text description]'
            : '',
      });
    }
  }

  return issueArray;
}

// -------- Next.js 16: params is a Promise --------
type PageParams = { project?: string };
type PageProps = { params: Promise<PageParams> };

export default async function Page({ params }: PageProps) {
  const { project } = await params; // <-- IMPORTANT in Next 16

  if (!project) {
    // Optional: render a 404 if the segment wasn’t provided
    // import { notFound } from 'next/navigation'; notFound();
    throw new Error('Missing project route parameter.');
  }

  const [issues, issueTypes] = await Promise.all([
    getIssues(project),
    getIssueTypes(project),
  ]);

  return (
    <div className="mt-2">
      <h1 className="title">Issues</h1>

      <Card title="Issues" className="mb-4">
        <Table
          columns={[
            { key: 'key', value: 'Key' },
            { key: 'type', value: 'Type' },
            { key: 'status', value: 'Status' },
            { key: 'summary', value: 'Title' },
          ]}
          rows={issues}
        />
      </Card>

      <Card title="Issue Types">
        <Table
          columns={[
            { key: 'name', value: 'Name' },
            { key: 'description', value: 'Description' },
          ]}
          rows={issueTypes}
        />
      </Card>
    </div>
  );
}
