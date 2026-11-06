import NavLink from "@/components/NavLink";

export default function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NavLink
      href={href}
      className="flex items-center whitespace-nowrap border-b-2 py-3 transition-colors hover:text-foreground"
      activeClassName="border-accent text-foreground"
      inactiveClassName="border-transparent"
    >
      {children}
    </NavLink>
  );
}
