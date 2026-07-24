import asyncHandler from "express-async-handler";
import Outlet from "../models/Outlet.js";

// @desc    Get all active outlets (optionally filter by city)
// @route   GET /api/outlets
// @access  Public
export const getOutlets = asyncHandler(async (req, res) => {
  const { city } = req.query;

  const filter = { isActive: true };
  if (city) filter.city = { $regex: `^${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }; // escape user input to prevent ReDoS

  const outlets = await Outlet.find(filter).sort({ city: 1, name: 1 });
  res.json(outlets);
});

// @desc    Get outlets near a given point (for "find a store near me")
// @route   GET /api/outlets/nearby?lng=..&lat=..&maxDistanceKm=10
// @access  Public
export const getNearbyOutlets = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistanceKm } = req.query;

  if (!lng || !lat) {
    res.status(400);
    throw new Error("lng and lat query params are required");
  }

  const maxDistance = (Number(maxDistanceKm) || 25) * 1000; // km -> meters

  const outlets = await Outlet.find({
    isActive: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  res.json(outlets);
});

// @desc    Create an outlet
// @route   POST /api/outlets
// @access  Private/Admin
export const createOutlet = asyncHandler(async (req, res) => {
  const { name, address, city, phone, coordinates, openingHours } = req.body;

  if (!name || !address || !city || !coordinates || coordinates.length !== 2) {
    res.status(400);
    throw new Error("Name, address, city and [lng, lat] coordinates are required");
  }

  const outlet = await Outlet.create({
    name,
    address,
    city,
    phone,
    openingHours,
    location: { type: "Point", coordinates },
  });

  res.status(201).json(outlet);
});

// @desc    Update an outlet
// @route   PUT /api/outlets/:id
// @access  Private/Admin
export const updateOutlet = asyncHandler(async (req, res) => {
  const outlet = await Outlet.findById(req.params.id);
  if (!outlet) {
    res.status(404);
    throw new Error("Outlet not found");
  }

  const { coordinates, ...rest } = req.body;
  Object.assign(outlet, rest);
  if (coordinates && coordinates.length === 2) {
    outlet.location = { type: "Point", coordinates };
  }

  const updated = await outlet.save();
  res.json(updated);
});

// @desc    Soft-delete (deactivate) an outlet
// @route   DELETE /api/outlets/:id
// @access  Private/Admin
export const deleteOutlet = asyncHandler(async (req, res) => {
  const outlet = await Outlet.findById(req.params.id);
  if (!outlet) {
    res.status(404);
    throw new Error("Outlet not found");
  }

  outlet.isActive = false;
  await outlet.save();

  res.json({ message: "Outlet removed" });
});