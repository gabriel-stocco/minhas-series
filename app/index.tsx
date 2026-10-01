import { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Serie, SerieFilter } from "../src/types/series";
import { getSeries } from "../src/database/serieRepository";

export default function Index() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>("todas");

  const carregarSeries = useCallback(async () => {
    const dados = await getSeries(filtro);
    setSeries(dados);
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarSeries();
    }, [carregarSeries]),
  );

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={() => setFiltro("todas")}
          className={`flex-1 py-2 rounded-lg items-center ${
            filtro === "todas" ? "bg-indigo-600" : "bg-slate-800"
          }`}
        >
          <Text className="text-white font-semibold">Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFiltro("assistindo")}
          className={`flex-1 py-2 rounded-lg items-center ${
            filtro === "assistindo" ? "bg-indigo-600" : "bg-slate-800"
          }`}
        >
          <Text className="text-white font-semibold">Assistindo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFiltro("concluidas")}
          className={`flex-1 py-2 rounded-lg items-center ${
            filtro === "concluidas" ? "bg-indigo-600" : "bg-slate-800"
          }`}
        >
          <Text className="text-white font-semibold">Concluídas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/detalhe", params: { id: item.id } })
            }
            className={`p-4 rounded-xl mb-3 border ${
              item.concluida === 1
                ? "bg-slate-800/50 border-emerald-500/40 opacity-80"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-lg font-bold text-white flex-1 mr-2">
                {item.titulo}
              </Text>
              <Text className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                {item.plataforma}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-sm text-slate-400">
                {item.temporadas}{" "}
                {item.temporadas === 1 ? "temporada" : "temporadas"}
              </Text>
              <Text className="text-sm font-medium text-amber-400">
                {item.nota !== null ? `⭐ ${item.nota}/5` : "Sem nota"}
              </Text>
            </View>

            {item.concluida === 1 && (
              <View className="mt-2 self-start">
                <Text className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  ✓ Concluída
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-slate-400 text-base">
              Nenhuma série encontrada.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => router.push("/form")}
        className="bg-indigo-600 p-4 rounded-xl items-center mt-2 shadow-lg"
      >
        <Text className="text-white font-bold text-base">+ Nova série</Text>
      </TouchableOpacity>
    </View>
  );
}
