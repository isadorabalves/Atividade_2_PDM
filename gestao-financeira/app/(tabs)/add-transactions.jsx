import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";

import { useContext, useEffect, useRef, useState } from "react";

import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

import Button from "../../components/Button";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";

import { MoneyContext } from "../../contexts/GlobalState";

const emptyForm = { description: "", value: 0, date: new Date(), categoryId: "" };

export default function AddTransactions() {
  const [form, setForm] = useState(emptyForm);
  const [transactionType, setTransactionType] = useState("despesa");
  const [saving, setSaving] = useState(false);
  const valueInputRef = useRef();

  const { categories, addTransaction } = useContext(MoneyContext);

  const isIncome = transactionType === "receita";

  useEffect(() => {
    const filtered = categories.filter((c) => c.isIncome === isIncome);
    if (filtered.length > 0) {
      setForm((f) => ({ ...f, categoryId: filtered[0].id }));
    }
  }, [categories, transactionType]);

  const handleTypeChange = (type) => {
    setTransactionType(type);
  };

  const handleAdd = async () => {
    if (!form.description) {
      Alert.alert("Atenção", "Digite uma descrição.");
      return;
    }
    if (form.value <= 0) {
      Alert.alert("Atenção", "Digite um valor válido.");
      return;
    }
    if (!form.categoryId) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }

    setSaving(true);
    try {
      await addTransaction(form);
      const filtered = categories.filter((c) => c.isIncome === isIncome);
      setForm({ ...emptyForm, categoryId: filtered[0]?.id ?? "" });
      Alert.alert("Sucesso!", "Transação adicionada.");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar. Verifique a conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Nova transação</Text>
          <Text style={styles.subtitle}>
            Registre suas receitas e despesas
          </Text>

          {/* Toggle Receita / Despesa */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                transactionType === "receita" && styles.typeBtnIncomeActive,
              ]}
              onPress={() => handleTypeChange("receita")}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  transactionType === "receita" && styles.typeBtnTextActive,
                ]}
              >
                Receita
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                transactionType === "despesa" && styles.typeBtnExpenseActive,
              ]}
              onPress={() => handleTypeChange("despesa")}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  transactionType === "despesa" && styles.typeBtnTextActive,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <DescriptionInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />

            <CurrencyInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />

            <DatePicker form={form} setForm={setForm} />

            <CategoryPicker
              form={form}
              setForm={setForm}
              filterIsIncome={isIncome}
            />

            <Button onPress={handleAdd} disabled={saving}>
              {saving ? "Salvando..." : "Adicionar"}
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 42,
    paddingBottom: 150,
  },

  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#8FA6C1",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },

  typeToggle: {
    flexDirection: "row",
    backgroundColor: "#081421",
    borderRadius: 22,
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1A2A42",
  },

  typeBtn: {
    flex: 1,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBtnIncomeActive: {
    backgroundColor: colors.success,
  },

  typeBtnExpenseActive: {
    backgroundColor: colors.danger,
  },

  typeBtnText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },

  typeBtnTextActive: {
    color: "#fff",
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#16273D",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#223654",
    shadowColor: "#0F4C81",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
});
