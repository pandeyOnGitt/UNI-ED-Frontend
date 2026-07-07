import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Bed as BedIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, Badge, Kpi } from "@/components/app/ui";
import { hostelRooms as seed, type HostelRoom } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/hostel")({ component: HostelPage });

function HostelPage() {
  const [rows, setRows] = useState<HostelRoom[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ block: "A", room: "", capacity: 3, warden: "" });

  const filtered = useMemo(() => rows.filter((r) => !search || `${r.block} ${r.room} ${r.warden}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  function assign(r: HostelRoom) {
    if (r.occupied >= r.capacity) return toast.error("Room is full");
    setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, occupied: x.occupied + 1, status: x.occupied + 1 === x.capacity ? "Full" : "Available" } : x));
    toast.success(`Assigned to ${r.block}-${r.room}`);
  }
  function add() {
    if (!form.room.trim()) return toast.error("Room number required");
    setRows((rs) => [{ id: `hst_${Date.now()}`, ...form, occupied: 0, status: "Available" }, ...rs]);
    toast.success("Room added"); setDlg(false);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Operations" title="Hostel" subtitle="Room allocation and occupancy."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> Add room</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Rooms" value={rows.length.toString()} tone="primary" />
        <Kpi label="Capacity" value={rows.reduce((a,b)=>a+b.capacity,0).toString()} tone="info" />
        <Kpi label="Occupied" value={rows.reduce((a,b)=>a+b.occupied,0).toString()} tone="success" />
        <Kpi label="Occupancy" value={`${Math.round(rows.reduce((a,b)=>a+b.occupied,0)/rows.reduce((a,b)=>a+b.capacity,0)*100)}%`} tone="warning" />
      </div>
      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search rooms or wardens…" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Block {r.block}</div>
                  <div className="mt-0.5 text-[18px] font-semibold text-foreground">Room {r.room}</div>
                </div>
                <Badge tone={r.status === "Available" ? "success" : r.status === "Full" ? "danger" : "warning"}>{r.status}</Badge>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: r.capacity }).map((_, i) => (
                  <BedIcon key={i} className={`h-4 w-4 ${i < r.occupied ? "text-primary" : "text-muted-foreground/40"}`} />
                ))}
              </div>
              <div className="mt-2 text-[11.5px] text-muted-foreground">Warden: {r.warden}</div>
              <div className="mt-3 flex justify-between text-[12px]">
                <span className="text-muted-foreground tabular-nums">{r.occupied} / {r.capacity}</span>
                <button className="text-primary hover:brightness-125 text-[12px]" onClick={() => assign(r)}>Assign +</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add room</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Block"><Input value={form.block} onChange={(e) => setForm({...form, block: e.target.value})} /></F>
            <F label="Room"><Input value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} /></F>
            <F label="Capacity"><Input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: Number(e.target.value)})} /></F>
            <F label="Warden"><Input value={form.warden} onChange={(e) => setForm({...form, warden: e.target.value})} /></F>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={add}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-[12px]">{label}</Label>{children}</div>;
}
