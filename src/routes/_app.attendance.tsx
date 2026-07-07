import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, Avatar, Badge, Kpi } from "@/components/app/ui";
import { students, GRADES, SECTIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Save } from "lucide-react";

export const Route = createFileRoute("/_app/attendance")({ component: AttendancePage });

type Mark = "present" | "absent" | "late";

function AttendancePage() {
  const [grade, setGrade] = useState("Grade 6");
  const [section, setSection] = useState("A");
  const [search, setSearch] = useState("");
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  const roster = useMemo(() => students.slice(0, 24), []);
  const filtered = roster.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  function setMark(id: string, m: Mark) {
    setMarks((prev) => ({ ...prev, [id]: m }));
  }
  function markAll(m: Mark) {
    const next: Record<string, Mark> = {};
    roster.forEach((s) => (next[s.id] = m));
    setMarks(next);
  }
  const present = Object.values(marks).filter((v) => v === "present").length;
  const absent = Object.values(marks).filter((v) => v === "absent").length;
  const late = Object.values(marks).filter((v) => v === "late").length;

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Academics"
        title="Attendance"
        subtitle="Mark daily attendance per class. Auto-saved."
        actions={<Button size="sm" onClick={() => toast.success("Attendance submitted for the day")}><Save /> Submit day</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Present" value={present.toString()} tone="success" hint={`${Math.round(present/roster.length*100)||0}%`} />
        <Kpi label="Absent" value={absent.toString()} tone="danger" />
        <Kpi label="Late" value={late.toString()} tone="warning" />
        <Kpi label="Unmarked" value={(roster.length - present - absent - late).toString()} tone="muted" />
      </div>

      <Card>
        <div className="flex items-center gap-2 flex-wrap px-4 pt-4">
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="h-9 w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
          </Select>
          <div className="ml-auto flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => markAll("present")}><Check /> Mark all present</Button>
            <Button variant="outline" size="sm" onClick={() => setMarks({})}>Clear</Button>
          </div>
        </div>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search student…" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 pt-0">
          {filtered.map((s) => {
            const m = marks[s.id];
            return (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                <Avatar name={s.name} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.admissionNo}</div>
                </div>
                {m && <Badge tone={m === "present" ? "success" : m === "absent" ? "danger" : "warning"}>{m}</Badge>}
                <div className="flex gap-1">
                  <MarkBtn active={m === "present"} tone="success" onClick={() => setMark(s.id, "present")}><Check className="h-3.5 w-3.5" /></MarkBtn>
                  <MarkBtn active={m === "late"} tone="warning" onClick={() => setMark(s.id, "late")}><Clock className="h-3.5 w-3.5" /></MarkBtn>
                  <MarkBtn active={m === "absent"} tone="danger" onClick={() => setMark(s.id, "absent")}><X className="h-3.5 w-3.5" /></MarkBtn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MarkBtn({ active, tone, onClick, children }: { active: boolean; tone: "success" | "warning" | "danger"; onClick: () => void; children: React.ReactNode }) {
  const t: Record<string, string> = {
    success: "text-success ring-[oklch(0.72_0.16_158_/_0.35)] bg-[oklch(0.72_0.16_158_/_0.15)]",
    warning: "text-warning ring-[oklch(0.78_0.15_78_/_0.35)] bg-[oklch(0.78_0.15_78_/_0.15)]",
    danger: "text-danger ring-[oklch(0.66_0.22_20_/_0.35)] bg-[oklch(0.66_0.22_20_/_0.15)]",
  };
  return (
    <button onClick={onClick} className={`grid h-7 w-7 place-items-center rounded-md ring-1 transition ${active ? t[tone] : "text-muted-foreground ring-border hover:bg-surface-2"}`}>
      {children}
    </button>
  );
}
