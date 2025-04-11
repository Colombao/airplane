import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type ReportPDFProps = {
  kgTotal: number;
  fuelToAddKg: number;
  fuelToAddLiters: number;
  temperature: number;
  pressure: number;
};

export const ReportPDF = ({
  kgTotal,
  fuelToAddKg,
  fuelToAddLiters,
  temperature,
  pressure,
}: ReportPDFProps) => {
  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    section: { marginBottom: 10 },
    title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Abastecimento</Text>
        <View style={styles.section}>
          <Text>Total de KG: {kgTotal} kg</Text>
          <Text>Total de Litros: {(kgTotal / 0.8).toFixed(2)} L</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Abastecimento necessário: {fuelToAddKg.toFixed(2)} kg /{" "}
            {fuelToAddLiters.toFixed(2)} L
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Temperatura: {temperature} °C</Text>
          <Text>Pressão: {pressure} hPa</Text>
        </View>
      </Page>
    </Document>
  );
};
