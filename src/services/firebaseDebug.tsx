import { auth, db } from './connectionFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase Configuration...');
  
  // Test 1: Check if Firebase is initialized
  try {
    console.log('📱 Firebase app initialized:', auth.app.name);
    console.log('🔑 Project ID:', auth.app.options.projectId);
    console.log('🌐 Auth Domain:', auth.app.options.authDomain);
    console.log('💾 Database URL:', auth.app.options.databaseURL);
  } catch (error) {
    console.error('❌ Firebase app not properly initialized:', error);
    return;
  }

  // Test 2: Test Authentication
  try {
    console.log('🔐 Testing Authentication...');
    const testEmail = `test.${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';
    
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Authentication test successful! User ID:', userCredential.user.uid);
    
    // Test 3: Test Firestore with the authenticated user
    console.log('💾 Testing Firestore...');
    
    const testData = {
      nome: 'Test User',
      email: testEmail,
      criadoEm: new Date(),
      tipo: 'teste',
      uid: userCredential.user.uid
    };
    
    console.log('📤 Attempting to save to Firestore with data:', testData);
    
    const docRef = await addDoc(collection(db, 'usuarios'), testData);
    console.log('✅ Firestore test successful! Document ID:', docRef.id);
    
    return { success: true, userId: userCredential.user.uid, docId: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          console.error('🚫 Firestore security rules are denying access');
          break;
        case 'unavailable':
          console.error('🔌 Firestore service is temporarily unavailable');
          break;
        case 'failed-precondition':
          console.error('⚠️ Firestore operation failed precondition check');
          break;
        default:
          console.error('🔍 Unknown Firebase error:', error.code);
      }
    }
    
    return { success: false, error };
  }
};

export const checkFirestoreRules = async () => {
  console.log('🔒 Checking Firestore Rules...');
  
  try {
    // Try to read from Firestore without authentication
    console.log('📖 Testing read access to usuarios collection...');
    
    // This will fail if rules require authentication
    const testCollection = collection(db, 'usuarios');
    console.log('Collection reference created:', testCollection.id);
    
    return true;
  } catch (error) {
    console.error('❌ Firestore rules check failed:', error);
    return false;
  }
};

export const debugCurrentUser = () => {
  console.log('👤 Current Firebase Auth User:');
  const user = auth.currentUser;
  
  if (user) {
    console.log('✅ User is authenticated:');
    console.log('  - UID:', user.uid);
    console.log('  - Email:', user.email);
    console.log('  - Email verified:', user.emailVerified);
    console.log('  - Creation time:', user.metadata.creationTime);
  } else {
    console.log('❌ No user is currently authenticated');
  }
  
  return user;
};
