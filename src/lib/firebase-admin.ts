
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// This is a global cache for the admin app instance
const globalForFirebase = globalThis as unknown as {
  adminApp: admin.app.App | undefined;
  };

  function initializeAdminApp() {
    if (globalForFirebase.adminApp) {
        return globalForFirebase.adminApp;
          }

            // Vercel and other platforms handle multiline environment variables.
              // We need to ensure the private key is correctly formatted.
                const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

                  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
                      throw new Error('Missing Firebase Admin SDK environment variables.');
                        }

                          const serviceAccount: ServiceAccount = {
                              projectId: process.env.FIREBASE_PROJECT_ID,
                                  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                                      privateKey: privateKey,
                                        };

                                          try {
                                              // Check if the app is already initialized to avoid errors
                                                  if (admin.apps.length === 0) {
                                                          globalForFirebase.adminApp = admin.initializeApp({
                                                                      credential: admin.credential.cert(serviceAccount),
                                                                                  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
                                                                                          });
                                                                                              } else {
                                                                                                      globalForFirebase.adminApp = admin.app();
                                                                                                          }
                                                                                                              
                                                                                                                  return globalForFirebase.adminApp;

                                                                                                                    } catch (error: any) {
                                                                                                                        console.error('Firebase admin initialization error:', error);
                                                                                                                            throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
                                                                                                                              }
                                                                                                                              }

                                                                                                                              export function getAdminServices() {
                                                                                                                                  const app = initializeAdminApp();
                                                                                                                                      return {
                                                                                                                                              auth: app.auth(),
                                                                                                                                                      db: app.database(),
                                                                                                                                                          };
                                                                                                                                                          }
                                                                                                                                                          
