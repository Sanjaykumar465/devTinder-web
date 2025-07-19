// UserCard.js
import axios from "axios";

import { useDispatch } from "react-redux";
import { clearFeed } from "../Utils/feedSlice"
import { BASE_URL } from "../Utils/constants";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(clearFeed(userId));
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl overflow-hidden border border-opacity-20 border-purple-300 transition-all duration-500 ease-in-out">
      {/* Profile Header with Gradient */}
      <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-end justify-center pb-8">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <img
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl z-10"
              src={photoUrl || "https://via.placeholder.com/200"}
              alt={`${firstName} ${lastName}`}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200";
              }}
            />
          </div>
        </div>
      </div>

      {/* User Content */}
      <div className="pt-20 px-6 pb-6 text-center">
        {/* Name and Basic Info */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {firstName} {lastName}
          </h2>
          {(age || gender) && (
            <p className="text-gray-600 capitalize text-lg font-medium">
              {[gender, age].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* About Section */}
        <div className="relative mb-6 mx-auto max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg blur opacity-75"></div>
          <p className="relative p-4 text-gray-700 leading-relaxed bg-white bg-opacity-70 rounded-lg backdrop-blur-sm text-sm md:text-base">
            <span className="font-semibold text-purple-600">About:</span>{" "}
            {about || "No description provided."}
          </p>
        </div>

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Skills & Expertise
              </span>
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-purple-700 text-sm font-medium rounded-full shadow-sm border border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="flex-1 py-3 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
          >
            Ignore
          </button>
          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;