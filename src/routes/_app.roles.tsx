import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Kpi, Badge } from "@/components/app/ui";
import { roles as seed, type Role } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/roles")({ component: RolesPage });

const PERMS = [
  "View students","Edit students","Manage admissions","Take attendance","Publish results",
  "Manage fees","Manage payroll","Send announcements","Manage users","Access reports",
];

function RolesPage() {
  const [rows, setRows] = useState<Role[]>(seed);
  const [selected, setSelected] = useState<Role>(seed[0]);
  const [dlg, setDlg] = useState(false);
  const [name, setName] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PERMS.map((p, i) => [p, i < 6]))
  );

  function toggle(p: string) {
    setChecked((c) => ({ ...c, [p]: !c[p] }));
    toast.success(`${!checked[p] ? "Granted" : "Revoked"}: ${p}`);
  }
  function add() {
    if (!name.trim()) return toast.error("Name required");
    setRows((rs) => [...rs, { id: `r_${Date.now()}`, name, members: 0, permissions: 6, scope: "Custom" }]);
    toast.success("Role created"); setDlg(false); setName("");
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="System" title="Roles & Permissions" subtitle="Control what each role can access across the platform."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> New role</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Roles" value={rows.length.toString()} tone="primary" />
        <Kpi label="Total members" value={rows.reduce((a,b)=>a+b.members,0).toLocaleString()} tone="info" />
        <Kpi label="Permissions" value={PERMS.length.toString()} tone="success" />
        <Kpi label="Audit events (24h)" value="42" tone="muted" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <Card>
          <div className="p-4 border-b border-border text-[12.5px] font-medium">Roles</div>
          <ul>
            {rows.map((r) => (
              <li key={r.id}>
                <button onClick={() => setSelected(r)} className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-surface-2/60 ${selected.id === r.id ? "bg-surface-2" : ""}`}>
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary"><Shield className="h-4 w-4" /></span>
                  <div className="flex-1 text-left">
                    <div className="text-[13px] font-medium text-foreground">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.scope}</div>
                  </div>
                  <Badge tone="muted"><Users className="h-3 w-3 mr-0.5" />{r.members}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="p-5 border-b border-border">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Permissions for</div>
            <div className="text-[16px] font-semibold">{selected.name}</div>
          </div>
          <div className="divide-y divide-border">
            {PERMS.map((p) => (
              <div key={p} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-[13px] font-medium text-foreground">{p}</div>
                  <div className="text-[11.5px] text-muted-foreground">{p.startsWith("Manage") ? "Full CRUD access" : "Read + limited actions"}</div>
                </div>
                <Switch checked={!!checked[p]} onCheckedChange={() => toggle(p)} />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Reset to defaults")}>Reset</Button>
            <Button size="sm" onClick={() => toast.success("Permissions saved")}>Save changes</Button>
          </div>
        </Card>
      </div>
      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New role</DialogTitle></DialogHeader>
          <div className="space-y-1.5"><Label className="text-[12px]">Role name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Librarian" /></div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={add}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
