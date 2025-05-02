import { useState } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        "http://localhost:44308/api/v1/Account/requestPasswordReset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        setError(`Ошибка: ${errorText}`);
        return;
      }

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setError("Произошла ошибка при отправке запроса.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
      }}
    >
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
        Reset Password
      </button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
