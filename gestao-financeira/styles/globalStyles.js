import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#16273D",
    borderRadius: 28,
    padding: 22,

    borderWidth: 1,
    borderColor: "#223654",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.28,
    shadowRadius: 14,

    elevation: 10,
  },

  inputContainer: {
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  input: {
    height: 58,

    paddingHorizontal: 18,

    borderRadius: 20,

    backgroundColor: "#0B1829",

    borderWidth: 1,
    borderColor: "#223654",

    color: colors.text,

    fontSize: 16,
    fontWeight: "700",
  },

  line: {
    backgroundColor: "#223654",
    height: 1,
    opacity: 0.6,
    marginVertical: 10,
  },

  primaryText: {
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: "800",
  },

  secondaryText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: "600",
  },

  positiveText: {
    fontSize: 16,
    color: colors.positiveText,
    fontWeight: "900",
  },

  negativeText: {
    fontSize: 16,
    color: colors.negativeText,
    fontWeight: "900",
  },
});