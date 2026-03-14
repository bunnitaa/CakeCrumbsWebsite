const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.addRoleToUsers = functions.https.onRequest(async (req, res) => {
    try {
        const usersSnapshot = await db.collection("users").get();
        const promises = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (!userData.role) {
                const updatePromise = db.collection("users").doc(doc.id).update({
                    role: "user"
                });
                promises.push(updatePromise);
            }
        });

        await Promise.all(promises);

        res.status(200).send(`Successfully added 'role' to ${promises.length} users.`);
    } catch (error) {
        console.error("Error updating users:", error);
        res.status(500).send("Error updating users: " + error.message);
    }
});