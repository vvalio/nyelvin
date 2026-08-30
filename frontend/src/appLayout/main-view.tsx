import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type SxProps,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';

export type MainViewProps = {
  pages: { [key: string]: MainViewPage };
};

export type MainViewPage = {
  drawerItemTitle: string;
  renderFn: () => React.ReactElement;
  iconFn: () => React.ReactElement;
};

const highlightedState: SxProps = {
  backgroundColor: 'rgba(0,0,0,0.15)',
  borderRadius: '5px',
  ':hover': {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
};

const MainView: React.FC<MainViewProps> = ({ pages }) => {
  const [drawerTab, setDrawerTab] = useState<string | null>(null);

  return (
    <Box>
      <Drawer
        open={true}
        variant="permanent"
        slotProps={{ paper: { sx: { width: '20%' } } }}
      >
        <List>
          {Object.keys(pages).map(id => {
            const pg = pages[id];
            return (
              <ListItem>
                <ListItemButton
                  onClick={() => setDrawerTab(id)}
                  sx={id === drawerTab ? highlightedState : null}
                >
                  <ListItemText>{pg.drawerItemTitle}</ListItemText>
                  <ListItemIcon>{pg.iconFn()}</ListItemIcon>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box sx={{ marginLeft: '20%' }}>
        <Box className="m-4">
          {drawerTab ? pages[drawerTab].renderFn() : <></>}
        </Box>
      </Box>
    </Box>
  );
};

export default MainView;
