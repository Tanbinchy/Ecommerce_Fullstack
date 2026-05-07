const express = require("express");
const createError = require("http-errors");
const {
  seedUser,
  seedCategory,
  seedProduct,
  seedDemo,
} = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.use((req, res, next) => {
  if (!process.env.SEED_SECRET) {
    return next(
      createError(
        403,
        "Seed routes are disabled. Set SEED_SECRET or use npm run seed:demo.",
      ),
    );
  }

  if (req.query.key !== process.env.SEED_SECRET) {
    return next(createError(403, "Valid seed key is required"));
  }

  next();
});

seedRouter.get("/demo", seedDemo);
seedRouter.get("/users", seedUser);
seedRouter.get("/categories", seedCategory);
seedRouter.get("/products", seedProduct);

module.exports = seedRouter;
