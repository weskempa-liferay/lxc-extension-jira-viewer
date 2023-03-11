import { useReducer } from 'react';

import { Project } from 'jira.js/out/version2/models';

type State = {
  initialized: boolean;
  projects: Project[];
  issues: any[];
  selectedProject: 0;
  title: string;
};

const initialState = {
  initialized: false,
  projects: [],
  issues: [],
  selectedProject: 0,
  title: 'example',
};

function reducer(state: State, action: { type: string; value: any }) {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, initialized: action.value };
    case 'PROJECTS':
      return { ...state, projects: action.value };
    case 'SELECTEDPROJECT':
      return { ...state, selectedProject: action.value };
    case 'ISSUES':
      return { ...state, issues: action.value };
    case 'TITLE':
      return { ...state, title: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function useStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch];
}

export default useStore;
