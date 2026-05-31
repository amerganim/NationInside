/** Activity-score point values for each contribution type. */
export const POINTS = {
  verification: 5,
  eventAttendance: 10,
  mobilizationResponse: 8,
  // tasks award their own configurable `points` value on approval
} as const;
