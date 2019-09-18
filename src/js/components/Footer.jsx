import React from "react";

class Footer extends React.Component {
  render() {
    const app_name = "MotoMenus";
    return (
      <footer className="bg-smoke-100 py-2">
        <p className="text-center text-gray-600 text-xs w-full">
          Copyright &copy; {new Date().getFullYear()} {app_name}. All rights
          reserved.
        </p>
      </footer>
    );
  }
}

export default Footer;
