function trackMetric(metric: { ok: boolean; latency?: number }) {
  const stats = JSON.parse(localStorage.getItem("metrics") || '{"ok":0,"fail":0,"latency":[]}');
  if (metric.ok) {
    stats.ok++;
    stats.latency.push(metric.latency || 0);
  } else {
    stats.fail++;
  }
  localStorage.setItem("metrics", JSON.stringify(stats));
}

function saveToHistory(payload: any, success: boolean) {
  const history = JSON.parse(localStorage.getItem("paymentsHistory") || "[]");
  const now = new Date();

  history.unshift({
    id: crypto.randomUUID(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    budget: payload.budget || "—",
    status: success ? "✅ Enviado correctamente" : "❌ Error en el envío",
  });

  localStorage.setItem("paymentsHistory", JSON.stringify(history));
}

export async function sendContact(payload: any) {
  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const t0 = performance.now();

      await new Promise((resolve) => setTimeout(resolve, 700));

      const success = Math.random() > 0.1;
      const t1 = performance.now();
      trackMetric({ ok: success, latency: t1 - t0 });

      if (!success) throw new Error("Error simulado en el envío");

      saveToHistory(payload, true);
      console.log("✅ Mensaje simulado correctamente:", payload);

      return { success: true, message: "Mensaje enviado correctamente (sin backend)" };
    } catch (err) {
      attempt++;
      trackMetric({ ok: false });
      console.warn(`⚠️ Error intento ${attempt}/${maxRetries}`);

      if (attempt > maxRetries) {
        saveToHistory(payload, false);
        throw new Error("❌ Error simulado: no se pudo enviar el mensaje");
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
}
