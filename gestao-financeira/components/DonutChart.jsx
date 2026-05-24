import Svg, { Circle } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../constants/colors";

export default function DonutChart({ income = 0, expenses = 0 }) {
  const size = 190;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const netIncome = Math.max(income - expenses, 0);
  const total = income + expenses + netIncome;

  const incomePercent = total > 0 ? income / total : 0;
  const expensesPercent = total > 0 ? expenses / total : 0;
  const netIncomePercent = total > 0 ? netIncome / total : 0;

  const incomeDash = circumference * incomePercent;
  const expensesDash = circumference * expensesPercent;
  const netIncomeDash = circumference * netIncomePercent;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10213A"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${incomeDash} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.danger}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${expensesDash} ${circumference}`}
          strokeDashoffset={-incomeDash - 6}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.success}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${netIncomeDash} ${circumference}`}
          strokeDashoffset={-(incomeDash + expensesDash) - 12}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Text style={styles.centerLabel}>Saldo</Text>
        <Text style={styles.centerValue}>
          {(income - expenses).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 12,
  },

  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  centerLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    marginBottom: 4,
  },

  centerValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
});