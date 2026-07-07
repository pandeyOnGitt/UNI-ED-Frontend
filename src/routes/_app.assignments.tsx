import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Kpi } from "@/components/app/ui";
import { assignments as seed, GRADES, SUBJECTS, teachers, type Assignment } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/assignments")({ component: AssignmentsPage });

function AssignmentsPage() {
  const [rows, setRows] = useState<Assignment[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ title: "", subject: SUBJECTS[0], grade: GRADES[0], dueDate: "", assignedBy: teachers[0].name });

  const filtered = useMemo(() =>
    rows.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase())),
  [rows, search]);

  function add() {
    if (!form.title.trim()) return toast.error("Title required");
    setRows((rs) => [{ id: `asg_${Date.now()}`, ...form, submissions: 0, total: 32, status: "Open" }, ...rs]);
    toast.success("Assignment created");
    setDlg(false);
  }
  function close(a: Assignment) {
    setRows((rs) => rs.map((r) => r.id === a.id ? { ...r, status: "Closed" } : r));
    toast.success(`Closed: ${a.title}`);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Academics"
        title="Assignments"
        subtitle="Homework and coursework across grades."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> New assignment</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Open" value={rows.filter(r => r.status === "Open").length.toString()} tone="primary" />
        <Kpi label="Grading" value={rows.filter(r => r.status === "Grading").length.toString()} tone="warning" />
        <Kpi label="Closed" value={rows.filter(r => r.status === "Closed").length.toString()} tone="muted" />
        <Kpi label="Avg. submission" value={`${Math.round(rows.reduce((a,b)=>a+b.submissions/b.total*100,0)/rows.length)}%`} tone="success" />
      </div>

      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search assignments…" />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "t", label: "Title", render: (r) => (
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 ring-1 ring-border"><FileText className="h-4 w-4 text-muted-foreground" /></span>
                <div><div className="font-medium">{r.title}</div><div className="text-[11px] text-muted-foreground">{r.subject} · {r.grade}</div></div>
              </div>
            )},
            { key: "by", label: "Assigned by", render: (r) => <span className="text-muted-foreground">{r.assignedBy}</span> },
            { key: "due", label: "Due", render: (r) => <span className="text-muted-foreground">{r.dueDate}</span> },
            { key: "sub", label: "Submissions", render: (r) => (
              <div className="w-40">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1"><span>{r.submissions}/{r.total}</span><span>{Math.round(r.submissions/r.total*100)}%</span></div>
                <Progress value={r.submissions/r.total*100} className="h-1.5" />
              </div>
            )},
            { key: "s", label: "Status", render: (r) => (
              <Badge tone={r.status === "Open" ? "info" : r.status === "Grading" ? "warning" : "muted"}>{r.status}</Badge>
            )},
            { key: "act", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                {r.status !== "Closed" && <Button size="sm" variant="outline" onClick={() => close(r)}>Close</Button>}
                <Button size="icon" variant="ghost" onClick={() => { setRows((rs) => rs.filter((x) => x.id !== r.id)); toast.success("Deleted"); }}><Trash2 /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New assignment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Title" full><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Chapter 4 problems" /></F>
            <F label="Subject">
              <Select value={form.subject} onValueChange={(v) => setForm({...form, subject: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Grade">
              <Select value={form.grade} onValueChange={(v) => setForm({...form, grade: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Due date"><Input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} /></F>
            <F label="Assigned by"><Input value={form.assignedBy} onChange={(e) => setForm({...form, assignedBy: e.target.value})} /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button>
            <Button onClick={add}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-[12px]">{label}</Label>{children}</div>;
}
