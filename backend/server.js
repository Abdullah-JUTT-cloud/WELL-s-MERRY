import "./config/env.js"; // must be the very first import — loads .env before other modules read process.env

import connectDB from "./config/db.js";
import app from "./app.js";

/* =====================================================================
   Process entry point.

   All Express wiring lives in app.js so the route table can be booted in
   tests without connecting to Mongo or binding a port. Everything here is
   process-level: connect the database, then listen.
   ===================================================================== */

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
