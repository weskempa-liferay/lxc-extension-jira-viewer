const host = process.env.JIRA_HOST;
const username = process.env.JIRA_API_USERNAME;
const apiToken = process.env.JIRA_API_TOKEN;

interface JqlSearchOptions {
  jql: string;
  maxResults?: number;
  fields?: string[];
  startAt?: number;
}

interface JqlSearchResponse {
  issues: any[];
  total: number;
  maxResults: number;
  startAt: number;
}

export async function searchForIssuesUsingJql(
  options: JqlSearchOptions
): Promise<JqlSearchResponse> {
  const { jql, maxResults = 100, fields = ['*navigable'] } = options;

  const url = `${host}/rest/api/3/search/jql`;
  
  const authHeader = 'Basic ' + Buffer.from(`${username}:${apiToken}`).toString('base64');

  const payload: any = {
    jql,
    maxResults,
    fields,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jira API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}
