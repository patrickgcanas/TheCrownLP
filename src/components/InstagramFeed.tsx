import Reveal from "@/components/Reveal";
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, getPostsInstagram } from "@/lib/instagram";

// Últimas postagens do Instagram da banda. Sem feed configurado ou sem posts, não mostra nada.
export default async function InstagramFeed() {
  const posts = await getPostsInstagram();
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Instagram</p>
          <h2 className="font-display mt-3 text-4xl leading-none sm:text-5xl">
            SIGA <span className="text-accent normal-case">@{INSTAGRAM_USUARIO}</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted">Bastidores, trechos dos shows e as próximas datas.</p>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-ghost">
          Seguir no Instagram
        </a>
      </Reveal>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.id}>
            <Reveal delay={i * 90}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl border border-border bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imagem}
                  alt={post.legenda ? post.legenda.slice(0, 120) : "Post da The Crown LP no Instagram"}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {post.video && (
                  <span className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-gold">
                    ▶ Vídeo
                  </span>
                )}
                {post.legenda && (
                  <span className="absolute inset-0 flex items-end bg-gradient-to-t from-background/95 via-background/40 to-transparent p-3 text-xs leading-snug text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="line-clamp-3">{post.legenda}</span>
                  </span>
                )}
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
