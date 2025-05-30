import { OAuth2Client } from 'google-auth-library';

// Define allowed admin emails
const allowedAdmins = [
  'al.damacus@gmail.com',
  'second.admin@example.com', // Replace with the second admin's email
];

// Helper to verify Google ID token
export async function verifyGoogleToken(idToken: string) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}