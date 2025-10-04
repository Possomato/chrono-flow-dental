'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const appointmentSchema = z.object({
  patientId: z.string({ required_error: 'Paciente é obrigatório.' }),
  procedureId: z.string({ required_error: 'Procedimento é obrigatório.' }),
  dateTime: z.string({ required_error: 'Data e hora são obrigatórios.' }),
  observations: z.string().optional(),
  paymentMethod: z.string().optional(),
})

export async function createAppointment(data: unknown) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado.' }
  }

  const validatedFields = appointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { patientId, procedureId, dateTime, observations, paymentMethod } = validatedFields.data;

  const { error } = await supabase.from('appointments').insert({
    id_dentist: user.id,
    id_patient: parseInt(patientId),
    id_procedure: parseInt(procedureId),
    date: dateTime, // The 'date' column is of type TIMESTAMPTZ
    observations,
    payment_method: paymentMethod,
    status: 'Scheduled',
  })

  if (error) {
    // Basic check for a double-booking conflict
    if (error.code === '23505') { // unique_violation
        return { error: 'Já existe uma consulta para este horário.' }
    }
    return {
      error: 'Não foi possível criar a consulta. Verifique os dados e tente novamente.',
    }
  }

  revalidatePath('/appointments')
  revalidatePath('/dashboard')

  return {
    success: 'Consulta criada com sucesso!',
  }
}