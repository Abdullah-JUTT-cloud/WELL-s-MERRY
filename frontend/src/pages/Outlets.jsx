import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { getOutlets, getNearbyOutlets } from "../api/outlets.js";
import { buildWhatsAppLink } from "../config/siteConfig.js";
import { OutletGridSkeleton } from "../components/Skeleton.jsx";

const Outlets = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [mode, setMode] = useState("all"); // "all" | "nearby"

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getOutlets();
        if (!ignore) setOutlets(data);
      } catch {
        if (!ignore) setOutlets([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Uses the browser's Geolocation API + our backend's geospatial
  // $near query (built into outletController.getNearbyOutlets) to find
  // the closest stockists. Works correctly today even with zero outlets
  // seeded — it'll just return an empty array, which the empty state
  // below already handles gracefully.
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser doesn't support location detection");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getNearbyOutlets({ lng: longitude, lat: latitude, maxDistanceKm: 25 });
          setOutlets(data);
          setMode("nearby");
          if (data.length === 0) {
            toast("No outlets within 25km yet — check back as we grow!", { icon: "🌿" });
          }
        } catch {
          toast.error("Couldn't fetch nearby outlets. Please try again.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Location access denied. Showing all outlets instead.");
        setLocating(false);
      }
    );
  };

  const resetToAll = async () => {
    setLoading(true);
    setMode("all");
    try {
      const data = await getOutlets();
      setOutlets(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center">
        <span className="eyebrow mb-3">Find Us Offline</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">Our Outlets</h1>
        <p className="text-cream/60 max-w-lg mx-auto mt-4 px-6">
          Prefer shopping in person? Find a Well's Merry stockist near you.
        </p>
      </div>

      <div className="container-content py-16 sm:py-20">
        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <button
            onClick={handleFindNearMe}
            disabled={locating}
            className="btn btn-dark disabled:opacity-60"
          >
            <HiOutlineMapPin className="w-4 h-4" />
            {locating ? "Locating..." : "Find Outlets Near Me"}
          </button>
          {mode === "nearby" && (
            <button onClick={resetToAll} className="btn btn-outline">
              View All Outlets
            </button>
          )}
        </div>

        {loading ? (
          <OutletGridSkeleton count={3} />
        ) : outlets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map((outlet) => (
              <div key={outlet._id} className="border border-cream-dim bg-white p-7">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold-1 mb-4">
                  <HiOutlineBuildingStorefront className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg mb-2">{outlet.name}</h3>
                <p className="text-[13.5px] text-ink/60 flex items-start gap-2 mb-2">
                  <HiOutlineMapPin className="w-4 h-4 shrink-0 mt-0.5 text-gold-1" />
                  {outlet.address}, {outlet.city}
                </p>
                {outlet.phone && (
                  <a
                    href={`tel:${outlet.phone}`}
                    className="text-[13.5px] text-ink/60 hover:text-gold-1 flex items-center gap-2 mb-2"
                  >
                    <HiOutlinePhone className="w-4 h-4 shrink-0 text-gold-1" />
                    {outlet.phone}
                  </a>
                )}
                {outlet.openingHours && (
                  <p className="text-[13.5px] text-ink/60 flex items-center gap-2">
                    <HiOutlineClock className="w-4 h-4 shrink-0 text-gold-1" />
                    {outlet.openingHours}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty state — expected right now since no outlets are
             onboarded yet. Communicates that this is intentional
             ("coming soon"), not a broken page. */
          <div className="max-w-xl mx-auto text-center border border-dashed border-cream-dim rounded-sm px-8 py-16 sm:py-20">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-cream flex items-center justify-center text-gold-1">
              <HiOutlineBuildingStorefront className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl mb-3">
              {mode === "nearby" ? "No Outlets Nearby Yet" : "We're Building Our Retail Network"}
            </h3>
            <p className="text-ink/55 mb-8 max-w-sm mx-auto">
              Well's Merry is currently available online with Cash on Delivery
              and WhatsApp ordering. Retail stockists are coming soon —
              check back here as we grow.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn btn-dark">Shop Online Instead</Link>
              <a
                href={buildWhatsAppLink("Hi Well's Merry! Do you have a store near me?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Retailer CTA */}
        <div className="mt-16 border-t border-cream-dim pt-14 text-center">
          <h3 className="font-display text-xl sm:text-2xl mb-3">Own a Store? Stock Well's Merry.</h3>
          <p className="text-ink/55 max-w-md mx-auto mb-6">
            We're looking for retail partners who'd like to carry our
            products. Get in touch to learn more.
          </p>
          <Link to="/contact" className="btn btn-outline">Become a Stockist</Link>
        </div>
      </div>
    </div>
  );
};

export default Outlets;
