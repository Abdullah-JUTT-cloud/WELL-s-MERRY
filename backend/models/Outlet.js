import mongoose from "mongoose";

const outletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Outlet name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      // GeoJSON point — enables "find outlets near me" queries later
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    openingHours: {
      type: String, // simple text for now, e.g. "10:00 AM - 10:00 PM"
    },
    isActive: {
      type: Boolean,
      default: true, // lets you temporarily hide a closed/paused outlet
    },
  },
  { timestamps: true }
);

// Enables geospatial queries like "outlets within X km of a point"
outletSchema.index({ location: "2dsphere" });

const Outlet = mongoose.model("Outlet", outletSchema);
export default Outlet;