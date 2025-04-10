// components/WeatherInfoPanel.tsx
import { Thermometer, Gauge } from "lucide-react";

const WeatherInfoPanel = ({ temp, pressure }: { temp: number; pressure: number }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl border rounded-xl p-4 w-52 text-sm space-y-2 z-50">
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-red-500" />
        <span className="font-medium">Temp:</span> {temp}°C
      </div>
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-blue-500" />
        <span className="font-medium">Pressão:</span> {pressure} hPa
      </div>
    </div>
  );
};

export default WeatherInfoPanel;
