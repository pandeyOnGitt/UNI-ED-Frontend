import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const [school, setSchool] = useState({ name: "Scholaris Academy", motto: "Learn. Lead. Inspire.", email: "info@scholaris.edu", phone: "+91 22 4000 0000", address: "12 Marine Drive, Mumbai 400020" });
  const [prefs, setPrefs] = useState({ emailNotifs: true, smsNotifs: false, twoFA: true, weekend: "Sun", locale: "en-IN", currency: "INR" });

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1200px]">
      <PageHeader eyebrow="System" title="Settings" subtitle="Configure school details, preferences and integrations." />

      <Tabs defaultValue="school">
        <TabsList>
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="prefs">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="School name"><Input value={school.name} onChange={(e) => setSchool({...school, name: e.target.value})} /></F>
                <F label="Motto"><Input value={school.motto} onChange={(e) => setSchool({...school, motto: e.target.value})} /></F>
                <F label="Email"><Input value={school.email} onChange={(e) => setSchool({...school, email: e.target.value})} /></F>
                <F label="Phone"><Input value={school.phone} onChange={(e) => setSchool({...school, phone: e.target.value})} /></F>
              </div>
              <F label="Address"><Textarea value={school.address} onChange={(e) => setSchool({...school, address: e.target.value})} rows={2} /></F>
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.info("Changes discarded")}>Discard</Button>
                <Button onClick={() => toast.success("School details saved")}>Save</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prefs">
          <Card>
            <div className="p-6 space-y-1 divide-y divide-border">
              <Row title="Email notifications" desc="Send updates to admins by email">
                <Switch checked={prefs.emailNotifs} onCheckedChange={(v) => { setPrefs({...prefs, emailNotifs: v}); toast.success("Preference saved"); }} />
              </Row>
              <Row title="SMS notifications" desc="Send text messages for urgent alerts">
                <Switch checked={prefs.smsNotifs} onCheckedChange={(v) => { setPrefs({...prefs, smsNotifs: v}); toast.success("Preference saved"); }} />
              </Row>
              <Row title="Weekend day" desc="Non-working day for the school">
                <Select value={prefs.weekend} onValueChange={(v) => setPrefs({...prefs, weekend: v})}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Sun","Sat","Sat-Sun","Fri"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
              <Row title="Locale" desc="Interface language and number format">
                <Select value={prefs.locale} onValueChange={(v) => setPrefs({...prefs, locale: v})}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>{[["en-IN","English (India)"],["en-US","English (US)"],["hi-IN","हिन्दी"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
              <Row title="Currency" desc="Default currency for fees and payroll">
                <Select value={prefs.currency} onValueChange={(v) => setPrefs({...prefs, currency: v})}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>{["INR","USD","EUR","GBP","AED"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <div className="p-6 space-y-1 divide-y divide-border">
              <Row title="Two-factor authentication" desc="Require 2FA for all staff logins">
                <Switch checked={prefs.twoFA} onCheckedChange={(v) => { setPrefs({...prefs, twoFA: v}); toast.success("Security updated"); }} />
              </Row>
              <Row title="Session timeout" desc="Automatically sign out after inactivity">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{["15","30","60","120"].map(m => <SelectItem key={m} value={m}>{m} min</SelectItem>)}</SelectContent>
                </Select>
              </Row>
              <Row title="Reset admin password" desc="Send a reset link to the primary admin">
                <Button variant="outline" onClick={() => toast.success("Reset link sent")}>Send link</Button>
              </Row>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <div className="p-6 space-y-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current plan</div>
                <div className="mt-1 text-[20px] font-semibold">Enterprise</div>
                <div className="text-[12.5px] text-muted-foreground">Unlimited students · Priority support · Renews on 12 Dec 2025</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success("Invoice downloaded")}>Download invoice</Button>
                <Button onClick={() => toast.info("Redirecting to billing portal…")}>Manage billing</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-[12px]">{label}</Label>{children}</div>;
}
function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div><div className="text-[13.5px] font-medium text-foreground">{title}</div><div className="text-[11.5px] text-muted-foreground">{desc}</div></div>
      {children}
    </div>
  );
}
