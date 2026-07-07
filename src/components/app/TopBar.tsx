import { Bell, Command, Inbox, Plus, Search, Sun, Moon, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { schoolBrand } from "@/lib/branding";

const labelMap: Record<string, string> = {
  "": "Dashboard",
  analytics: "Analytics", calendar: "Calendar",
  students: "Students", teachers: "Teachers", parents: "Parents", admissions: "Admissions",
  classes: "Classes", timetable: "Timetable", attendance: "Attendance",
  assignments: "Assignments", examinations: "Examinations",
  fees: "Fees", transport: "Transport", library: "Library", hostel: "Hostel", payroll: "Payroll",
  announcements: "Announcements", messages: "Messages",
  roles: "Roles & Permissions", settings: "Settings",
};

export function TopBar() {
  const [dark, setDark] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const seg = pathname.split("/").filter(Boolean)[0] ?? "";
  const current = labelMap[seg] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-6">
        <div className="hidden md:flex items-center gap-0 text-[13px] text-muted-foreground">
          <img
            src={schoolBrand.logoSrc}
            alt={`${schoolBrand.name} logo`}
            className="h-10 w-10 object-contain"
          />
          <span>{schoolBrand.name}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium">{current}</span>
        </div>

        <div className="ml-auto flex flex-1 max-w-md items-center">
          <label className="group flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search students, invoices, classes…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  toast.info(`Searching for "${e.currentTarget.value.trim()}"`);
                }
              }}
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70 text-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" /> K
            </kbd>
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate({ to: "/admissions" })}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_0.15)_inset,0_1px_2px_0_oklch(0_0_0_/_0.4)] hover:brightness-110 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Quick Create
          </button>
          <IconBtn onClick={() => { setDark((v) => !v); toast(`${dark ? "Light" : "Dark"} mode preview toggled`); }}>
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </IconBtn>
          <IconBtn onClick={() => navigate({ to: "/messages" })}>
            <Inbox className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={() => toast("You have 3 new notifications")}>
            <span className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
            </span>
          </IconBtn>
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
    >
      {children}
    </button>
  );
}
