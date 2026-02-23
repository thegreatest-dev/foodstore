import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../serviceAccountKey.json.json" assert { type: "json" };

// Prevent re-initializing on hot reload in development
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminDb = getFirestore();
