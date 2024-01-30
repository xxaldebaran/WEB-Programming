import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  //state variables for authentication token, expiration date, and user ID
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  //function for logging in
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //calculate token expiration date or set a default one hour from the current time
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    //store user data in localStorage
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  //function for logging out
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    //remove user data from localStorage
    localStorage.removeItem('userData');
  }, []);

  //set up timer for automatic logout based on token expiration
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      //start a countdown using setTimeout and call the logout function when the timer expires
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      //clear the timeout if either token or tokenExpirationDate becomes falsy (e.g., on logout)
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //check for stored authentication data when the component mounts
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      //if the stored token is valid, perform login with stored user ID, token, and expiration date
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};