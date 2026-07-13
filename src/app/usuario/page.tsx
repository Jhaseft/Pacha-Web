import { ChatAsistente } from "@/components/ChatAsistente";

export const metadata = {
  title: "Soy nuevo · Pachamama",
  description: "Nuestro asistente te guía paso a paso para empezar en Pachamama.",
};

export default function UsuarioPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-md sm:border-x sm:border-white/10">
        <ChatAsistente
          role="usuario"
          titulo="Asistente Pachamama"
          subtitulo="Soy nuevo · Te ayudo a empezar"
          welcomeMessage="¡Hola! 👋 Soy el asistente de Pachamama. Estoy aquí para ayudarte a entender cómo funciona la plataforma y cómo puedes empezar. ¿Qué quieres saber?"
          sugerencias={[]}
        />
      </div>
    </div>
  );
}
