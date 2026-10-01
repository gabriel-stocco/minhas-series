import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getSerieById,
  createSerie,
  updateSerie,
} from "../src/database/serieRepository";

export default function FormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;

  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [temporadas, setTemporadas] = useState("");
  const [nota, setNota] = useState<number | null>(null);

  useEffect(() => {
    if (serieId) {
      getSerieById(serieId).then((serie) => {
        if (serie) {
          setTitulo(serie.titulo);
          setPlataforma(serie.plataforma);
          setTemporadas(serie.temporadas.toString());
          setNota(serie.nota);
        }
      });
    }
  }, [serieId]);

  const handleSelectNota = (valor: number) => {
    setNota((prevNota) => (prevNota === valor ? null : valor));
  };

  const handleSave = async () => {
    if (!titulo.trim() || !plataforma.trim()) {
      Alert.alert("Atenção", "Título e plataforma são obrigatórios.");
      return;
    }

    const numTemporadas = Number(temporadas);
    if (isNaN(numTemporadas) || numTemporadas < 0 || temporadas.trim() === "") {
      Alert.alert("Atenção", "Insira um número válido de temporadas.");
      return;
    }

    if (serieId) {
      await updateSerie(serieId, {
        titulo: titulo.trim(),
        plataforma: plataforma.trim(),
        temporadas: numTemporadas,
        nota,
      });
    } else {
      await createSerie({
        titulo: titulo.trim(),
        plataforma: plataforma.trim(),
        temporadas: numTemporadas,
        nota,
      });
    }

    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-slate-900 p-4">
      <View className="mb-4">
        <Text className="text-slate-300 mb-1 font-medium">Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex.: Breaking Bad"
          placeholderTextColor="#64748b"
          className="bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-300 mb-1 font-medium">Plataforma</Text>
        <TextInput
          value={plataforma}
          onChangeText={setPlataforma}
          placeholder="Ex.: Netflix"
          placeholderTextColor="#64748b"
          className="bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-300 mb-1 font-medium">Temporadas</Text>
        <TextInput
          value={temporadas}
          onChangeText={setTemporadas}
          keyboardType="numeric"
          placeholder="Ex.: 5"
          placeholderTextColor="#64748b"
          className="bg-slate-800 text-white p-3 rounded-lg border border-slate-700"
        />
      </View>

      <View className="mb-6">
        <Text className="text-slate-300 mb-2 font-medium">Nota (opcional)</Text>
        <View className="flex-row gap-2">
          {[1, 2, 3, 4, 5].map((valor) => (
            <TouchableOpacity
              key={valor}
              onPress={() => handleSelectNota(valor)}
              className={`flex-1 py-3 rounded-lg items-center border ${
                nota === valor
                  ? "bg-amber-500/20 border-amber-500"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Text
                className={`font-bold ${
                  nota === valor ? "text-amber-400" : "text-slate-400"
                }`}
              >
                ★ {valor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-indigo-600 p-4 rounded-xl items-center mb-8 shadow-lg"
      >
        <Text className="text-white font-bold text-base">
          {serieId ? "Salvar Alterações" : "Cadastrar Série"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
