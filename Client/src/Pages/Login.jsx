import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  // state variables for email and passwords
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  // state variable for error messages
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "rememberme") setRememberme(type === "checkbox" ? checked : rememberme);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // handle submit event for the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // validate email and passwords
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      // clear error message
      setError("");

      const loginurl = rememberme ? "/login?useCookies=true" : "/login?useSessionCookies=true";

      fetch(loginurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => {
          // handle success or error from the server
          if (res.ok) {
            setError("Successful Login.");
            // SPA navigation
            navigate("/");
          } else {
            setError("Error Logging In.");
          }
        })
        .catch((err) => {
          // handle network error
          setError("Error Logging in.");
        });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h3 className="login-form-title">Login</h3>
      <div className="login-form-section">
        <input
          className="login-form-input"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="login-form-section">
        <input
          className="login-form-input"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="login-form-checkbox-section">
        <input
          type="checkbox"
          id="rememberme"
          name="rememberme"
          checked={rememberme}
          onChange={handleChange}
          className="login-form-checkbox"
        />
        <span className="login-form-checkbox-label">Remember Me</span>
      </div>
      <div className="login-form-section">
        <button type="submit" className="login-form-btn login-form-btn-primary">Login</button>
      </div>
      <div className="login-form-section">
        <button type="button" onClick={handleRegisterClick} className="login-form-btn login-form-btn-secondary">Register</button>
      </div>
      {error && <p className="login-form-error">{error}</p>}
    </form>
  );
}

export default Login;
