import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }
    if (!login(name, password)) {
      Alert.alert("Acesso negado", "Senha incorreta.");
      return;
    }
    router.replace("/(tabs)/summary");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[globalStyles.screenContainer, styles.container]}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <MaterialIcons name="monetization-on" size={44} color={colors.primary} />
        </View>
        <Text style={styles.title}>GESTÃO</Text>
        <View style={styles.titleSubRow}>
          <View style={styles.titleLine} />
          <Text style={styles.titleSub}>FINANCEIRA</Text>
          <View style={styles.titleLine} />
        </View>
        <Text style={styles.subtitle}>Entre para acessar sua conta</Text>
      </View>

      <View style={globalStyles.card}>
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>Nome</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Seu nome"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={[globalStyles.inputContainer, { marginBottom: 22 }]}>
          <Text style={globalStyles.inputLabel}>Senha</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="••••"
            placeholderTextColor={colors.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#0A1628",
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 8,
  },
  titleSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
    gap: 8,
  },
  titleLine: {
    width: 28,
    height: 1.5,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  titleSub: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 5,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#081421",
    fontWeight: "900",
    fontSize: 15,
  },
});
