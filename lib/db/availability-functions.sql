-- Function to get barber's available dates
CREATE OR REPLACE FUNCTION get_barber_available_dates(
  p_barber_id INT,
  p_days_ahead INT DEFAULT 30
)
RETURNS TABLE (
  date_value DATE,
  has_availability BOOLEAN
) LANGUAGE plpgsql
AS $$
DECLARE
  v_current_date DATE := CURRENT_DATE;
  v_end_date DATE := CURRENT_DATE + p_days_ahead;
  v_barbershop_id INT;
  v_opening_time TIME;
  v_closing_time TIME;
BEGIN
  -- Get the barbershop details for this barber
  SELECT barbershop_id INTO v_barbershop_id FROM barbers WHERE id = p_barber_id;
  
  -- Get barbershop opening hours
  SELECT 
    opening_time::TIME, 
    closing_time::TIME 
  INTO v_opening_time, v_closing_time 
  FROM barbershops 
  WHERE id = v_barbershop_id;
  
  RETURN QUERY
  WITH date_series AS (
    -- Generate a series of dates for the next p_days_ahead days
    SELECT generate_series(v_current_date, v_end_date, '1 day'::interval)::DATE AS date_value
  ),
  barber_unavailability AS (
    -- Get dates where barber is fully unavailable
    SELECT DISTINCT date 
    FROM barber_unavailability 
    WHERE barber_id = p_barber_id
      AND (
        -- Full day unavailability is when start_time = opening time and end_time = closing time
        (start_time = v_opening_time AND end_time = v_closing_time)
        -- Or date range includes this date
        OR (date <= date_value AND (end_date IS NULL OR end_date >= date_value))
      )
  ),
  barber_appointments AS (
    -- Get dates that have booked appointments
    SELECT date FROM appointments
    WHERE barber_id = p_barber_id
      AND is_cancelled = FALSE
  )
  SELECT 
    ds.date_value,
    -- A date has availability if:
    -- 1. It's not in barber_unavailability (barber isn't marked as fully unavailable)
    -- 2. The total duration of appointments doesn't fill the entire day
    NOT EXISTS (
      SELECT 1 FROM barber_unavailability 
      WHERE date = ds.date_value
    ) AS has_availability
  FROM date_series ds
  ORDER BY ds.date_value;
END;
$$;

-- Function to check available time slots for a specific barber on a specific date
CREATE OR REPLACE FUNCTION get_barber_available_slots(
  p_barber_id INT,
  p_date DATE,
  p_service_ids INT[] DEFAULT NULL
)
RETURNS TABLE (
  time_slot TIME,
  end_time TIME,
  is_available BOOLEAN
) LANGUAGE plpgsql
AS $$
DECLARE
  v_barbershop_id INT;
  v_opening_time TIME;
  v_closing_time TIME;
  v_interval INTERVAL := '30 minutes'::INTERVAL;
  v_total_duration INT := 0;
BEGIN
  -- Get the barbershop details for this barber
  SELECT barbershop_id INTO v_barbershop_id FROM barbers WHERE id = p_barber_id;
  
  -- Get barbershop opening hours
  SELECT 
    opening_time::TIME, 
    closing_time::TIME 
  INTO v_opening_time, v_closing_time 
  FROM barbershops 
  WHERE id = v_barbershop_id;
  
  -- Calculate the total duration of requested services
  IF p_service_ids IS NOT NULL AND array_length(p_service_ids, 1) > 0 THEN
    SELECT COALESCE(SUM(time), 30) 
    INTO v_total_duration 
    FROM services 
    WHERE id = ANY(p_service_ids);
  ELSE
    -- Default to 30 minutes if no services specified
    v_total_duration := 30;
  END IF;
  
  RETURN QUERY
  WITH time_slots AS (
    -- Generate all possible time slots based on barbershop hours
    SELECT 
      time_slot,
      (time_slot + (v_total_duration || ' minutes')::INTERVAL) AS end_time
    FROM generate_series(
      v_opening_time, 
      -- Need to subtract service duration to ensure appointment fits in opening hours
      v_closing_time - (v_total_duration || ' minutes')::INTERVAL,
      v_interval
    ) AS time_slot
  ),
  barber_unavailability AS (
    -- Get time ranges where barber is unavailable on this date
    SELECT start_time, end_time
    FROM barber_unavailability
    WHERE barber_id = p_barber_id
      AND date = p_date
  ),
  appointments AS (
    -- Get existing appointments for this barber on this date
    SELECT 
      time::TIME AS start_time,
      COALESCE(end_time, (time::TIME + INTERVAL '30 minutes' * 
        (SELECT COALESCE(SUM(time), 30) FROM services WHERE id = ANY(appointments.service_ids)) / 30)
      )::TIME AS end_time
    FROM appointments
    WHERE barber_id = p_barber_id
      AND date = p_date
      AND is_cancelled = FALSE
  )
  SELECT 
    ts.time_slot,
    ts.end_time,
    -- A time slot is available if:
    -- 1. It's after the current time if the date is today
    -- 2. It doesn't overlap with barber's unavailable periods
    -- 3. It doesn't overlap with existing appointments
    CASE 
      WHEN p_date = CURRENT_DATE AND ts.time_slot <= CURRENT_TIME THEN FALSE
      WHEN EXISTS (
        SELECT 1 FROM barber_unavailability bu
        WHERE (ts.time_slot, ts.end_time) OVERLAPS (bu.start_time, bu.end_time)
      ) THEN FALSE
      WHEN EXISTS (
        SELECT 1 FROM appointments a
        WHERE (ts.time_slot, ts.end_time) OVERLAPS (a.start_time, a.end_time)
      ) THEN FALSE
      ELSE TRUE
    END AS is_available
  FROM time_slots ts
  ORDER BY ts.time_slot;
