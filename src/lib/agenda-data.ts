import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { supabase, supabaseEnabled, type DataAgenda } from "./supabase";

// O painel chama updateTag(AGENDA_TAG) ao criar, editar ou excluir uma data
export const AGENDA_TAG = "agenda";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// Data de hoje no horário de Brasília, no formato AAAA-MM-DD
export function hojeNoBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Shows de hoje em diante. O cache renova de hora em hora, então um show some do site
// no máximo uma hora depois da virada do dia.
export async function getProximosShows(): Promise<{ hoje: string; shows: DataAgenda[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag(AGENDA_TAG);

  const hoje = hojeNoBrasil();
  if (!supabaseEnabled || !supabase) return { hoje, shows: [] };

  const { data, error } = await supabase
    .from("agenda")
    .select("*")
    .gte("data", hoje)
    .order("data", { ascending: true })
    .order("horario", { ascending: true, nullsFirst: true })
    .limit(8);

  if (error || !data) return { hoje, shows: [] };
  return { hoje, shows: data as DataAgenda[] };
}

export function partesDaData(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  return { dia: String(dia).padStart(2, "0"), mes: MESES[mes - 1], semana: DIAS_SEMANA[semana], ano };
}

// "22:00:00" → "22h"; "21:30:00" → "21h30"
export function formatarHorario(horario: string | null) {
  if (!horario) return null;
  const [h, m] = horario.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}
