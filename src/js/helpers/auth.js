export const setLogin = (data, remember) => {
  data.current_time = new Date().getTime() / 1000;
  if (remember) {
    localStorage.setItem("auth", JSON.stringify(data));
  } else {
    sessionStorage.setItem("auth", JSON.stringify(data));
  }
};

export const logout = () => {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");

  // redirect to login
  window.location = "/";
};

export const isAuthenticated = () =>
  localStorage.getItem("auth") || sessionStorage.getItem("auth");

export const getAuthToken = () => {
  return (
    JSON.parse(localStorage.getItem("auth")) ||
    JSON.parse(sessionStorage.getItem("auth"))
  ).token.access_token;
};

export const sessionExpired = () => {
  let session =
    JSON.parse(localStorage.getItem("auth")) ||
    JSON.parse(sessionStorage.getItem("auth"));

  return (
    !session ||
    new Date().getTime() / 1000 >
      parseInt(session.token.expires_in) + session.current_time
  );
};
