const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    // Convert to FormData for better handling of potential file uploads
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Handle arrays (like skills) differently
      if (Array.isArray(value)) {
        value.forEach(item => formDataToSend.append(`${key}[]`, item));
      } else {
        formDataToSend.append(key, value);
      }
    });

    const res = await axios.patch(
      `${BASE_URL}/profile/edit`,
      formDataToSend,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    dispatch(addUser(res.data.data));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
  } catch (err) {
    // Enhanced error handling
    if (err.response) {
      if (err.response.status === 413) {
        setError("Your data is too large. Please reduce file sizes or text length.");
      } else {
        setError(err.response.data?.message || "Failed to update profile");
      }
    } else if (err.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError("An unexpected error occurred.");
    }
  }
};