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
    components: {
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td, &last-child th': {border: 0}
                }
            }
        }
    }
})

// Точка инициализации
function App() {
  return (
      <ErrorBoundary>
          <Provider store={store}>
              <Box>
                  <ThemeProvider theme={theme}>
                      <RouterProvider router={router}/>
                  </ThemeProvider>
              </Box>
          </Provider>
      </ErrorBoundary>
  );
}

export default App;
