interface Filters {
  [field: string]: Record<string, any>;
}

export const buildQuery = (filters?: Filters, allowedFields: string[] = []) => {
  if (!filters) return {};

  const criteria: Filters = {};

  for (const [field, condition] of Object.entries(filters)) {
    if (!allowedFields.includes(field)) {
      continue; // Skip fields not in allowed list
    }

    const [operator, value] = Object.entries(condition)[0] || [];

    if (!operator || value === undefined) {
      continue;
    }

    switch (operator.toLowerCase()) {
      case "eq":
      case "gt":
      case "gte":
      case "lt":
      case "lte":
      case "ne":
      case "in":
      case "nin":
      case "exists":
      case "type":
      case "regex":
        // Handle other operators as before
        criteria[field] = { [`$${operator}`]: value };
        break;
      case "between":
        // Handle 'between' operator for date range
        const [startDate, endDate] = value;
        criteria[field] = { $gte: startDate, $lte: endDate };
        break;

      case "$in":
        criteria[field] = {
          $in: value.split(",").map((v: string) => v.trim()),
        };
        break;
      default:
        break;
    }
  }

  return criteria;
};
