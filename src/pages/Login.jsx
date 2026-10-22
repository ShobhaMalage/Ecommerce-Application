
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === "shobhamalage23@gmail.com" &&
      password === "admin123"
    ) {
      const token = "demo-auth-token";

      onLogin(token);
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <p className="login-subtitle">
          Welcome back! Please sign in.
        </p>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit">Login</button>

        {/* Back to Home Link */}
        <p className="back-home">
          <span>Don't want to login?</span>{" "}
          <button
            type="button"
            className="back-home-link"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
