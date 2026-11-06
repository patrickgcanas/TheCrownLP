import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "História — The Crown LP",
  description: "A história da banda The Crown LP, tributo a Linkin Park, e os músicos que sobem ao palco.",
};

const integrantes = [
  {
    nome: "Giu Malizia",
    personagem: "Nossa Emily",
    instrumento: "Vocal",
    texto:
      "Vocalista profissional com 12 anos de estrada nos melhores palcos. Entrega tudo na performance, com uma presença de palco absurda e um carisma que literalmente pega fogo 🔥",
  },
  {
    nome: "Cesar Fukuda",
    personagem: "Nosso Dave",
    instrumento: "Baixo",
    texto:
      "O mestre dos grooves e do passinho. Já viu slap em Linkin Park? Então nos veja ao vivo. Resumindo: o cara tem O MOLHO.",
  },
  {
    nome: "Pedro Martinez",
    personagem: "Nosso Brad",
    instrumento: "Guitarra",
    texto:
      "Com a guitarra na mão há quase 20 anos, realizando aquele sonho de adolescente em cada show (e metendo solo transcendental até onde não existe).",
  },
  {
    nome: "Victor Fernandez",
    personagem: "Nosso Mike",
    instrumento: "Vocal e rap",
    texto:
      "O cara é tão brabo que até o próprio Mike ficaria impressionado assistindo, e ainda faz umas partes do Chester pra tirar onda.",
  },
  {
    nome: "Patrick Cañas",
    personagem: "Nosso Colin",
    instrumento: "Bateria",
    texto:
      "Ele não tá nem aí, arrebenta a bateria sem dó. Daqui a pouco ela vai ter que reivindicar os direitos dela e pedir aposentadoria por insalubridade.",
  },
];

export default function HistoriaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Nossa história" title="QUEM É A" highlight="THE CROWN LP" />

      <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-muted">
        <p>
          A The Crown LP é o resultado puro da nossa paixão pelo Linkin Park. O
          que começou apenas como um encontro entre amigos para tocar nossas
          músicas favoritas acabou se transformando em um projeto sério.
          Criamos esse tributo para levar a verdadeira intensidade da banda aos
          palcos brasileiros.
        </p>
        <p>
          Nosso setlist é uma viagem pelos maiores sucessos do grupo, passando
          pelos clássicos do <em className="text-foreground">Hybrid Theory</em> e
          do <em className="text-foreground">Meteora</em>. Fazemos questão de tocar
          tudo com muita fidelidade e com o mesmo peso das gravações originais,
          mas sem perder nossa própria essência pra deixar nossa marca.
        </p>
        <p>
          Depois de passar por vários bares, eventos privados e casas de show,
          estamos prontos para voar mais alto. Nosso objetivo agora é levar esse
          espetáculo para festivais, eventos corporativos e palcos públicos,
          expandindo cada vez mais essa homenagem.
        </p>
      </div>

      <section className="mt-20">
        <p className="eyebrow">A banda</p>
        <h2 className="font-display mt-3 text-3xl leading-none sm:text-5xl">
          QUEM SOBE AO <span className="text-accent">PALCO</span>
        </h2>
        <p className="mt-4 max-w-3xl text-muted">
          Formada no começo de 2026, a banda passou por duas formações até
          encontrar a sua seleção. Hoje, a The Crown LP conta com 5 amigos:
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {integrantes.map((m, i) => (
            <li key={m.nome}>
              <Reveal
                delay={(i % 2) * 120}
                className="h-full rounded-2xl border border-border border-l-4 border-l-gold bg-surface p-6"
              >
                <p className="eyebrow">{m.instrumento}</p>
                <h3 className="font-display mt-2 text-2xl leading-tight">{m.nome}</h3>
                <p className="mt-0.5 text-sm font-semibold uppercase tracking-[0.1em] text-accent">{m.personagem}</p>
                <p className="mt-4 leading-relaxed text-muted">{m.texto}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
