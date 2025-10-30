import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendContact } from "../api/contactApi";
import StatsPanel from "../components/StatsPanel";
import PaymentsLogPanel from "../components/PaymentsLogPanel";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo inválido"),
  subject: z.string().min(3, "Mínimo 3 caracteres"),
  message: z.string().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  budget: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const savedLogs = localStorage.getItem("contactLogs");
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem("contactLogs", JSON.stringify(logs));
  }, [logs]);

  const onSubmit = async (data: FormData) => {
    const now = new Date();
    const logEntry = {
      ...data,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      status: "✅ Enviado correctamente",
    };

    try {
      const idempotencyKey = crypto.randomUUID();
      await sendContact(data, idempotencyKey);
      setLogs((prev) => [logEntry, ...prev]);
      setToast({ type: "success", text: "✅ Mensaje enviado correctamente" });
      window.dispatchEvent(new CustomEvent("messageSent", { detail: { success: true } }));
      reset();
    } catch (error) {
      logEntry.status = "❌ Error al enviar mensaje";
      setLogs((prev) => [logEntry, ...prev]);
      setToast({ type: "error", text: "❌ Error al enviar mensaje. Intenta nuevamente." });
      window.dispatchEvent(new CustomEvent("messageSent", { detail: { success: false } }));
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://64.media.tumblr.com/2032c86dc2ccfdfca586a13931a9df69/14c75a25ba5b48cd-e2/s540x810/e0768e7a4f543decd8e14b7bd8e536b34fdb109a.gif"
          alt="Fondo lunar brillante"
          className="w-full h-full object-cover brightness-[0.9] saturate-[1.4]"
        />
        <div className="absolute inset-0 bg-[#0a0a1a]/40 backdrop-blur-[1px]" />
      </div>

      <div className="flex flex-col gap-5">
        <StatsPanel />
        <PaymentsLogPanel logs={logs} />
      </div>

      <div className="relative z-10 bg-gradient-to-b from-[#2e2e4f]/80 to-[#1e1e35]/80 backdrop-blur-lg border border-white/20 shadow-[0_0_25px_5px_rgba(255,255,255,0.08)] rounded-3xl p-8 w-full max-w-2xl text-white">
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
          📬 Registro de Contacto
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              placeholder="Tu nombre completo"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/70 border border-white/10 hover:border-white/30 transition-all"
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="correo@ejemplo.com"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/70 border border-white/10 hover:border-white/30 transition-all"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("subject")}
              placeholder="Asunto"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/70 border border-white/10 hover:border-white/30 transition-all"
            />
            {errors.subject && <p className="text-red-400 text-sm">{errors.subject.message}</p>}
          </div>

          <div>
            <textarea
              {...register("message")}
              placeholder="Escribe tu mensaje..."
              rows={5}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/70 border border-white/10 hover:border-white/30 transition-all"
            ></textarea>
            {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
          </div>

          <div>
            <input
              {...register("budget")}
              placeholder="Presupuesto (opcional)"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/70 border border-white/10 hover:border-white/30 transition-all"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("consent")} />
            Acepto la política de privacidad
          </label>
          {errors.consent && <p className="text-red-400 text-sm">{errors.consent.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700 hover:brightness-125 shadow-[0_0_20px_3px_rgba(255,255,255,0.1)] p-3 rounded-xl font-semibold text-white transition-all duration-300"
          >
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>

        {toast && (
          <div
            className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in-up transition-all duration-500 ${
              toast.type === "success" ? "bg-green-600/90" : "bg-red-600/90"
            }`}
          >
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
