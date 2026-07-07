import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Send, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Avatar, Kpi } from "@/components/app/ui";
import { invoices as seed, students, type Invoice } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/fees")({ component: FeesPage });

function FeesPage() {
  const [rows, setRows] = useState<Invoice[]>(seed);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ student: students[0].name, grade: students[0].grade, category: "Tuition", amount: 15000, dueDate: "" });

  const filtered = useMemo(() =>
    rows.filter((r) => (!search || r.student.toLowerCase().includes(search.toLowerCase())) && (status === "all" || r.status === status)),
  [rows, search, status]);

  const totalCollected = rows.filter(r => r.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = rows.filter(r => r.status !== "Paid").reduce((a, b) => a + b.amount, 0);

  function markPaid(inv: Invoice) {
    setRows((rs) => rs.map((r) => r.id === inv.id ? { ...r, status: "Paid" } : r));
    toast.success(`Payment recorded for ${inv.student}`);
  }
  function add() {
    if (!form.student.trim()) return toast.error("Student required");
    setRows((rs) => [{ id: `inv_${Date.now()}`, ...form, status: "Pending" }, ...rs]);
    toast.success("Invoice created");
    setDlg(false);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Operations"
        title="Fees"
        subtitle="Invoices, payments and dues across the school."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success(`Reminders sent to ${rows.filter(r => r.status !== "Paid").length} guardians`)}><Send /> Send reminders</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Statement exported")}><Download /> Export</Button>
            <Button size="sm" onClick={() => setDlg(true)}><Plus /> New invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Collected" value={`₹${(totalCollected/1000).toFixed(1)}K`} tone="success" hint="This period" />
        <Kpi label="Pending" value={`₹${(totalPending/1000).toFixed(1)}K`} tone="warning" />
        <Kpi label="Overdue" value={rows.filter(r => r.status === "Overdue").length.toString()} tone="danger" />
        <Kpi label="Invoices" value={rows.length.toString()} tone="primary" />
      </div>

      <Card>
        <Toolbar
          search={search}
          onSearch={setSearch}
          placeholder="Search by student…"
          left={
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "inv", label: "Invoice", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.id.toUpperCase()}</span> },
            { key: "s", label: "Student", render: (r) => (
              <div className="flex items-center gap-2.5"><Avatar name={r.student} /><div><div className="font-medium">{r.student}</div><div className="text-[11px] text-muted-foreground">{r.grade}</div></div></div>
            )},
            { key: "c", label: "Category", render: (r) => <span className="text-muted-foreground">{r.category}</span> },
            { key: "a", label: "Amount", render: (r) => <span className="font-medium tabular-nums">₹{r.amount.toLocaleString()}</span> },
            { key: "d", label: "Due", render: (r) => <span className="text-muted-foreground">{r.dueDate}</span> },
            { key: "st", label: "Status", render: (r) => (
              <Badge tone={r.status === "Paid" ? "success" : r.status === "Pending" ? "warning" : "danger"}>{r.status}</Badge>
            )},
            { key: "act", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                {r.status !== "Paid" && <Button size="sm" variant="outline" onClick={() => markPaid(r)}><DollarSign /> Mark paid</Button>}
                <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt downloaded")}>Receipt</Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New invoice</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Student" full><Input value={form.student} onChange={(e) => setForm({...form, student: e.target.value})} /></F>
            <F label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Tuition","Transport","Hostel","Exam","Library","Uniform"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Amount (₹)"><Input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: Number(e.target.value)})} /></F>
            <F label="Due date" full><Input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button>
            <Button onClick={add}>Create invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-[12px]">{label}</Label>{children}</div>;
}
