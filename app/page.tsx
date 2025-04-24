// app/page.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function FuelCalculator() {
  const [showRegua, setShowRegua] = useState(false);
  const [arrivalLiters, setArrivalLiters] = useState(0);
  const [departureLiters, setDepartureLiters] = useState("");
  const [kgLeft, setKgLeft] = useState<any>(0);
  const [kgRight, setKgRight] = useState<any>(0);
  const [kgTotal, setKgTotal] = useState<any>(0);
  const [valuesLeft, setValuesLeft] = useState<any>(0);
  const [valuesRight, setValuesRight] = useState<any>(0);
  const [currentTime, setCurrentTime] = useState("");

  const [nome, setNome] = useState("");
  const [canac, setCanac] = useState("");
  const [data, setData] = useState("");
  const [base, setBase] = useState("");
  const [prefixo, setPrefixo] = useState("");
  const [density, setDensity] = useState(0.8);
  const [fuelToAddLiters, setFuelToAddLiters] = useState(0);
  const [fuelToAddKg, setFuelToAddKg] = useState(0);

  const [leituraReguas, setLeituraReguas] = useState("");

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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Sao_Paulo",
      }).format(new Date());
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  const parseInput = (val: any) =>
    typeof val === "string" ? parseFloat(val.replace(",", ".")) || 0 : 0;

  const calcKg = (liters: number) => liters / density;

  const calcValues = (kg: number) => {
    const liters = kg / density;
    const cm = kg !== 0 ? kg / 50 - 6 : 0;
    return { liters: liters.toFixed(2), cm: cm.toFixed(1) };
  };

  useEffect(() => {
    if (density != 0) {
      const arrival = parseInput(arrivalLiters);
      const departure = parseInput(departureLiters);

      if (departure > arrival) {
        const liters = (departure - arrival) / density;
        const kg = calcKg(liters);

        setFuelToAddLiters(liters);
        setFuelToAddKg(kg);
      } else {
        setFuelToAddLiters(0);
        setFuelToAddKg(0);
      }
    }
  }, [arrivalLiters, departureLiters, density]);

  const refuelNote = `PERFORMED MANUAL REFUELING IAW AMM\nMP ATR-A-12-11-28-00001-211C-A CHECK OF FUEL LEVEL USING MANUAL\nINDICATORS IAW AM MP ATR- A-12-11-28-00001-310A-A AND FUNCTIONAL\nTEST OF FEEDER TANK LOW LEVEL SENSOR IAW AMM MP ATR-A-28-42-70-04001-340A-A -A REV 10 jan-01-2025 MANUAL CHECK IN NORMAL INDICATION, TEST OK`;

  useEffect(() => {
    setKgLeft(kgTotal / 2);
    setKgRight(kgTotal / 2);
    setValuesLeft(calcValues(kgTotal / 2));
    setValuesRight(calcValues(kgTotal / 2));
  }, [kgTotal, density]);

  const downloadServerPDF = async (data: {
    kgTotal: number;
    fuelToAddKg: number;
    fuelToAddLiters: number;
    temperature: number;
    pressure: number;
    refuelNote: string;
    currentTime: string;
    regua01Left: string;
    regua02Left: string;
    regua01Right: string;
    regua02Right: string;
    leituraReguas: string;
    nome: string;
    canac: string;
    data: string;
    base: string;
    prefixo: string;
    density: number;
    arrivalLiters: number;
  }) => {
    const res = await fetch("/api/pdf", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio.pdf";
    link.click();
    link.remove();
  };

  return (
    <main className="min-h-screen p-4 bg-gray-100 text-gray-800 bg-cover bg-center">
      {" "}
      <div className="max-w-2xl mx-auto  p-6 rounded-2xl shadow-md">
        <div className="">
          <h2 className="text-xl font-bold mb-4">Cálculo de Reabastecimento</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block font-medium mb-1">Densidade:</label>
              <input
                type="number"
                onChange={(e) => setDensity(parseFloat(e.target.value) || 0)}
                placeholder="Ex: 0.8"
                className="w-full border p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Kg na Chegada:</label>
              <input
                type="number"
                onChange={(e: any) => setArrivalLiters(e.target.value)}
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
          <div className="grid grid-cols-2 border-t mt-6">
            <div className="mt-2 pt-4">
              <p className="font-semibold text-lg">Resultado</p>
              <p>
                Litros a Abastecer:{" "}
                <strong>{fuelToAddLiters.toFixed(2)}</strong> L
              </p>
              <p>
                Quilogramas a Abastecer:{" "}
                <strong>{fuelToAddKg.toFixed(2)}</strong> kg
              </p>
            </div>
            <div className="mt-2 pt-4">
              <p>Temp: {weather?.temperature} °C</p>
              <p>Time: {currentTime}</p>
              <p>Pressão: {weather?.pressure} hPa</p>
            </div>
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
              className="w-full border p-2 rounded-md"
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
              <label className="font-medium">Régua 02:</label>
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
              <label className="font-medium">Régua 02:</label>
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
            <p>Confirmar Leitura das Réguas: </p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="regua"
                  onChange={(e) => setLeituraReguas("Esquerda")}
                  value="LH"
                  className="accent-blue-600"
                />
                LH
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="regua"
                  onChange={(e) => setLeituraReguas("Direita")}
                  value="RH"
                  className="accent-blue-600"
                />
                RH
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  onChange={(e) => setLeituraReguas("Ambas")}
                  name="regua"
                  value="AMBAS"
                  className="accent-blue-600"
                />
                AMBAS
              </label>
            </div>
          </div>
          <div className="space-y-3 text-sm border-t md:border-t-0">
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="flex-1 p-1 border-b outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">CANAC:</label>
              <input
                type="text"
                value={canac}
                onChange={(e) => setCanac(e.target.value)}
                className="flex-1 p-1 border-b outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Data:</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="flex-1 p-1 border-b outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Base:</label>
              <input
                type="text"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="flex-1 p-1 border-b outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">Prefixo:</label>
              <input
                type="text"
                value={prefixo}
                onChange={(e) => setPrefixo(e.target.value)}
                className="flex-1 p-1 border-b outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold mb-2">Texto Padrão</h3>
          <pre className="whitespace-pre-wrap text-sm mb-2 text-gray-700">
            {refuelNote}
          </pre>
        </div>
        <div className="mt-6">
          <div className="mt-6">
            <button
              onClick={() =>
                downloadServerPDF({
                  kgTotal,
                  fuelToAddKg,
                  fuelToAddLiters,
                  temperature: weather?.temperature || 0,
                  pressure: weather?.pressure || 0,
                  refuelNote,
                  currentTime,
                  regua01Left: valuesLeft.cm,
                  regua02Left: "0,0",
                  regua01Right: valuesRight.cm,
                  regua02Right: "0,0",
                  leituraReguas,
                  nome,
                  canac,
                  data,
                  base,
                  prefixo,
                  density: density,
                  arrivalLiters: arrivalLiters,
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Gerar PDF
            </button>
            <button
              onClick={() => setShowRegua(true)} // Exibe a régua ao clicar
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Visualizar Régua
            </button>
          </div>
        </div>
        {showRegua && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-">
            <div className="relative">
              <img
                src="/regua.jpg"
                alt="Régua"
                className="max-w-full max-h-full"
              />
              <button
                onClick={() => setShowRegua(false)} // Fecha o modal
                className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
