import type { FormEntity } from 'contextual-ui';
import { generateSchema } from './generateSchema';
import { generateComponent } from './generateComponent';
import { generateApiRoute } from './generateApiRoute';

export function generateAiPrompt(form: FormEntity): string {
  const schemaCode = generateSchema(form);
  const componentCode = generateComponent(form);
  const apiRouteCode = generateApiRoute(form);

  const endpointPath = form.endpoint?.startsWith('/')
    ? form.endpoint.slice(1)
    : form.endpoint || 'api/form';

  return `I need to implement a production-ready "${form.title || form.name || 'Form'}" in my Next.js (App Router) project using the \`contextual-ui\` and \`zod\` packages.

Please install the required dependencies if not already installed:
\`\`\`bash
npm install contextual-ui zod
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

### Instructions:
1. Ensure the component correctly handles loading and error states.
2. In \`app/${endpointPath}/route.ts\`, import \`${form.id || 'form'}Schema\` from \`@/forms/${form.id || 'form'}.schema\`.
3. Hook up any database storage, email notifications, or analytics needed for this form submission.
`;
}
