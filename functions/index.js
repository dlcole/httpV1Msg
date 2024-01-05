/**
 * Send a push notification using Firebase HTTP v1 interface 
 * This node.js express app is can be used for multiple Firebase apps.  The apps' admin server account keys 
 * must be placed in the /keys/ folder, as downloaded from the Firebase console. 
 * @author David Cole
 * @see https://firebase.google.com/docs/cloud-messaging/migrate-v1
 * @see https://github.com/NativeScript/firebase/blob/main/packages/firebase-messaging/README.md
 * Input received via POST request
 * @param {string} app - appname; same short name as used for Firebase application 
 * @param {Object} msg - message object to be sent
 * @returns Promise - reject if http request itself is in error 
 * @returns HTTP response; response.status = 200 -> notification sent successfully 
 */

const admin = require("firebase-admin");
const express = require("express");
const faApp = require("firebase-admin/app");
const fs = require("fs");
const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");

const app = express();
app.use(express.json());  
app.listen(3000);

app.post("/msg", (req, res) => {
  if (req.body.hasOwnProperty("app") && req.body.hasOwnProperty("msg")) {
    if (setDefaultCredentials(req.body.app)) { // set GOOGLE_APPLICATION_CREDENTIALS environment variable

      const alreadyCreatedApps = faApp.getApps(); // prevent multiple initializeApp's  
      const adminApp = alreadyCreatedApps.length === 0 ? 
        admin.initializeApp({ credential: admin.credential.applicationDefault() }) : 
        alreadyCreatedApps[0];

      adminApp.messaging().send(req.body.msg)
        .then((msgrsp) => {  // Response is a message ID string.
          res.status(200).send(msgrsp);
        })
        .catch((error) => {
          logger.error("index.js send error: " + error.toString());
          // res.sendStatus(500);
          res.status(500).send(error.toString());
        });

    } // end default credentials set 
    else {
      // res.sendStatus(500);  // service account JSON file not found 
      res.status(500).send("service account JSON file not found");
    }

  } // end required properties exist
  else {
    // res.sendStatus(500); // app or msg properties not found  
    res.status(500).send("required properties not found");
  }

}); // end app.post/msg 

/**
   * Get Firebase service account JSON file associated with app 
   * @param {String} appName - name of app; prefix for JSON file  
   * @returns boolean - true -> GOOGLE_APPLICATION_CREDENTIALS environment variable set 
   */
function setDefaultCredentials(appName) {

  if (!appName || appName.length == 0)
    return false;

  const keyFilePath = "./keys";
  let jsonFileFound = false;

  try {
    const keyDir = fs.opendirSync(keyFilePath);
    let keyDirEnt;
    while ((keyDirEnt = keyDir.readSync()) !== null) { // iterate through dirEnt's 
      if (keyDirEnt.name.charAt(0) == ".") continue; // skip hidden files 
      if (keyDirEnt.isDirectory()) continue; // skip directories 
      if (keyDirEnt.name.startsWith(appName)) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath + "/" + keyDirEnt.name;
        jsonFileFound = true;
        break;
      }
    } // end while
    keyDir.closeSync();
  }
  catch (e) {
    logger.error("setDefaultCredentials error: " + e );
  }

  return jsonFileFound;

} // end setDefaultCredentials

exports.app = functions.https.onRequest(app);