-- Create profiles table for dentists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cro INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id SERIAL PRIMARY KEY,
  dentist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Patients policies
CREATE POLICY "Dentists can view their own patients"
  ON public.patients FOR SELECT
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can create patients"
  ON public.patients FOR INSERT
  WITH CHECK (auth.uid() = dentist_id);

CREATE POLICY "Dentists can update their own patients"
  ON public.patients FOR UPDATE
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can delete their own patients"
  ON public.patients FOR DELETE
  USING (auth.uid() = dentist_id);

-- Create procedures table
CREATE TABLE IF NOT EXISTS public.procedures (
  id SERIAL PRIMARY KEY,
  dentist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;

-- Procedures policies
CREATE POLICY "Dentists can view their own procedures"
  ON public.procedures FOR SELECT
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can create procedures"
  ON public.procedures FOR INSERT
  WITH CHECK (auth.uid() = dentist_id);

CREATE POLICY "Dentists can update their own procedures"
  ON public.procedures FOR UPDATE
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can delete their own procedures"
  ON public.procedures FOR DELETE
  USING (auth.uid() = dentist_id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id SERIAL PRIMARY KEY,
  dentist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id INTEGER NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  procedure_id INTEGER NOT NULL REFERENCES public.procedures(id) ON DELETE RESTRICT,
  date TIMESTAMPTZ NOT NULL,
  observations TEXT,
  payment_method TEXT,
  payment_date TEXT,
  status TEXT NOT NULL DEFAULT 'agendada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Dentists can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = dentist_id);

CREATE POLICY "Dentists can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = dentist_id);

CREATE POLICY "Dentists can delete their own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = dentist_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_procedures_updated_at
  BEFORE UPDATE ON public.procedures
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, cro, name, phone)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'cro')::INTEGER,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();