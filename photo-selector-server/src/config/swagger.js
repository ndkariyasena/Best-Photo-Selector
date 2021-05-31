const { PORT, APP_NAME, APP_URL } = process.env;

const Definition = (AppVersion, option = {}) => ({
  swagger: '2.0',
  components: {},
  info: {
    title: `${APP_NAME} API ${AppVersion}`,
    version: require(`${process.cwd()}/package.json`).version,
    description: 'Endpoints to test the routes'
  },
  host: `${APP_URL}:${PORT}`,
  basePath: `/${AppVersion.toLowerCase()}`,
  ...option,
});

const Modules = {
  'V1': ['best-photos', 'photo-gallery']
};

const Apis = (AppVersion) => ([
  ...Modules[AppVersion].map(api => `./src/${AppVersion.toLowerCase()}/api/${api}/swagger/*.yaml`),
  `./src/${AppVersion.toLowerCase()}/*.yaml`,
  `./src/${AppVersion.toLowerCase()}/swagger/*.yaml`,
]);

module.exports = {
  Definition,

  Apis
};