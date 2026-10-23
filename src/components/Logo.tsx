import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo-mark.png";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src={logo}
        alt=""
        width={size}
        height={size}
        className="rounded-full border border-gold-dim object-cover shadow-[0_0_14px_rgb(214_63_184/0.35)]"
        priority
      />
      <span className="font-display text-2xl leading-none text-foreground">
        THE CROWN <span className="text-gold">LP</span>
      </span>
    </Link>
  );
}
