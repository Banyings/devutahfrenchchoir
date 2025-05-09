// Bookus or Contact us page
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isLoading: false
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      phone: '',
      email: '',
      message: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    const phoneRegex = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g. 123-456-7890)';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormStatus({
      message: '',
      isError: false,
      isLoading: true
    });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4003';

    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          message: data.message || 'Message sent successfully!',
          isError: false,
          isLoading: false
        });

        setFormData({
          fullName: '',
          phone: '',
          email: '',
          message: ''
        });

        // Redirect after short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setFormStatus({
          message: data.message || 'Submission failed. Please try again.',
          isError: true,
          isLoading: false
        });
      }
    } catch (error) {
      setFormStatus({
        message: 'Server error. Please check your connection.',
        isError: true,
        isLoading: false
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="max-w-auto mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-500">
          <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <a href="tel:385-230-9434" className="text-gray-700">385-230-9434</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <a href="mailto:utahchoir@gmail.com" className="text-gray-700">utahchoir@gmail.com</a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-1" />
              <p className="text-gray-700">234 N 200 W Orem, Utah, United States, 84058</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <p className="text-gray-700">Send us a message to plan with our event planner</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-500">
          <h2 className="text-xl font-semibold mb-6">Send Us A Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fullName ? 'border-red-500' : 'border-gray-500'}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-500'}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email-address"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-500'}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.message ? 'border-red-500' : 'border-gray-500'}`}
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={formStatus.isLoading}
                className="flex items-center gap-2 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400"
              >
                {formStatus.isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {formStatus.message && (
                <div className={`flex justify-center rounded-md ${formStatus.isError ? 'bg-red-100 text-red-800 border border-red-400' : 'bg-green-100 text-green-800 border'}`}>
                  {formStatus.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="h-72 bg-gray-200 rounded-lg overflow-hidden border border-gray-500">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.6783974489483!2d-111.6932392!3d40.2967777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x874d9271930c1947%3A0x1d90f12600b556ef!2s234%20N%20200%20W%2C%20Orem%2C%20UT%2084057!5e0!3m2!1sen!2sus!4v1630000000000!5m2!1sen!2sus"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
