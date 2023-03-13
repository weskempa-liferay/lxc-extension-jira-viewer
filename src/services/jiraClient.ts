import { Version2Client, Version3Client, Config } from 'jira.js';

const apiToken = process.env.JIRA_API_TOKEN;
const apiVersion = process.env.JIRA_CLIENT_VERSION;
const host = process.env.JIRA_HOST;
const password = process.env.JIRA_API_PASSWORD;
const username = process.env.JIRA_API_USERNAME;

const VersionClient = apiVersion === 'v3' ? Version3Client : Version2Client;

const jiraClient = new VersionClient({
  host,
  authentication: {
    basic: {
      email: username,
      apiToken: apiToken
    }
  },
  newErrorHandling: true,
} as Config);


// Exporting as V3, to avoid typing issue

export default jiraClient as Version3Client;
