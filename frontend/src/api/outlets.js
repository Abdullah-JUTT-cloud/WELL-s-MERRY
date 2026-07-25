import api from "./axios.js";

export const getOutlets = async (city) => {
  const { data } = await api.get("/outlets", { params: city ? { city } : {} });
  return data;
};

export const getNearbyOutlets = async ({ lng, lat, maxDistanceKm }) => {
  const { data } = await api.get("/outlets/nearby", {
    params: { lng, lat, maxDistanceKm },
  });
  return data;
};