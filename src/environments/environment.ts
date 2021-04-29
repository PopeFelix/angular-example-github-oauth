// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { NgxLoggerLevel } from 'ngx-logger'
const clientId = '7bc5d253583f4a7c408b'
export const environment = {
  production: false,
  // authCodeFlowConfig: {
  //   issuer: '',
  //   redirectUri: window.location.origin + '/index.html',
  //   clientId: '7bc5d253583f4a7c408b',
  //   responseType: 'code',
  //   scope: 'openid',
  //   showDebugInformation: true
  // } as AuthConfig
  authentication: {
    redirectUri: window.location.origin + '/index.html',
    serviceUri: 'http://localhost:9999/authenticate',
    authUri: `https://github.com/login/oauth/authorize?client_id=${clientId}`,
    scope: 'repo'
  },
  logConfig: {
    level: NgxLoggerLevel.DEBUG, // Level of messages that will be logged locally (i.e. console.log)
    serverLogLevel: NgxLoggerLevel.INFO, // Level of messages that will be sent to the external logging service (if enabled)
    serverLoggingUrl: undefined, // URL to POST logs to (not implemented yet)
  },

}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
