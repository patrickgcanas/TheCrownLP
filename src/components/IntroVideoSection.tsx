const introVideoUrl =
  process.env.NEXT_PUBLIC_INTRO_VIDEO_URL ??
  (process.env.NODE_ENV !== "production" ? "/videos/intro-video.mp4" : undefined);

export default function IntroVideoSection() {
  if (!introVideoUrl) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Abertura do show</p>
      <h2 className="font-display mt-3 text-5xl leading-none">
        É ASSIM QUE A GENTE <span className="text-accent">SOBE AO PALCO</span>
      </h2>
      <p className="mt-3 max-w-2xl text-muted">Dá o play e sente a energia.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_0_60px_rgb(214_63_184/0.15)]">
        <video
          className="aspect-video w-full"
          src={introVideoUrl}
          poster="/images/intro-poster.jpg"
          controls
          preload="none"
        />
      </div>
    </section>
  );
}
