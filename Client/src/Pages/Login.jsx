import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          console.log(res);
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
          console.error(err);
          setError("Error Logging in.");
        });
    }
  };

  return (
    <div className="containerbox">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="forminput" htmlFor="email">Email:</label>
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="checkbox"
            id="rememberme"
            name="rememberme"
            checked={rememberme}
            onChange={handleChange}
          />
          <span>Remember Me</span>
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
        <div>
          {/* Prevents form submission when clicking Register */}
          <button type="button" onClick={handleRegisterClick}>Register</button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
