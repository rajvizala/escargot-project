import { VertexAI } from '@google-cloud/vertexai';
import { ExternalAccountClient } from 'google-auth-library';
import type { RemixResult } from '@/types/card';

async function getVertexAIClient(): Promise<VertexAI> {
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;
  if (!oidcToken) {
    throw new Error('VERCEL_OIDC_TOKEN not available — run via: vercel dev');
  }

  const audience = process.env.GCP_AUDIENCE;
  const saImpersonationUrl = process.env.GCP_SA_IMPERSONATION_URL;
  const projectId = process.env.GCP_PROJECT_ID;

  if (!audience || !saImpersonationUrl || !projectId) {
    throw new Error('Missing GCP env vars: GCP_AUDIENCE, GCP_SA_IMPERSONATION_URL, GCP_PROJECT_ID');
  }

  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: saImpersonationUrl,
    subject_token_supplier: {
      getSubjectToken: () => Promise.resolve(oidcToken)
    }
  } as any);

  if (!authClient) {
    throw new Error('Failed to create auth client');
  }

  return new VertexAI({
    project: projectId,
    location: 'us-central1',
    googleAuthOptions: { authClient } as any
  });
}

export async function remixCardImage(
  cardImageBase64: string,
  prompt: string,
): Promise<RemixResult> {
  const startMs = Date.now();
  const vertex  = await getVertexAIClient();
  const model   = vertex.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
  });

  const engineeredPrompt = [
    `You are an expert card illustrator. You will be given a greeting card image and a user request to modify it.`,
    `IMPORTANT RULES:`,
    `- Preserve the original art style exactly — do not change the illustration technique, color palette, or artistic voice.`,
    `- Make ONLY the specific change requested by the user. Do not "improve" or alter anything else.`,
    `- Maintain print quality — clean lines, high contrast, no artifacts.`,
    `- The output must look like it could be commercially printed on a greeting card.`,
    ``,
    `User's requested change: "${prompt}"`,
    ``,
    `Apply this change to the provided card image and return the modified image.`,
  ].join('\n');

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: cardImageBase64,
          },
        },
        { text: engineeredPrompt },
      ],
    }],
    // ← This was missing in your version — required for image output
    generationConfig: {
      responseModalities: ['IMAGE'],
    } as any,
  });

  const parts = result.response.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('No response from Gemini');
  }

  const imagePart = parts.find((p: any) => p.inlineData);
  if (!imagePart?.inlineData?.data) {
    throw new Error('No image returned from Gemini — check responseModalities');
  }

  return {
    remixedImage: imagePart.inlineData.data,
    remixId:      `remix-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    processingMs: Date.now() - startMs,
  };
}
