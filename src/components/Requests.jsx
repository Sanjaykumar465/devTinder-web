import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../Utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      // Close modal if the reviewed request was being viewed
      if (selectedProfile && selectedProfile._id === _id) {
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const openProfile = (userProfile, requestId) => {
    setSelectedProfile({ ...userProfile, requestId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Close modal when clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-4xl sm:text-5xl">📭</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              No Requests Found
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              You don't have any connection requests at the moment. When someone
              wants to connect with you, their requests will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">🤝</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Connection Requests
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Review and respond to developers who want to connect with you
          </p>
          <div className="mt-4 text-sm text-purple-300">
            {requests.length} {requests.length === 1 ? "request" : "requests"}{" "}
            pending
          </div>
        </div>

        {/* Requests Grid */}
        <div className="space-y-4 sm:space-y-6">
          {requests.map((request, index) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Profile Image - Clickable */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        alt={`${firstName} ${lastName}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-gray-700 group-hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                        src={photoUrl}
                        onClick={() =>
                          openProfile(request.fromUserId, request._id)
                        }
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs">✨</span>
                      </div>
                      {/* View Profile Tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Click to view profile
                      </div>
                    </div>
                  </div>

                  {/* User Information - Clickable */}
                  <div
                    className="flex-1 text-center sm:text-left min-w-0 cursor-pointer"
                    onClick={() => openProfile(request.fromUserId, request._id)}
                  >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 truncate hover:text-purple-300 transition-colors duration-200">
                      {firstName} {lastName}
                    </h2>

                    {age && gender && (
                      <div className="flex items-center justify-center sm:justify-start text-gray-400 mb-2 text-sm sm:text-base">
                        <span className="mr-2">👤</span>
                        <span>
                          {age}, {gender}
                        </span>
                      </div>
                    )}

                    {about && (
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none hover:text-gray-200 transition-colors duration-200">
                        {about}
                      </p>
                    )}

                    <div className="mt-2 text-xs text-purple-400 opacity-70">
                      Click to view full profile
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-shrink-0 w-full sm:w-auto">
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm sm:text-base"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">❌</span>
                        Reject
                      </span>
                    </button>

                    <button
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm sm:text-base"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">✅</span>
                        Accept
                      </span>
                    </button>
                  </div>
                </div>

                {/* Connection Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-500">
                    <span className="mr-2">🔗</span>
                    <span>Wants to connect with you</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center text-gray-500 text-xs sm:text-sm">
            <span className="mr-2">💡</span>
            <span>
              Tip: Click on profiles to view more details before accepting
              connections
            </span>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isModalOpen && selectedProfile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">Profile Details</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
              >
                <span className="text-gray-400 hover:text-white text-xl">
                  ✕
                </span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img
                    src={selectedProfile.photoUrl}
                    alt={`${selectedProfile.firstName} ${selectedProfile.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mx-auto mb-4"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                    <span className="text-sm">✨</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {selectedProfile.firstName} {selectedProfile.lastName}
                </h3>
                {selectedProfile.age && selectedProfile.gender && (
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <span className="mr-2">👤</span>
                    <span className="text-lg">
                      {selectedProfile.age}, {selectedProfile.gender}
                    </span>
                  </div>
                )}
              </div>

              {/* About Section */}
              {selectedProfile.about && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    About
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-base bg-gray-800/50 p-4 rounded-xl">
                    {selectedProfile.about}
                  </p>
                </div>
              )}

              {/* Additional Profile Fields - Add more as needed */}
              {selectedProfile.skills && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="mr-2">🛠️</span>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-red-500/25"
                  onClick={() =>
                    reviewRequest("rejected", selectedProfile.requestId)
                  }
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">❌</span>
                    Reject Request
                  </span>
                </button>

                <button
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-green-500/25"
                  onClick={() =>
                    reviewRequest("accepted", selectedProfile.requestId)
                  }
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✅</span>
                    Accept Request
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Requests;
