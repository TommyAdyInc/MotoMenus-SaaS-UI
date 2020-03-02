export const setLogin = (data, remember) => {
  data.current_time = new Date().getTime() / 1000;

  if (remember) {
    localStorage.setItem("auth", JSON.stringify(data));
  } else {
    sessionStorage.setItem("auth", JSON.stringify(data));
  }
};

export const setAdminLogin = (data, remember) => {
  data.current_time = new Date().getTime() / 1000;

  sessionStorage.setItem("auth_admin", JSON.stringify(data));
};

export const logout = () => {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");

  // redirect to login
  window.location = "/";
};

export const adminLogout = () => {
  sessionStorage.removeItem("auth_admin");

  // redirect to login
  window.location = "/admin";
};

export const isAuthenticated = () =>
  localStorage.getItem("auth") || sessionStorage.getItem("auth");

export const isAdminAuthenticated = () => sessionStorage.getItem("auth_admin");

export const getAuthToken = () => {
  return (
    JSON.parse(localStorage.getItem("auth")) ||
    JSON.parse(sessionStorage.getItem("auth"))
  ).token.access_token;
};

export const getAdminAuthToken = () => {
  return JSON.parse(sessionStorage.getItem("auth_admin")).token.access_token;
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

export const isAdmin = () => {
  let session =
    JSON.parse(localStorage.getItem("auth")) ||
    JSON.parse(sessionStorage.getItem("auth"));

  return session.user.role === "admin";
};

export const authUser = () => {
  let session =
    JSON.parse(localStorage.getItem("auth")) ||
    JSON.parse(sessionStorage.getItem("auth"));

  return session.user;
};
