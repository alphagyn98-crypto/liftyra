import { createHmac, timingSafeEqual } from "crypto";

type JoinTokenPayload = {
  trainerId: string;
  gymId: string | null;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getJoinLinkSecret() {
  const secret =
    process.env.PT_JOIN_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error(
      "PT join link membutuhkan PT_JOIN_LINK_SECRET atau SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return secret;
}

function signValue(value: string) {
  return createHmac("sha256", getJoinLinkSecret()).update(value).digest();
}

export function createPtJoinToken(
  trainerId: string,
  gymId: string | null,
  expiresInSeconds = 60 * 60 * 24 * 14,
) {
  const payload: JoinTokenPayload = {
    trainerId,
    gymId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload).toString("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyPtJoinToken(token: string): JoinTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  try {
    const expectedSignature = signValue(encodedPayload);
    const providedSignature = Buffer.from(signature, "base64url");

    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload),
    ) as JoinTokenPayload;

    if (!payload.trainerId || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
