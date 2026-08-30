import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import type { Project } from '../bindings/vvalio.dev/nyelvin/project';
import { useLexicon } from './store';
import type { LexiconEntry } from '../bindings/vvalio.dev/nyelvin/lexicon';
import { subscribe } from './events/listen';
import { ProjectService } from '../bindings/vvalio.dev/nyelvin/service';

subscribe('project:open', ({ path, project }) => {
  onProjectOpen(project);
});

subscribe('project:save', ({ path }) => {
  onProjectSave();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const onProjectOpen = (project: Project) => {
  if (project.lexicon === null) {
    project.lexicon = { entries: [] };
  }

  useLexicon.setState({
    words: Object.values(project.lexicon.entries!) as LexiconEntry[],
  });
};

const onProjectSave = () => {
  const words = useLexicon.getState().words;
  const project: Project = { lexicon: { entries: words } };

  ProjectService.Update(project);
  ProjectService.SaveProject();
};
