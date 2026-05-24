import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

export default function Button({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.background}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    marginTop: 20,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  text: {
    color: "#081421",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});