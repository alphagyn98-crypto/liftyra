import { NextRequest, NextResponse } from "next/server";

import { sendWABlastMessage } from "@/lib/wa-blast";

type SupabaseSendSmsPayload = {
  user?: {
    id?: string;
    phone?: string;
    user_metadata?: Record<string, unknown>;
  };
  sms?: {
    otp?: string;
  };
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        http_code: 401,
        message: "Unauthorized hook request.",
      },
    },
    { status: 401 },
  );
}

function buildOtpMessage(phone: string, otp: string) {
  const appName = process.env.WA_OTP_APP_NAME || "Liftyra";
  const customTemplate = process.env.WA_OTP_MESSAGE_TEMPLATE;

  if (customTemplate) {
    return customTemplate
      .replaceAll("{{otp}}", otp)
      .replaceAll("{{phone}}", phone)
      .replaceAll("{{app}}", appName);
  }

  return `Kode OTP ${appName}: ${otp}\nJangan berikan kode ini ke siapa pun.`;
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.SUPABASE_SMS_HOOK_SECRET;

  if (expectedSecret) {
    const authHeader = request.headers.get("authorization");
    const xHookSecret = request.headers.get("x-hook-secret");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (bearerToken !== expectedSecret && xHookSecret !== expectedSecret) {
      return unauthorizedResponse();
    }
  }

  let payload: SupabaseSendSmsPayload;

  try {
    payload = (await request.json()) as SupabaseSendSmsPayload;
  } catch {
    return NextResponse.json(
      {
        error: {
          http_code: 400,
          message: "Payload hook tidak valid.",
        },
      },
      { status: 400 },
    );
  }

  const phone = payload.user?.phone?.trim();
  const otp = payload.sms?.otp?.trim();

  if (!phone || !otp) {
    return NextResponse.json(
      {
        error: {
          http_code: 400,
          message: "Payload hook harus mengandung phone dan otp.",
        },
      },
      { status: 400 },
    );
  }

  const result = await sendWABlastMessage(phone, buildOtpMessage(phone, otp));

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          http_code: 500,
          message: result.error || "Gagal mengirim OTP ke WhatsApp.",
        },
      },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 200 });
}
