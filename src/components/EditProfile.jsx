import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";

const EditProfile = ({ user = {} }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    age: "",
    gender: "",
    bio: "",
    skills: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.firstName) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoUrl: user.photoUrl || "",
        age: user.age || "",
        gender: user.gender || "",
        bio: user.bio || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-violet-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-fuchsia-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 sm:w-52 sm:h-52 lg:w-72 lg:h-72 bg-cyan-600/25 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-indigo-600/35 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-6000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/40 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-fuchsia-400/50 rounded-full animate-pulse animation-delay-3000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping animation-delay-5000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 blur-2xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              Edit Profile
            </h1>
          </div>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-violet-200/80 font-medium">
            Update your personal information and showcase your skills
          </p>
        </div>

        {/* Enhanced Success Message */}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-900/80 backdrop-blur-sm text-emerald-200 rounded-xl sm:rounded-2xl border border-emerald-700/50 shadow-lg">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Enhanced Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/80 backdrop-blur-sm text-red-200 rounded-xl sm:rounded-2xl border border-red-700/50 shadow-lg">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              {error}
            </p>
          </div>
        )}

        {/* Enhanced Form Container */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 lg:space-y-8 bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-slate-700/50 hover:border-violet-500/30 transition-colors duration-500"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80"
                  placeholder="Your first name"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80"
                  placeholder="Your last name"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="group">
            <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
              Profile Photo URL
            </label>
            <div className="relative">
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80"
                placeholder="https://example.com/photo.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            {/* Enhanced Profile Preview */}
            {formData.photoUrl && (
              <div className="mt-4 sm:mt-6 flex justify-center">
                <div className="relative group/avatar">
                  <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full blur-lg opacity-40 group-hover/avatar:opacity-60 transition-all duration-500 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-sm opacity-60"></div>
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Profile preview"
                      className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-2xl z-10 group-hover/avatar:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`${formData.photoUrl ? 'hidden' : 'flex'} relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 items-center justify-center text-white font-bold text-xl sm:text-2xl lg:text-3xl border-4 border-white shadow-2xl z-10`}
                    style={{ display: formData.photoUrl ? 'none' : 'flex' }}
                  >
                    {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : '?'}
                    {formData.lastName ? formData.lastName.charAt(0).toUpperCase() : ''}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
                Age
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80"
                  placeholder="Your age"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
                Gender
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white appearance-none text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80 cursor-pointer"
                >
                  <option value="" className="bg-slate-800 text-slate-300">Select gender</option>
                  <option value="male" className="bg-slate-800 text-white">Male</option>
                  <option value="female" className="bg-slate-800 text-white">Female</option>
                  <option value="other" className="bg-slate-800 text-white">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="group">
            <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
              About You
            </label>
            <div className="relative">
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80 resize-none"
                placeholder="Tell others about yourself..."
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Enhanced Skills Section */}
          <div className="group">
            <label className="block text-sm sm:text-base font-semibold text-slate-300 mb-2 sm:mb-3 group-hover:text-violet-300 transition-colors duration-200">
              Skills & Expertise
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="w-full bg-slate-700/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base transition-all duration-300 hover:bg-slate-700/80"
                  placeholder="Add a skill (press Enter)"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 sm:px-6 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Add Skill</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
            
            {/* Skills Display */}
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
              {formData.skills.map((skill, index) => (
                <div key={skill} className="group/skill relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full blur opacity-0 group-hover/skill:opacity-75 transition-all duration-300"></div>
                  <span className="relative flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-white border border-slate-600 group-hover/skill:border-transparent group-hover/skill:bg-slate-700 transition-all duration-300">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-red-400 focus:outline-none transition-colors duration-200 flex items-center justify-center rounded-full hover:bg-red-500/20"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              className="group w-full py-3 sm:py-4 lg:py-5 px-6 sm:px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-cyan-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 sm:gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Save Changes</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* CSS-in-JS styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animation-delay-6000 {
            animation-delay: 6s;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-3000 {
            animation-delay: 3s;
          }
          .animation-delay-5000 {
            animation-delay: 5s;
          }
        `
      }} />
    </div>
  );
};

export default EditProfile;