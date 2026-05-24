import { StyleSheet, Text, View } from "react-native";

import CategoryItem from "./CategoryItem";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

export default function SummaryItem({ category, value }) {
  const valueStyle = category.isIncome
    ? globalStyles.positiveText
    : globalStyles.negativeText;

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />

      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>
          {category.displayName}
        </Text>

        <Text style={valueStyle}>
          {Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#223654",
  },

  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 14,
  },
});