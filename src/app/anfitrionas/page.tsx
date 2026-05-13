import { ChatAsistente } from "@/components/ChatAsistente";

export const metadata = {
  title: "Trabaja con nosotros · Pachamama",
  description: "Conviértete en anfitriona de Pachamama y genera ingresos desde casa.",
};

export default function AnfitrionasPage() {
  return (
    <ChatAsistente
      role="anfitriona"
      titulo="Asistente Pachamama"
      subtitulo="Trabaja con nosotros · Anfitrionas"
      welcomeMessage="¡Hola! 💫 Soy el asistente de Pachamama para anfitrionas. Te puedo explicar cómo funciona la plataforma, cómo crear tu perfil y cómo empezar a generar ingresos. ¿Qué quieres saber?"
      sugerencias={[
        "¿Cómo me registro como anfitriona?",
        "¿Cómo gano dinero?",
        "¿Cómo retiro mis ganancias?",
        "¿Qué servicios puedo ofrecer?",
      ]}
    />
  );
}
