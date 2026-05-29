const WA_BLAST_API_URL = process.env.WA_BLAST_API_URL || "";
const WA_BLAST_SESSION_ID = process.env.WA_BLAST_SESSION_ID || "";
const WA_BLAST_TOKEN = process.env.WA_BLAST_TOKEN || "";

export type SendMessageResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

function formatPhoneNumber(phone: string) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = `62${cleaned.slice(1)}`;
  }

  if (!cleaned.startsWith("62")) {
    cleaned = `62${cleaned}`;
  }

  return cleaned;
}

export function isWABlastConfigured() {
  return Boolean(WA_BLAST_API_URL && WA_BLAST_SESSION_ID && WA_BLAST_TOKEN);
}

export async function sendWABlastMessage(
  to: string,
  body: string,
): Promise<SendMessageResult> {
  if (!isWABlastConfigured()) {
    return {
      success: false,
      error:
        "WA Blast belum dikonfigurasi. Isi WA_BLAST_API_URL, WA_BLAST_SESSION_ID, dan WA_BLAST_TOKEN.",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WA_BLAST_TOKEN}`,
        },
        body: JSON.stringify({
          to: formatPhoneNumber(to),
          type: "text",
          text: { body },
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    const result = (await response.json()) as
      | { status?: string; messageId?: string; message?: string }
      | Array<{ status?: string; messageId?: string; message?: string }>;
    const data = Array.isArray(result) ? result[0] : result;

    if (response.ok && data?.status === "success") {
      return {
        success: true,
        messageId: data.messageId,
      };
    }

    return {
      success: false,
      error: data?.message || "WA Blast mengembalikan respons gagal.",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, error: "Request WA Blast timeout." };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim pesan WhatsApp.",
    };
  }
}
