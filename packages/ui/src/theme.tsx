import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline'
import React from 'react'
import { useThemeConfig } from './store'

export const MaterialUI: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const themeConfig = useThemeConfig()
  const themeType =
    themeConfig === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : themeConfig

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          mode: themeType,
        },
      }),
    [themeType]
  )

  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>{children}</ScopedCssBaseline>
    </ThemeProvider>
  )
}
