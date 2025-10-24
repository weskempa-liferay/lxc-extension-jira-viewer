const { Version2Client, Version3Client } = require('jira.js');

const apiToken = process.env.JIRA_API_TOKEN;
const apiVersion = process.env.JIRA_CLIENT_VERSION;
const host = process.env.JIRA_HOST;
const username = process.env.JIRA_API_USERNAME;

console.log('Testing Jira Connection...');
console.log('Host:', host);
console.log('API Version:', apiVersion);
console.log('Username:', username);
console.log('API Token:', apiToken ? 'Set' : 'NOT SET');
console.log('---');

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
});

async function testWithVersion(version) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing with API Version: ${version}`);
  console.log('='.repeat(60));
  
  const Client = version === 'v3' ? Version3Client : Version2Client;
  const client = new Client({
    host,
    authentication: {
      basic: {
        email: username,
        apiToken: apiToken
      }
    },
    newErrorHandling: true,
  });
  
  try {
    console.log('\n1. Testing myself/getCurrentUser()...');
    const myself = await client.myself.getCurrentUser();
    console.log('✓ Connection successful!');
    console.log('Logged in as:', myself.displayName, '(' + myself.emailAddress + ')');
    
    console.log('\n2. Testing projects.getAllProjects()...');
    const projects = await client.projects.getAllProjects();
    console.log('Response type:', typeof projects);
    console.log('Is array?', Array.isArray(projects));
    
    if (Array.isArray(projects)) {
      console.log('✓ Projects count:', projects.length);
      if (projects.length > 0) {
        console.log('First project:', projects[0].key, '-', projects[0].name);
      } else {
        console.log('⚠ No projects accessible to this user');
      }
    } else if (projects && typeof projects === 'object') {
      console.log('⚠ Response is an object, not an array');
      console.log('Keys:', Object.keys(projects));
      console.log('Response preview:', JSON.stringify(projects, null, 2).substring(0, 500));
    }
    
    return true;
  } catch (error) {
    console.error('\n✗ Caught error');
    console.error('Error type:', typeof error, error.constructor.name);
    console.error('Error value:', error);
    console.error('Error string:', String(error));
    
    if (error.response) {
      console.error('Response status:', error.response?.status);
      console.error('Response statusText:', error.response?.statusText);
      console.error('Response headers:', error.response?.headers);
      console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    if (error.request) {
      console.error('Request was made but no response:', !!error.request);
    }
    
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    
    if (error.stack) {
      console.error('Stack (first 500 chars):', error.stack.substring(0, 500));
    }
    
    return false;
  }
}

async function runTests() {
  console.log('\nTesting both API versions to find which one works...\n');
  
  const v2Works = await testWithVersion('v2');
  const v3Works = await testWithVersion('v3');
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS:');
  console.log('='.repeat(60));
  console.log('API v2:', v2Works ? '✓ Works' : '✗ Failed');
  console.log('API v3:', v3Works ? '✓ Works' : '✗ Failed');
  
  if (host.includes('atlassian.net')) {
    console.log('\nRECOMMENDATION: You are using Jira Cloud (atlassian.net).');
    console.log('Set JIRA_CLIENT_VERSION=v3 in your Replit Secrets.');
  }
}

runTests();
