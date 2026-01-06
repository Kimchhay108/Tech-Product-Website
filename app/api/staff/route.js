import { db, auth } from "@/lib/firebaseConfig";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { 
  collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc 
} from "firebase/firestore";

// GET all staff
export async function GET(req) {
  try {
    const staffQuery = query(
      collection(db, "users"),
      where("role", "==", "staff")
    );
    const staffSnapshot = await getDocs(staffQuery);

    const staffList = staffSnapshot.docs.map((docSnap) => ({
      uid: docSnap.id,
      ...docSnap.data(),
    }));

    return Response.json({ success: true, data: staffList });
  } catch (error) {
    console.error("❌ Error fetching staff:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create staff (admin only)
export async function POST(req) {
  try {
    const {
      adminUid,
      adminRole,
      firstName,
      lastName,
      email,
      password,
      position,
      dateOfBirth,
    } = await req.json();

    console.log("📝 Create staff request:", { adminUid, adminRole, roleType: typeof adminRole, roleValue: JSON.stringify(adminRole) });

    // Verify admin authorization from Firestore (always use Firestore as source of truth)
    let isAdmin = false;
    
    try {
      const adminDocRef = doc(db, "users", adminUid);
      const adminDocSnap = await getDoc(adminDocRef);
      
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        isAdmin = adminData.role === "admin";
        console.log("🔍 Admin verification from Firestore:", {
          uid: adminUid,
          firestoreRole: adminData.role,
          isAdmin: isAdmin
        });
      } else {
        console.log("❌ Admin document not found in Firestore for uid:", adminUid);
      }
    } catch (err) {
      console.error("❌ Error verifying admin from Firestore:", err.message);
    }

    if (!isAdmin) {
      console.log("❌ Authorization failed - not an admin:", { adminUid, adminRole });
      return Response.json(
        { success: false, error: "Only admin can create staff accounts. Please ensure you are logged in as an admin." },
        { status: 403 }
      );
    }
    
    console.log("✅ Admin verified, proceeding with staff creation");

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !position) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: firstName, lastName, email, password, position",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create Firebase Auth user using Admin SDK
    if (!adminAuth) {
      console.error("❌ Firebase Admin SDK not initialized");
      return Response.json(
        { 
          success: false, 
          error: "Firebase Admin SDK not configured. Please set up service account credentials.",
          instructions: "1. Go to Firebase Console settings/serviceaccounts/adminsdk 2. Generate new private key 3. Save as service-account-key.json 4. Add GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json to .env.local 5. Restart dev server"
        },
        { status: 500 }
      );
    }

    let userId; // Declare outside try block so it's accessible in response

    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      userId = userRecord.uid;

      console.log("✅ Firebase user created:", userId);

      // Save staff profile to Firestore using Admin SDK
      const userRef = adminDb.collection("users").doc(userId);
      await userRef.set({
        uid: userId,
        firstName,
        lastName,
        email,
        dateOfBirth: dateOfBirth || null,
        position,
        role: "staff",
        createdAt: new Date(),
        createdBy: adminUid,
        active: true,
      });

      // Generate email verification link using Admin SDK
      try {
        const verificationLink = await adminAuth.generateEmailVerificationLink(email);
        console.log("✅ Verification link generated for staff:", email);
        console.log("📧 Share this link with the staff member to verify their email:");
        console.log(verificationLink);
      } catch (verifyError) {
        console.warn("⚠️ Could not generate verification link:", verifyError.message);
        // Continue even if verification link generation fails
      }
    } catch (firebaseError) {
      console.error("❌ Firebase error:", firebaseError.message);
      throw firebaseError;
    }

    return Response.json(
      {
        success: true,
        message: "Staff account created successfully. Staff member needs to verify their email to log in.",
        data: {
          uid: userId,
          email,
          firstName,
          lastName,
          position,
          role: "staff",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating staff:", error);

    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format";
    }

    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update staff
export async function PUT(req) {
  try {
    const { staffUid, adminUid, adminRole, firstName, lastName, position, active } =
      await req.json();

    // Verify admin authorization from Firestore
    let isAdmin = false;
    
    try {
      const adminDocRef = doc(db, "users", adminUid);
      const adminDocSnap = await getDoc(adminDocRef);
      
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        isAdmin = adminData.role === "admin";
        console.log("🔍 Admin verification for UPDATE:", {
          uid: adminUid,
          firestoreRole: adminData.role,
          isAdmin: isAdmin
        });
      } else {
        console.log("❌ Admin document not found in Firestore for uid:", adminUid);
      }
    } catch (err) {
      console.error("❌ Error verifying admin from Firestore:", err.message);
    }

    if (!isAdmin) {
      console.log("❌ Authorization failed for UPDATE - not an admin:", { adminUid, adminRole });
      return Response.json(
        { success: false, error: "Only admin can update staff" },
        { status: 403 }
      );
    }
    
    console.log("✅ Admin verified for UPDATE");

    // Update staff
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (position) updateData.position = position;
    if (typeof active === "boolean") updateData.active = active;
    updateData.updatedAt = new Date();

    await updateDoc(doc(db, "users", staffUid), updateData);

    return Response.json({ success: true, message: "Staff updated successfully" });
  } catch (error) {
    console.error("❌ Error updating staff:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE staff
export async function DELETE(req) {
  try {
    const { staffUid, adminUid, adminRole } = await req.json();

    // Verify admin authorization from Firestore
    let isAdmin = false;
    
    try {
      const adminDocRef = doc(db, "users", adminUid);
      const adminDocSnap = await getDoc(adminDocRef);
      
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        isAdmin = adminData.role === "admin";
        console.log("🔍 Admin verification for DELETE:", {
          uid: adminUid,
          firestoreRole: adminData.role,
          isAdmin: isAdmin
        });
      } else {
        console.log("❌ Admin document not found in Firestore for uid:", adminUid);
      }
    } catch (err) {
      console.error("❌ Error verifying admin from Firestore:", err.message);
    }

    if (!isAdmin) {
      console.log("❌ Authorization failed for DELETE - not an admin:", { adminUid, adminRole });
      return Response.json(
        { success: false, error: "Only admin can delete staff" },
        { status: 403 }
      );
    }
    
    console.log("✅ Admin verified for DELETE");

    // Validate Firebase Admin SDK
    if (!adminAuth) {
      console.error("❌ Firebase Admin SDK not initialized");
      return Response.json(
        { 
          success: false, 
          error: "Firebase Admin SDK not configured. Cannot delete staff from authentication system."
        },
        { status: 500 }
      );
    }

    // First, delete from Firebase Authentication using Admin SDK
    try {
      await adminAuth.deleteUser(staffUid);
      console.log("✅ Deleted user from Firebase Auth:", staffUid);
    } catch (authError) {
      console.error("❌ Error deleting from Firebase Auth:", authError.message);
      // Continue with Firestore deletion even if auth deletion fails
      // (user might not exist in auth but exists in Firestore)
    }

    // Then delete from Firestore
    try {
      await deleteDoc(doc(db, "users", staffUid));
      console.log("✅ Deleted user from Firestore:", staffUid);
    } catch (firestoreError) {
      console.error("❌ Error deleting from Firestore:", firestoreError.message);
      throw firestoreError;
    }

    return Response.json({ 
      success: true, 
      message: "Staff account deleted successfully from both authentication and database" 
    });
  } catch (error) {
    console.error("❌ Error deleting staff:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
