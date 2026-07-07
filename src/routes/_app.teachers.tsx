import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Edit3, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Avatar, Kpi } from "@/components/app/ui";
import { teachers as seed, DEPARTMENTS, SUBJECTS, type Teacher } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/teachers")({ component: TeachersPage });

const empty: Omit<Teacher, "id"> = {
  name: "", employeeNo: "", department: DEPARTMENTS[0], subjects: [SUBJECTS[0]],
  email: "", phone: "", experience: 1, status: "Active",
};

function TeachersPage() {
  const [rows, setRows] = useState<Teacher[]>(seed);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [dialog, setDialog] = useState<{ open: boolean; edit?: Teacher }>({ open: false });
  const [form, setForm] = useState(empty);

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
      && (dept === "all" || r.department === dept);
  }), [rows, search, dept]);

  function openAdd() { setForm(empty); setDialog({ open: true }); }
  function openEdit(t: Teacher) { setForm(t); setDialog({ open: true, edit: t }); }
  function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (dialog.edit) {
      setRows((rs) => rs.map((r) => r.id === dialog.edit!.id ? { ...r, ...form } : r));
      toast.success("Teacher updated");
    } else {
      setRows((rs) => [{ id: `tch_${Date.now()}`, ...form, employeeNo: form.employeeNo || `EMP${2020 + rs.length + 1}` }, ...rs]);
      toast.success("Teacher added");
    }
    setDialog({ open: false });
  }
  function del(t: Teacher) {
    setRows((rs) => rs.filter((r) => r.id !== t.id));
    toast.success(`Removed ${t.name}`);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="People"
        title="Teachers"
        subtitle="Faculty directory across departments."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported teachers.csv")}><Download /> Export</Button>
            <Button size="sm" onClick={openAdd}><Plus /> Add teacher</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total faculty" value={rows.length.toString()} tone="primary" />
        <Kpi label="On leave today" value={rows.filter(r => r.status === "On Leave").length.toString()} tone="warning" />
        <Kpi label="Departments" value={new Set(rows.map(r => r.department)).size.toString()} tone="info" />
        <Kpi label="Avg. experience" value={`${Math.round(rows.reduce((a,b)=>a+b.experience,0)/rows.length)} yrs`} tone="muted" />
      </div>

      <Card>
        <Toolbar
          search={search}
          onSearch={setSearch}
          placeholder="Search teachers…"
          left={
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          }
        />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "name", label: "Teacher", render: (r) => (
              <div className="flex items-center gap-2.5">
                <Avatar name={r.name} />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.employeeNo}</div>
                </div>
              </div>
            )},
            { key: "dept", label: "Department", render: (r) => <span className="text-muted-foreground">{r.department}</span> },
            { key: "subj", label: "Subjects", render: (r) => (
              <div className="flex gap-1 flex-wrap">{r.subjects.map((s) => <Badge key={s}>{s}</Badge>)}</div>
            )},
            { key: "exp", label: "Experience", render: (r) => <span className="text-muted-foreground tabular-nums">{r.experience} yrs</span> },
            { key: "contact", label: "Contact", render: (r) => (
              <div className="flex flex-col text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {r.email}</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {r.phone}</span>
              </div>
            )},
            { key: "status", label: "Status", render: (r) => (
              <Badge tone={r.status === "Active" ? "success" : r.status === "On Leave" ? "warning" : "muted"}>{r.status}</Badge>
            )},
            { key: "actions", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Edit3 /></Button>
                <Button size="icon" variant="ghost" onClick={() => del(r)}><Trash2 /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dialog.open} onOpenChange={(o) => setDialog({ open: o })}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{dialog.edit ? "Edit teacher" : "Add teacher"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></Field>
            <Field label="Employee no."><Input value={form.employeeNo} onChange={(e) => setForm({...form, employeeNo: e.target.value})} /></Field>
            <Field label="Department">
              <Select value={form.department} onValueChange={(v) => setForm({...form, department: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Experience (yrs)"><Input type="number" value={form.experience} onChange={(e) => setForm({...form, experience: Number(e.target.value)})} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false })}>Cancel</Button>
            <Button onClick={save}>{dialog.edit ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-[12px]">{label}</Label>{children}</div>;
}
