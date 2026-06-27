"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type FollowUp = {
  id: string;
  follow_up_date: string;
  type: string;
  summary: string | null;
  contact_name: string | null;
  role_title: string | null;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function FollowUpCalendar({ followUps }: { followUps: FollowUp[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const monthLabel = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  const followUpsByDate = new Map<string, FollowUp[]>();
  for (const fu of followUps) {
    const existing = followUpsByDate.get(fu.follow_up_date) ?? [];
    existing.push(fu);
    followUpsByDate.set(fu.follow_up_date, existing);
  }

  function prev() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function next() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card className="overflow-visible">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prev} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2">←</button>
          <h2 className="text-sm font-medium">{monthLabel}</h2>
          <button onClick={next} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2">→</button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayFollowUps = followUpsByDate.get(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div key={dateStr} className="relative group min-h-[2.5rem] flex flex-col items-center pt-1">
                <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-foreground text-background font-medium" : ""}`}>
                  {day}
                </span>
                {dayFollowUps && (
                  <>
                    <div className="flex gap-0.5 mt-0.5">
                      {dayFollowUps.length <= 3
                        ? dayFollowUps.map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)
                        : <>
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                            <span className="text-[10px] text-muted-foreground leading-none">{dayFollowUps.length}</span>
                          </>
                      }
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 z-10 hidden group-hover:block w-52 bg-popover border border-border rounded-lg shadow-lg p-3 mt-1">
                      {dayFollowUps.map((fu) => (
                        <div key={fu.id} className="text-xs py-1.5 border-b border-border/60 last:border-0">
                          <p className="font-medium">{fu.contact_name || fu.role_title}</p>
                          <p className="text-muted-foreground">{fu.type?.replace(/_/g, " ")}</p>
                          {fu.summary && <p className="text-muted-foreground truncate">{fu.summary}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
