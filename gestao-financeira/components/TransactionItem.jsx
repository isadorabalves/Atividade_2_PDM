import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

function bgAlpha(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},0.18)`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Hoje, ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Ontem, ${time}`;
  return (
    d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }) + `, ${time}`
  );
}

export default function TransactionItem({ category, date, description, value }) {
  const isIncome = category.isIncome;
  const numValue = Number(value);

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: bgAlpha(category.background) }]}>
        <MaterialIcons name={category.icon} size={22} color={category.background} />
      </View>

      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <Text style={[styles.value, { color: isIncome ? colors.success : colors.danger }]}>
        {isIncome ? "+" : "-"}{" "}
        {numValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2A42",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  description: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  date: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "800",
  },
});
