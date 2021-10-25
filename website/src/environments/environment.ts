// This file can be replaced during build by using the fileReplacements array.
// ng build ---prod replaces environment.ts with environment.prod.ts.
// The list of file replacements can be found in angular.json.

export const environment = {
  production: false,

  ONBOARDING_BASE_API_URL: 'https://api.taiaar.com/v1/common', // 'https://codebrew.royoapps.com/v1/common',

  BASE_API_URL: 'https://api.taiaar.com', // 'https://api.royoapps.com',

  AGENT_BASE_API_URL: 'https://agent.taiaar.com', // 'https://onboarding-agent.royoapps.com',

  ONBOARDING_TRACK_BASE_URL: 'https://api.taiaar.com', // 'https://codebrew.royoapps.com',

  DIALOGFLOW_API_URL_V2: 'https://dialogflow.googleapis.com/v2',

  INSTANCE_SELECTION: true,

  CYBERSOURCE_API_URL: 'https://apitest.cybersource.com/flex/v1/tokens',

  CONVERGEPAY_API_URL: 'https://api.demo.convergepay.com/hosted-payments',

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * zone.run, zoneDelegate.invokeTask for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.