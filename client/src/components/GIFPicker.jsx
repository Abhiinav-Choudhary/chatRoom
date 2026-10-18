
import React, { useEffect, useState } from "react";
import { Search, X, LoaderCircle } from "lucide-react";
import "../styles/GIFPicker.css";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = "https://api.giphy.com/v1/gifs";

function GIFPicker({ onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API_KEY) {
      setError("Missing GIPHY API key. Add it to your frontend .env.");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const endpoint = query.trim()
          ? `${BASE_URL}/search`
          : `${BASE_URL}/trending`;

        const params = new URLSearchParams({
          api_key: API_KEY,
          limit: "24",
          rating: "pg-13",
          q: query.trim(),
        });

        // The trending endpoint doesn't require q.
        if (!query.trim()) params.delete("q");

        const response = await fetch(`${endpoint}?${params}`);

        if (!response.ok) {
          throw new Error("Unable to load GIFs. Please try again.");
        }

        const result = await response.json();

        if (!cancelled) {
          setGifs(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setGifs([]);
          setError(err.message || "Failed to load GIFs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <section className="gif-picker" aria-label="GIF picker">
      <header className="gif-picker-header">
        <div>
          <h3>Choose a GIF</h3>
          <p>Find the perfect reaction</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close GIF picker"
        >
          <X size={19} />
        </button>
      </header>

      <form
        className="gif-search"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search size={18} />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search GIFs..."
          aria-label="Search GIFs"
          maxLength={50}
        />

        {query && (
          <button type="button" onClick={() => setQuery("")}>
            Clear
          </button>
        )}
      </form>

      <div className="gif-results">
        {loading ? (
          <div className="gif-state">
            <LoaderCircle className="gif-spinner" size={25} />
            <span>Finding GIFs...</span>
          </div>
        ) : error ? (
          <div className="gif-state">{error}</div>
        ) : gifs.length === 0 ? (
          <div className="gif-state">No GIFs found. Try another search.</div>
        ) : (
          <div className="gif-grid">
            {gifs.map((gif) => {
              const preview =
                gif.images?.fixed_width_small?.url ||
                gif.images?.fixed_width?.url;

              const original =
                gif.images?.original?.url ||
                gif.images?.fixed_width?.url;

              if (!preview || !original) return null;

              return (
                <button
                  key={gif.id}
                  type="button"
                  className="gif-result"
                  onClick={() => onSelect(original)}
                  title="Send this GIF"
                  aria-label={`Send GIF: ${gif.title || "GIF"}`}
                >
                  <img
                    src={preview}
                    alt={gif.title || "GIF"}
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <footer className="gif-picker-footer">
        Powered by GIPHY
      </footer>
    </section>
  );
}

export default GIFPicker;
