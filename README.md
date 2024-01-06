# Sample Node.js app for sending push notifications via Firebase HTTP V1 interface

This respository serves as a sample implementation for sending push notifications via the Firebase Messaging HTTP v1 interface.  
Firebase is dropping support for their legacy interface effective Jul 20, 2024, so any application using that older interface will be forced to migrate. 
Firebase has the document, [Migrate from legacy FCM APIs to HTTP v1](https://firebase.google.com/docs/cloud-messaging/migrate-v1), 
and while useful, it only contains code snippets and not full working examples. 

I had initially intended to use the V1 interface directly from within my NativeScript app, but I simply encountered too many obstacles.
(This [issue](https://github.com/NativeScript/firebase/issues/238) documents my ordeals.) 
I pivoted to instead use a Node.js server via my ISP, which required becoming more familiar with both Node.js and cpanel.
This approach, too, encountered many obstacles.  (See this [SO post](https://stackoverflow.com/questions/77704455/error-secretorprivatekey-must-be-an-asymmetric-key-when-using-rs256-from-within).) 

I finally tried using Firebase Hosting, and this works quite well.  There's some setup involved, and I'll describe that below. 
I offer this repository for those who will be following in my footsteps to save them some of the considerable time and effort this took. 

## Setting up Firebase Hosting 

There are good resources that document how to set up a Node.js app hosted on Firebase. I recommend these to get started: 

1. [Host a NodeJS app with Firebase Functions](https://dev.to/lachouri/host-a-nodejs-app-with-firebase-functions-lgg)
2. [Node.js apps on Firebase Hosting Crash Course](https://youtu.be/LOeioOKUKI8)

## Install the sample app

If you followed the steps from the above tutorial you should already have the folder structure set up on your local machine.  Copy `index.js` and `package.json` from the `/features` folder of this respository into your own `/features` folder.  CD into the `/features` folder and run `npm install` to install the necessary dependencies.  

Inspect the source files `index.js` and `client.js` and edit both files accordingly. 
`client.js` is independent and does not need to be located in the `/features` folder, but it will work from there. 

This sample implementation is designed to work for multiple Firebase apps, with each having its service account JSON file downloaded into the `/keys` folder. 
Adjust the design to suit your needs. 

## Testing the sample app 

The sample app will **not** run as-is. 
You will need to edit `client.js` appropriately for your needs, as indicated by the `//TODO:` comments therein. 
You'll also need to have `.firebase.rc` and `firebase.json` files in place. 
These get created automatically in the setup process described in the tutorial (resource #1, above). 

With all that ready, first test the app locally: 

1. `CD` into the `/features` folder
2. Run `npm run serve`
3. When the local server is active, run `node client --local`

To run the app from Firebase: 

1. Run `npm run deploy`
2. When the deployment completes, run `node client` 

## Conclusions 

In the end, the code needed to migrate to the HTTP v1 interface is fairly simple, but it took me some 80 hours to get from start to finish. 
If you're confronted with this same migration effort, I wish you Godspeed and hope this sample implementation will help. 

David Cole
Jan 5, 2025