END;
$$;

-- Improved appointment booking function with comprehensive checks
CREATE OR REPLACE FUNCTION book_appointment_v2(
  p_barber_id INT,
  p_user_id TEXT,
  p_service_ids INT[],
  p_date DATE,
  p_time TIME,
  p_is_guest BOOLEAN DEFAULT FALSE,
  p_temporary_user_id INT DEFAULT NULL,
  p_check_only BOOLEAN DEFAULT FALSE
)
RETURNS JSON LANGUAGE plpgsql
AS $$
DECLARE
  v_barbershop_id INT;
  v_result JSON;
  v_appointment_id INT;
  v_total_duration INT;
  v_end_time TIME;
  v_appointment_exists BOOLEAN;
BEGIN
  -- Get the barbershop details for this barber
  SELECT barbershop_id INTO v_barbershop_id FROM barbers WHERE id = p_barber_id;
  
  -- Calculate total service duration
  SELECT COALESCE(SUM(time), 30) 
  INTO v_total_duration 
  FROM services 
  WHERE id = ANY(p_service_ids);
  
  -- Calculate end time
  v_end_time := p_time + (v_total_duration || ' minutes')::INTERVAL;
  
  -- Check if barber exists
  IF NOT EXISTS (SELECT 1 FROM barbers WHERE id = p_barber_id) THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Barber not found'
    );
  END IF;
  
  -- Check if services exist
  IF (SELECT COUNT(*) FROM services WHERE id = ANY(p_service_ids)) != array_length(p_service_ids, 1) THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'One or more services not found'
    );
  END IF;
  
  -- Check if barber provides these services
  IF NOT (
    SELECT BOOL_AND(EXISTS (
      SELECT 1 FROM barber_services 
      WHERE barber_id = p_barber_id AND service_id = svc_id
    ))
    FROM unnest(p_service_ids) AS svc_id
  ) THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Barber does not provide one or more of the selected services'
    );
  END IF;
  
  -- Check if date is valid (not in the past)
  IF p_date < CURRENT_DATE THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Cannot book appointments for past dates'
    );
  END IF;
  
  -- Check if time is valid for today
  IF p_date = CURRENT_DATE AND p_time <= CURRENT_TIME THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Cannot book appointments for past times'
    );
  END IF;
  
  -- Check for barber unavailability
  IF EXISTS (
    SELECT 1 FROM barber_unavailability
    WHERE barber_id = p_barber_id 
      AND date = p_date
      AND (p_time, v_end_time) OVERLAPS (start_time, end_time)
  ) THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Barber is unavailable during this time'
    );
  END IF;
  
  -- Check for appointment conflicts
  IF EXISTS (
    SELECT 1 FROM appointments
    WHERE barber_id = p_barber_id
      AND date = p_date
      AND is_cancelled = FALSE
      AND (
        (p_time, v_end_time) OVERLAPS (time::TIME, COALESCE(end_time, (time::TIME + INTERVAL '30 minutes' * 
          (SELECT COALESCE(SUM(time), 30) FROM services WHERE id = ANY(appointments.service_ids)) / 30)
        )::TIME)
      )
  ) THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Time slot is not available'
    );
  END IF;
  
  -- If this is just a check, return success
  IF p_check_only THEN
    RETURN json_build_object(
      'success', TRUE,
      'message', 'Time slot is available',
      'end_time', v_end_time::TEXT
    );
  END IF;
  
  -- Insert the appointment
  INSERT INTO appointments (
    barber_id,
    user_id,
    barbershop_id,
    date,
    time,
    service_ids,
    is_cancelled,
    is_cancelled_by_barber,
    end_time,
    duration,
    temporary_user_id
  ) VALUES (
    p_barber_id,
    p_user_id,
    v_barbershop_id,
    p_date,
    p_time,
    p_service_ids,
    FALSE,
    FALSE,
    v_end_time,
    v_total_duration,
    p_temporary_user_id
  ) RETURNING id INTO v_appointment_id;
  
  -- Return success with appointment ID
  RETURN json_build_object(
    'success', TRUE,
    'message', 'Appointment booked successfully',
    'appointment_id', v_appointment_id,
    'end_time', v_end_time::TEXT,
    'duration', v_total_duration
  );
END;
$$; 