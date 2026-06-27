"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/brand/icon-button";

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
    <div className="bg-brand-surface rounded-2xl p-6 overflow-visible">
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={prev} variant="outlined" color="white" size="sm">←</IconButton>
        <h2 className="text-sm font-black text-white uppercase tracking-widest">{monthLabel}</h2>
        <IconButton onClick={next} variant="outlined" color="white" size="sm">→</IconButton>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1 text-[10px] font-black text-white/30 uppercase">{d}</div>
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
              <span className={cn(
                "text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold transition-colors",
                isToday
                  ? "bg-brand-orange text-white"
                  : "text-white/50 hover:text-white"
              )}>
                {day}
              </span>
              {dayFollowUps && (
                <>
                  <div className="flex gap-0.5 mt-0.5">
                    {dayFollowUps.length <= 3
                      ? dayFollowUps.map((_, i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        ))
                      : <>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                          <span className="text-[10px] text-white/40 leading-none">{dayFollowUps.length}</span>
                        </>
                    }
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 z-10 hidden group-hover:block w-52 bg-brand-surface border border-brand-orange/30 rounded-xl p-3 mt-1">
                    {dayFollowUps.map((fu) => (
                      <div key={fu.id} className="text-xs py-1.5 border-b border-white/10 last:border-0">
                        <p className="font-bold text-white">{fu.contact_name || fu.role_title}</p>
                        <p className="text-white/50">{fu.type?.replace(/_/g, " ")}</p>
                        {fu.summary && <p className="text-white/40 truncate">{fu.summary}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
