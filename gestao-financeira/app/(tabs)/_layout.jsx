import { Tabs, Redirect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import { colors } from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,
          height: 72,
          backgroundColor: "#081421",
          borderRadius: 28,
          borderTopWidth: 1,
          borderColor: "#1A2A42",
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#7C8CA5",

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 3,
        },
      }}
    >
      {/* Início */}
      <Tabs.Screen
        name="summary"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home-filled" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />

      {/* Transações */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="receipt-long" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />

      {/* Botão central + */}
      <Tabs.Screen
        name="add-transactions"
        options={{
          title: "",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.9}
              style={styles.addButtonContainer}
            >
              <View style={styles.addButton}>
                <MaterialIcons name="add" size={34} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Planejamento */}
      <Tabs.Screen
        name="planejamento"
        options={{
          title: "Planejamento",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="event-note" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />

      {/* Mais (Relatórios) */}
      <Tabs.Screen
        name="mais"
        options={{
          title: "Mais",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="apps" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />

      {/* Telas acessíveis mas não no tab bar */}
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="home-template" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -28,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
    borderWidth: 4,
    borderColor: "#081421",
  },
});
