import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../Utils/connectionsSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      if (res.data && res.data.data) {
        dispatch(addConnections(res.data.data));
      } else {
        dispatch(addConnections([]));
      }
    } catch (err) {
      dispatch(addConnections([]));
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!Array.isArray(connections)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50 px-4">
        <div className="text-center p-6 sm:p-8 lg:p-10 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl max-w-sm w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mx-auto"></div>
          </div>
          <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Loading your connections...
          </p>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50 px-4">
        <div className="text-center p-6 sm:p-8 lg:p-10 max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl">
          {/* Enhanced Icon Container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-violet-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            No Connections Yet
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
            Start building your network by connecting with amazing people
          </p>
          <Link
            to="/discover"
            className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105"
          >
            <span>Discover People</span>
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 blur-2xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3">
              Your{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                Connections
              </span>
            </h1>
          </div>
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
            <span className="text-base sm:text-lg lg:text-xl text-gray-700">
              You have{" "}
              <span className="font-bold text-violet-600 text-lg sm:text-xl lg:text-2xl">
                {connections.length}
              </span>{" "}
              <span className="text-gray-600">
                {connections.length === 1 ? "connection" : "connections"}
              </span>
            </span>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;

            return (
              <div
                key={_id}
                className="group bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-[1.02] hover:bg-white/95"
              >
                {/* Mobile Layout (< sm) */}
                <div className="block sm:hidden p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      {photoUrl ? (
                        <img
                          className="relative h-16 w-16 rounded-full object-cover border-3 border-white shadow-lg"
                          src={photoUrl}
                          alt={`${firstName} ${lastName}`}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`${
                          photoUrl ? "hidden" : "flex"
                        } relative h-16 w-16 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 items-center justify-center text-white font-bold text-lg border-3 border-white shadow-lg`}
                        style={{ display: photoUrl ? "none" : "flex" }}
                      >
                        {firstName ? firstName.charAt(0).toUpperCase() : "?"}
                        {lastName ? lastName.charAt(0).toUpperCase() : ""}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {firstName} {lastName}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        {gender && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                            {gender}
                          </span>
                        )}
                        {age && (
                          <span className="text-xs text-gray-500">
                            {age} yrs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {about && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {about}
                    </p>
                  )}
                  <Link to={`/chat/${_id}`} className="w-full">
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Start Chat
                    </button>
                  </Link>
                </div>

                {/* Tablet & Desktop Layout (>= sm) */}
                <div className="hidden sm:block p-6 lg:p-8">
                  <div className="flex items-start space-x-4 lg:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      {photoUrl ? (
                        <img
                          className="relative h-20 w-20 lg:h-24 lg:w-24 rounded-full object-cover border-4 border-white shadow-xl"
                          src={photoUrl}
                          alt={`${firstName} ${lastName}`}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`${
                          photoUrl ? "hidden" : "flex"
                        } relative h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 items-center justify-center text-white font-bold text-xl lg:text-2xl border-4 border-white shadow-xl`}
                        style={{ display: photoUrl ? "none" : "flex" }}
                      >
                        {firstName ? firstName.charAt(0).toUpperCase() : "?"}
                        {lastName ? lastName.charAt(0).toUpperCase() : ""}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-3 mb-2">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                          {firstName} {lastName}
                        </h2>
                        {gender && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700">
                            {gender}
                          </span>
                        )}
                        {age && (
                          <span className="text-sm lg:text-base text-gray-500 font-medium">
                            {age} years
                          </span>
                        )}
                      </div>
                      {about && (
                        <p className="text-gray-600 line-clamp-2 text-sm lg:text-base leading-relaxed">
                          {about}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Link to={`/chat/${_id}`}>
                        <button className="group/btn flex items-center px-5 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-sm lg:text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4 lg:h-5 lg:w-5 group-hover/btn:animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span className="hidden sm:inline">Chat</span>
                          <span className="sm:hidden">Message</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;