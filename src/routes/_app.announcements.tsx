import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Badge, Kpi } from "@/components/app/ui";
import { announcements as seed, type Announcement } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/announcements")({ component: AnnouncementsPage });

function AnnouncementsPage() {
  const [rows, setRows] = useState<Announcement[]>(seed);
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState<Omit<Announcement, "id" | "publishedAt" | "author">>({ title: "", body: "", audience: "All", priority: "Normal" });

  function publish() {
    if (!form.title.trim()) return toast.error("Title required");
    setRows((rs) => [{ id: `an_${Date.now()}`, ...form, author: "Principal's Office", publishedAt: "just now" }, ...rs]);
    toast.success("Announcement published");
    setDlg(false); setForm({ title: "", body: "", audience: "All", priority: "Normal" });
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Communication" title="Announcements" subtitle="Share updates with the whole community or targeted groups."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> New announcement</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total posts" value={rows.length.toString()} tone="primary" />
        <Kpi label="Urgent" value={rows.filter(r=>r.priority==="Urgent").length.toString()} tone="danger" />
        <Kpi label="Important" value={rows.filter(r=>r.priority==="Important").length.toString()} tone="warning" />
        <Kpi label="Reach" value="2.4K" tone="info" hint="Estimated readers" />
      </div>
      <div className="space-y-3">
        {rows.map((a) => (
          <Card key={a.id}>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary ring-1 ring-border"><Megaphone className="h-4 w-4" /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[15px] font-semibold text-foreground">{a.title}</div>
                    <Badge tone={a.priority === "Urgent" ? "danger" : a.priority === "Important" ? "warning" : "muted"}>{a.priority}</Badge>
                    <Badge tone="info">{a.audience}</Badge>
                  </div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{a.body}</div>
                  <div className="mt-2 text-[11.5px] text-muted-foreground">{a.author} · {a.publishedAt}</div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => { setRows((rs) => rs.filter((r) => r.id !== a.id)); toast.success("Deleted"); }}><Trash2 /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New announcement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-[12px]">Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-1.5"><Label className="text-[12px]">Body</Label><Textarea rows={4} value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-[12px]">Audience</Label>
                <Select value={form.audience} onValueChange={(v) => setForm({...form, audience: v as Announcement["audience"]})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["All","Teachers","Students","Parents"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-[12px]">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({...form, priority: v as Announcement["priority"]})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Normal","Important","Urgent"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={publish}>Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
