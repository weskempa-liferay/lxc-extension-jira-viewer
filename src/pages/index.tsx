import Head from 'next/head'
import useStore from './useStore';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';


import { Grid, Box, Paper, Button, Card } from '@mui/material';



export default function Home() {
  
  const [store, dispatch] = useStore();

  function createProjectArray(projects:any){

    const array:any = [];

    for(let key in projects){

      //console.log(projects[key]);

      let project:any = {};
      project['name'] = projects[key].name;
      project['id'] = projects[key].id;

      array.push(project);
    }

    //console.log(array);
    return array;
  }

  function createIssueArray(issues:any){

    const array:any = [];

    for(let key in issues){

      //console.log(issues[key]);

      let issue:any = {};
      issue['name'] = issues[key].name;
      issue['description'] = issues[key].description;
      issue['id'] = issues[key].id;

      array.push(issue);
    }

    //console.log(array);
    return array;
  }

  async function loadProjects() {
    
    try {

      const response = await fetch("/api/jiraprojects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const projects = createProjectArray(data.result);
      
      dispatch({ type: 'PROJECTS', value:projects });

    } catch(error) {
      console.error(error);
    }
  }

  function selectProject(projectId:Number){
    loadIssues(projectId);
  }

  async function loadIssues(projectId:Number) {
    
    try {

      const body = {
        "projectId":projectId
      }

      const response = await fetch("/api/jiraissues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const issues = createIssueArray(data.result);
      
      //console.log(issues);
      dispatch({ type: 'ISSUES', value:issues });

    } catch(error) {
      console.error(error);
    }
  }

  if(!store.initialized){
    console.log("INITIALIZE");
    dispatch({ type: 'INITIALIZE', value:true });

    loadProjects();
  }

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Jira Integration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid className="content" container spacing={2}>
        <Grid className="projects" item xs={6}>

          <h4>Projects</h4>

          {store.projects.map((project:any) => {
            return ( 

              <Card key={project.id} 
                  onClick={ () => selectProject(project.id) }
                  className="label-item">
                   {project.name}
              </Card>

            );
          })}

        </Grid>
        <Grid item xs={6}>

          <h4>Issues</h4>

          {store.issues.map((issue:any) => {
            return ( 

              <Card key={issue.id}>
                <Box className="label-item">
                  <div><b>{issue.name}</b> (<a href="#">{issue.id}</a>)</div>
                  <div><i>{issue.description}</i></div>
                </Box>
              </Card>

            );
          })}

        </Grid>
      </Grid>

    </ThemeProvider>
    </>
  )
}
