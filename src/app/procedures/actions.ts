'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const procedureFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  value: z.coerce.number().min(0, 'O valor deve ser positivo.'),
});

export async function createProcedure(data: unknown) {
  const supabase = createClient()

  const validatedFields = procedureFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, value } = validatedFields.data;

  const { error } = await supabase.from('procedures').insert({
    name,
    description: description || null,
    value,
  })

  if (error) {
    return {
      error: 'Não foi possível cadastrar o procedimento. Tente novamente.',
    }
  }

  revalidatePath('/procedures')

  return {
    success: 'Procedimento cadastrado com sucesso!',
  }
}