import Table from '@/app/components/Table';
import Card from '@/app/components/Card';
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

async function getIssues(projectIdOrKey: string) {
  console.log("--searchResult--");

  const searchResult = await jiraClient.issueSearch.searchForIssuesUsingJql({
    jql: 'project='+projectIdOrKey
  });

  let issueArray:Object = [];
  const issueObject = {};

  if(searchResult.issues){
    for(const key in searchResult.issues){

      let fields = {issuetype:{name:""},description:""};
      if(searchResult.issues[key].fields){
        fields = searchResult.issues[key].fields;
      }

      console.log(searchResult.issues[key]);

      const issueObject = {
        id:searchResult.issues[key].id,
        key:searchResult.issues[key].key,
        type:fields.issuetype.name,
        description:fields.description,
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

  return (
    <div className="mt-2">
      <h1 className="title">Issues Types</h1>

      <Card title='Issues'>
        <Table
          columns={[
            { key: 'key', width: 100, value: 'Key' },
            { key: 'type', width: 200, value: 'Type' },
            { key: 'description', value: 'Description' },
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
