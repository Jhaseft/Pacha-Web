import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  try {
    const res = await fetch(`${apiUrl}/chat-ia/usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Error del asistente" }, { status: 502 });
    }

    const data = await res.json();
    const reply = typeof data.reply === 'object' ? data.reply?.mensaje ?? JSON.stringify(data.reply) : data.reply;
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el asistente" }, { status: 502 });
  }
}
