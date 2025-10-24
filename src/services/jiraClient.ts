import { Version2Client, Version3Client, Config } from 'jira.js';

const apiToken = process.env.JIRA_API_TOKEN;
const apiVersion = process.env.JIRA_CLIENT_VERSION;
const host = process.env.JIRA_HOST;
const username = process.env.JIRA_API_USERNAME;

// Log configuration (without exposing sensitive data)
console.log('Jira Client Configuration:', {
  host: host ? `${host.substring(0, 10)}...` : 'NOT SET',
  apiVersion,
  usernameSet: !!username,
  apiTokenSet: !!apiToken,
});

if (!host || !username || !apiToken) {
  console.error('Missing required Jira environment variables!');
  console.error('JIRA_HOST:', !!host);
  console.error('JIRA_API_USERNAME:', !!username);
  console.error('JIRA_API_TOKEN:', !!apiToken);
}

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
