// app/page.tsx
"use client";

import { useState } from "react";

export default function FuelCalculator() {
  const [arrivalLiters, setArrivalLiters] = useState("");
  const [departureLiters, setDepartureLiters] = useState("");
  const [kgLeft, setKgLeft] = useState("");
  const [kgRight, setKgRight] = useState("");
  const density = 0.8;

  const parseInput = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const calcKg = (liters: number) => liters * density;

  const calcValues = (kg: number) => {
    const liters = kg / density;
    const cm = kg !== 0 ? kg / 50 - 7 : 0;
    return { liters: liters.toFixed(2), cm: cm.toFixed(1) };
  };

  const arrival = parseInput(arrivalLiters);
  const departure = parseInput(departureLiters);
  const fuelToAddLiters = (departure - arrival) / density;
  const fuelToAddKg = calcKg(fuelToAddLiters);

  const valuesLeft = calcValues(parseInput(kgLeft));
  const valuesRight = calcValues(parseInput(kgRight));
  const totalKg = parseInput(kgLeft) + parseInput(kgRight);
  const totalLiters = totalKg / density;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refuelNote);
  };

  const refuelNote = `PERFORMED MANUAL REFUELING IAW AMM\nMP ATR-A-12-11-28-00001-211C-A CHECK OF FUEL LEVEL USING MANUAL\nINDICATORS IAW AM MP ATR- A-12-11-28-00001-310A-A AND FUNCTIONAL\nTEST OF FEEDER TANK LOW LEVEL SENSOR IAW AMM MP ATR-A-28-42-70-04001-340A-A -A REV 10 jan-01-2025 MANUAL CHECK IN NORMAL INDICATION, TEST OK`;

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
              Régua: <strong>{valuesRight.cm}</strong> cm
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="font-semibold text-lg">Total</p>
          <p>
            KG Entrada: <strong>{totalKg}</strong> kg
          </p>
          <p>
            Litros: <strong>{totalLiters.toFixed(2)}</strong> L
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Cálculo de Reabastecimento</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block font-medium mb-1">
                Kg na Chegada:
              </label>
              <input
                type="text"
                value={arrivalLiters}
                onChange={(e) => setArrivalLiters(e.target.value)}
                placeholder="Ex: 1800"
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Kg para Saída:
              </label>
              <input
                type="text"
                value={departureLiters}
                onChange={(e) => setDepartureLiters(e.target.value)}
                placeholder="Ex: 2600"
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="font-semibold text-lg">Resultado</p>
            <p>
              Litros a Abastecer:{" "}
              <strong>
                {departure && arrival && fuelToAddLiters.toFixed(2)}
              </strong>{" "}
              L
            </p>
            <p>
              Quilogramas a Abastecer:{" "}
              <strong>{departure && arrival && fuelToAddKg.toFixed(2)}</strong>{" "}
              kg
            </p>
            {/* <p className="text-sm mt-2 text-gray-500">
              Fórmula: (Litros saída - Litros chegada) × 0.8 = KG
            </p> */}
          </div>
        </div>
        <div className="mt-8 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold mb-2">Texto Padrão</h3>
          <pre className="whitespace-pre-wrap text-sm mb-2 text-gray-700">
            {refuelNote}
          </pre>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Copiar Texto
          </button>
        </div>
      </div>
    </main>
  );
}
