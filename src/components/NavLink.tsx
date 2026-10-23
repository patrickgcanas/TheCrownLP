"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type Props = {
  href: string;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
  onClick?: () => void;
  children: React.ReactNode;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function ActiveLink({ href, className, activeClassName, inactiveClassName, onClick, children }: Props) {
  const ativo = isActive(usePathname(), href);
  return (
    <Link href={href} onClick={onClick} className={`${className} ${ativo ? activeClassName : inactiveClassName}`}>
      {children}
    </Link>
  );
}

// O destaque da página atual depende da URL, então fica atrás de um Suspense
// para não travar o pré-render de rotas dinâmicas (ex.: /midia/[id])
export default function NavLink(props: Props) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} onClick={props.onClick} className={`${props.className} ${props.inactiveClassName}`}>
          {props.children}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
