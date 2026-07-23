import { ChatAsistente } from "@/components/ChatAsistente";

export const metadata = {
  title: "Trabaja con nosotros · MonetizaLab",
  description: "Conviértete en creador de contenido de MonetizaLab y genera ingresos desde casa.",
};

export default function AnfitrionasPage() {
  return (
    <ChatAsistente
      role="anfitriona"
      titulo="Asistente MonetizaLab"
      subtitulo="Trabaja con nosotros · Creadores de contenido"
      welcomeMessage="¡Hola! 💫 Soy el asistente de MonetizaLab para creadores de contenido. Te puedo explicar cómo funciona la plataforma, cómo crear tu perfil y cómo empezar a generar ingresos. ¿Qué quieres saber?"
      sugerencias={[
        "¿Cómo me registro como creador de contenido?",
        "¿Cómo gano dinero?",
        "¿Cómo retiro mis ganancias?",
        "¿Qué servicios puedo ofrecer?",
      ]}
    />
  );
}
