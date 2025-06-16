import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
  })
}

const db = getFirestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid email in request body' })
  }

  try {
    const userRef = db.collection('users').doc(email)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      // Create new user document if it doesn't exist
      await userRef.set({
        email,
        createdAt: new Date().toISOString(),
        // add any default fields you want here
        subscriptionActive: false,
        usageCount: 0,
      })
    } else {
      // Optionally, update last login or check for missing fields here
      await userRef.update({
        lastLogin: new Date().toISOString(),
      })
    }

    return res.status(200).json({ message: 'User initialized successfully' })
  } catch (error) {
    console.error('Error initializing user in Firestore:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
