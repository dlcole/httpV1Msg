/**
 * Drive firebase HTTP v1 node server messaging app, either local or remote. 
 * @example node client [--local]
 */

const useLocal = process.argv.includes("--local");

sendMsg(useLocal)
    .then((msgId) => {
        console.log("client: msgId: " + msgId);
    });

/**
 * Send sample message to node.js server to send Firebase push notification via HTTP v1 interface
 * See https://firebase.google.com/docs/cloud-messaging/migrate-v1 for message format. 
 * 
 * @async
 * @param Boolean useLocal - true -> use local url  
 * @returns {String} message ID (successful) | error message (error)
 */
async function sendMsg(useLocal) {

    let msgId = null;

    const localUrl = ""; //TODO: run `npm run serve` from /functions folder and get url from `http function initialized` message; append "/msg"
    const remoteUrl = ""; //TODO: get trigger URL from Firebase Console `Functions` tab; append "/msg"

    const url = useLocal ? localUrl : remoteUrl;

    let fetchOptions = {
        "method": 'POST',
        "headers": {
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify({
            "app": "festivelo",
            "msg": {
                "topic": "<topic>",  //TODO: set topic or replace with `token: <tokenvalue>`
                "notification": {
                    "title": "Sample Notification",
                    "body": "Test Notification from Client",
                },
                "data": {  //TODO: add/remove data properties to match the needs of your app 
                    "action": "notify",
                    "name": "Aaron Rider",
                    "nfytext": "Test Notification from Client",
                    "timestamp": new Date().getTime().toString(),
                    "title": "Sample Notification",
                },
                "android": {
                    "priority": 'high',
                    "notification": {
                        "notification_priority": "4",
                        "visibility": "1",
                        "sound": 'default',
                    }
                },
                "apns": {
                    "payload": {
                        "aps": {
                            "contentAvailable": "1",
                            "sound": 'default',
                        }
                    }
                }
            }

        })
    }

    try {
        let response = await fetch(url, fetchOptions);
        msgId = await response.text(); // response text is a message ID string or error message 
        if (response.ok) {
            ;
        }
        else {
            console.error("sendMsg: fetch error: " + response.status + ": " + msgId);
        }

    } catch (e) {
        console.error("sendMsg: fetch catch error: " + e);
    }

    return msgId;

} // end sendMsg