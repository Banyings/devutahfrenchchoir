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
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

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
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! Redirecting to home page...'
        });
        
        // Reset the form
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
        setPreviewUrl(null);
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home page
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Submission failed: ' + data.message
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting the form.'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
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
                label="Zip Code"
                type="text"
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
                <div className="mt-1 w-full">
                  {!previewUrl ? (
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
                  ) : (
                    <div className="border-2 border-green-500 rounded-lg p-4 relative">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded-full border border-gray-200">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {formData.picture?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formData.picture && (formData.picture.size / 1024).toFixed(1)} KB
                          </p>
                          <div className="flex items-center text-xs text-green-600 mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Image selected
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null);
                            setFormData({ ...formData, picture: null });
                          }}
                          className="p-2 text-gray-500 hover:text-red-600"
                          aria-label="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <label htmlFor="replace-picture" className="text-xs text-blue-600 cursor-pointer hover:underline">
                          Replace with different image
                        </label>
                        <input
                          id="replace-picture"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>
            
            {/* Status Message */}
            {submitStatus.type && (
              <div 
                className={`mt-4 flex justify-center rounded-md ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-800 border' 
                    : 'bg-red-100 text-red-800 border border-red-400'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

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

// 'use client';

// import React, { useState } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { v4 as uuidv4 } from 'uuid';

// // Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const ApplicationForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     date: '',
//     country: 'United States',
//     state: 'Utah',
//     address: '',
//     zip_code: '',
//     interest: '',
//     picture: null as File | null,
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // 1. Upload image to Supabase Storage if available
//       let pictureUrl = null;
      
//       if (formData.picture) {
//         const fileExt = formData.picture.name.split('.').pop();
//         const fileName = `${uuidv4()}.${fileExt}`;
//         const filePath = `applicant-photos/${fileName}`;
        
//         // Upload to Supabase Storage
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('applications')
//           .upload(filePath, formData.picture);
          
//         if (uploadError) {
//           throw new Error(`Error uploading picture: ${uploadError.message}`);
//         }
        
//         // Get public URL
//         const { data: urlData } = supabase.storage
//           .from('applications')
//           .getPublicUrl(filePath);
          
//         pictureUrl = urlData.publicUrl;
//       }
      
//       // 2. Insert application data into Supabase Database
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { data, error } = await supabase
//         .from('choir_applications')
//         .insert([
//           {
//             full_name: formData.fullName,
//             email: formData.email,
//             phone: formData.phone,
//             application_date: formData.date,
//             country: formData.country,
//             state: formData.state,
//             address: formData.address,
//             zip_code: formData.zip_code,
//             interest: formData.interest,
//             picture_url: pictureUrl,
//           }
//         ]);

//       if (error) {
//         throw new Error(`Error submitting application: ${error.message}`);
//       }

//       // Show success message
//       console.log('Application submitted successfully!');
      
//       // Reset the form
//       setFormData({
//         fullName: '',
//         email: '',
//         phone: '',
//         date: '',
//         country: 'United States',
//         state: 'Utah',
//         address: '',
//         zip_code: '',
//         interest: '',
//         picture: null,
//       });
      
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert(`An error occurred while submitting the form: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData({ ...formData, picture: file });
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-2xl bg-white rounded-lg border border-cyan-100 shadow-md">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-center mb-6">
//             We are so happy to have you join us!
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-4">
//               <InputField
//                 id="fullName"
//                 label="Full Name"
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(val) => setFormData({ ...formData, fullName: val })}
//                 required={true}
//               />
//               <InputField
//                 id="email"
//                 label="Email Address"
//                 type="email"
//                 value={formData.email}
//                 onChange={(val) => setFormData({ ...formData, email: val })}
//                 required={true}
//               />
//               <InputField
//                 id="phone"
//                 label="Phone Number"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(val) => setFormData({ ...formData, phone: val })}
//                 required={true}
//               />
//               <InputField
//                 id="date"
//                 label="Date"
//                 type="date"
//                 value={formData.date}
//                 onChange={(val) => setFormData({ ...formData, date: val })}
//                 required={true}
//               />
//               <SelectField
//                 id="country"
//                 label="Country"
//                 value={formData.country}
//                 options={['United States']}
//                 onChange={(val) => setFormData({ ...formData, country: val })}
//               />
//               <SelectField
//                 id="state"
//                 label="State"
//                 value={formData.state}
//                 options={['Utah']}
//                 onChange={(val) => setFormData({ ...formData, state: val })}
//               />
//               <InputField
//                 id="address"
//                 label="Address"
//                 type="text"
//                 value={formData.address}
//                 onChange={(val) => setFormData({ ...formData, address: val })}
//                 required={true}
//               />
//               <InputField
//                 id="zip_code"
//                 label="Zip Code"
//                 type="text"
//                 value={formData.zip_code}
//                 onChange={(val) => setFormData({ ...formData, zip_code: val })}
//                 required={true}
//               />
//               <div>
//                 <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
//                   Tell us a little bit about your interest in singing
//                 </label>
//                 <textarea
//                   id="interest"
//                   value={formData.interest}
//                   onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-32"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Picture
//                 </label>
//                 <div className="mt-1 flex items-center justify-center w-full">
//                   <label className="w-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 cursor-pointer hover:border-lime-500">
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                       </svg>
//                       <p className="mb-2 text-sm text-gray-500">
//                         <span className="font-semibold">Click to upload</span> or drag and drop
//                       </p>
//                       {formData.picture && (
//                         <p className="text-sm text-green-600">
//                           File selected: {formData.picture.name}
//                         </p>
//                       )}
//                     </div>
//                     <input
//                       id="picture"
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>

//             <p className="text-sm text-gray-500 mt-4">
//               Please, give us a couple of weeks to review your application and we will get back to you. In the meantime, we will contact you if we need something from you.
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable input field
// const InputField = ({
//   id,
//   label,
//   type,
//   value,
//   onChange,
//   required = false,
// }: {
//   id: string;
//   label: string;
//   type: string;
//   value: string;
//   onChange: (val: string) => void;
//   required?: boolean;
// }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       id={id}
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//       required={required}
//     />
//   </div>
// );

// // Reusable select field
// const SelectField = ({
//   id,
//   label,
//   value,
//   options,
//   onChange,
// }: {
//   id: string;
//   label: string;
//   value: string;
//   options: string[];
//   onChange: (val: string) => void;
// }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <select
//       id={id}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// export default ApplicationForm;

// 'use client';

// import React, { useState } from 'react';

// const ApplicationForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     date: '',
//     country: 'United States',
//     state: 'Utah',
//     address: '',
//     zip_code: '',
//     interest: '',
//     picture: null as File | null,
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmissionStatus(null);

//     try {
//       // Simulate backend logic
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Example basic validation
//       if (!formData.fullName || !formData.email || !formData.phone) {
//         throw new Error('Please fill out all required fields.');
//       }

//       setSubmissionStatus('Application submitted successfully!');
//       setFormData({
//         fullName: '',
//         email: '',
//         phone: '',
//         date: '',
//         country: 'United States',
//         state: 'Utah',
//         address: '',
//         zip_code: '',
//         interest: '',
//         picture: null,
//       });
//     } catch (error: any) {
//       setSubmissionStatus(error.message || 'An error occurred while submitting.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData({ ...formData, picture: file });
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-2xl bg-white rounded-lg border border-cyan-100 shadow-md">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-center mb-6">
//             We are so happy to have you join us!
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-4">
//               <InputField
//                 id="fullName"
//                 label="Full Name"
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(val) => setFormData({ ...formData, fullName: val })}
//                 required
//               />
//               <InputField
//                 id="email"
//                 label="Email Address"
//                 type="email"
//                 value={formData.email}
//                 onChange={(val) => setFormData({ ...formData, email: val })}
//                 required
//               />
//               <InputField
//                 id="phone"
//                 label="Phone Number"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(val) => setFormData({ ...formData, phone: val })}
//                 required
//               />
//               <InputField
//                 id="date"
//                 label="Date"
//                 type="date"
//                 value={formData.date}
//                 onChange={(val) => setFormData({ ...formData, date: val })}
//                 required
//               />
//               <SelectField
//                 id="country"
//                 label="Country"
//                 value={formData.country}
//                 options={['United States']}
//                 onChange={(val) => setFormData({ ...formData, country: val })}
//               />
//               <SelectField
//                 id="state"
//                 label="State"
//                 value={formData.state}
//                 options={['Utah']}
//                 onChange={(val) => setFormData({ ...formData, state: val })}
//               />
//               <InputField
//                 id="address"
//                 label="Address"
//                 type="text"
//                 value={formData.address}
//                 onChange={(val) => setFormData({ ...formData, address: val })}
//                 required
//               />
//               <InputField
//                 id="zip_code"
//                 label="Zip Code"
//                 type="text"
//                 value={formData.zip_code}
//                 onChange={(val) => setFormData({ ...formData, zip_code: val })}
//                 required
//               />
//               <div>
//                 <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
//                   Tell us a little bit about your interest in singing
//                 </label>
//                 <textarea
//                   id="interest"
//                   value={formData.interest}
//                   onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-32"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Picture
//                 </label>
//                 <div className="mt-1 flex items-center justify-center w-full">
//                   <label className="w-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 cursor-pointer hover:border-lime-500">
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                       </svg>
//                       <p className="mb-2 text-sm text-gray-500">
//                         <span className="font-semibold">Click to upload</span> or drag and drop
//                       </p>
//                       {formData.picture && (
//                         <p className="text-sm text-green-600">
//                           File selected: {formData.picture.name}
//                         </p>
//                       )}
//                     </div>
//                     <input
//                       id="picture"
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center space-x-2">
//                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                   </svg>
//                   <span>Submitting...</span>
//                 </span>
//               ) : (
//                 'Submit'
//               )}
//             </button>

//             {submissionStatus && (
//               <div className={`mt-2 text-sm ${submissionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
//                 {submissionStatus}
//               </div>
//             )}

//             <p className="text-sm text-gray-500 mt-4">
//               Please, give us a couple of weeks to review your application and we will get back to you. In the meantime, we will contact you if we need something from you.
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({
//   id,
//   label,
//   type,
//   value,
//   onChange,
//   required = false,
// }: {
//   id: string;
//   label: string;
//   type: string;
//   value: string;
//   onChange: (val: string) => void;
//   required?: boolean;
// }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       id={id}
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//       required={required}
//     />
//   </div>
// );

// const SelectField = ({
//   id,
//   label,
//   value,
//   options,
//   onChange,
// }: {
//   id: string;
//   label: string;
//   value: string;
//   options: string[];
//   onChange: (val: string) => void;
// }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <select
//       id={id}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// export default ApplicationForm;
