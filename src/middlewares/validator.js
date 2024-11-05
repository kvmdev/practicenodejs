import { prisma } from "../../config/db.js";

const validate = (req, res, next, schema) => {
  try {
    req.body.price = Number(req.body.price);
    req.body.stock = Number(req.body.stock);
    req.body.category_id = Number(req.body.category_id);
    
    const parseResult = schema.safeParse(req.body);
    
    // If validation fails, send an error response and return early
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    
    const category_id = req.body.category_id;

    // Find the category in the database
    prisma.category.findUnique({
        where: {
          id: category_id
        },
      })
      .then((val) => {
        if (!val) {
          // If category not found, send a 404 error
          return res.status(404).json({ message: "Category not found" });
        }
          req.validatedData = req.body;
          next()
      })
      .catch((err) => {
        // If there's an error with the database query, send a 500 error
        console.error(err);
        return res.status(500).json({ message: "There was an error", err });
      });
    
  } catch (error) {
    // Catch any other errors and send a 400 response
    return res.status(400).json({ message: "Not enough arguments" });
  }
};

export { validate };
