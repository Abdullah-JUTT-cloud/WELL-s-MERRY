import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_STYLE, MAP_CENTER } from "../../data/merry/mock.js";

/* =====================================================================
   MerryMap — embedded map graded to the global Forest & Cream palette.

   The look comes from ONE place: `MAP_STYLE` (map-style JSON in
   mapTheme format, see data/merry/mock.js).

     • With a Mapbox/MapTiler token you could hand MAP_STYLE straight
       to mapboxgl.Map({ style }) — the layer paints are already valid.
     • Keyless (our case): we raster OSM tiles and paint the tile pane
       with MAP_STYLE.tiles.cssFilter, which is derived from the same
       palette — sepia warms OSM's cream land, hue-rotate pushes it
       into forest greens, brightness sinks it to the deep-green base.

   Pins are organic clay blobs (flagship gets the forest ring) and
   popups are styled to the card system via `.merry-map` CSS.

   Props:
     outlets  — [{ id, name, address, hours, coords: {lat,lng}, flagship? }]
     activeId — id of the highlighted outlet; the map flies to it
     onSelect — (id) => void, fired when a pin is clicked
     className
   ===================================================================== */

const PIN_LEAF_SVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="#F9F6F0" aria-hidden="true"><path d="M20.9 3.1C10.4 3.1 4 9.2 3.4 19.3c0 .6 0 1.1.1 1.6 1.5.4 3.1.5 4.7.3 7.7-1 12.4-8 12.7-18.1Z"/></svg>`;

const MerryMap = ({ outlets, activeId, onSelect, className = "" }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* Init once: map, themed tile pane, one organic pin per outlet. */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false, // page scroll wins over map zoom
      zoomControl: true,
      attributionControl: true,
    }).setView([MAP_CENTER.lat, MAP_CENTER.lng], 5);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // The JSON theme grades the tiles — no hard-coded colors here.
    map.getPane("tilePane").style.filter = MAP_STYLE.tiles.cssFilter;

    outlets.forEach((o) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="merry-pin${o.flagship ? " merry-pin--flagship" : ""}">${PIN_LEAF_SVG}</div>`,
        iconSize: o.flagship ? [44, 44] : [34, 34],
        iconAnchor: o.flagship ? [22, 30] : [17, 24],
        popupAnchor: [0, o.flagship ? -28 : -22],
      });
      const marker = L.marker([o.coords.lat, o.coords.lng], { icon, title: o.name }).addTo(map);
      marker.bindPopup(
        `<div class="merry-popup"><strong>${o.name}</strong>` +
          `<span>${o.address}</span><em>${o.hours}</em></div>`,
        { closeButton: false, offset: [0, 4] }
      );
      marker.on("click", () => onSelectRef.current?.(o.id));
      markersRef.current[o.id] = marker;
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fit all pins once the container has its real size. */
  useEffect(() => {
    if (!mapRef.current || !outlets.length) return;
    const t = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
      const bounds = L.latLngBounds(outlets.map((o) => [o.coords.lat, o.coords.lng]));
      mapRef.current?.fitBounds(bounds.pad(0.3));
    }, 150);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fly to the active outlet + flag its pin. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const outlet = outlets.find((x) => x.id === activeId);
    if (!outlet) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.getElement()?.classList.toggle("is-active", id === activeId);
    });
    map.flyTo([outlet.coords.lat, outlet.coords.lng], 13, { duration: 0.9 });
    markersRef.current[activeId]?.openPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Map of Well's Merry outlet locations"
      className={`merry-map h-full w-full ${className}`}
    />
  );
};

export default MerryMap;
