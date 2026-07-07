import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Kpi } from "@/components/app/ui";
import { exams as seed, GRADES, SUBJECTS, type Exam } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/examinations")({ component: ExamsPage });

function ExamsPage() {
  const [rows, setRows] = useState<Exam[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ name: "", grade: GRADES[0], subject: SUBJECTS[0], date: "", duration: "1h 30m", totalMarks: 100 });

  const filtered = useMemo(() =>
    rows.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase())),
  [rows, search]);

  function add() {
    if (!form.name.trim()) return toast.error("Exam name required");
    setRows((rs) => [{ id: `exm_${Date.now()}`, ...form, status: "Upcoming" }, ...rs]);
    toast.success("Exam scheduled");
    setDlg(false);
  }
  function toggle(e: Exam) {
    const next: Exam["status"] = e.status === "Upcoming" ? "Ongoing" : "Completed";
    setRows((rs) => rs.map((r) => r.id === e.id ? { ...r, status: next } : r));
    toast.success(`${e.name} → ${next}`);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Academics"
        title="Examinations"
        subtitle="Schedule, monitor and publish results."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> Schedule exam</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total scheduled" value={rows.length.toString()} tone="primary" />
        <Kpi label="Upcoming" value={rows.filter(r => r.status === "Upcoming").length.toString()} tone="info" />
        <Kpi label="Ongoing" value={rows.filter(r => r.status === "Ongoing").length.toString()} tone="warning" />
        <Kpi label="Completed" value={rows.filter(r => r.status === "Completed").length.toString()} tone="success" />
      </div>

      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search exams…" />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "n", label: "Exam", render: (r) => <div className="font-medium">{r.name}</div> },
            { key: "g", label: "Grade", render: (r) => <span className="text-muted-foreground">{r.grade}</span> },
            { key: "s", label: "Subject", render: (r) => <span className="text-muted-foreground">{r.subject}</span> },
            { key: "d", label: "Date", render: (r) => <span className="text-muted-foreground">{r.date}</span> },
            { key: "dur", label: "Duration", render: (r) => <span className="text-muted-foreground tabular-nums">{r.duration}</span> },
            { key: "m", label: "Marks", render: (r) => <span className="text-muted-foreground tabular-nums">{r.totalMarks}</span> },
            { key: "st", label: "Status", render: (r) => (
              <Badge tone={r.status === "Upcoming" ? "info" : r.status === "Ongoing" ? "warning" : "success"}>{r.status}</Badge>
            )},
            { key: "act", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                {r.status !== "Completed" && (
                  <Button size="sm" variant="outline" onClick={() => toggle(r)}>
                    {r.status === "Upcoming" ? <><Play /> Start</> : <><Square /> Complete</>}
                  </Button>
                )}
                {r.status === "Completed" && <Button size="sm" variant="outline" onClick={() => toast.success("Results published")}>Publish</Button>}
                <Button size="icon" variant="ghost" onClick={() => { setRows((rs) => rs.filter((x) => x.id !== r.id)); toast.success("Deleted"); }}><Trash2 /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule exam</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Name" full><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Mid-term Nov 2025" /></F>
            <F label="Grade">
              <Select value={form.grade} onValueChange={(v) => setForm({...form, grade: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Subject">
              <Select value={form.subject} onValueChange={(v) => setForm({...form, subject: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} /></F>
            <F label="Duration"><Input value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} /></F>
            <F label="Total marks"><Input type="number" value={form.totalMarks} onChange={(e) => setForm({...form, totalMarks: Number(e.target.value)})} /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button>
            <Button onClick={add}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-[12px]">{label}</Label>{children}</div>;
}
