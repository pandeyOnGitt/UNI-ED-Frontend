import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, GraduationCap, UserSquare2, ClipboardCheck,
  CalendarDays, BookOpen, FileText, Wallet, Bus, Library, Megaphone,
  MessageSquare, Settings, ShieldCheck, Receipt, ChevronDown, Sparkles,
  Bed, CalendarCheck2, BarChart3, FileStack,
} from "lucide-react";

type Item = { label: string; icon: React.ComponentType<{ className?: string }>; to: string; badge?: string };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  { label: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Student Portal", icon: Sparkles, to: "/portal" },
    { label: "Analytics", icon: BarChart3, to: "/analytics" },
    { label: "Calendar", icon: CalendarDays, to: "/calendar" },
  ]},
  { label: "People", items: [
    { label: "Students", icon: GraduationCap, to: "/students", badge: "2,481" },
    { label: "Teachers", icon: Users, to: "/teachers" },
    { label: "Parents", icon: UserSquare2, to: "/parents" },
    { label: "Admissions", icon: Sparkles, to: "/admissions", badge: "12" },
  ]},
  { label: "Academics", items: [
    { label: "Classes", icon: BookOpen, to: "/classes" },
    { label: "Timetable", icon: CalendarCheck2, to: "/timetable" },
    { label: "Attendance", icon: ClipboardCheck, to: "/attendance" },
    { label: "Assignments", icon: FileText, to: "/assignments" },
    { label: "Examinations", icon: FileStack, to: "/examinations" },
  ]},
  { label: "Operations", items: [
    { label: "Fees", icon: Wallet, to: "/fees", badge: "₹4.2L" },
    { label: "Transport", icon: Bus, to: "/transport" },
    { label: "Library", icon: Library, to: "/library" },
    { label: "Hostel", icon: Bed, to: "/hostel" },
    { label: "Payroll", icon: Receipt, to: "/payroll" },
  ]},
  { label: "Communication", items: [
    { label: "Announcements", icon: Megaphone, to: "/announcements" },
    { label: "Messages", icon: MessageSquare, to: "/messages", badge: "3" },
  ]},
  { label: "System", items: [
    { label: "Roles & Permissions", icon: ShieldCheck, to: "/roles" },
    { label: "Settings", icon: Settings, to: "/settings" },
  ]},
];

export function Sidebar() {
  const [openSchool, setOpenSchool] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border bg-[oklch(0.13_0.012_265)]">
      <div className="px-3 pt-4 pb-3 border-b border-border">
        <button
          onClick={() => setOpenSchool((v) => !v)}
          className="group w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-surface-2 transition-colors"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-[oklch(0.5_0.2_295)] text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_0.15)_inset]">
            <span className="text-[13px] font-semibold">S</span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-[13px] font-semibold text-foreground">Scholaris Academy</div>
            <div className="truncate text-[11px] text-muted-foreground">AY 2025–26 · Primary</div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSchool ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            <div className="px-2 pb-1.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground/70">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
                return (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      className={[
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                        active
                          ? "bg-surface-2 text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60",
                      ].join(" ")}
                    >
                      <it.icon className={`h-[15px] w-[15px] shrink-0 ${active ? "text-primary" : ""}`} />
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.badge && (
                        <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground ring-1 ring-border">
                          {it.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <Link to="/settings" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-surface-2 transition-colors">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[oklch(0.28_0.02_278)] text-[12px] font-semibold text-foreground ring-1 ring-border">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium text-foreground">Aditya Raman</div>
            <div className="truncate text-[11px] text-muted-foreground">Principal</div>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
        </Link>
      </div>
    </aside>
  );
}
