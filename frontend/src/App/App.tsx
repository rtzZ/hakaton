import React from 'react';
import {Provider} from "react-redux";
import {RouterProvider} from "react-router-dom";

import {createTheme, ThemeProvider} from "@mui/material";
import Box from "@mui/material/Box"

import router from './router'
import {store} from "../entities/commonStore";

const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
            fontSize: '17px'
        }
    },
    // palette: {
    //     custom: {
    //         blue: {
    //             light: '#026595',
    //             main: '#0e2b46',
    //         }
    //     }
    // }
})

function App() {
  return (
      <Provider store={store}>
          <Box>
              <ThemeProvider theme={theme}>
                  <RouterProvider router={router}/>
              </ThemeProvider>
          </Box>
      </Provider>
  );
}

export default App;
