import React, { useState } from "react";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.4:8000/api/user/", {  // Change IP to your friend's IP
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("User data submitted successfully!");
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (error) {
      setMessage("Could not connect to backend!");
    }
  };

  return (
    <div>
      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Sex:
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UserForm;
