// pages/api/check-access.ts
import { getToken } from "next-auth/jwt";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseAdminApp } from "../../lib/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

const firestore = getFirestore(firebaseAdminApp);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.sub) {
    return res.status(401).json({ unlocked: false, reason: "unauthorized" });
  }

  const userRef = firestore.collection("users").doc(token.sub);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return res.status(404).json({ unlocked: false, reason: "not_found" });
  }

  const user = userSnap.data();

  const hasFreeUse = user?.usage?.freeUsed === false;
  const hasSubscription = user?.subscription?.hasMonthlyAccess === true &&
    (!user?.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());

  return res.status(200).json({ unlocked: hasFreeUse || hasSubscription });
}
