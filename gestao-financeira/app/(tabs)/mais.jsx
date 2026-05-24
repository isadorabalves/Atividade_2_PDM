import { useContext, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { MoneyContext } from "../../contexts/GlobalState";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";
import MonthYearPicker from "../../components/MonthYearPicker";
import CategoryDonutChart from "../../components/CategoryDonutChart";

const now = new Date();

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Mais() {
  const { transactions } = useContext(MoneyContext);
  const { logout } = useAuth();

  const [filterMonth, setFilterMonth] = useState(now.getMonth());
  const [filterYear, setFilterYear] = useState(now.getFullYear());

  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });
  }, [transactions, filterMonth, filterYear]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    for (const t of monthTransactions) {
      if (t.category.isIncome) continue;
      const key = t.categoryId;
      if (!map[key]) map[key] = { category: t.category, total: 0 };
      map[key].total += Number(t.value);
    }
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [monthTransactions]);

  const totalExpenses = categoryBreakdown.reduce((s, c) => s + c.total, 0);

  const segments = categoryBreakdown.map(c => ({
    color: c.category.background,
    value: c.total,
  }));

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => { logout(); router.replace("/login"); },
      },
    ]);
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Relatórios</Text>
          <Text style={styles.subtitle}>Visão geral</Text>
        </View>

        <MonthYearPicker
          month={filterMonth}
          year={filterYear}
          onChange={(m, y) => { setFilterMonth(m); setFilterYear(y); }}
        />

        {/* Donut */}
        <View style={styles.chartCard}>
          <CategoryDonutChart segments={segments} />
          <View style={styles.chartCenter}>
            <Text style={styles.chartCenterValue}>{fmt(totalExpenses)}</Text>
            <Text style={styles.chartCenterLabel}>Total de despesas</Text>
          </View>
        </View>

        {/* Legend */}
        {categoryBreakdown.length > 0 ? (
          <View style={styles.legendCard}>
            {categoryBreakdown.map((c, i) => {
              const pct = totalExpenses > 0 ? ((c.total / totalExpenses) * 100).toFixed(0) : 0;
              return (
                <View key={c.category.id}>
                  <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: c.category.background }]} />
                    <Text style={styles.legendName} numberOfLines={1}>{c.category.displayName}</Text>
                    <Text style={styles.legendPct}>{pct}%</Text>
                    <Text style={styles.legendValue}>{fmt(c.total)}</Text>
                  </View>
                  {i < categoryBreakdown.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhuma despesa neste mês.</Text>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/categories")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "rgba(212,175,55,0.15)" }]}>
              <MaterialIcons name="category" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Gerenciar categorias</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <View style={[styles.actionIcon, { backgroundColor: "rgba(255,107,107,0.15)" }]}>
              <MaterialIcons name="logout" size={22} color={colors.danger} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.danger }]}>Sair da conta</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 130,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 16,
    alignItems: "center",
  },
  chartCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
  },
  chartCenterValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  chartCenterLabel: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  legendCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 20,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 10,
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  legendName: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  legendPct: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
    width: 38,
    textAlign: "right",
  },
  legendValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    width: 90,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#1A2A42",
  },
  emptyCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 20,
    alignItems: "center",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
  },
  actionsSection: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16273D",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#223654",
    gap: 14,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
