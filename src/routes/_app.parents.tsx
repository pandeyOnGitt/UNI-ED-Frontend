import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Mail, Phone, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Avatar, Kpi } from "@/components/app/ui";
import { parents as seed, type Parent } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/parents")({ component: ParentsPage });

function ParentsPage() {
  const [rows, setRows] = useState<Parent[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState<{ open: boolean; edit?: Parent }>({ open: false });
  const [form, setForm] = useState({ name: "", phone: "", email: "", occupation: "", child: "" });

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.children.join(" ").toLowerCase().includes(q);
  }), [rows, search]);

  function openAdd() { setForm({ name: "", phone: "", email: "", occupation: "", child: "" }); setDlg({ open: true }); }
  function openEdit(p: Parent) { setForm({ name: p.name, phone: p.phone, email: p.email, occupation: p.occupation, child: p.children[0] ?? "" }); setDlg({ open: true, edit: p }); }
  function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (dlg.edit) {
      setRows((rs) => rs.map((r) => r.id === dlg.edit!.id ? { ...r, name: form.name, phone: form.phone, email: form.email, occupation: form.occupation, children: form.child ? [form.child] : r.children } : r));
      toast.success("Parent updated");
    } else {
      setRows((rs) => [{ id: `par_${Date.now()}`, name: form.name, phone: form.phone, email: form.email, occupation: form.occupation, children: form.child ? [form.child] : [] }, ...rs]);
      toast.success("Parent added");
    }
    setDlg({ open: false });
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="People"
        title="Parents"
        subtitle="Guardian directory with linked student(s)."
        actions={<Button size="sm" onClick={openAdd}><Plus /> Add parent</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Registered" value={rows.length.toString()} tone="primary" />
        <Kpi label="Portal active" value={Math.round(rows.length * 0.86).toString()} tone="success" />
        <Kpi label="Pending invites" value={Math.round(rows.length * 0.14).toString()} tone="warning" />
        <Kpi label="Bounced emails" value="2" tone="danger" />
      </div>

      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search parents or their children…" />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            { key: "n", label: "Parent", render: (r) => (
              <div className="flex items-center gap-2.5">
                <Avatar name={r.name} />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.occupation}</div>
                </div>
              </div>
            )},
            { key: "c", label: "Children", render: (r) => <span className="text-muted-foreground">{r.children.join(", ")}</span> },
            { key: "e", label: "Email", render: (r) => <span className="text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</span> },
            { key: "p", label: "Phone", render: (r) => <span className="text-muted-foreground tabular-nums inline-flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span> },
            { key: "a", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="outline" onClick={() => toast.success(`Message drafted to ${r.name}`)}>Message</Button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Edit3 /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Dialog open={dlg.open} onOpenChange={(o) => setDlg({ open: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>{dlg.edit ? "Edit parent" : "Add parent"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Name"><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></F>
            <F label="Occupation"><Input value={form.occupation} onChange={(e) => setForm({...form, occupation: e.target.value})} /></F>
            <F label="Email"><Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></F>
            <F label="Phone"><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></F>
            <F label="Child's name"><Input value={form.child} onChange={(e) => setForm({...form, child: e.target.value})} /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg({ open: false })}>Cancel</Button>
            <Button onClick={save}>{dlg.edit ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-[12px]">{label}</Label>{children}</div>;
}
