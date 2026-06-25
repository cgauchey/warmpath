# WarmPath

A job search CRM for tracking roles, contacts, and networking activity. Built with Next.js, Supabase, and Claude.

## Features

- **Roles** -- Track job applications with stage management (researching, applied, phone screen, onsite, offer, rejected), job descriptions, and source URLs. Import roles from job posting URLs with auto-scraping.
- **Contacts** -- Manage networking contacts with relationship tracking, LinkedIn URLs, company associations, and interaction history.
- **Profile** -- Store multiple resume versions (upload PDF/DOCX/TXT or paste text), background notes, career narrative, values, and writing samples.
- **Why Answer Generator** -- AI-powered answer generation for "Why this role?" / "Why this company?" questions. Streams responses from Claude, lets you edit before saving, and stores answers for reuse. Learns your writing voice over time: each time you edit a generated answer before saving, the system diffs the original and your version, extracts style preferences (tone, sentence length, vocabulary, structure), and updates a voice profile stored on your account. Future generations incorporate that profile alongside examples of your past answers, so the output gets closer to your natural voice with each use.
- **Follow-up Calendar** -- Dashboard view of upcoming follow-ups across contacts and roles.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database & Auth**: Supabase (Postgres + Row Level Security)
- **AI**: Anthropic Claude API (streaming)
- **UI**: shadcn/ui, Tailwind CSS
- **PDF/DOCX parsing**: unpdf, mammoth

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` with your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)
