import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://url-shortener-zi5d.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/urls`);

      setUrls(response.data.data);
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortUrl("");

      const response = await axios.post(`${API_URL}/api/urls/shorten`, {
        originalUrl: url,
      });

      setShortUrl(response.data.shortUrl);
      setUrl("");

      fetchUrls();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(value);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const getShortUrl = (shortCode) => {
    return `${API_URL}/${shortCode}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://url-shortener-zi5d.onrender.com/api/urls/${id}`,
      );

      setUrls((prevUrls) => prevUrls.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);

      setError(error.response?.data?.message || "Failed to delete URL");
    }
  };

  return (
    <div className="app">
      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <main className="main-container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">↗</div>

            <div>
              <h1>URL Shortener</h1>
              <p>Transform long URLs into short, shareable links.</p>
            </div>
          </div>
        </header>

        {/* Shortener Card */}
        <section className="shortener-card">
          <form onSubmit={handleSubmit} className="shorten-form">
            <div className="input-wrapper">
              <span className="input-icon">🔗</span>

              <input
                type="text"
                placeholder="Enter your long URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button type="submit" className="shorten-button" disabled={loading}>
              <span>🔗</span>

              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {error && <div className="error-message">⚠️ {error}</div>}

          {/* Success Result */}
          {shortUrl && (
            <div className="success-box">
              <div className="success-icon">✓</div>

              <div className="success-content">
                <h3>Your shortened URL</h3>

                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </div>

              <button
                className="copy-button"
                onClick={() => copyToClipboard(shortUrl)}
              >
                {copied === shortUrl ? "✓ Copied" : "Copy"}
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          )}
        </section>

        {/* History */}
        <section className="history-card">
          <div className="history-header">
            <div className="history-title">
              <div className="history-icon">↶</div>

              <h2>URL History</h2>
            </div>

            <span className="total-badge">Total URLs: {urls.length}</span>
          </div>

          {urls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <h3>No URLs yet</h3>
              <p>Shorten your first URL to see it here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <div className="table-header">
                <span>Original URL</span>
                <span>Short URL</span>
                <span>Clicks</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              {urls.map((item) => {
                const itemShortUrl = getShortUrl(item.shortCode);

                return (
                  <div className="url-row" key={item._id}>
                    {/* Original URL */}
                    <div className="original-column">
                      <span className="link-symbol">↗</span>

                      <span className="truncate" title={item.originalUrl}>
                        {item.originalUrl}
                      </span>
                    </div>

                    {/* Short URL */}
                    <a
                      href={itemShortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="short-link"
                    >
                      {itemShortUrl}
                    </a>

                    {/* Clicks */}
                    <div className="clicks">
                      <span>👁</span>
                      <strong>{item.clicks}</strong>
                    </div>

                    {/* Date */}
                    <span className="date">{formatDate(item.createdAt)}</span>

                    {/* Actions */}
                    <div className="actions">
                      <button
                        className="small-copy"
                        onClick={() => copyToClipboard(itemShortUrl)}
                      >
                        {copied === itemShortUrl ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer>Built with React, Node.js, Express & MongoDB</footer>
      </main>
    </div>
  );
}

export default App;
