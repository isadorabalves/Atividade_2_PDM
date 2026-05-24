import { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { MoneyContext } from "../../contexts/GlobalState";
import CategoryItem from "../../components/CategoryItem";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

const PALETTE = [
  "#DE9AC3",
  "#DEA17B",
  "#E6E088",
  "#AB8FBE",
  "#82C9DE",
  "#FF6B6B",
  "#4CAF50",
  "#D4AF37",
  "#0F4C81",
  "#94A3B8",
  "#FFB6B6",
  "#B6FFB6",
  "#B6D4FF",
  "#FFD9B6",
  "#D9B6FF",
];

const ICONS = [
  "restaurant",
  "shopping-bag",
  "directions-car",
  "flight",
  "favorite",
  "school",
  "sports-esports",
  "home",
  "work",
  "pets",
  "fitness-center",
  "attach-money",
];

const emptyForm = {
  displayName: "",
  icon: "favorite",
  background: PALETTE[0],
  isIncome: false,
};

function generateTechnicalName(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function Categories() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (form.displayName.trim().length < 2) {
      Alert.alert("Atenção", "Preencha o nome da categoria.");
      return;
    }

    const technicalName = generateTechnicalName(form.displayName);

    setSaving(true);

    try {
      await addCategory({
        name: technicalName,
        displayName: form.displayName.trim(),
        icon: form.icon,
        background: form.background,
        isIncome: form.isIncome,
      });

      setForm(emptyForm);
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat) => {
    Alert.alert("Excluir categoria", `Deseja excluir "${cat.displayName}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await removeCategory(cat.id);
          } catch (e) {
            Alert.alert("Erro", e.message ?? "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Categorias</Text>
            <Text style={styles.subtitle}>
              Gerencie suas categorias financeiras
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Nova categoria</Text>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>Nome da categoria</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="ex: Saúde da Família"
                  placeholderTextColor={colors.secondaryText}
                  value={form.displayName}
                  onChangeText={(v) =>
                    setForm({ ...form, displayName: v })
                  }
                />
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>Ícone</Text>

                <View style={styles.iconGrid}>
                  {ICONS.map((iconName) => (
                    <TouchableOpacity
                      key={iconName}
                      style={[
                        styles.iconButton,
                        form.icon === iconName && styles.iconButtonSelected,
                      ]}
                      onPress={() => setForm({ ...form, icon: iconName })}
                    >
                      <MaterialIcons
                        name={iconName}
                        size={24}
                        color={
                          form.icon === iconName ? "#081421" : colors.text
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>Cor</Text>

                <View style={styles.palette}>
                  {PALETTE.map((cor) => (
                    <TouchableOpacity
                      key={cor}
                      style={[
                        styles.colorDot,
                        { backgroundColor: cor },
                        form.background === cor && styles.colorDotSelected,
                      ]}
                      onPress={() => setForm({ ...form, background: cor })}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.incomeToggleRow}>
                <Text style={globalStyles.inputLabel}>Tipo</Text>

                <View style={styles.toggleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      !form.isIncome && styles.toggleBtnActive,
                    ]}
                    onPress={() => setForm({ ...form, isIncome: false })}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        !form.isIncome && styles.toggleTextActive,
                      ]}
                    >
                      Despesa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      form.isIncome && styles.toggleBtnActive,
                    ]}
                    onPress={() => setForm({ ...form, isIncome: true })}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        form.isIncome && styles.toggleTextActive,
                      ]}
                    >
                      Receita
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  saving && styles.createButtonDisabled,
                ]}
                onPress={handleCreate}
                disabled={saving}
              >
                <Text style={styles.createButtonText}>
                  {saving ? "Criando..." : "Criar categoria"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Suas categorias</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            <CategoryItem category={item} />

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.displayName}</Text>

              <View style={styles.badges}>
                <View
                  style={[
                    styles.badge,
                    item.isDefault
                      ? styles.badgeDefault
                      : styles.badgeCustom,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.isDefault ? "padrão" : "personalizada"}
                  </Text>
                </View>

                {item.isIncome && (
                  <View style={styles.badgeIncome}>
                    <Text style={styles.badgeText}>receita</Text>
                  </View>
                )}
              </View>
            </View>

            {!item.isDefault && (
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.deleteBtn}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color={colors.danger}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
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

  card: {
    backgroundColor: "#16273D",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 28,
  },

  cardTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 18,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },

  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#081421",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#223654",
  },

  iconButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },

  incomeToggleRow: {
    marginBottom: 18,
  },

  toggleButtons: {
    flexDirection: "row",
    backgroundColor: "#081421",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#1A2A42",
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  toggleBtnActive: {
    backgroundColor: colors.primary,
  },

  toggleText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },

  toggleTextActive: {
    color: "#081421",
    fontWeight: "900",
  },

  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },

  createButtonDisabled: {
    opacity: 0.6,
  },

  createButtonText: {
    color: "#081421",
    fontWeight: "900",
    fontSize: 15,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16273D",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#223654",
  },

  categoryInfo: {
    flex: 1,
    marginLeft: 14,
  },

  categoryName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  badges: {
    flexDirection: "row",
    gap: 6,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  badgeDefault: {
    backgroundColor: "#223654",
  },

  badgeCustom: {
    backgroundColor: "#1A3320",
  },

  badgeIncome: {
    backgroundColor: "#1A3320",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  badgeText: {
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: "700",
  },

  deleteBtn: {
    padding: 6,
  },
});