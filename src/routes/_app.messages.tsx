import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Avatar, Badge } from "@/components/app/ui";
import { messages as seed, type Message } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/messages")({ component: MessagesPage });

function MessagesPage() {
  const [rows, setRows] = useState<Message[]>(seed);
  const [selected, setSelected] = useState<Message>(seed[0]);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) => !search || r.subject.toLowerCase().includes(search.toLowerCase()) || r.from.toLowerCase().includes(search.toLowerCase()));

  function send() {
    if (!reply.trim()) return toast.error("Message cannot be empty");
    toast.success(`Reply sent to ${selected.from}`);
    setReply("");
  }
  function open(m: Message) {
    setSelected(m);
    setRows((rs) => rs.map((r) => r.id === m.id ? { ...r, unread: false } : r));
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Communication" title="Messages" subtitle="Inbox from parents, teachers and students." />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[540px]">
          <div className="border-r border-border">
            <div className="p-3 border-b border-border">
              <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inbox…" className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70" />
              </label>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((m) => (
                <li key={m.id}>
                  <button onClick={() => open(m)} className={`w-full text-left px-4 py-3 hover:bg-surface-2 transition-colors ${selected.id === m.id ? "bg-surface-2" : ""}`}>
                    <div className="flex items-start gap-2.5">
                      <Avatar name={m.from} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`text-[13px] truncate ${m.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{m.from}</div>
                          <span className="ml-auto text-[11px] text-muted-foreground shrink-0">{m.time}</span>
                        </div>
                        <div className="text-[11.5px] text-muted-foreground truncate">{m.role}</div>
                        <div className="mt-1 text-[12.5px] text-foreground truncate">{m.subject}</div>
                        <div className="text-[11.5px] text-muted-foreground truncate">{m.preview}</div>
                      </div>
                      {m.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar name={selected.from} className="h-10 w-10 text-[13px]" />
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-foreground">{selected.subject}</div>
                  <div className="text-[12px] text-muted-foreground">{selected.from} · {selected.role}</div>
                </div>
                <Badge tone="info">{selected.time}</Badge>
              </div>
            </div>
            <div className="flex-1 p-5">
              <div className="rounded-lg border border-border bg-surface p-4 text-[13.5px] leading-relaxed text-foreground">
                {selected.preview} — Lorem ipsum dolor sit amet. This is the full body of the conversation. It carries important context from the parent regarding their child's schedule and requests.
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <Textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${selected.from}…`} />
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setReply("")}>Discard</Button>
                <Button size="sm" onClick={send}><Send /> Send reply</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
