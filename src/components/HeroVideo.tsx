const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/videos/hero-loop.mp4";

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="h-full w-full object-cover"
        src={heroVideoUrl}
        poster="/images/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Escurece o lado do texto e deixa o redemoinho aparecer à direita */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--background)_5%,rgb(18_10_20/0.7)_60%,rgb(18_10_20/0.4)_100%)] md:bg-[linear-gradient(90deg,rgb(18_10_20/0.96)_0%,rgb(18_10_20/0.78)_45%,rgb(18_10_20/0.4)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
