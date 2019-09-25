import React from "react";

class Home extends React.Component {
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
                    method="POST"
                    action="#"
                  >
                    <div className="flex flex-col mt-4">
                      <input
                        autoComplete="username"
                        id="email"
                        type="text"
                        className="flex-grow h-8 px-2 border rounded border-gray-400"
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <input
                        autoComplete="current-password"
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
