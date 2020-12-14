import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import zh_CN from './zh-CN.json'
import ja_JP from './ja-JP.json'
import en_US from './en-US.json'

export type Languages = 'zh-CN' | 'ja-JP' | 'en-US'

const LOCALES = [
  {
    tag: 'zh-CN',
    lng: '简体中文',
    res: zh_CN,
  },
  {
    tag: 'ja-JP',
    lng: '日本語',
    res: ja_JP,
  },
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
  on: (eventName: 'languageChanged', callback: (lng: string) => void) => void
  off: (eventName: 'languageChanged', callback: (lng: string) => void) => void
}

let language = standardizeLocale(navigator.language)

const getFixedT: I18nInstance['getFixedT'] = (lng = language) => {
  if (!(lng in resources)) {
    console.warn(`[i18n] missed language:${lng}`)
    lng = language
  }
  return (keys: string) => {
    if (!(keys in resources[lng].translation)) {
      console.warn(`[i18n] missed key: ${lng} ${keys}`)
      return keys
    }
    return resources[lng].translation[keys]
  }
}
const observers = {
  languageChanged: [] as ((lng: string) => void)[],
}

export const i18nInstance: I18nInstance = {
  language,
  getFixedT,
  t: (...args) => getFixedT(language)(...args),
  changeLanguage(lng) {
    if (!(lng in resources)) {
      console.warn(`[i18n] missed language:${lng}`)
      return Promise.reject()
    }
    if (language !== lng) {
      language = lng
      observers['languageChanged'].forEach((fn) => fn(lng))
    }
    return Promise.resolve(getFixedT(lng))
  },
  on(eventName, callback) {
    observers[eventName].push(callback)
  },
  off(eventName, callback) {
    observers[eventName] = observers[eventName].filter((fn) => fn !== callback)
  },
}

const I18nContext = createContext<{
  i18n?: I18nInstance
  defaultNS?: string
}>({ i18n: i18nInstance })

export function I18nProvider({
  i18n,
  defaultNS,
  children,
}: {
  i18n?: I18nInstance
  defaultNS?: string
  children?: JSX.Element
}) {
  const value = useMemo(
    () => ({
      i18n,
      defaultNS,
    }),
    [i18n, defaultNS]
  )
  return createElement(
    I18nContext.Provider,
    {
      value,
    },
    children
  )
}

export function useTranslation(
  ns?: string,
  props: { i18n?: I18nInstance } = {}
) {
  // assert we have the needed i18nInstance
  const { i18n: i18nFromProps } = props
  const { i18n: i18nFromContext } = useContext(I18nContext) || {}
  const i18n = i18nFromProps || i18nFromContext || i18nInstance

  // binding t function to namespace (acts also as rerender trigger)
  function getT() {
    return {
      t: i18n.getFixedT(),
    }
  }
  const [t, setT] = useState(getT()) // seems we can't have functions as value -> wrap it in obj

  const isMounted = useRef(true)
  useEffect(() => {
    isMounted.current = true
    function boundReset() {
      if (isMounted.current) setT(getT())
    }

    // bind events to trigger change, like languageChanged
    i18n.on('languageChanged', boundReset)

    // unbinding on unmount
    return () => {
      isMounted.current = false
      i18n.off('languageChanged', boundReset)
    }
  })

  return {
    i18n,
    t: t.t,
  }
}
