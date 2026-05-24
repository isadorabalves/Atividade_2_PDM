import { Text, TextInput, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

export default function CurrencyInput({ form, setForm, valueInputRef }) {
  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;

    setForm({ ...form, value: numberValue });
  };

  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.inputLabel}>Valor</Text>

      <TextInput
        ref={valueInputRef}
        value={form.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        onChangeText={handleCurrencyChange}
        keyboardType="numeric"
        placeholder="R$ 0,00"
        placeholderTextColor={colors.subtitle}
        style={globalStyles.input}
      />
    </View>
  );
}