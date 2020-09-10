import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline'

export const parameters = {
  controls: { expanded: true },
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'switchalt',
      items: ['light', 'dark'],
    },
  },
}

const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme
  return (
    <ThemeProvider
      theme={createMuiTheme({
        palette: {
          type: theme,
        },
      })}
    >
      <ScopedCssBaseline>
        <Story {...context} />
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

export const decorators = [withThemeProvider]
