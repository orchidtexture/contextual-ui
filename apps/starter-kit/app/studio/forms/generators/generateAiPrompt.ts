import type { FormEntity } from 'contextual-ui';
import { generateSchema } from './generateSchema';
import { generateComponent } from './generateComponent';
import { generateApiRoute } from './generateApiRoute';
import type { PromptOptions } from '../types';

export function generateAiPrompt(
  form: FormEntity,
  options?: Partial<PromptOptions>
): string {
  const schemaCode = generateSchema(form);
  const componentCode = generateComponent(form);
  const apiRouteCode = generateApiRoute(form);

  const endpointPath = form.endpoint?.startsWith('/')
    ? form.endpoint.slice(1)
    : form.endpoint || 'api/form';

  const aiTarget = options?.aiTarget || 'cursor';
  const integration = options?.integration || 'none';
  const customInstructions = options?.customInstructions?.trim();

  let targetPreamble = '';
  if (aiTarget === 'cursor') {
    targetPreamble = `You are working as an expert full-stack developer in Cursor.`;
  } else if (aiTarget === 'claude') {
    targetPreamble = `You are Claude Code acting as an expert Next.js and TypeScript architect.`;
  } else if (aiTarget === 'v0') {
    targetPreamble = `Generate the Next.js and Tailwind component with the following specifications.`;
  } else {
    targetPreamble = `You are an expert Next.js and TypeScript developer.`;
  }

  let integrationInstructions = '';
  let extraPackages = '';
  if (integration === 'resend') {
    extraPackages = ' resend';
    integrationInstructions = `
- Configure email notification in the backend handler using \`resend\` to send an alert on new submissions.`;
  } else if (integration === 'supabase') {
    extraPackages = ' @supabase/supabase-js';
    integrationInstructions = `
- Insert the validated payload into the Supabase \`${form.id || 'submissions'}\` table using the server Supabase client.`;
  } else if (integration === 'prisma') {
    extraPackages = ' @prisma/client';
    integrationInstructions = `
- Persist the validated record into the database via Prisma client (e.g., \`prisma.${form.id || 'submission'}.create\`).`;
  } else if (integration === 'drizzle') {
    extraPackages = ' drizzle-orm';
    integrationInstructions = `
- Persist the validated submission using Drizzle ORM into the corresponding schema table.`;
  }

  const customNotes = customInstructions
    ? `\n- Additional user requirements: ${customInstructions}`
    : '';

  return `${targetPreamble}

I need to implement a production-ready "${form.title || form.name || 'Form'}" in my Next.js (App Router) project using \`contextual-ui\` and \`zod\`.

Please install the required dependencies if not already installed:
\`\`\`bash
npm install contextual-ui zod${extraPackages}
\`\`\`

Then create and wire the following 3 files:

---

### File 1: Schema Definition (\`src/forms/${form.id || 'form'}.schema.ts\`)
\`\`\`typescript
${schemaCode.trim()}
\`\`\`

---

### File 2: Form Component (\`src/components/${form.id || 'form'}-form.tsx\`)
\`\`\`tsx
${componentCode.trim()}
\`\`\`

---

### File 3: Next.js API Route Handler (\`app/${endpointPath}/route.ts\`)
\`\`\`typescript
${apiRouteCode.trim()}
\`\`\`

---

### Implementation Instructions:
1. Ensure the form component properly handles loading, disabled, and validation error states.
2. In \`app/${endpointPath}/route.ts\`, import \`${form.id || 'form'}Schema\` from \`@/forms/${form.id || 'form'}.schema\`.${integrationInstructions}${customNotes}
3. Maintain accessible HTML semantics and full TypeScript type safety throughout.
`;
}
