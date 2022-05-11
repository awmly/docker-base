// import regeneratorRuntime from "/build/node_modules/regenerator-runtime";
import { initializeApp } from "/build/node_modules/firebase/app"
// import "/build/node_modules/firebase/storage";

import {auth, download, authDownload, verifyDownload, setUser, getUser, getStorageUrl, getStorageFunctions} from './basefire.js'

const firebaseApp = initializeApp(firebaseConfig);

let firebasePerformance = async () => {

  const { getPerformance  } = await import('/build/node_modules/firebase/performance');
  if (!base.feature('ie')) {
    return getPerformance(firebaseApp);
  }

}

let firebaseAnalytics = async () => {

  const { getAnalytics  } = await import('/build/node_modules/firebase/analytics');
  if (!base.feature('ie')) {
    return getAnalytics(firebaseApp);
  }

}

firebasePerformance();

// base.on('window.interact', () => {
//   //firebaseAnalytics();
// });

export { firebaseApp, auth, download, verifyDownload, authDownload, setUser, getUser, getStorageUrl, getStorageFunctions };
