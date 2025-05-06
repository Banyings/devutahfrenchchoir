'use client';

import React, { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    country: 'United States',
    state: 'Utah',
    address: '',
    zip_code:'',
    interest: '',
    picture: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('date', formData.date);
    form.append('country', formData.country);
    form.append('state', formData.state);
    form.append('address', formData.address);
    form.append('zip_code', formData.zip_code);
    form.append('interest', formData.interest);
    if (formData.picture) {
      form.append('picture', formData.picture);
    }

    try {
      const res = await fetch('http://localhost:4005/api/apply', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        alert('Application submitted successfully!');
        // Optionally reset the form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          date: '',
          country: 'United States',
          state: 'Utah',
          address: '',
          zip_code:'',
          interest: '',
          picture: null,
        });
      } else {
        alert('Submission failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, picture: file });
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-cyan-100 shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            We are so happy to have you join us!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <InputField
                id="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(val) => setFormData({ ...formData, fullName: val })}
              />
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(val) => setFormData({ ...formData, email: val })}
              />
              <InputField
                id="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
              />
              <InputField
                id="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={(val) => setFormData({ ...formData, date: val })}
              />
              <SelectField
                id="country"
                label="Country"
                value={formData.country}
                options={['United States']}
                onChange={(val) => setFormData({ ...formData, country: val })}
              />
              <SelectField
                id="state"
                label="State"
                value={formData.state}
                options={['Utah']}
                onChange={(val) => setFormData({ ...formData, state: val })}
              />
              <InputField
                id="address"
                label="Address"
                type="text"
                value={formData.address}
                onChange={(val) => setFormData({ ...formData, address: val })}
              />
              <InputField
                id="zip_code"
                label="Zip_code"
                type="int"
                value={formData.zip_code}
                onChange={(val) => setFormData({ ...formData, zip_code: val })}
              />
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us a little bit about your interest in singing
                </label>
                <textarea
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-32"
                />
              </div>

              <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Picture
                </label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 cursor-pointer hover:border-lime-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <input
                      id="picture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>

            <p className="text-sm text-gray-500 mt-4">
              Please, give us a couple of weeks to review your application and we will get back to you. In the meantime, we will contact you if we need something from you.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable input field
const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

// Reusable select field
const SelectField = ({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default ApplicationForm;
