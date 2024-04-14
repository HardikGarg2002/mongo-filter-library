// A function to convert input filter from req of get api request to filter object required for mongoose filter queries

export const convertFilterToMongo = (req) => {
  const filter = {};
  for (const key in req.query) {
    if (req.query[key] !== "") {
      filter[key] = req.query[key];
    }
  }
  return filter;
};
