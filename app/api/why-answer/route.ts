import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const PROMPT_VERSION = "v1";

const SYSTEM_PROMPT = `You are a professional career coach helping a job applicant write concise, compelling answers for job applications. Write in first person from the applicant's perspective. This will be submitted as part of a job application.

Your answer MUST be 3-5 sentences. No more. Be direct and specific.

You will be given the job title, company name, and job description. Use all three to tailor the answer. Reference specific aspects of the role and company, not generic praise. Use what you know about the company (mission, product, industry, recent work) to make the answer feel informed and specific. Connect the applicant's background to what makes this particular role and company a fit.

If <additional_context> is provided, treat it as high-priority personal detail from the applicant and weave it directly into the answer.

Write in a natural, human voice that matches the tone and style of the examples below. Sound like a real person, not a language model. Avoid generic corporate language, filler phrases, and overly polished phrasing. Never use emdashes (the long dash character) or colons. Use commas, periods, or restructure the sentence instead.

<examples>
Q: Why are you a good fit for Chief of Staff to CEO and President at Orca Bio?
A: I'm a strong match for this role because my career has centered on bringing together technical, operational, and business stakeholders to drive complex initiatives forward. As a software engineer at JPMorgan, I led emerging technology projects that required coordinating across product, engineering, compliance, and executive leadership, while my experience running an accelerator and working in venture capital strengthened my ability to synthesize information, manage competing priorities, and communicate clearly with diverse audiences. My MS in Computer Science gives me the analytical rigor to quickly understand complex topics, and I'm comfortable moving between high-level strategy and hands-on execution. Most importantly, I enjoy being the person who brings clarity, alignment, and momentum to cross-functional teams working toward ambitious goals.

Q: Why do you want to work at Palantir?
A: What draws me to Palantir is the opportunity to work on hard, real-world problems while staying close to the people you're building for. I've realized over the course of my career that I'm most energized when I'm working directly with users, figuring out what's actually broken, and building solutions that have a clear impact. At JPMorgan, some of my favorite projects were the ones where I got to bridge the gap between technical implementation and business needs, and that's something I've continued to seek out through my master's in machine learning and my work in venture. The FDSE role stands out because it combines technical problem-solving with ownership, customer interaction, and a lot of ambiguity, which are all things I genuinely enjoy.

Q: Why are you interested in Goodfire?
A: What interests me about Goodfire is that you're tackling a problem that feels foundational to the future of AI. As models become more capable, understanding what's happening inside them becomes increasingly important, and I think interpretability is one of the most interesting areas in the field right now.

My background has been somewhat unconventional. I studied psychology and economics at Barnard, later worked as a software engineer at JPMorgan, and then completed my MS in Computer Science at Columbia. A common thread across those experiences has been trying to understand how complex systems work, whether that's human behavior, organizations, or machine learning models. Goodfire's mission resonates with me because it's focused on making these systems more understandable rather than simply building on top of them.

I spend a lot of time looking at AI companies in my current role in venture, and Goodfire stands out because you're working on a genuinely difficult technical problem with the potential to shape how future AI systems are developed and trusted.
</examples>`;

const QUESTION_TEXT: Record<string, string> = {
  why_role: "Why are you interested in this role?",
  why_company: "Why do you want to work at this company?",
  both: "Why are you interested in this role at this company?",
};

type RequestBody = {
  roleId: string;
  questionType: "why_company" | "why_role" | "both";
  resumeIndexes: number[] | "all";
  additionalContext: string | null;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as RequestBody;
  const { roleId, questionType, resumeIndexes, additionalContext } = body;

  if (!roleId || !questionType) {
    return Response.json(
      { error: "roleId and questionType are required" },
      { status: 400 }
    );
  }

  const [{ data: profile }, { data: role }, { data: recentAnswers }] =
    await Promise.all([
      supabase
        .from("user_profile")
        .select(
          "resume_text, background_notes, values_motivations, career_narrative, writing_samples, voice_profile"
        )
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("roles")
        .select("title, job_description, source_url, companies(name)")
        .eq("id", roleId)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("why_answers")
        .select("answer_text, question_type")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  if (!profile) {
    return Response.json(
      { error: "Please fill out your profile first" },
      { status: 400 }
    );
  }

  if (!role) {
    return Response.json({ error: "Role not found" }, { status: 404 });
  }

  const allResumes = (profile.resume_text as { label: string; text: string }[] | null) ?? [];
  let selectedResumes: { label: string; text: string }[];
  if (resumeIndexes === "all") {
    selectedResumes = allResumes;
  } else {
    selectedResumes = resumeIndexes
      .filter((i) => i >= 0 && i < allResumes.length)
      .map((i) => allResumes[i]);
  }

  const resumeText = selectedResumes
    .map((r) => `[${r.label}]\n${r.text}`)
    .join("\n\n---\n\n");

  const parts: string[] = [];

  if ((profile as any).voice_profile)
    parts.push(
      `<voice_profile>\n${(profile as any).voice_profile}\n</voice_profile>`
    );

  if (recentAnswers && recentAnswers.length > 0) {
    const exampleLines = recentAnswers
      .map((a) => `[${QUESTION_TEXT[a.question_type] ?? a.question_type}]\n${a.answer_text}`)
      .join("\n\n---\n\n");
    parts.push(`<your_writing_examples>\n${exampleLines}\n</your_writing_examples>`);
  }

  if (resumeText) parts.push(`<resume>\n${resumeText}\n</resume>`);
  if (profile.background_notes)
    parts.push(`<background>\n${profile.background_notes}\n</background>`);
  if (profile.values_motivations)
    parts.push(`<values>\n${profile.values_motivations}\n</values>`);
  if (profile.career_narrative)
    parts.push(
      `<career_narrative>\n${profile.career_narrative}\n</career_narrative>`
    );
  parts.push(`<role_title>${role.title}</role_title>`);
  if ((role as any).companies?.name)
    parts.push(`<company>${(role as any).companies.name}</company>`);
  if (role.job_description)
    parts.push(
      `<job_description>\n${role.job_description}\n</job_description>`
    );
  if (additionalContext)
    parts.push(
      `<additional_context>\n${additionalContext}\n</additional_context>`
    );
  parts.push(`\nWrite a response to: "${QUESTION_TEXT[questionType]}"`);

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: parts.join("\n\n") }],
    });

    return new Response(stream.toReadableStream(), {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to generate" },
      { status: 500 }
    );
  }
}
