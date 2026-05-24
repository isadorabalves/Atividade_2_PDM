import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MonthYearPicker({ month, year, onChange }) {
  function prev() {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  }

  function next() {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={prev} style={styles.arrow}>
        <MaterialIcons name="chevron-left" size={26} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.label}>{MONTHS[month]} {year}</Text>
      <TouchableOpacity onPress={next} style={styles.arrow}>
        <MaterialIcons name="chevron-right" size={26} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#081421",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1A2A42",
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 20,
  },
  arrow: {
    padding: 6,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
