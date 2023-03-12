import Table from '@/app/components/Table';
import jiraClient from '@/services/jiraClient';
import { Component } from 'jira.js/out/version3/models';

export const metadata = {
  title: 'LXC Extension Jira Viewer - Issues Assigned to Me',
  description: 'LXC - Client Extensions and Next 13',
};

const getIssues = async () => {
  const response = await jiraClient.issueSearch.searchForIssuesUsingJql({
    jql: 'assignee = currentUser() and status not in (Closed) order by created DESC',
  });

  const issues = (response.issues ?? []).map(
    ({
      fields: { assignee, components, status, reporter, summary },
      id,
      key,
      ...rest
    }) => ({
      assignee,
      id,
      key,
      components,
      status,
      reporter,
      rest,
      summary,
    })
  );

  return issues;
};

export default async function AssignedToMe() {
  const issues = await getIssues();

  return (
    <div>
      <h1 className="title is-4 mt-4">My tasks</h1>

      <Table
        columns={[
          { key: 'key', value: 'Key', width: 150 },
          { key: 'summary', value: 'Project', width: 300 },
          {
            key: 'components',
            value: 'Components',
            render: (components) => (
              <>
                {(components as Component[]).map(
                  (component, componentIndex) => (
                    <span className="tag mr-2" key={componentIndex}>
                      {component.name}
                    </span>
                  )
                )}
              </>
            ),
          },
          {
            key: 'status',
            value: 'Status',
            render: (status) => <span className="tag">{status?.name}</span>,
          },
          {
            key: 'assignee',
            value: 'Owner',
            render: (assignee) => assignee.name,
          },
        ]}
        rows={issues}
      />
    </div>
  );
}
