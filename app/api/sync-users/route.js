import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { userStore } from "@/lib/memoryStore";

// This endpoint syncs users from memoryStore to Firestore
// Run this once to migrate existing in-memory users to Firestore
export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // Simple password protection for this migration endpoint
    if (password !== "migrate123") {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 403 }
      );
    }

    const results = [];
    
    for (const [phone, userData] of Object.entries(userStore)) {
      try {
        // Use phone as the document ID for consistency
        const userRef = doc(db, "users", phone);
        
        // Check if user already exists
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          results.push({
            phone,
            status: "already_exists",
            message: `User ${userData.firstName} ${userData.lastName} already exists in Firestore`
          });
          continue;
        }
        
        // Create user document in Firestore
        await setDoc(userRef, {
          uid: phone,
          phone,
          password: userData.password, // In production, this should be hashed
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          role: userData.role,
          active: true,
          createdAt: new Date(),
          migratedFromMemory: true,
        });
        
        results.push({
          phone,
          status: "success",
          message: `User ${userData.firstName} ${userData.lastName} (${userData.role}) synced to Firestore`
        });
        
        console.log(`Synced user ${phone} to Firestore`);
      } catch (error) {
        results.push({
          phone,
          status: "error",
          message: error.message
        });
        console.error(`Error syncing user ${phone}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "User sync completed",
      results
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
