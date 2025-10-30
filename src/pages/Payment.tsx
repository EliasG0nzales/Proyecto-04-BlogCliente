import { useState, useEffect } from "react";

type Payment = {
  id: string;
  name: string;
  email: string;
  amount: string;
  method: string;
  description: string;
  date: string;
};

export default function Payment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    method: "Tarjeta",
    description: "",
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("payments");
    if (saved) setPayments(JSON.parse(saved));
  }, []);

  const savePayments = (data: Payment[]) => {
    localStorage.setItem("payments", JSON.stringify(data));
    setPayments(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.amount) {
      setMessage({ type: "error", text: "Completa todos los campos obligatorios." });
      return;
    }

    const newPayment: Payment = {
      id: crypto.randomUUID(),
      ...formData,
      date: new Date().toLocaleString(),
    };

    const updated = [...payments, newPayment];
    savePayments(updated);

    setFormData({
      name: "",
      email: "",
      amount: "",
      method: "Tarjeta",
      description: "",
    });

    setMessage({ type: "success", text: "✅ Pago registrado correctamente." });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-6">
      <div className="bg-gradient-to-b from-pink-500 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 w-full max-w-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-6">💳 Registro de Pagos</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-purple-100 text-black focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-purple-100 text-black focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Monto (S/)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-purple-100 text-black focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej. 150.00"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Método de pago</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-purple-100 text-black focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option>Tarjeta</option>
              <option>Yape</option>
              <option>Plin</option>
              <option>Transferencia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Descripción</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-purple-100 text-black focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Motivo del pago"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-700 p-3 rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Registrar pago
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              message.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {payments.length > 0 && (
        <div className="mt-8 w-full max-w-2xl bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-xl font-semibold mb-3">📋 Historial de Pagos</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left py-2">Nombre</th>
                <th className="text-left py-2">Monto</th>
                <th className="text-left py-2">Método</th>
                <th className="text-left py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-1">{p.name}</td>
                  <td className="py-1">S/ {p.amount}</td>
                  <td className="py-1">{p.method}</td>
                  <td className="py-1 text-xs opacity-80">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
