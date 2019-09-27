import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <footer className="absolute bg-smoke-400 bottom-0 py-2 w-full">
        <p className="text-center text-white text-xs">
          Copyright &copy; {new Date().getFullYear()} {process.env.APP_NAME}.
          All rights reserved.
        </p>
      </footer>
    );
  }
}

export default Footer;
