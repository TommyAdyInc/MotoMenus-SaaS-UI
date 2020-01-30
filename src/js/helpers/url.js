export const apiURL = (api, ui) => {
  return (
    "//" +
    (ui.subsubdomain ? ui.subsubdomain + "." + ui.subdomain : ui.subdomain) +
    "." +
    api.subdomain +
    "." +
    ui.domain +
    "." +
    ui.tld +
    ":" +
    api.port +
    api.route_prefix
  );
};
