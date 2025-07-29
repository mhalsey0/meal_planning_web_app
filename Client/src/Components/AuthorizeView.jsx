import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

const UserContext = createContext({});

function AuthorizeView({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ email: '' });

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    const delay = 1000;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function fetchWithRetry(url, options) {
      try {
        const response = await fetch(url, options);

        if (response.status === 200) {
          console.log('Authorized');
          const j = await response.json();
          setUser({ email: j.email });
          setAuthorized(true);
          return response;
        } else if (response.status === 401) {
          console.log('Unauthorized');
          return response;
        } else {
          throw new Error(String(response.status));
        }
      } catch (error) {
        retryCount += 1;
        if (retryCount > maxRetries) {
          throw error;
        } else {
          await wait(delay);
          return fetchWithRetry(url, options);
        }
      }
    }

    fetchWithRetry('/pingauth', { method: 'GET' })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authorized) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  return <Navigate to="/login" />;
}

export function AuthorizedUser({ value }) {
  const user = React.useContext(UserContext);
  if (value === 'email') return <>{user.email}</>;
  return null;
}

export default AuthorizeView;
