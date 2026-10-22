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
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
  );
}
