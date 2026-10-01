import { getDatabase } from "./database";
import {
  Serie,
  CreateSerieInput,
  UpdateSerieInput,
  SerieFilter,
} from "../types/series";

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = getDatabase();

  if (filtro === "assistindo") {
    return await db.getAllAsync<Serie>(
      "SELECT * FROM series WHERE concluida = 0 ORDER BY createdAt DESC, id DESC",
    );
  }

  if (filtro === "concluidas") {
    return await db.getAllAsync<Serie>(
      "SELECT * FROM series WHERE concluida = 1 ORDER BY createdAt DESC, id DESC",
    );
  }

  return await db.getAllAsync<Serie>(
    "SELECT * FROM series ORDER BY createdAt DESC, id DESC",
  );
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Serie>(
    "SELECT * FROM series WHERE id = ?",
    [id],
  );
  return result ?? null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = getDatabase();
  const createdAt = new Date().toISOString();
  const nota = input.nota ?? null;

  const result = await db.runAsync(
    "INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, 0, ?)",
    [input.titulo, input.plataforma, input.temporadas, nota, createdAt],
  );

  const newSerie = await getSerieById(result.lastInsertRowId);

  if (!newSerie) {
    throw new Error("Erro ao buscar série recém-criada");
  }

  return newSerie;
}

export async function updateSerie(
  id: number,
  input: UpdateSerieInput,
): Promise<void> {
  const db = getDatabase();
  const currentSerie = await getSerieById(id);

  if (!currentSerie) {
    return;
  }

  const titulo = input.titulo ?? currentSerie.titulo;
  const plataforma = input.plataforma ?? currentSerie.plataforma;
  const temporadas = input.temporadas ?? currentSerie.temporadas;
  const nota = input.nota !== undefined ? input.nota : currentSerie.nota;
  const concluida =
    input.concluida !== undefined ? input.concluida : currentSerie.concluida;

  await db.runAsync(
    "UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ?, concluida = ? WHERE id = ?",
    [titulo, plataforma, temporadas, nota, concluida, id],
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    "UPDATE series SET concluida = CASE WHEN concluida = 1 THEN 0 ELSE 1 END WHERE id = ?",
    [id],
  );
}

export async function deleteSerie(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync("DELETE FROM series WHERE id = ?", [id]);
}
