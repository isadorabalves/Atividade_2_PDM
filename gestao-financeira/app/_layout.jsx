import { Stack } from "expo-router";
import GlobalState from "../contexts/GlobalState";
import AuthProvider from "../contexts/AuthContext";
import { colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalState>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.primary,
            headerTitleAlign: "center",
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="+not-found"
            options={{
              title: "Página não encontrada",
            }}
          />
        </Stack>
      </GlobalState>
    </AuthProvider>
  );
}