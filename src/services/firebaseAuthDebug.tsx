import { auth } from './connectionFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const testAuthOnly = async () => {
  console.log('🔥 Testing Firebase Authentication Only...');
  
  try {
    console.log('📱 Firebase app initialized:', auth.app.name);
    console.log('🔑 Project ID:', auth.app.options.projectId);
    console.log('🌐 Auth Domain:', auth.app.options.authDomain);
    
    console.log('🔐 Testing Authentication...');
    const testEmail = `test.${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';
    
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Authentication test successful! User ID:', userCredential.user.uid);
    
    return { success: true, userId: userCredential.user.uid };
    
  } catch (error: any) {
    console.error('❌ Firebase Authentication test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return { success: false, error };
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
