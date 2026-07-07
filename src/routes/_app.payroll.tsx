import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Play } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Avatar, Kpi } from "@/components/app/ui";
import { payroll as seed, type PayrollEntry } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/payroll")({ component: PayrollPage });

function PayrollPage() {
  const [rows, setRows] = useState<PayrollEntry[]>(seed);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => rows.filter((r) => !search || r.employee.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const totalNet = rows.reduce((a,b) => a+b.net, 0);
  const paid = rows.filter(r => r.status === "Paid").length;

  function process(p: PayrollEntry) {
    setRows((rs) => rs.map((r) => r.id === p.id ? { ...r, status: "Paid" } : r));
    toast.success(`${p.employee} paid`);
  }
  function runAll() {
    setRows((rs) => rs.map((r) => ({ ...r, status: "Paid" })));
    toast.success("Payroll run completed");
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Operations" title="Payroll" subtitle="Salaries, allowances and deductions."
        actions={<>
          <Button variant="outline" size="sm" onClick={() => toast.success("Payslips exported")}><Download /> Export payslips</Button>
          <Button size="sm" onClick={runAll}><Play /> Run payroll</Button>
        </>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Employees" value={rows.length.toString()} tone="primary" />
        <Kpi label="Net payout" value={`₹${(totalNet/100000).toFixed(1)}L`} tone="success" hint="November 2025" />
        <Kpi label="Paid" value={paid.toString()} tone="info" />
        <Kpi label="Pending" value={(rows.length-paid).toString()} tone="warning" />
      </div>
      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search employees…" />
        <DataTable rows={filtered} rowKey={(r) => r.id}
          columns={[
            { key: "e", label: "Employee", render: (r) => <div className="flex items-center gap-2.5"><Avatar name={r.employee} /><div><div className="font-medium">{r.employee}</div><div className="text-[11px] text-muted-foreground">{r.role}</div></div></div> },
            { key: "b", label: "Basic", render: (r) => <span className="tabular-nums">₹{r.basic.toLocaleString()}</span> },
            { key: "a", label: "Allowances", render: (r) => <span className="tabular-nums text-success">+₹{r.allowances.toLocaleString()}</span> },
            { key: "d", label: "Deductions", render: (r) => <span className="tabular-nums text-danger">-₹{r.deductions.toLocaleString()}</span> },
            { key: "n", label: "Net", render: (r) => <span className="font-medium tabular-nums">₹{r.net.toLocaleString()}</span> },
            { key: "s", label: "Status", render: (r) => <Badge tone={r.status === "Paid" ? "success" : r.status === "Processing" ? "info" : "warning"}>{r.status}</Badge> },
            { key: "act", label: "", className: "text-right", render: (r) => r.status !== "Paid" ? <Button size="sm" variant="outline" onClick={() => process(r)}>Pay</Button> : <Button size="sm" variant="ghost" onClick={() => toast.success("Payslip downloaded")}>Payslip</Button> },
          ]} />
      </Card>
    </div>
  );
}
