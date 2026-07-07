import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, MapPin, Users, Bus as BusIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Kpi } from "@/components/app/ui";
import { routes as seed, type Route as R } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/transport")({ component: TransportPage });

function TransportPage() {
  const [rows, setRows] = useState<R[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ name: "", driver: "", vehicle: "", stops: 6 });

  const filtered = useMemo(() => rows.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  function add() {
    if (!form.name.trim()) return toast.error("Route name required");
    setRows((rs) => [{ id: `rte_${Date.now()}`, ...form, students: 0, status: "At School" }, ...rs]);
    toast.success("Route added"); setDlg(false);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Operations" title="Transport" subtitle="Bus routes, drivers, and live status."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> Add route</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Routes" value={rows.length.toString()} tone="primary" />
        <Kpi label="Students transported" value={rows.reduce((a,b)=>a+b.students,0).toString()} tone="info" />
        <Kpi label="On route" value={rows.filter(r=>r.status==="On Route").length.toString()} tone="success" />
        <Kpi label="Maintenance" value={rows.filter(r=>r.status==="Maintenance").length.toString()} tone="warning" />
      </div>
      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search routes…" />
        <DataTable rows={filtered} rowKey={(r) => r.id}
          columns={[
            { key: "n", label: "Route", render: (r) => (
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 ring-1 ring-border"><BusIcon className="h-4 w-4 text-muted-foreground" /></span>
                <div><div className="font-medium">{r.name}</div><div className="text-[11px] font-mono text-muted-foreground">{r.vehicle}</div></div>
              </div>
            )},
            { key: "d", label: "Driver", render: (r) => <span className="text-muted-foreground">{r.driver}</span> },
            { key: "st", label: "Stops", render: (r) => <span className="text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{r.stops}</span> },
            { key: "s", label: "Students", render: (r) => <span className="text-muted-foreground inline-flex items-center gap-1"><Users className="h-3 w-3" />{r.students}</span> },
            { key: "sta", label: "Status", render: (r) => <Badge tone={r.status === "On Route" ? "info" : r.status === "At School" ? "success" : "warning"}>{r.status}</Badge> },
            { key: "act", label: "", className: "text-right", render: (r) => <Button size="sm" variant="outline" onClick={() => toast.info(`Live tracking ${r.name}`)}>Track</Button> },
          ]} />
      </Card>
      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add route</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Route name" full><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Route H — Powai" /></F>
            <F label="Driver"><Input value={form.driver} onChange={(e) => setForm({...form, driver: e.target.value})} /></F>
            <F label="Vehicle"><Input value={form.vehicle} onChange={(e) => setForm({...form, vehicle: e.target.value})} placeholder="MH-01-BR-2345" /></F>
            <F label="Stops"><Input type="number" value={form.stops} onChange={(e) => setForm({...form, stops: Number(e.target.value)})} /></F>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={add}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-[12px]">{label}</Label>{children}</div>;
}
