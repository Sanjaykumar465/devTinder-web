// UserCard.js
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearFeed } from "../Utils/feedSlice";
import { BASE_URL } from "../Utils/constants";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, bio, skills } = user;
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
    <div className="w-full px-4 sm:px-6 md:px-0 sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
      {/* Main Card Container with Glass Effect */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl group">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400/20 to-violet-600/20 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-10 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-lg opacity-40 animate-pulse delay-1000"></div>

        {/* Header Section with Dynamic Gradient */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 flex items-end justify-center pb-4 overflow-visible">
          {/* Animated Waves */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-t from-white/40 to-transparent transform rotate-1 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-full h-16 sm:h-20 bg-gradient-to-t from-white/30 to-transparent transform -rotate-1 animate-pulse delay-500"></div>
          </div>

          {/* Profile Image with Enhanced Effects */}
          <div className="absolute -bottom-14 sm:-bottom-16 left-1/2 transform -translate-x-1/2 z-30">
            <div className="relative group/avatar">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full blur-lg opacity-70 group-hover/avatar:opacity-100 transition-all duration-500 animate-pulse"></div>

              {/* Middle Ring */}
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 rounded-full blur-sm opacity-80"></div>

              {/* Image Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-transform duration-300 group-hover/avatar:scale-110">
                {photoUrl ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Default Avatar when no photo or error */}
                <div
                  className={`${
                    photoUrl ? "hidden" : "flex"
                  } w-full h-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl sm:text-2xl transition-transform duration-500 group-hover/avatar:scale-110`}
                  style={{ display: photoUrl ? "none" : "flex" }}
                >
                  {firstName ? firstName.charAt(0).toUpperCase() : "?"}
                  {lastName ? lastName.charAt(0).toUpperCase() : ""}
                </div>

                {/* Image Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative pt-16 sm:pt-20 px-6 sm:px-8 pb-6 sm:pb-8 z-10">
          {/* Name and Info Section */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              {firstName} {lastName}
            </h2>
            {(age || gender) && (
              <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full shadow-sm">
                <span className="text-violet-700 font-medium capitalize text-xs sm:text-sm">
                  {[gender, age].filter(Boolean).join(" • ")}
                </span>
              </div>
            )}
          </div>

          {/* Bio Section with Enhanced Design */}
          <div className="mb-6 sm:mb-8 relative group/bio">
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-violet-200/50 via-fuchsia-200/50 to-cyan-200/50 rounded-2xl blur opacity-0 group-hover/bio:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                    <span className="font-semibold text-violet-600 text-[0.65rem] sm:text-xs uppercase tracking-wider">
                      About
                    </span>
                    <br />
                    <span className="text-sm sm:text-base mt-1 block">
                      {bio || "No description provided."}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section with Modern Pills */}
          {skills?.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Skills & Expertise
                </span>
              </h3>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="group/skill relative px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-white to-gray-50 text-violet-700 text-xs font-medium rounded-full shadow-md border border-violet-200/60 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default"
                  >
                    {/* Skill Pill Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 rounded-full opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex space-x-3 sm:space-x-4">
            {/* Ignore Button */}
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="group/ignore flex-1 relative overflow-hidden py-3 px-4 sm:py-4 sm:px-6 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 border border-red-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover/ignore:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-1 sm:space-x-2">
                <span className="text-base sm:text-lg">✕</span>
                <span className="text-xs sm:text-sm">Pass</span>
              </span>
            </button> 

            {/* Interested Button */}
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="group/interest flex-1 relative overflow-hidden py-3 px-4 sm:py-4 sm:px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/interest:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-1 sm:space-x-2">
                <span className="text-base sm:text-lg">♥</span>
                <span className="text-xs sm:text-sm">Like</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60"></div>
      </div>
    </div>
  );
};

export default UserCard;
