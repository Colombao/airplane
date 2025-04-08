// app/page.tsx
"use client";

import { useState } from "react";

export default function FuelCalculator() {
  const [kgLeft, setKgLeft] = useState("");
  const [kgRight, setKgRight] = useState("");
  const density = 0.8;

  const parseInput = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const calcValues = (kg: number) => {
    const liters = kg / density;
    // a cada 1cm é == 50kg
    const cm = kg / 50;
    return { liters: liters.toFixed(2), cm: cm.toFixed(1) };
  };

  const valuesLeft = calcValues(parseInput(kgLeft));
  const valuesRight = calcValues(parseInput(kgRight));
  const totalKg = parseInput(kgLeft) + parseInput(kgRight);
  const totalLiters = totalKg / density;

  return (
    <main className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          Cálculo de Combustível por Asa (ATR)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">KG Asa Esquerda:</label>
            <input
              type="text"
              value={kgLeft}
              onChange={(e) => setKgLeft(e.target.value)}
              placeholder="Ex: 1400"
              className="w-full border p-2 rounded-md"
            />
            <p className="mt-2 text-sm">
              Litros: <strong>{valuesLeft.liters}</strong> L
            </p>
            <p className="text-sm">
              Régua: <strong>{valuesLeft.cm}</strong> cm
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">KG Asa Direita:</label>
            <input
              type="text"
              value={kgRight}
              onChange={(e) => setKgRight(e.target.value)}
              placeholder="Ex: 1400"
              className="w-full border p-2 rounded-md"
            />
            <p className="mt-2 text-sm">
              Litros: <strong>{valuesRight.liters}</strong> L
            </p>
            <p className="text-sm">
              Altura Régua: <strong>{valuesRight.cm}</strong> cm
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="font-semibold text-lg">Total</p>
          <p>
            KG: <strong>{totalKg}</strong> kg
          </p>
          <p>
            Litros: <strong>{totalLiters.toFixed(2)}</strong> L
          </p>
        </div>
      </div>
    </main>
  );
}
