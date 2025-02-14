const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            'primary-color': '#1677ff',
            'link-color': '#1677ff',
            'border-radius-base': '2px',
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
