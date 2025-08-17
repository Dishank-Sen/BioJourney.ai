import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialUserInfo = {
  id: "USR123456",
  name: "Rohan Patel",
  age: 32,
  gender: "Male",
  email: "rohan.patel@example.com",
  phone: "+91 9876543210",
  address: "123 MG Road, Bangalore, India",
  emergencyContact: {
    name: "Priya Patel",
    phone: "+91 9123456789",
  },
  bloodGroup: "O+",
  allergies: ["Peanuts", "Penicillin"],
  medicalHistory: ["Hypertension", "Vitamin D Deficiency"],
  registrationDate: "2023-08-15",
};

export default function C5() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserInfo(formData);
    setEditMode(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {/* Back button */}
      <button
        onClick={() => navigate("/timeline")}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        ← Back to Timeline
      </button>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>

          {editMode ? (
            <>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Age:
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Gender:
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
            </>
          ) : (
            <>
              <p><span className="font-medium">ID:</span> {userInfo.id}</p>
              <p><span className="font-medium">Name:</span> {userInfo.name}</p>
              <p><span className="font-medium">Age:</span> {userInfo.age}</p>
              <p><span className="font-medium">Gender:</span> {userInfo.gender}</p>
              <p><span className="font-medium">Email:</span> {userInfo.email}</p>
              <p><span className="font-medium">Phone:</span> {userInfo.phone}</p>
              <p><span className="font-medium">Address:</span> {userInfo.address}</p>
            </>
          )}
        </div>

        {/* Health Details */}
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-4">Health Details</h3>
          <p><span className="font-medium">Blood Group:</span> {userInfo.bloodGroup}</p>
          <p><span className="font-medium">Allergies:</span> {userInfo.allergies.join(", ")}</p>
          <p><span className="font-medium">Medical History:</span> {userInfo.medicalHistory.join(", ")}</p>
          <p>
            <span className="font-medium">Emergency Contact:</span>{" "}
            {userInfo.emergencyContact.name} ({userInfo.emergencyContact.phone})
          </p>
          <p><span className="font-medium">Registration Date:</span> {userInfo.registrationDate}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}