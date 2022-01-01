import {
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  ScopedCssBaseline,
} from '@mui/material'
import { useMemo } from 'react'
import { useDispatch, useStore } from './store'

export const MaterialUI: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { theme: themeConfig } = useStore()
  const themeType =
    themeConfig === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : themeConfig

  const theme = useMemo(
    () =>
      createTheme({
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

const useUpdateTheme = () => {
  const dispatch = useDispatch()

  return (theme: 'light' | 'dark') =>
    dispatch({
      type: 'UPDATE',
      payload: { theme },
    })
}

export const useThemeSwitch = () => {
  const theme = useTheme()
  const currentTheme = theme.palette.mode
  const updateTheme = useUpdateTheme()
  return {
    currentTheme,
    toggle: () => updateTheme(currentTheme === 'light' ? 'dark' : 'light'),
    // setLight, setDark
  }
}
