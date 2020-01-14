import React from "react";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  login(event) {
    event.preventDefault();

    const {
      port,
      route_prefix,
      oauth_id,
      oauth_secret,
      api_url
    } = this.props.api;
    const { subdomain } = this.props;
    const data = new FormData(event.target);

    axios({
      method: "post",
      url:
        "//" + subdomain + api_url + ":" + port + route_prefix + "/oauth/token",
      data: {
        grant_type: "password",
        client_id: oauth_id,
        client_secret: oauth_secret,
        username: data.get("email"),
        password: data.get("password"),
        provider: "users",
        scope: ""
      },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(({ data }) => console.log(data)); //this.props.onLogin(data)
  }

  render() {
    return (
      <div className="bg-blue-400 h-screen w-screen">
        <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
          <div className="flex rounded-lg shadow-xl w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0">
            <div className="flex flex-col w-full md:w-1/2 p-4">
              <div className="flex flex-col flex-1 justify-center mb-8">
                <h1 className="text-4xl text-center font-thin">Welcome Back</h1>
                <div className="w-full mt-4">
                  <form
                    className="form-horizontal w-3/4 mx-auto"
                    onSubmit={this.login}
                  >
                    <div className="flex flex-col mt-4">
                      <input
                        id="email"
                        type="text"
                        className="flex-grow h-8 px-2 border rounded border-gray-400"
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <input
                        id="password"
                        type="password"
                        className="flex-grow h-8 px-2 rounded border border-gray-400"
                        name="password"
                        required
                        placeholder="Password"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="mr-2"
                      />{" "}
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember Me
                      </label>
                    </div>
                    <div className="flex flex-col mt-8">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-4">
                    <a
                      className="no-underline hover:underline text-blue-600 text-xs"
                      href="/"
                    >
                      Forgot Your Password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-center bg-cover hidden md:block md:w-1/2 rounded-r-lg"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1525160354320-d8e92641c563)"
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
