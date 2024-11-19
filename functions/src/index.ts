const logger = require('firebase-functions/logger');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdmin = functions.https.onCall(() => {
  return admin.auth().setCustomUserClaims('YZk2pNBey7bRY4J02rwT1ndc75I2', {
    admin: true
  }).then(() => {
    return {
      message: 'Admin criado com sucesso'
    }
  }).catch((err: Error) => {
    return err;
  });
});