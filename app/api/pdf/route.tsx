import { ReportPDF } from "@/app/components/ReportPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

// 🚨 NÃO use ReportPDF como tipo
export async function POST(req: Request) {
  const body = await req.json();

  const element = (
    <ReportPDF
      kgTotal={body.kgTotal}
      fuelToAddKg={body.fuelToAddKg}
      fuelToAddLiters={body.fuelToAddLiters}
      temperature={body.temperature}
      pressure={body.pressure}
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
