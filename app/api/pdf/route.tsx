import { ReportPDF } from "@/app/components/ReportPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

// 🚨 NÃO use ReportPDF como tipo
export async function POST(req: Request) {
  const body = await req.json();

  const element = (
    <ReportPDF
      nome={body.nome}
      canac={body.canac}
      data={body.data}
      base={body.base}
      prefixo={body.prefixo}
      currentTime={body.currentTime}
      regua01Left={body.regua01Left}
      regua02Left={body.regua02Left}
      regua01Right={body.regua01Right}
      regua02Right={body.regua02Right}
      leituraReguas={body.leituraReguas}
      refuelNote={body.refuelNote}
      kgTotal={body.kgTotal}
      fuelToAddKg={body.fuelToAddKg}
      fuelToAddLiters={body.fuelToAddLiters}
      temperature={body.temperature}
      pressure={body.pressure}
      density={body.density}
      arrivalLiters={body.arrivalLiters}
    />
  );

  const pdfBuffer = await renderToBuffer(element);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=relatorio.pdf",
    },
  });
}
