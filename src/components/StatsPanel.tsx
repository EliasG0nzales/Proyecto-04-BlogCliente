import { useState } from "react";

export default function StatsPanel() {
  const [isConnected, setIsConnected] = useState(true);

  const toggleConnection = () => setIsConnected(!isConnected);

  return (
    <div className="bg-gradient-to-b from-[#1e1e35]/80 to-[#121222]/80 backdrop-blur-md border border-white/10 shadow-[0_0_25px_5px_rgba(255,255,255,0.08)] rounded-2xl p-5 w-[280px] h-[280px] flex flex-col justify-between text-white transition-all duration-500">
      <h3 className="text-sm font-semibold flex items-center gap-1 text-gray-300">
        ⚡ <span>Estadísticas del Cliente</span>
      </h3>

      <div className="flex flex-col justify-center flex-grow gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-green-400">✔ Envíos OK</span>
          <span className="text-gray-200">{isConnected ? 1 : 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-orange-400">⚠ Envíos Fallidos</span>
          <span className="text-gray-200">{isConnected ? 0 : 1}</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/10 pt-2">
          <span className="text-gray-300">🕓 Latencia Promedio (ms)</span>
          <span className={`font-bold ${isConnected ? "text-white" : "text-gray-500"}`}>
            {isConnected ? "642.15" : "--"}
          </span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-gray-400">📦 En cola Offline</span>
          <span className="text-gray-200">{isConnected ? 0 : 3}</span>
        </div>
      </div>

      <div
        className={`w-full mt-3 text-center rounded-lg py-2 text-sm font-semibold shadow-inner transition-all duration-500 ${
          isConnected
            ? "bg-green-700/80 hover:bg-green-600/90"
            : "bg-red-700/80 hover:bg-red-600/90"
        }`}
      >
        {isConnected ? "🟢 CONECTADO" : "🔴 DESCONECTADO"}
      </div>

      <button
        onClick={toggleConnection}
        className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 transition-all duration-300 py-2 rounded-lg text-sm font-semibold"
      >
        {isConnected ? "Apagar Conexión" : "Encender Conexión"}
      </button>
    </div>
  );
}
