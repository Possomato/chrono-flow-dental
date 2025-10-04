-- Seed Patients
INSERT INTO public.patients (name, phone, email, observations)
VALUES
('Ana Silva', '(11) 98765-4321', 'ana.silva@example.com', 'Alergia a penicilina.'),
('Bruno Costa', '(21) 91234-5678', 'bruno.costa@example.com', 'Paciente ansioso, requer mais tempo para os procedimentos.'),
('Carla Dias', '(31) 99999-8888', 'carla.dias@example.com', 'Nenhuma observação médica relevante.'),
('Daniel Martins', '(41) 98888-7777', 'daniel.martins@example.com', 'Gengivas sensíveis.'),
('Eduarda Souza', '(51) 97777-6666', 'eduarda.souza@example.com', 'Usa aparelho ortodôntico.');

-- Seed Procedures
INSERT INTO public.procedures (name, description, value)
VALUES
('Limpeza Dental', 'Remoção de placa bacteriana e tártaro.', 200.00),
('Restauração (Obturação)', 'Reparo de dentes danificados por cáries.', 350.00),
('Tratamento de Canal', 'Remoção da polpa dentária infectada.', 800.00),
('Extração de Dente', 'Remoção de um dente danificado ou siso.', 450.00),
('Clareamento Dental', 'Procedimento estético para clarear os dentes.', 1200.00),
('Implante Dentário', 'Substituição de uma raiz dentária por um pino de titânio.', 3500.00),
('Coroa Dentária', 'Capa em formato de dente que é colocada sobre um dente.', 1500.00),
('Radiografia Panorâmica', 'Exame de raio-x que mostra todos os dentes de uma só vez.', 150.00);

-- Note: Appointments are not seeded here because they require a dynamic `id_dentist`
-- which is created upon user signup. Please register a new dentist user via the application
-- and create appointments through the UI.