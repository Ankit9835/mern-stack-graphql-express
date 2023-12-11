let admin = require("firebase-admin");

var serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});




exports.authCheck = async (req) => {
    try {
        const authToken = req.headers.authtoken;
        
        if (!authToken) {
            throw new Error('ID token not provided in request headers.');
        }

        const currentUser = await admin.auth().verifyIdToken(authToken);
        console.log('CURRENT USER', currentUser);
        return currentUser;
    } catch (error) {
        console.log(req.headers.authtoken);
        console.log('AUTH CHECK ERROR', error);
        throw new Error('Invalid or expired toke');
    }
}

exports.authCheckMiddleware = (req, res, next) => {
    if (req.headers.authtoken) {
        admin
            .auth()
            .verifyIdToken(req.headers.authtoken)
            .then((result) => {
                next();
            })
            .catch((error) => console.log(error));
    } else {
        res.json({ error: 'Unauthorized' });
    }
};

