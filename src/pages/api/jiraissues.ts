import { Version3Client } from 'jira.js';
import { host, email, apiToken } from './credentials';

const client = new Version3Client({
  host,
  authentication: {
    basic: { email, apiToken },
  },
  newErrorHandling: true,
});

export default async function getissues(req:any,res:any) {

  if (!host||!email||!apiToken) {
    res.status(500).json({
      error: {
        message: "Jira API configuration not present, please follow instructions in README.md",
      }
    });
    return;
  }

  console.log(req.body.projectId);
  const project = await client.projects.getProject({ projectIdOrKey: req.body.projectId }) 
  
  //console.log("----project----");
  //console.log(project);

  res.status(200).json({ result: project["issueTypes"] });
}