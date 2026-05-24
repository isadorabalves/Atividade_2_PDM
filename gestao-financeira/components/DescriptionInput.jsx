import { Text, TextInput, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

export default function DescriptionInput({ form, setForm, valueInputRef }) {
  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.inputLabel}>Descrição</Text>

      <TextInput
        value={form.description}
        returnKeyType="next"
        onChangeText={(text) => setForm({ ...form, description: text })}
        onSubmitEditing={() => valueInputRef.current.focus()}
        placeholder="Ex: Salário"
        placeholderTextColor={colors.subtitle}
        style={globalStyles.input}
      />
    </View>
  );
}