const introVideoUrl =
  process.env.NEXT_PUBLIC_INTRO_VIDEO_URL ??
  (process.env.NODE_ENV !== "production" ? "/videos/intro-video.mp4" : undefined);

export default function IntroVideoSection() {
  if (!introVideoUrl) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold">O vídeo de abertura do nosso show</h2>
      <p className="mt-3 max-w-2xl text-muted">
        É assim que a The Crown LP sobe ao palco. Dá o play e sente a energia.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        <video
          className="aspect-video w-full"
          src={introVideoUrl}
          poster="/images/hero-poster.jpg"
          controls
          preload="none"
        />
      </div>
    </section>
  );
}
