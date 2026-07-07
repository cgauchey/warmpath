export type Company = {
  id: string;
  user_id: string;
  name: string;
  website: string | null;
  description: string | null;
  linkedin_url: string | null;
  industry: string | null;
  size: string | null;
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
  generation_notes: string | null;
  stage: "researching" | "applied" | "phone_screen" | "onsite" | "offer" | "rejected";
  created_at: string;
  companies?: { name: string } | null;
};

export type CompanyList = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  company_list_items?: { id: string }[];
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

export type ContactResult = {
  contact_id: string;
  name: string;
  role_title: string | null;
  company_name: string | null;
  angle: string;
  tier: 1 | 2 | 3;
};
