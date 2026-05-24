import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";

const STORAGE_KEY = "@metas_v1";

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function GoalCard({ goal, onLongPress }) {
  const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
  return (
    <TouchableOpacity
      style={styles.goalCard}
      onLongPress={() => onLongPress(goal)}
      activeOpacity={0.85}
    >
      <View style={styles.goalHeader}>
        <Text style={styles.goalName}>{goal.name}</Text>
        <Text style={styles.goalPct}>{pct.toFixed(0)}%</Text>
      </View>
      <Text style={styles.goalAmounts}>
        {fmt(goal.current)} / {fmt(goal.target)}
      </Text>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

export default function Planejamento() {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm] = useState({ name: "", target: "", current: "" });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setGoals(JSON.parse(raw));
    });
  }, []);

  async function save(updated) {
    setGoals(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function openAdd() {
    setEditGoal(null);
    setForm({ name: "", target: "", current: "0" });
    setModalVisible(true);
  }

  function openEdit(goal) {
    setEditGoal(goal);
    setForm({
      name: goal.name,
      target: String(goal.target),
      current: String(goal.current),
    });
    setModalVisible(true);
  }

  function handleLongPress(goal) {
    Alert.alert(goal.name, "O que deseja fazer?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Editar progresso", onPress: () => openEdit(goal) },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => save(goals.filter(g => g.id !== goal.id)),
      },
    ]);
  }

  async function handleSave() {
    const name = form.name.trim();
    const target = parseFloat(form.target.replace(",", "."));
    const current = parseFloat(form.current.replace(",", ".") || "0");

    if (!name || isNaN(target) || target <= 0) {
      Alert.alert("Atenção", "Preencha nome e valor da meta.");
      return;
    }

    if (editGoal) {
      await save(
        goals.map(g =>
          g.id === editGoal.id ? { ...g, name, target, current: isNaN(current) ? 0 : current } : g
        )
      );
    } else {
      await save([
        ...goals,
        { id: Date.now().toString(), name, target, current: isNaN(current) ? 0 : current },
      ]);
    }
    setModalVisible(false);
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Planejamento</Text>
            <Text style={styles.subtitle}>Acompanhe suas metas financeiras</Text>
          </View>
        }
        renderItem={({ item }) => (
          <GoalCard goal={item} onLongPress={handleLongPress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialIcons name="flag" size={36} color={colors.primary} />
            <Text style={styles.emptyTitle}>Nenhuma meta ainda</Text>
            <Text style={styles.emptyText}>
              Toque em "+ Nova meta" para começar.
            </Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <MaterialIcons name="add" size={20} color={colors.primary} />
            <Text style={styles.addBtnText}>Nova meta</Text>
          </TouchableOpacity>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editGoal ? "Editar meta" : "Nova meta"}
            </Text>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>Nome da meta</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="ex: Reserva de Emergência"
                placeholderTextColor={colors.secondaryText}
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
              />
            </View>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>Valor alvo (R$)</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="15000"
                placeholderTextColor={colors.secondaryText}
                value={form.target}
                onChangeText={v => setForm(f => ({ ...f, target: v }))}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[globalStyles.inputContainer, { marginBottom: 22 }]}>
              <Text style={globalStyles.inputLabel}>Valor atual (R$)</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="0"
                placeholderTextColor={colors.secondaryText}
                value={form.current}
                onChangeText={v => setForm(f => ({ ...f, current: v }))}
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: "#16273D",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 14,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  goalName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  goalPct: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  goalAmounts: {
    color: colors.secondaryText,
    fontSize: 13,
    marginBottom: 12,
  },
  progressBg: {
    height: 6,
    backgroundColor: "#0F1E32",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#0F4C81",
    borderRadius: 3,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
    textAlign: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    marginTop: 8,
  },
  addBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
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
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnText: {
    color: "#081421",
    fontWeight: "900",
    fontSize: 15,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.secondaryText,
    fontWeight: "700",
    fontSize: 14,
  },
});
