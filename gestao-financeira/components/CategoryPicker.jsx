import { useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";
import { MoneyContext } from "../contexts/GlobalState";

export default function CategoryPicker({ form, setForm, filterIsIncome }) {
  const { categories } = useContext(MoneyContext);

  const filtered =
    filterIsIncome === undefined
      ? categories
      : categories.filter((c) => c.isIncome === filterIsIncome);

  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.inputLabel}>Categoria</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.categoryId}
          dropdownIconColor={colors.primary}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setForm({ ...form, categoryId: itemValue })
          }
        >
          {filtered.map((cat) => (
            <Picker.Item key={cat.id} label={cat.displayName} value={cat.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: 58,
    justifyContent: "center",
    backgroundColor: "#0B1829",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#223654",
    overflow: "hidden",
  },

  picker: {
    color: colors.text,
    backgroundColor: "#0B1829",
    fontWeight: "700",
  },
});