// app/page.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import WeatherInfoPanel from "./components/WeatherInfoPanel";

export default function FuelCalculator() {
  const [arrivalLiters, setArrivalLiters] = useState("");
  const [departureLiters, setDepartureLiters] = useState("");
  const [kgLeft, setKgLeft] = useState<any>(0);
  const [kgRight, setKgRight] = useState<any>(0);
  const [kgTotal, setKgTotal] = useState<any>(0);
  const [valuesLeft, setValuesLeft] = useState<any>(0);
  const [valuesRight, setValuesRight] = useState<any>(0);
  const density = 0.8;

  const [weather, setWeather] = useState<{
    temperature: number;
    pressure: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&pressure_unit=hPa`
          );

          const current = res.data.current_weather;
          setWeather({
            temperature: current.temperature,
            pressure: current.pressure || 1013, // fallback
          });
        } catch (err) {
          console.error("Erro ao buscar dados do clima", err);
        }
      },
      (err) => {
        console.error("Erro ao obter localização", err);
      }
    );
  }, []);

  const parseInput = (val: any) =>
    typeof val === "string" ? parseFloat(val.replace(",", ".")) || 0 : 0;

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refuelNote);
  };

  const refuelNote = `PERFORMED MANUAL REFUELING IAW AMM\nMP ATR-A-12-11-28-00001-211C-A CHECK OF FUEL LEVEL USING MANUAL\nINDICATORS IAW AM MP ATR- A-12-11-28-00001-310A-A AND FUNCTIONAL\nTEST OF FEEDER TANK LOW LEVEL SENSOR IAW AMM MP ATR-A-28-42-70-04001-340A-A -A REV 10 jan-01-2025 MANUAL CHECK IN NORMAL INDICATION, TEST OK`;

  useEffect(() => {
    setKgLeft(kgTotal / 2);
    setKgRight(kgTotal / 2);
    setValuesLeft(calcValues(kgTotal / 2));
    setValuesRight(calcValues(kgTotal / 2));
  }, [kgTotal]);

  return (
    <main className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="">
          <h2 className="text-xl font-bold mb-4">Cálculo de Reabastecimento</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block font-medium mb-1">Kg na Chegada:</label>
              <input
                type="number"
                value={arrivalLiters}
                onChange={(e) => setArrivalLiters(e.target.value)}
                placeholder="Ex: 1800"
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Kg para Saída:</label>
              <input
                type="number"
                value={departureLiters}
                onChange={(e) => {
                  setKgTotal(e.target.value);
                  setDepartureLiters(e.target.value);
                }}
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
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h1 className="text-xl font-bold  mb-6">
            Cálculo de Combustível por Asa (ATR)
          </h1>
        </div>
        <div className="flex justify-center items-center mb-4">
          <div>
            <label className="block font-medium mb-1">Total Asas (KG):</label>
            <input
              type="number"
              value={kgTotal}
              onChange={(e: any) => {
                const value = e.target.value / 2;
                setKgLeft(value);
                setKgRight(value);
                setKgTotal(e.target.value);
              }}
              placeholder="Ex: 2800"
              className="w-full border p-2 rounded-md mx-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">KG Asa Esquerda:</label>
            <input
              type="number"
              value={kgLeft}
              onChange={(e) => setKgLeft(e.target.value)}
              placeholder="Ex: 1400"
              className="w-full border p-2 rounded-md"
            />
            <p className="mt-2 text-sm">
              Litros: <strong>{valuesLeft.liters}</strong> L
            </p>
            <p className="text-sm">
              Régua 01: <strong>{valuesLeft.cm}</strong> cm
            </p>
            <div className="flex items-center gap-2 text-sm">
              <label className="font-medium">Régua 2:</label>
              <input
                type="text"
                placeholder="0,0"
                className="p-1 w-32 text-sm border-b"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">KG Asa Direita:</label>
            <input
              type="number"
              value={kgRight}
              onChange={(e) => setKgRight(e.target.value)}
              placeholder="Ex: 1400"
              className="w-full border p-2 rounded-md"
            />
            <p className="mt-2 text-sm">
              Litros: <strong>{valuesRight.liters}</strong> L
            </p>
            <p className="text-sm">
              Régua 01: <strong>{valuesRight.cm}</strong> cm
            </p>
            <div className="flex items-center gap-2 text-sm">
              <label className="font-medium">Régua 2:</label>
              <input
                type="number"
                placeholder="0,0"
                className="p-1 w-32 text-sm border-b"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-6 border-t pt-4  md:grid-cols-2">
          <div>
            <p className="font-semibold text-lg mb-2">Total</p>
            <p>
              KG: <strong>{kgTotal}</strong> kg
            </p>
            <p>
              Litros: <strong>{(kgTotal / density).toFixed(2)}</strong> L
            </p>
          </div>
          <div className="space-y-3 text-sm border-t md:border-t-0">
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Nome:</label>
              <input type="text" className="flex-1 p-1 border-b outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">CANAC:</label>
              <input type="text" className="flex-1 p-1 border-b outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Data:</label>
              <input type="date" className="flex-1 p-1 border-b outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Base:</label>
              <input type="text" className="flex-1 p-1 border-b outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Prefixo:</label>
              <input type="text" className="flex-1 p-1 border-b outline-none" />
            </div>
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
      <WeatherInfoPanel
        temp={weather?.temperature ?? 0}
        pressure={weather?.pressure ?? 0}
      />
    </main>
  );
}
