import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

// Initialize Firebase Admin SDK
let adminApp;
let adminAuth = null;
let adminDb = null;

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.join(process.cwd(), "service-account-key.json");
    
    if (fs.existsSync(serviceAccountPath)) {
      console.log("📋 Loading service account from:", serviceAccountPath);
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "tech-product-eb904",
      });
      
      adminAuth = admin.auth();
      adminDb = admin.firestore();
      console.log("✅ Firebase Admin SDK initialized successfully");
    } else {
      throw new Error(`service-account-key.json not found at ${serviceAccountPath}`);
    }
  } else {
    adminApp = admin.app();
    adminAuth = admin.auth();
    adminDb = admin.firestore();
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  console.log("\n📝 To fix this, follow these steps:");
  console.log("   1. Go to: https://console.firebase.google.com/project/tech-product-eb904/settings/serviceaccounts/adminsdk");
  console.log("   2. Click 'Generate new private key'");
  console.log("   3. Save the JSON file as 'service-account-key.json' in your project root");
  console.log("   4. Restart the dev server");
}

export { adminAuth, adminDb };
