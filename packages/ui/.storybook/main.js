module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: (/** @type {import('webpack').Configuration} */ config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        // {
        //   loader: require.resolve('react-docgen-typescript-loader'),
        // },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
