export interface IFilters {
  [field: string]: Record<string, any>;
}

export const craftQuery = (
  filters?: IFilters,
  allowedFields: string[] = []
) => {
  if (!filters) return {};

  const criteria: IFilters = {};

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

export const craftSort = (sort: string) => {
  const [fieldName, order] = sort.split(":");
  return { [fieldName]: order === "desc" ? -1 : 1 };
};

export const craftPagination = (page: number = 1, limit: number = 20) => {
  if (page < 1) {
    page = 1;
  }
  limit = Math.min(parseInt(limit.toString()) || 20, 500);
  const skip = (page - 1) * limit;
  return { skip, limit };
};
// const filters = { title: { eq: "Room 1" } };

// buildQuery(filters, ["title"]);
