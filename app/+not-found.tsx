// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        Page not found
      </h1>
      <p style={{ marginBottom: 16 }}>
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: 8,
          background: "#3B82F6",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Go to Home
      </Link>
    </div>
  );
}
