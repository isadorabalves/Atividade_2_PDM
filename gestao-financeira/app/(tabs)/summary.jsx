import { useContext, useMemo, useState } from "react";
import {
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
import TransactionItem from "../../components/TransactionItem";
import BarChart from "../../components/BarChart";

const now = new Date();

function fmt(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function pctChange(current, prev) {
  if (prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

function StatCard({ iconName, iconColor, label, value, pct }) {
  const up = pct === null ? null : pct >= 0;
  return (
    <View style={statStyles.card}>
      <View style={[statStyles.iconCircle, { backgroundColor: iconColor + "22" }]}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
      </View>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={statStyles.value}>{fmt(value)}</Text>
      {pct !== null && (
        <View style={statStyles.pctRow}>
          <MaterialIcons
            name={up ? "arrow-upward" : "arrow-downward"}
            size={12}
            color={up ? colors.success : colors.danger}
          />
          <Text style={[statStyles.pct, { color: up ? colors.success : colors.danger }]}>
            {Math.abs(pct).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}

export default function Summary() {
  const { transactions } = useContext(MoneyContext);
  const { user } = useAuth();

  const [filterMonth, setFilterMonth] = useState(now.getMonth());
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [hideBalance, setHideBalance] = useState(false);

  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });
  }, [transactions, filterMonth, filterYear]);

  const prevMonthTransactions = useMemo(() => {
    const prevM = filterMonth === 0 ? 11 : filterMonth - 1;
    const prevY = filterMonth === 0 ? filterYear - 1 : filterYear;
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === prevM && d.getFullYear() === prevY;
    });
  }, [transactions, filterMonth, filterYear]);

  const totals = useMemo(() => {
    let income = 0, expenses = 0;
    for (const t of monthTransactions) {
      const v = Number(t.value);
      if (t.category.isIncome) income += v;
      else expenses += v;
    }
    return { income, expenses, sum: income - expenses };
  }, [monthTransactions]);

  const prevTotals = useMemo(() => {
    let income = 0, expenses = 0;
    for (const t of prevMonthTransactions) {
      const v = Number(t.value);
      if (t.category.isIncome) income += v;
      else expenses += v;
    }
    return { income, expenses, sum: income - expenses };
  }, [prevMonthTransactions]);

  const balanceVariation = pctChange(totals.sum, prevTotals.sum);
  const incomeVariation = pctChange(totals.income, prevTotals.income);
  const expenseVariation = pctChange(totals.expenses, prevTotals.expenses);

  const latestTransactions = monthTransactions.slice(0, 4);

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn}>
            <MaterialIcons name="menu" size={26} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo</Text>
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <TouchableOpacity
            style={styles.balanceLabelRow}
            onPress={() => setHideBalance(h => !h)}
          >
            <Text style={styles.balanceLabel}>Saldo total</Text>
            <MaterialIcons
              name={hideBalance ? "visibility-off" : "visibility"}
              size={16}
              color={colors.secondaryText}
            />
          </TouchableOpacity>

          <Text style={styles.balanceValue}>
            {hideBalance ? "R$ ••••••" : fmt(totals.sum)}
          </Text>

          {balanceVariation !== null && (
            <View style={styles.variationRow}>
              <MaterialIcons
                name={balanceVariation >= 0 ? "arrow-upward" : "arrow-downward"}
                size={14}
                color={balanceVariation >= 0 ? colors.success : colors.danger}
              />
              <Text
                style={[
                  styles.variationText,
                  { color: balanceVariation >= 0 ? colors.success : colors.danger },
                ]}
              >
                {fmt(Math.abs(totals.sum - prevTotals.sum))} ({Math.abs(balanceVariation).toFixed(1)}%) este mês
              </Text>
            </View>
          )}
        </View>

        {/* Month picker */}
        <MonthYearPicker
          month={filterMonth}
          year={filterYear}
          onChange={(m, y) => { setFilterMonth(m); setFilterYear(y); }}
        />

        {/* Stat cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard
            iconName="arrow-upward"
            iconColor={colors.success}
            label="Receitas"
            value={totals.income}
            pct={incomeVariation}
          />
          <StatCard
            iconName="arrow-downward"
            iconColor={colors.danger}
            label="Despesas"
            value={totals.expenses}
            pct={expenseVariation}
          />
          <StatCard
            iconName="account-balance-wallet"
            iconColor={colors.primary}
            label="Saldo"
            value={totals.sum}
            pct={balanceVariation}
          />
        </ScrollView>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Fluxo financeiro</Text>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>Mês</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
            </View>
          </View>

          <BarChart
            transactions={monthTransactions}
            month={filterMonth}
            year={filterYear}
          />

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Receitas</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#0F4C81" }]} />
              <Text style={styles.legendText}>Despesas</Text>
            </View>
          </View>
        </View>

        {/* Latest transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas transações</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/index")}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {latestTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação neste mês.</Text>
          ) : (
            latestTransactions.map(item => (
              <TransactionItem key={item.id} {...item} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: "#16273D",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#223654",
    width: 148,
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  label: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },
  pctRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pct: {
    fontSize: 12,
    fontWeight: "700",
  },
});

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 130,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  /* Balance */
  balanceSection: {
    marginBottom: 22,
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  balanceLabel: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },
  balanceValue: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 6,
  },
  variationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  variationText: {
    fontSize: 13,
    fontWeight: "700",
  },

  /* Stats */
  statsScroll: {
    marginBottom: 20,
  },
  statsContent: {
    paddingRight: 4,
  },

  /* Chart */
  chartCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#223654",
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  chartTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  chartBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#081421",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#223654",
    gap: 2,
  },
  chartBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  chartLegend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },

  /* Transactions */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  transactionsCard: {
    backgroundColor: "#16273D",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: "#223654",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
});
