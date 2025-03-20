/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Mustafa Escemo Custom View',
  cloudIdentifier: 'gcp-eu',
  mcApiUrl: 'https://mc-api.europe-west1.gcp.escemo.com',
  env: {
    development: {
      initialProjectKey: 'test-project-12121',
    },
    production: {
      customViewId: 'cm8h8om3p0074010160abzm3p',
      url: 'https://test-custom-view-escemo.netlify.app',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'SMALL',
  },
  locators: ['products.product_details.general'],
};

export default config;
