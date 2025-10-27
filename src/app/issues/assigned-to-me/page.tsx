import Table from '@/app/components/Table';
import { Component } from 'jira.js/out/version3/models';
import { searchForIssuesUsingJql } from '@/services/jiraSearchJql';
import { adfToPlainText } from '@/utils/adfToText';
import { truncateText, formatDate } from '@/utils/formatters';

export const metadata = {
  title: 'LXC Extension Jira Viewer - Issues Assigned to Me',
  description: 'LXC - Client Extensions and Next 16',
};

const getIssues = async () => {
  const response = await searchForIssuesUsingJql({
    jql: 'assignee = currentUser() and status not in (Closed) order by created DESC',
  });

  const issues = (response.issues ?? []).map(
    ({
      fields: { assignee, components, status, reporter, summary, description, issuetype, created },
      id,
      key,
      ...rest
    }) => {
      const fullDescription = adfToPlainText(description);
      return {
        assignee,
        id,
        key,
        components,
        status,
        reporter,
        rest,
        summary,
        type: issuetype?.name || '',
        description: fullDescription,
        descriptionTruncated: truncateText(fullDescription, 150),
        created: formatDate(created),
      };
    }
  );

  return issues;
};

export default async function AssignedToMe() {
  const issues = await getIssues();
  const jiraHost = process.env.JIRA_HOST;

  return (
    <div>
      <h1 className="title is-4 mt-4">My tasks</h1>

      <Table
        columns={[
          { 
            key: 'key', 
            value: 'Key', 
            width: 100,
            render: (value: string) => (
              <a 
                href={`${jiraHost}/browse/${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="has-text-link"
              >
                {value}
              </a>
            )
          },
          { key: 'type', value: 'Type', width: 140 },
          {
            key: 'status',
            value: 'Status',
            width: 110,
            render: (status) => <span className="tag">{status?.name}</span>,
          },
          { key: 'summary', value: 'Title', width: 200 },
          { 
            key: 'descriptionTruncated', 
            width: 250, 
            value: 'Description',
            render: (value: string, row: any) => (
              <span title={row.description}>{value}</span>
            )
          },
          { key: 'created', value: 'Created', width: 110 },
        ]}
        rows={issues}
      />
    </div>
  );
}
