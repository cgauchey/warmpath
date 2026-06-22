export type Company = {
  id: string;
  user_id: string;
  name: string;
  notes: string | null;
  created_at: string;
};

export type Contact = {
  id: string;
  user_id: string;
  company_id: string | null;
  name: string;
  role_title: string | null;
  relationship: "warm" | "cold" | "recruiter" | "referral" | null;
  linkedin_url: string | null;
  notes: string | null;
  stage: "not_contacted" | "reached_out" | "responded" | "call_scheduled" | "intro_made";
  created_at: string;
  companies?: { name: string } | null; // present when joined
};

export type Role = {
  id: string;
  user_id: string;
  company_id: string | null;
  title: string;
  job_description: string | null;
  source_url: string | null;
  stage: "researching" | "applied" | "phone_screen" | "onsite" | "offer" | "rejected";
  created_at: string;
  companies?: { name: string } | null;
};

export type Interaction = {
  id: string;
  user_id: string;
  contact_id: string | null;
  role_id: string | null;
  type: "email" | "call" | "linkedin" | "coffee_chat" | "interview";
  summary: string | null;
  interaction_date: string | null;
  follow_up_date: string | null;
  created_at: string;
};
