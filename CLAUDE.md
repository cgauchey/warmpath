@AGENTS.md

Styling system

Foundation

Use shadcn/ui for all primitives (Button, Card, Input, Dialog, Badge, etc.). Do not hand-build a component that shadcn already provides — generate it and customize via the token layer.
All styling via Tailwind utility classes. No inline style={{}}, no CSS Modules, no styled-components.
Colors, radius, and spacing come from the design tokens (CSS variables in globals.css). Reference tokens (bg-background, text-muted-foreground, rounded-lg) — never hardcode hex values or arbitrary pixel radii.

Component discipline

If a UI pattern appears twice, extract it into components/. No copy-pasted Tailwind soup across pages.
Compose pages from the component vocabulary; pages should read as layout + composed components, not long walls of utilities.
Keep className lists readable; when they get long, lean on a primitive or a variant rather than stacking 15 utilities.

Visual direction

Aesthetic: professional, calm, and focused — closer to a refined productivity tool (Linear, Notion) than a generic SaaS marketing site. Avoid default-bootstrap-blue and gradient-heavy looks.
One accent color used intentionally for primary actions and active states; neutrals carry the rest of the UI.
One typeface (Inter or Geist). Establish hierarchy through weight and size, not multiple fonts.
Generous whitespace, consistent radius, restrained borders. Restraint reads as polish.
Support light and dark mode through the token variables from the start.

## Conventions

### Supabase server client

Import from `@/lib/supabase/server`. The function is async:

```ts
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
```

### Authentication

Every server action and API route must verify the user before doing anything:

```ts
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect('/login'); // in form actions
if (!user) return; // in void actions
```

All database queries must scope to the authenticated user with `.eq("user_id", user.id)`.

### Response shapes

**Server actions** (`"use server"`) do not return JSON. They follow one of two patterns:

```ts
// Form actions: throw on error, revalidate + redirect on success
if (error) throw error;
revalidatePath('/dashboard/roles');
redirect('/dashboard/roles');

// Void actions: silent return on auth failure, throw on DB error
if (!user) return;
if (error) throw error;
revalidatePath(`/dashboard/contacts/${contactId}`);
```

**Server actions that return data** use `{ data?, error? }`:

```ts
// Success
return { data: { title, company, job_description } };

// Error
return { error: 'Could not fetch page (404)' };
```

**API routes** should follow the same `{ data, error }` shape with `NextResponse.json()`:

```ts
// Success
return NextResponse.json({ data: result });

// Error
return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
```
