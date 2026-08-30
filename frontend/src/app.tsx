import { Box, StyledEngineProvider, ThemeProvider } from '@mui/material';
import MainView from './appLayout/main-view';
import Lexicon from './lexicon/lexicon';
import { theme } from './theme/theme';
import { SlBookOpen, SlTag } from 'react-icons/sl';
import PartsOfSpeech from './pos/parts-of-speech';

import './base.css';

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Box className="w-full h-full">
          <MainView
            pages={{
              lexicon: {
                drawerItemTitle: 'Lexicon',
                renderFn: () => <Lexicon />,
                iconFn: () => <SlBookOpen />,
              },
              pos: {
                drawerItemTitle: 'Parts of speech',
                renderFn: () => <PartsOfSpeech />,
                iconFn: () => <SlTag />,
              },
            }}
          />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
