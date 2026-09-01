import type { FormEntity } from 'contextual-ui';
import { generateSchema } from './generateSchema';

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

export function generateApiRoute(form: FormEntity): string {
  const schemaName = `${toCamelCase(form.id || 'form')}Schema`;

  return `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ${schemaName} } from './schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload against single source of truth Zod schema
    const parsed = ${schemaName}.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parsed.data;

    // TODO: Process data (e.g., save to database, dispatch webhook, send email)
    console.log('[API ${form.endpoint || '/api/form'}] Received submission:', validData);

    return NextResponse.json({
      success: true,
      message: '${form.successMessage || 'Form submitted successfully!'}',
      received: validData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
`;
}
