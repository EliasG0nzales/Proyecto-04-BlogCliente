import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Log = {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  date: string;
  time: string;
  status: string;
};

export default function PaymentsLogPanel({ logs }: { logs: Log[] }) {
  const [selected, setSelected] = useState<Log | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [toast, setToast] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const openTicket = (log: Log) => {
    setSelected(log);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    setPhone("");
  };

  const downloadPDF = async () => {
    if (!ticketRef.current || !selected) return;
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${selected.subject}-${selected.date}.pdf`);
      setToast({ type: "ok", text: "✅ Ticket descargado como PDF" });
    } catch {
      setToast({ type: "error", text: "❌ Error generando el ticket" });
    }
  };

  const sendSMS = () => {
    if (!phone.match(/^\+?\d{8,15}$/)) {
      setToast({ type: "error", text: "Número inválido. Ejemplo: +51987654321" });
      return;
    }
    const sent = JSON.parse(localStorage.getItem("sentSMS") || "[]");
    const record = {
      id: crypto.randomUUID(),
      phone,
      log: selected,
      sentAt: new Date().toLocaleString(),
    };
    sent.unshift(record);
    localStorage.setItem("sentSMS", JSON.stringify(sent));
    setToast({ type: "ok", text: `📲 Ticket enviado (simulado) a ${phone}` });
    closeModal();
  };

  const TicketPreview = ({ log }: { log: Log }) => (
    <div
      ref={ticketRef}
      className="w-[320px] p-4 bg-white text-black rounded-md shadow-md"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div style={{ borderBottom: "1px solid #ddd", paddingBottom: 6, marginBottom: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>RECIBO DE PAGO (SIMULADO)</div>
        <div style={{ fontSize: 10, color: "#666" }}>Ticket ID: {crypto.randomUUID()}</div>
      </div>

      <p style={{ fontSize: 12, marginBottom: 4 }}>
        <strong>Fecha:</strong> {log.date} — <strong>Hora:</strong> {log.time}
      </p>
      <p style={{ fontSize: 12 }}>
        <strong>Cliente:</strong> {log.name || "—"}
        <br />
        <strong>Correo:</strong> {log.email || "—"}
      </p>

      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />

      <p style={{ fontSize: 12 }}>
        <strong>Asunto:</strong> {log.subject}
        <br />
        <strong>Mensaje:</strong> {log.message}
      </p>

      {log.budget && (
        <div style={{ marginTop: 8 }}>
          <strong>Monto:</strong>{" "}
          <span style={{ color: "#0a6", fontWeight: 700 }}>S/ {log.budget}</span>
        </div>
      )}

      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />

      <p
        style={{
          fontSize: 12,
          color: log.status.includes("✅") ? "#0a6" : "#d33",
          fontWeight: 600,
        }}
      >
        Estado: {log.status}
      </p>

      <div style={{ fontSize: 10, color: "#777", marginTop: 10 }}>
        *Este comprobante es generado automáticamente y no tiene validez bancaria.
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-b from-[#1b1b2f]/90 to-[#0f0f1a]/90 backdrop-blur-md border border-white/10 shadow-[0_0_25px_5px_rgba(255,255,255,0.08)] rounded-2xl p-4 w-[300px] h-[320px] text-white overflow-y-auto">
        <h3 className="text-sm font-semibold flex items-center gap-1 text-gray-300 mb-2">
          💰 <span>Historial de Envíos / Pagos</span>
        </h3>

        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin registros aún.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {logs.map((log, index) => (
              <li
                key={index}
                onClick={() => openTicket(log)}
                className="border border-white/10 rounded-lg p-2 bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <p className="text-fuchsia-300 font-semibold truncate">{log.subject}</p>
                <p className="text-gray-300 truncate">{log.name}</p>
                <p className="text-gray-400 text-[10px]">
                  {log.date} — {log.time}
                </p>
                {log.budget && <p className="text-green-400">💵 {log.budget}</p>}
                <p className="text-gray-200 line-clamp-2">💬 {log.message}</p>
                <p
                  className={`text-xs font-semibold mt-1 ${
                    log.status.includes("✅") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {log.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal}></div>

          <div className="relative z-10 bg-[#111]/95 rounded-2xl p-6 w-[700px] flex gap-6 text-white border border-white/10">
            <TicketPreview log={selected} />

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-2">Opciones del Ticket</h4>
                <p className="text-sm text-gray-400 mb-4">
                  ¿Deseas descargar el ticket o enviarlo por SMS?
                </p>

                <button
                  onClick={downloadPDF}
                  className="w-full mb-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 font-semibold"
                >
                  📥 Descargar Ticket (PDF)
                </button>

                <div className="space-y-2">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+51987654321"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white outline-none"
                  />
                  <button
                    onClick={sendSMS}
                    className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 font-semibold"
                  >
                    📲 Enviar por SMS (Simulado)
                  </button>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="mt-4 w-full py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm"
              >
                ✖ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "ok" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}
