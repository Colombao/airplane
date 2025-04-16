import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type ReportPDFProps = {
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
};

export const ReportPDF = ({
  kgTotal,
  fuelToAddKg,
  fuelToAddLiters,
  temperature,
  pressure,
  refuelNote,
  currentTime,
  regua01Left,
  regua02Left,
  regua01Right,
  regua02Right,
  leituraReguas,
  nome,
  canac,
  data,
  base,
  prefixo,
  density,
  arrivalLiters,
}: ReportPDFProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
      lineHeight: 1.5,
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
    },
    section: {
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: "1px solid #ccc",
    },
    label: {
      fontWeight: "bold",
    },
    line: {
      marginBottom: 4,
    },
    note: {
      marginTop: 10,
      fontSize: 10,
      fontFamily: "Courier",
      backgroundColor: "#f0f0f0",
      padding: 10,
      borderRadius: 4,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Abastecimento</Text>

        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>Horário:</Text> {currentTime}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Temperatura:</Text> {temperature} °C
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Pressão:</Text> {pressure} hPa
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Densidade:</Text> {density}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>Total de KG Chegada:</Text>{" "}
            {arrivalLiters} kg
          </Text>
          {/* <Text style={styles.line}>
            <Text style={styles.label}>Total de Litros Entrada:</Text>{" "}
            {(+arrivalLiters / 0.8).toFixed(2)} L
          </Text> */}
          <Text style={styles.line}>
            <Text style={styles.label}>Total de KG:</Text> {kgTotal} kg
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Total de Litros:</Text>{" "}
            {(kgTotal / 0.8).toFixed(2)} L
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>Abastecimento necessário:</Text>{" "}
            {+kgTotal - +arrivalLiters} kg /{" "}
            {+kgTotal / 0.8 - +arrivalLiters / 0.8} L
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>Régua 01 (Esquerda):</Text> {regua01Left}{" "}
            cm
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Régua 02 (Esquerda):</Text> {regua02Left}{" "}
            cm
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Régua 01 (Direita):</Text> {regua01Right}{" "}
            cm
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Régua 02 (Direita):</Text> {regua02Right}{" "}
            cm
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Leitura Confirmada:</Text>{" "}
            {leituraReguas}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>Nome:</Text> {nome}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>CANAC:</Text> {canac}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Data:</Text> {data}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Base:</Text> {base}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Prefixo:</Text> {prefixo}
          </Text>
        </View>

        <View style={styles.note}>
          <Text>{refuelNote}</Text>
        </View>
      </Page>
    </Document>
  );
};
