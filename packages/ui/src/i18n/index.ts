import { createContext, useContext } from 'react'
import zh_CN from './zh-CN.json'
import en_US from './en-US.json'

const LOCALES = [
  {
    tag: 'zh-CN',
    lng: '简体中文',
    res: zh_CN,
  },
  // {
  //   tag: 'ja-JP',
  //   lng: '日本語',
  //   res: ja_JP,
  // },
  {
    tag: 'en-US',
    lng: 'English',
    res: en_US,
  },
]

const resources = LOCALES.reduce(
  (acc, { tag, res }) => ({ ...acc, [tag]: { translation: res } }),
  {} as { [lng: string]: { translation: Record<string, string> } }
)

const standardizeLocale = (language: string) => {
  if (LOCALES.find((locale) => locale.lng === language)) return language
  switch (language.substr(0, 2).toLowerCase()) {
    case 'zh':
      return 'zh-CN'
    case 'ja':
      return 'ja-JP'
    default:
      return 'en-US'
  }
}

/**
 * ported from i18next
 * see https://github.com/i18next/react-i18next/blob/master/src/useTranslation.js
 */

type I18nInstance = {
  language: string
  t: (keys: string, options?: Record<string, any>) => string
  getFixedT: (lng?: string, ns?: string) => I18nInstance['t']
  changeLanguage: (lng: string) => Promise<I18nInstance['t']>
}

let language = standardizeLocale(navigator.language)

const getFixedT: I18nInstance['getFixedT'] = (lng = language) => {
  return (keys: string) => {
    if (!(lng in resources)) {
      console.warn(`[i18n] missed language:${lng}`)
      return keys
    }
    if (!(keys in resources[lng].translation)) {
      console.warn(`[i18n] missed key: ${lng} ${keys}`)
      return keys
    }
    return resources[lng].translation[keys]
  }
}

const i18nInstance: I18nInstance = {
  language,
  getFixedT,
  t: (...args) => getFixedT(language)(...args),
  changeLanguage(lng) {
    language = lng
    return Promise.resolve(getFixedT(lng))
  },
}

const I18nContext = createContext<{
  i18n?: I18nInstance
  defaultNS?: string
}>({ i18n: i18nInstance })

export function useTranslation(
  ns?: string,
  props: { i18n?: I18nInstance } = {}
) {
  // assert we have the needed i18nInstance
  const { i18n: i18nFromProps } = props
  const { i18n: i18nFromContext } = useContext(I18nContext) || {}
  const i18n = i18nFromProps || i18nFromContext || i18nInstance

  return {
    i18n,
    t: i18n.t,
  }
}
