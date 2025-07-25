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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0d7ff] via-[#f5d9ff] to-[#fbe0ff]">
        <div className="text-center p-8 bg-white bg-opacity-80 rounded-2xl border border-purple-100 shadow-2xl backdrop-blur-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">
            Loading your connections...
          </p>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0d7ff] via-[#f5d9ff] to-[#fbe0ff]">
        <div className="text-center p-10 max-w-md bg-white bg-opacity-80 rounded-2xl border border-purple-100 shadow-2xl backdrop-blur-lg">
          <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-200 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-purple-500"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            No Connections Yet
          </h1>
          <p className="text-gray-600 mb-8">
            Start building your network by connecting with others
          </p>
          <Link
            to="/discover"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            Discover People
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0d7ff] via-[#f5d9ff] to-[#fbe0ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Connections
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            You have{" "}
            <span className="font-semibold text-purple-600">
              {connections.length}
            </span>{" "}
            {connections.length === 1 ? "connection" : "connections"}
          </p>
        </div>

        <div className="grid gap-8">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;

            return (
              <div
                key={_id}
                className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 border-opacity-50 hover:scale-[1.01]"
              >
                <div className="p-6 flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full blur-xl opacity-30"></div>
                    <img
                      className="relative h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                      src={
                        photoUrl ||
                        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
                      }
                      alt={`${firstName} ${lastName}`}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {firstName} {lastName}
                      </h2>
                      {gender && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {gender}
                        </span>
                      )}
                      {age && (
                        <span className="text-sm text-gray-500">{age} yrs</span>
                      )}
                    </div>
                    {about && (
                      <p className="mt-2 text-gray-600 line-clamp-2">{about}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Link to={`/chat/${_id}`}>
                      <button className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
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
                        Chat
                      </button>
                    </Link>
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
