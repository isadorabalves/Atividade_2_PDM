import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import MonthYearPicker from "../../components/MonthYearPicker";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

const FILTERS = { all: "all", income: "income", expenses: "expenses" };
const now = new Date();

export default function Transactions() {
  const { transactions, loading, error, refresh, removeTransaction, updateTransaction } =
    useContext(MoneyContext);

  const [activeFilter, setActiveFilter] = useState(FILTERS.all);
  const [filterMonth, setFilterMonth] = useState(now.getMonth());
  const [filterYear, setFilterYear] = useState(now.getFullYear());

  const [editItem, setEditItem] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });
  }, [transactions, filterMonth, filterYear]);

  const filteredTransactions = useMemo(() => {
    if (activeFilter === FILTERS.income) {
      return monthTransactions.filter((t) => t.category.isIncome);
    }
    if (activeFilter === FILTERS.expenses) {
      return monthTransactions.filter((t) => !t.category.isIncome);
    }
    return monthTransactions;
  }, [monthTransactions, activeFilter]);

  const openEdit = (item) => {
    setEditItem(item);
    setEditDesc(item.description);
    setEditValue(String(Number(item.value)));
  };

  const closeEdit = () => {
    setEditItem(null);
    setEditDesc("");
    setEditValue("");
  };

  const handleSaveEdit = async () => {
    if (!editDesc.trim()) {
      Alert.alert("Atenção", "A descrição não pode ficar vazia.");
      return;
    }
    const numValue = parseFloat(editValue.replace(",", "."));
    if (!numValue || numValue <= 0) {
      Alert.alert("Atenção", "Digite um valor válido.");
      return;
    }
    setSaving(true);
    try {
      await updateTransaction(editItem.id, {
        description: editDesc.trim(),
        value: numValue,
      });
      closeEdit();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a edição.");
    } finally {
      setSaving(false);
    }
  };

  const handleLongPress = (item) => {
    Alert.alert(
      item.description,
      "O que deseja fazer?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Editar",
          onPress: () => openEdit(item),
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => removeTransaction(item.id),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} onLongPress={() => handleLongPress(item)}>
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Transações</Text>
            <Text style={styles.subtitle}>
              Acompanhe suas movimentações financeiras
            </Text>

            <MonthYearPicker
              month={filterMonth}
              year={filterYear}
              onChange={(m, y) => {
                setFilterMonth(m);
                setFilterYear(y);
              }}
            />

            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === FILTERS.all && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(FILTERS.all)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === FILTERS.all && styles.filterTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === FILTERS.income && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(FILTERS.income)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === FILTERS.income && styles.filterTextActive,
                  ]}
                >
                  Receitas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === FILTERS.expenses && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(FILTERS.expenses)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === FILTERS.expenses && styles.filterTextActive,
                  ]}
                >
                  Despesas
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Histórico</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyText}>
              Adicione uma nova movimentação pelo botão central.
            </Text>
          </View>
        }
        contentContainerStyle={styles.content}
      />

      <Modal visible={!!editItem} transparent animationType="fade" onRequestClose={closeEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar transação</Text>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>Descrição</Text>
              <TextInput
                style={globalStyles.input}
                value={editDesc}
                onChangeText={setEditDesc}
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <View style={[globalStyles.inputContainer, { marginBottom: 22 }]}>
              <Text style={globalStyles.inputLabel}>Valor (R$)</Text>
              <TextInput
                style={globalStyles.input}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <TouchableOpacity
              style={[styles.modalButton, saving && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              disabled={saving}
            >
              <Text style={styles.modalButtonText}>
                {saving ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancelButton} onPress={closeEdit}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 130,
  },

  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#8FA6C1",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 22,
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#081421",
    borderRadius: 22,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1A2A42",
  },

  filterButton: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },

  filterTextActive: {
    color: "#081421",
    fontWeight: "900",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },

  emptyCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#223654",
    alignItems: "center",
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
    textAlign: "center",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },

  retryText: {
    color: "#081421",
    fontWeight: "900",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: "#16273D",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#223654",
  },

  modalTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  modalButtonText: {
    color: "#081421",
    fontWeight: "900",
    fontSize: 15,
  },

  modalCancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },

  modalCancelText: {
    color: colors.secondaryText,
    fontWeight: "700",
    fontSize: 14,
  },
});
