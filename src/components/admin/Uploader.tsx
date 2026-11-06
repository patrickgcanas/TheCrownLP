"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { registrarArquivo } from "@/lib/admin-actions";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const LADO_MAXIMO = 2000; // px no lado maior: nítido em tela cheia e ~300-500 KB por foto
const VIDEO_MAX_MB = 50; // limite de upload do plano gratuito do Supabase
const ENVIOS_SIMULTANEOS = 3;

type Envio = { id: string; nome: string; status: "fila" | "enviando" | "ok" | "erro"; erro?: string };

async function reduzirFoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("falha ao converter"))), "image/jpeg", 0.85),
  );
}

export default function Uploader({ showId }: { showId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [arrastando, setArrastando] = useState(false);

  const atualizar = (id: string, patch: Partial<Envio>) =>
    setEnvios((lista) => lista.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  async function enviarUm(file: File, envio: Envio) {
    const supabase = createBrowserSupabase();
    atualizar(envio.id, { status: "enviando" });

    try {
      const ehVideo = file.type.startsWith("video/");
      let corpo: Blob = file;
      let extensao = "jpg";

      if (ehVideo) {
        if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
          throw new Error(`Vídeo maior que ${VIDEO_MAX_MB} MB. Poste no Instagram e adicione pelo link.`);
        }
        extensao = file.name.split(".").pop()?.toLowerCase() || "mp4";
      } else {
        try {
          corpo = await reduzirFoto(file);
        } catch {
          throw new Error("Formato não suportado (ex.: HEIC do iPhone). Envie em JPG.");
        }
      }

      const caminho = `shows/${showId}/${crypto.randomUUID()}.${extensao}`;
      const { error } = await supabase.storage.from("midia").upload(caminho, corpo, {
        contentType: ehVideo ? file.type : "image/jpeg",
        cacheControl: "31536000",
      });
      if (error) throw new Error("Falha no envio. Verifique a conexão e tente de novo.");

      const { data } = supabase.storage.from("midia").getPublicUrl(caminho);
      const res = await registrarArquivo({
        showId,
        tipo: ehVideo ? "video" : "imagem",
        url: data.publicUrl,
        storagePath: caminho,
      });
      if (!res.ok) throw new Error("O arquivo subiu, mas não foi possível salvar no álbum.");

      atualizar(envio.id, { status: "ok" });
    } catch (e) {
      atualizar(envio.id, { status: "erro", erro: e instanceof Error ? e.message : "Erro inesperado." });
    }
  }

  async function enviar(files: FileList | File[]) {
    const validos = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (validos.length === 0) return;

    const novos = validos.map((f) => ({ id: crypto.randomUUID(), nome: f.name, status: "fila" as const }));
    setEnvios((lista) => [...novos, ...lista]);

    let proximo = 0;
    const trabalhador = async () => {
      while (proximo < validos.length) {
        const i = proximo++;
        await enviarUm(validos[i], novos[i]);
      }
    };
    await Promise.all(Array.from({ length: Math.min(ENVIOS_SIMULTANEOS, validos.length) }, trabalhador));
    router.refresh();
  }

  const concluidos = envios.filter((e) => e.status === "ok").length;
  const comErro = envios.filter((e) => e.status === "erro");
  const emAndamento = envios.some((e) => e.status === "fila" || e.status === "enviando");

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          enviar(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          arrastando ? "border-accent bg-accent/10" : "border-border hover:border-gold-dim"
        }`}
      >
        <p className="font-display text-3xl">
          ARRASTE FOTOS E VÍDEOS <span className="text-accent">AQUI</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          ou toque para escolher. Várias de uma vez. Fotos são otimizadas automaticamente; vídeos até {VIDEO_MAX_MB} MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) enviar(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {envios.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm">
          <p className="font-semibold">
            {emAndamento ? "Enviando…" : "Envio concluído"} — {concluidos} de {envios.length}
            {comErro.length > 0 && <span className="text-accent"> · {comErro.length} com erro</span>}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold transition-all"
              style={{ width: `${((concluidos + comErro.length) / envios.length) * 100}%` }}
            />
          </div>
          {comErro.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-muted">
              {comErro.map((e) => (
                <li key={e.id}>
                  <span className="text-foreground">{e.nome}</span>: {e.erro}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
