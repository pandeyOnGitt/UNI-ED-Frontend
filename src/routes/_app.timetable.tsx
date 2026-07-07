import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card } from "@/components/app/ui";
import { GRADES, SECTIONS, SUBJECTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer } from "lucide-react";

export const Route = createFileRoute("/_app/timetable")({ component: TimetablePage });

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PERIODS = ["08:15", "09:15", "10:15", "11:15", "12:30", "13:30", "14:30"];

function generateGrid(seed: string) {
  const grid: Record<string, Record<string, { subject: string; teacher: string }>> = {};
  let s = seed.length;
  DAYS.forEach((d) => {
    grid[d] = {};
    PERIODS.forEach((p, i) => {
      if (i === 3) { grid[d][p] = { subject: "Break", teacher: "" }; return; }
      s = (s * 9301 + 49297) % 233280;
      const subj = SUBJECTS[Math.floor((s / 233280) * SUBJECTS.length)];
      grid[d][p] = { subject: subj, teacher: `Mr. ${["Iyer","Sharma","Kapoor","Das","Nair"][i % 5]}` };
    });
  });
  return grid;
}

function TimetablePage() {
  const [grade, setGrade] = useState("Grade 6");
  const [section, setSection] = useState("A");
  const grid = generateGrid(`${grade}-${section}`);

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Academics"
        title="Timetable"
        subtitle="Weekly schedule per class. Edit periods with a click."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Timetable printed")}><Printer /> Print</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("PDF downloaded")}><Download /> Export PDF</Button>
          </>
        }
      />

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="h-9 w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Time</th>
                {DAYS.map((d) => <th key={d} className="px-4 py-3 text-left font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((p, pi) => (
                <tr key={p} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-[11.5px] font-medium tabular-nums text-muted-foreground align-top">{p}</td>
                  {DAYS.map((d) => {
                    const cell = grid[d][p];
                    const isBreak = pi === 3;
                    return (
                      <td key={d} className="p-2 align-top">
                        <button
                          onClick={() => !isBreak && toast.info(`${d} ${p} — ${cell.subject}`)}
                          className={`w-full text-left rounded-md px-3 py-2 border transition-colors ${
                            isBreak
                              ? "border-dashed border-border bg-transparent text-muted-foreground"
                              : "border-border bg-surface hover:bg-surface-2"
                          }`}
                        >
                          <div className="text-[12.5px] font-medium text-foreground">{cell.subject}</div>
                          {cell.teacher && <div className="text-[11px] text-muted-foreground mt-0.5">{cell.teacher}</div>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
