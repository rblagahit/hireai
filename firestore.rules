const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();
const db = admin.firestore();

exports.processResumeBatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');

  const { appId, jd, resumes } = data;
  const userId = context.auth.uid;

  try {
    const configPath = `artifacts/${appId}/public/data/settings/config`;
    const configSnap = await db.doc(configPath).get();
    const pricing = configSnap.exists ? configSnap.data().pricing : { perTransaction: 5.0 };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const systemPrompt = `Analyze resumes against: "${jd}". Score 0-100. Provide 1 sentence reasoning. Return JSON: { "score": number, "reasoning": "string" }`;
    const result = await model.generateContent([systemPrompt, JSON.stringify(resumes)]);
    const analysis = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    const docRef = await db.collection(`artifacts/${appId}/users/${userId}/rankings`).add({
      ...analysis,
      batchSize: resumes.length,
      cost: pricing.perTransaction,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    });

    return { success: true, rankingId: docRef.id, analysis };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});