// @ts-check
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline'
import { useEffect } from 'react'
import { i18nInstance } from '../src/i18n'

export const parameters = {
  controls: { expanded: true },
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en-US', right: '🇺🇸', title: 'English' },
        { value: 'zh-CN', right: '🇨🇳', title: '简体中文' },
        { value: 'ja-JP', right: '🇯🇵', title: '日本語' },
      ],
    },
  },
}

const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme
  return (
    <ThemeProvider
      theme={createMuiTheme({
        palette: {
          mode: theme,
        },
      })}
    >
      <ScopedCssBaseline>
        <Story {...context} />
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

const withI18n = (Story, context) => {
  const locale = context.globals.locale
  useEffect(() => {
    i18nInstance.changeLanguage(locale)
  }, [locale])
  return <Story {...context} />
}

export const decorators = [withThemeProvider, withI18n]
