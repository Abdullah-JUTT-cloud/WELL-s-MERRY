import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/products.js";

/* =====================================================================
   useProducts — the one way a page reads live inventory.

   Every catalog surface (shop grid, homepage lineup, PDP "pairs well
   with", the quiz result, the apocalypse slider) needs the same three
   things: the products, a loading flag, and an error it can retry from.
   Each of them used to import its own hardcoded array instead, which is
   how the shop and the admin panel drifted into two different catalogs.

   `params` is compared by value (`{ category: "hair-care" }` is stable
   across renders) so a page can pass it inline without refetching on
   every render.
   ===================================================================== */

export function useProducts(params) {
  // Value-based dependency: a fresh object literal each render must not
  // restart the fetch, but a genuinely different filter must.
  const key = JSON.stringify(params ?? {});

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    // `ignore` guards the unmount/param-change race: without it a slow
    // request that resolves after the filter changed would overwrite the
    // new result with the old one.
    let ignore = false;
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const data = await getProducts(params);
        if (ignore) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load store inventory", err);
        if (ignore) return;
        setProducts([]);
        setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { products, loading, error, refetch };
}

export default useProducts;
