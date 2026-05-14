import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  try {
    const res = await fetch(`${apiUrl}/chat-ia/anfitriona`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Error del asistente" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      reply: data.mensaje ?? '',
      imagenes: data.imagenes ?? [],
      videos: data.videos ?? [],
    });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el asistente" }, { status: 502 });
  }
}
