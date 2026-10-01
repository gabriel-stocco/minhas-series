import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Serie } from "../src/types/series";
import {
  getSerieById,
  toggleSerieConcluida,
  deleteSerie,
} from "../src/database/serieRepository";

export default function DetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;

  const [serie, setSerie] = useState<Serie | null>(null);

  const carregarSerie = async () => {
    if (serieId) {
      const dados = await getSerieById(serieId);
      setSerie(dados);
    }
  };

  useEffect(() => {
    carregarSerie();
  }, [serieId]);

  const handleToggleConcluida = async () => {
    if (serieId) {
      await toggleSerieConcluida(serieId);
      await carregarSerie();
    }
  };

  const handleEdit = () => {
    if (serieId) {
      router.push({ pathname: "/form", params: { id: serieId } });
    }
  };

  const handleDelete = () => {
    if (!serieId) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta série?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteSerie(serieId);
            router.back();
          },
        },
      ],
    );
  };

  if (!serie) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center p-4">
        <Text className="text-slate-400">Série não encontrada.</Text>
      </View>
    );
  }

  const dataFormatada = new Date(serie.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <ScrollView className="flex-1 bg-slate-900 p-4">
      <View className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-6">
        <View className="flex-row justify-between items-start mb-3">
          <Text className="text-2xl font-bold text-white flex-1 mr-2">
            {serie.titulo}
          </Text>
          <Text className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 font-medium">
            {serie.plataforma}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-1">
            {serie.temporadas}{" "}
            {serie.temporadas === 1
              ? "temporada assistida"
              : "temporadas assistidas"}
          </Text>
          <Text className="text-amber-400 font-medium text-base">
            {serie.nota !== null ? `⭐ Nota: ${serie.nota}/5` : "Sem nota"}
          </Text>
        </View>

        <View className="pt-3 border-t border-slate-700/60 flex-row justify-between items-center">
          <Text className="text-xs text-slate-500">
            Cadastrada em {dataFormatada}
          </Text>
          <Text
            className={`text-xs font-semibold px-2.5 py-1 rounded ${
              serie.concluida === 1
                ? "text-emerald-400 bg-emerald-950/60"
                : "text-amber-400 bg-amber-950/60"
            }`}
          >
            {serie.concluida === 1 ? "Concluída" : "Assistindo"}
          </Text>
        </View>
      </View>

      <View className="gap-3 mb-8">
        <TouchableOpacity
          onPress={handleToggleConcluida}
          className={`p-4 rounded-xl items-center ${
            serie.concluida === 1
              ? "bg-slate-800 border border-slate-700"
              : "bg-emerald-600"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {serie.concluida === 1
              ? "Marcar como Em Andamento"
              : "Marcar como Concluída"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEdit}
          className="bg-indigo-600 p-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Editar Série</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="bg-rose-900/40 border border-rose-700/60 p-4 rounded-xl items-center"
        >
          <Text className="text-rose-400 font-bold text-base">
            Excluir Série
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
