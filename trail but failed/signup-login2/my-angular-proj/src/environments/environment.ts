// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    firebase: {
        apiKey: "AIzaSyDrZru6I9Sq0HfLlERZcB-FefHUdXffC1U",
        authDomain: "esd-login-signup.firebaseapp.com",
        projectId: "esd-login-signup",
        storageBucket: "esd-login-signup.appspot.com",
        messagingSenderId: "245618021914",
        //appId: "1:245618021914:web:8dc1b6bd2202c47db923a3"
      },
      //userApi:  'https://us-central1-esd-login-signup.cloudfunctions.net/api/users'
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.