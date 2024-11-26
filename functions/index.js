const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

exports.addRoleToUsers = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    let updatedUsers = 0;

    usersSnapshot.forEach(async (doc) => {
      const userData = doc.data();

      // Check if 'role' already exists to avoid overwriting
      if (!userData.role) {
        await db.collection("users").doc(doc.id).update({
          role: "user", // Default role
        });
        updatedUsers++;
      }
    });

    res.status(200).send(`Successfully added 'role' to ${updatedUsers} users.`);
  } catch (error) {
    console.error("Error updating users:", error);
    res.status(500).send("Error updating users");
  }
});