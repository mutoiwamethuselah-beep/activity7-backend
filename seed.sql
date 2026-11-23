-- Inserts the made-up starting records only when the table is empty,
-- so running it twice does not create duplicates.
INSERT INTO records (title, category, description, status)
SELECT * FROM (VALUES
  ('Broken classroom light', 'Electrical', 'The light in Room B12 does not switch on.', 'Pending'),
  ('Leaking tap in library toilet', 'Plumbing', 'The second tap from the door drips all day and floods the sink.', 'In progress'),
  ('Broken lecture hall chair', 'Furniture', 'Chair in row 4, seat 7 of Lecture Hall A has a cracked leg.', 'Pending'),
  ('Flickering corridor lights', 'Electrical', 'Three tube lights in the engineering block corridor flicker at night.', 'Completed'),
  ('Blocked sink in computer lab', 'Plumbing', 'The sink at the back of Lab 2 drains very slowly.', 'In progress'),
  ('Wobbly desk in Room C3', 'Furniture', 'The front-left desk wobbles and a student keeps losing notes.', 'Completed'),
  ('Socket sparks in hostel room', 'Electrical', 'The wall socket near the bed sparks when a charger is plugged in.', 'Pending'),
  ('No water at cafeteria tap', 'Plumbing', 'The outside tap at the cafeteria has had no water since Monday.', 'Pending')
) AS starter(title, category, description, status)
WHERE NOT EXISTS (SELECT 1 FROM records);
