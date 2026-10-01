import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { runMigrations } from "../src/database/database";

export default function RootLayout() {
  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#0f172a" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "🎬 Minhas Séries" }} />
      <Stack.Screen name="detalhe" options={{ title: "Detalhes" }} />
      <Stack.Screen name="form" options={{ title: "Série" }} />
    </Stack>
  );
}
