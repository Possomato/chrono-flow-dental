'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const patientFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  email: z.string().email('Email inválido.').optional().or(z.literal('')),
  observations: z.string().optional(),
});

export async function createPatient(data: unknown) {
  const supabase = createClient()

  const validatedFields = patientFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, phone, email, observations } = validatedFields.data;

  const { error } = await supabase.from('patients').insert({
    name,
    phone,
    email: email || null,
    observations,
  })

  if (error) {
    return {
      error: 'Não foi possível cadastrar o paciente. Tente novamente.',
    }
  }

  revalidatePath('/patients')

  return {
    success: 'Paciente cadastrado com sucesso!',
  }
}