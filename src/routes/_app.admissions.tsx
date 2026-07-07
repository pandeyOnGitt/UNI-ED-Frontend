import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Check, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Avatar, Kpi } from "@/components/app/ui";
import { admissions as seed, GRADES, type Admission } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/admissions")({ component: AdmissionsPage });

const STAGES: Admission["stage"][] = ["Documents", "Assessment", "Interview", "Fee", "Enrolled", "Rejected"];

function AdmissionsPage() {
  const [rows, setRows] = useState<Admission[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ applicant: "", grade: "Grade 1" });

  const filtered = useMemo(() =>
    rows.filter((r) => !search || r.applicant.toLowerCase().includes(search.toLowerCase())),
  [rows, search]);

  function advance(a: Admission) {
    const idx = STAGES.indexOf(a.stage);
    if (idx >= STAGES.length - 2) return toast.info("Already at final stage");
    const next = STAGES[idx + 1];
    setRows((rs) => rs.map((r) => r.id === a.id ? { ...r, stage: next } : r));
    toast.success(`${a.applicant} → ${next}`);
  }
  function decide(a: Admission, ok: boolean) {
    setRows((rs) => rs.map((r) => r.id === a.id ? { ...r, status: ok ? "Approved" : "Rejected", stage: ok ? "Enrolled" : "Rejected" } : r));
    toast.success(ok ? `${a.applicant} approved` : `${a.applicant} rejected`);
  }
  function add() {
    if (!form.applicant.trim()) return toast.error("Applicant name required");
    setRows((rs) => [{ id: `app_${Date.now()}`, applicant: form.applicant, grade: form.grade, appliedOn: new Date().toLocaleDateString(), stage: "Documents", status: "In Review" }, ...rs]);
    toast.success("Application created");
    setDlg(false); setForm({ applicant: "", grade: "Grade 1" });
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="People"
        title="Admissions"
        subtitle="Track applicants through the intake pipeline."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> New application</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi label="Total applications" value={rows.length.toString()} tone="primary" />
        <Kpi label="In review" value={rows.filter(r => r.status === "In Review").length.toString()} tone="info" />
        <Kpi label="Approved" value={rows.filter(r => r.status === "Approved").length.toString()} tone="success" />
        <Kpi label="Pending" value={rows.filter(r => r.status === "Pending").length.toString()} tone="warning" />
        <Kpi label="Rejected" value={rows.filter(r => r.status === "Rejected").length.toString()} tone="danger" />
      </div>

      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search applicants…" />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "a", label: "Applicant", render: (r) => (
              <div className="flex items-center gap-2.5"><Avatar name={r.applicant} /><span className="font-medium">{r.applicant}</span></div>
            )},
            { key: "g", label: "Grade", render: (r) => <span className="text-muted-foreground">{r.grade}</span> },
            { key: "d", label: "Applied", render: (r) => <span className="text-muted-foreground">{r.appliedOn}</span> },
            { key: "st", label: "Stage", render: (r) => (
              <div className="flex items-center gap-1">
                {STAGES.slice(0, 5).map((s, i) => {
                  const idx = STAGES.indexOf(r.stage);
                  const done = i <= idx && r.status !== "Rejected";
                  return <span key={s} className={`h-1.5 w-6 rounded-full ${done ? "bg-primary" : "bg-surface-2"}`} />;
                })}
                <span className="ml-2 text-[11.5px] text-muted-foreground">{r.stage}</span>
              </div>
            )},
            { key: "s", label: "Status", render: (r) => (
              <Badge tone={r.status === "Approved" ? "success" : r.status === "Rejected" ? "danger" : r.status === "Pending" ? "warning" : "info"}>{r.status}</Badge>
            )},
            { key: "act", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="outline" onClick={() => advance(r)}>Advance <ChevronRight /></Button>
                <Button size="icon" variant="ghost" onClick={() => decide(r, true)}><Check className="text-success" /></Button>
                <Button size="icon" variant="ghost" onClick={() => decide(r, false)}><X className="text-danger" /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New application</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-[12px]">Applicant</Label><Input value={form.applicant} onChange={(e) => setForm({...form, applicant: e.target.value})} /></div>
            <div className="space-y-1.5"><Label className="text-[12px]">Grade</Label>
              <Select value={form.grade} onValueChange={(v) => setForm({...form, grade: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
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
