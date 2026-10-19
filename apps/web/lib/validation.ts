import type { CreateProfileInput, UpdateProfileInput } from "@bridge/shared-types";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProfileInput(
  input: CreateProfileInput | UpdateProfileInput
): ValidationResult {
  const errors: string[] = [];

  if ("birth_date" in input && input.birth_date != null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birth_date)) {
      errors.push("birth_date must be in YYYY-MM-DD format");
    } else {
      const d = new Date(input.birth_date + "T00:00:00Z");
      if (isNaN(d.getTime())) {
        errors.push("birth_date is not a valid date");
      }
    }
  }

  if ("birth_time" in input && input.birth_time != null) {
    if (!/^\d{2}:\d{2}$/.test(input.birth_time)) {
      errors.push("birth_time must be in HH:MM format");
    } else {
      const [h, m] = input.birth_time.split(":").map(Number);
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        errors.push("birth_time is out of range");
      }
    }
  }

  if ("birth_latitude" in input && input.birth_latitude != null) {
    if (input.birth_latitude < -90 || input.birth_latitude > 90) {
      errors.push("birth_latitude must be between -90 and 90");
    }
  }

  if ("birth_longitude" in input && input.birth_longitude != null) {
    if (input.birth_longitude < -180 || input.birth_longitude > 180) {
      errors.push("birth_longitude must be between -180 and 180");
    }
  }

  if ("display_name" in input && input.display_name != null) {
    if (input.display_name.length > 100) {
      errors.push("display_name must be 100 characters or fewer");
    }
  }

  return { valid: errors.length === 0, errors };
}
