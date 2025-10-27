import Table from '@/app/components/Table';
import Card from '@/app/components/Card';
import jiraClient from '@/services/jiraClient';
import { searchForIssuesUsingJql } from '@/services/jiraSearchJql';
import { adfToPlainText } from '@/utils/adfToText';
import { truncateText, formatDate } from '@/utils/formatters';

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

async function getIssues(projectIdOrKey: string) {

  const searchResult = await searchForIssuesUsingJql({
    jql: `project=${projectIdOrKey} ORDER BY created DESC`
  });

  let issueArray: any[] = [];

  if(searchResult.issues){
    for(const key in searchResult.issues){

      let fields = {issuetype:{name:""},status:{name:""},description:"",summary:"",created:""};
      if(searchResult.issues[key].fields){
        fields = searchResult.issues[key].fields;
      }

      const fullDescription = adfToPlainText(fields.description);

      const issueObject = {
        id:searchResult.issues[key].id,
        key:searchResult.issues[key].key,
        status:fields.status.name,
        type:fields.issuetype.name,
        summary:fields.summary,
        description: fullDescription,
        descriptionTruncated: truncateText(fullDescription, 150),
        created: formatDate(fields.created),
      };

      issueArray.push(issueObject);
    }

  }

  return issueArray;
}

type PageProps = {
  params: {
    [key: string]: string;
  };
};

export default async function Page({ params: { project } }: PageProps) {
  const issues = await getIssues(project);
  const issueTypes = await getIssueTypes(project);
  const jiraHost = process.env.JIRA_HOST;

  return (
    <div className="mt-2">
      <h1 className="title">Issues</h1>

      <Card title='Issues' className="mb-4">
        <Table
          columns={[
            { 
              key: 'key', 
              width: 100, 
              value: 'Key',
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
            { key: 'type', width: 140, value: 'Type' },
            { key: 'status', width: 110, value: 'Status' },
            { key: 'summary', width: 200, value: 'Title' },
            { 
              key: 'descriptionTruncated', 
              width: 250, 
              value: 'Description',
              render: (value: string, row: any) => (
                <span title={row.description}>{value}</span>
              )
            },
            { key: 'created', width: 110, value: 'Created' }
          ]}
          rows={issues}
        />
      </Card>
      <Card title='Issue Types'>
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
