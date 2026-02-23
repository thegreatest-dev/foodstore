import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.trim();
  return (
    normalized.length === 0 ||
    normalized.includes("REPLACE_WITH") ||
    normalized.includes("your_client_email")
  );
}

function getServiceAccountFromEnv(): admin.ServiceAccount | null {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    isPlaceholder(projectId) ||
    isPlaceholder(clientEmail) ||
    isPlaceholder(privateKey)
  ) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getServiceAccountFromFile(): admin.ServiceAccount | null {
  const serviceAccountPath = join(process.cwd(), "serviceAccountKey.json");
  if (!existsSync(serviceAccountPath)) return null;

  const fileContent = readFileSync(serviceAccountPath, "utf8");
  const parsed = JSON.parse(fileContent) as admin.ServiceAccount;

  if (
    isPlaceholder(parsed.projectId) ||
    isPlaceholder(parsed.clientEmail) ||
    isPlaceholder(parsed.privateKey)
  ) {
    return null;
  }

  return parsed;
}

function getServiceAccount(): admin.ServiceAccount {
  const fromEnv = getServiceAccountFromEnv();
  if (fromEnv) return fromEnv;

  const fromFile = getServiceAccountFromFile();
  if (fromFile) return fromFile;

  throw new Error(
    "Firebase Admin credentials are missing or placeholders. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local or add a valid serviceAccountKey.json."
  );
}

// Prevent re-initializing on hot reload in development
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb = getFirestore();
