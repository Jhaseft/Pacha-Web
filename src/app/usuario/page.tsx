import { ChatAsistente } from "@/components/ChatAsistente";

export const metadata = {
  title: "Soy nuevo · Pachamama",
  description: "Nuestro asistente te guía paso a paso para empezar en Pachamama.",
};

export default function UsuarioPage() {
  return (
    <ChatAsistente
      role="usuario"
      titulo="Asistente Pachamama"
      subtitulo="Soy nuevo · Te ayudo a empezar"
      welcomeMessage="¡Hola! 👋 Soy el asistente de Pachamama. Estoy aquí para ayudarte a entender cómo funciona la plataforma y cómo puedes empezar. ¿Qué quieres saber?"
      sugerencias={[
        "¿Qué es Pachamama?",
        "¿Cómo me registro?",
        "¿Cómo compro créditos?",
        "¿Cómo contacto a una anfitriona?",
      ]}
    />
  );
}
