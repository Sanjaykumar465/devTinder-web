import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

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
      const res = await axios.patch(`${BASE_URL}/profile/edit`, formData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Edit Profile</h1>
          <p className="mt-2 text-purple-600">
            Update your personal information
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p>✓ Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>⚠️ {error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 border border-purple-100"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-purple-800 mb-1"
              >
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
                  placeholder="Your first name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-purple-800 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              Profile Photo URL
            </label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
              placeholder="https://example.com/photo.jpg"
            />
            {formData.photoUrl && (
              <div className="mt-3 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <img
                    src={formData.photoUrl}
                    alt="Profile preview"
                    className="relative h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg z-10"
                    onError={(e) => (e.target.src = "/default-profile.png")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-purple-800 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
                placeholder="Your age"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-purple-800 mb-1"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 appearance-none"
                >
                  <option value="" className="text-purple-300">
                    Select gender
                  </option>
                  <option value="male" className="text-purple-800">
                    male
                  </option>
                  <option value="female" className="text-purple-800">
                    female
                  </option>
                  <option value="others" className="text-purple-800">
                    others
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              About You
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-white/80 px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-purple-900 placeholder-purple-300"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div key={skill} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-200"></div>
                  <span className="relative px-4 py-2 bg-white rounded-full text-sm font-medium text-purple-800 border border-purple-200 group-hover:border-transparent">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5 text-purple-400 hover:text-purple-600 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
