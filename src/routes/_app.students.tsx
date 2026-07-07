import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Upload, Trash2, Edit3, Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Avatar, Kpi } from "@/components/app/ui";
import { students as seed, GRADES, SECTIONS, type Student } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/students")({ component: StudentsPage });

const empty: Omit<Student, "id"> = {
  name: "", admissionNo: "", grade: "Grade 1", section: "A", gender: "Male",
  guardian: "", phone: "", email: "", feeStatus: "Pending", status: "Active",
};

function StudentsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Student[]>(seed);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState<string>("all");
  const [fee, setFee] = useState<string>("all");
  const [dialog, setDialog] = useState<{ open: boolean; edit?: Student }>({ open: false });
  const [form, setForm] = useState(empty);
  const [confirmDel, setConfirmDel] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
      && (grade === "all" || r.grade === grade)
      && (fee === "all" || r.feeStatus === fee);
  }), [rows, search, grade, fee]);

  function openAdd() { setForm(empty); setDialog({ open: true }); }
  function openEdit(s: Student) { setForm(s); setDialog({ open: true, edit: s }); }
  function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (dialog.edit) {
      setRows((rs) => rs.map((r) => r.id === dialog.edit!.id ? { ...r, ...form } : r));
      toast.success(`Updated ${form.name}`);
    } else {
      const id = `stu_${Date.now()}`;
      const admissionNo = form.admissionNo || `ADM${2025000 + rows.length + 1}`;
      setRows((rs) => [{ id, ...form, admissionNo }, ...rs]);
      toast.success(`Admitted ${form.name}`);
    }
    setDialog({ open: false });
  }
  function del(s: Student) {
    setRows((rs) => rs.filter((r) => r.id !== s.id));
    toast.success(`Removed ${s.name}`);
    setConfirmDel(null);
  }

  const kpiPaid = rows.filter((r) => r.feeStatus === "Paid").length;
  const kpiOverdue = rows.filter((r) => r.feeStatus === "Overdue").length;

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="People"
        title="Students"
        subtitle="Directory of enrolled students across all grades and sections."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported students.csv")}>
              <Download /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Import wizard opened")}>
              <Upload /> Import
            </Button>
            <Button size="sm" onClick={openAdd}><Plus /> Add student</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total students" value={rows.length.toLocaleString()} hint="All active grades" tone="primary" />
        <Kpi label="Fees paid" value={kpiPaid.toString()} hint={`${Math.round(kpiPaid / rows.length * 100)}% of directory`} tone="success" />
        <Kpi label="Overdue" value={kpiOverdue.toString()} hint="Requires follow-up" tone="danger" />
        <Kpi label="Active" value={rows.filter(r => r.status === "Active").length.toString()} tone="info" />
      </div>

      <Card>
        <Toolbar
          search={search}
          onSearch={setSearch}
          placeholder="Search by name, admission no, email…"
          left={
            <>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="h-9 w-[140px]"><Filter className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All grades</SelectItem>
                  {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={fee} onValueChange={setFee}>
                <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All fees</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          right={selectedIds.size > 0 ? (
            <>
              <span className="text-[12px] text-muted-foreground">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={() => { toast.success(`Message sent to ${selectedIds.size} parents`); setSelectedIds(new Set()); }}>Message parents</Button>
            </>
          ) : null}
        />
        <DataTable
          onRowClick={(r) => navigate({ to: "/students/$id", params: { id: r.id } })}
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "sel", label: "", className: "w-8", render: (r) => (
              <input type="checkbox" checked={selectedIds.has(r.id)} onChange={(e) => {
                const s = new Set(selectedIds);
                if (e.target.checked) s.add(r.id); else s.delete(r.id);
                setSelectedIds(s);
              }} onClick={(e) => e.stopPropagation()} className="accent-primary" />
            )},
            { key: "name", label: "Name", render: (r) => (
              <div className="flex items-center gap-2.5">
                <Avatar name={r.name} />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.admissionNo}</div>
                </div>
              </div>
            )},
            { key: "grade", label: "Class", render: (r) => <span className="text-muted-foreground">{r.grade} · {r.section}</span> },
            { key: "guardian", label: "Guardian", render: (r) => <span className="text-muted-foreground">{r.guardian}</span> },
            { key: "contact", label: "Contact", render: (r) => <span className="text-muted-foreground tabular-nums">{r.phone}</span> },
            { key: "fee", label: "Fee", render: (r) => (
              <Badge tone={r.feeStatus === "Paid" ? "success" : r.feeStatus === "Pending" ? "warning" : "danger"}>{r.feeStatus}</Badge>
            )},
            { key: "status", label: "Status", render: (r) => (
              <Badge tone={r.status === "Active" ? "success" : "muted"}>{r.status}</Badge>
            )},
            { key: "actions", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <Button size="icon" variant="ghost" onClick={() => navigate({ to: "/students/$id", params: { id: r.id } })}><Eye /></Button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Edit3 /></Button>
                <Button size="icon" variant="ghost" onClick={() => setConfirmDel(r)}><Trash2 /></Button>
              </div>
            )},
          ]}
        />
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-[12px] text-muted-foreground">
          <span>Showing {filtered.length} of {rows.length}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={dialog.open} onOpenChange={(o) => setDialog({ open: o })}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{dialog.edit ? "Edit student" : "Add student"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></Field>
            <Field label="Admission no."><Input value={form.admissionNo} onChange={(e) => setForm({...form, admissionNo: e.target.value})} placeholder="Auto-generated" /></Field>
            <Field label="Grade">
              <Select value={form.grade} onValueChange={(v) => setForm({...form, grade: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Section">
              <Select value={form.section} onValueChange={(v) => setForm({...form, section: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Gender">
              <Select value={form.gender} onValueChange={(v) => setForm({...form, gender: v as "Male" | "Female"})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Guardian"><Input value={form.guardian} onChange={(e) => setForm({...form, guardian: e.target.value})} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false })}>Cancel</Button>
            <Button onClick={save}>{dialog.edit ? "Save changes" : "Add student"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {confirmDel?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will move the student to the archive. You can restore within 30 days.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && del(confirmDel)}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px]">{label}</Label>
      {children}
    </div>
  );
}
