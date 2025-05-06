'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CreditCard, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:4004/api';

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    zipCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  const predefinedAmounts = [
    { value: '5', label: '$5' },
    { value: '10', label: '$10' },
    { value: '20', label: '$20' },
    { value: '30', label: '$30' },
    { value: '50', label: '$50' },
  ];

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          const data = await response.json();
          setServerStatus(data.status);
        } else {
          setServerStatus('Server unavailable');
        }
      } catch (error) {
        console.error('Failed to check server health:', error);
        setServerStatus('Unable to connect to server');
      }
    };

    checkServerHealth();
  }, []);

  const handleDonate = () => {
    const donationAmount = selectedAmount || customAmount;
    
    // Validate if an amount is selected
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }
    
    // Show payment options
    setShowPaymentOptions(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setServerError(null); // Clear any previous errors when changing payment method
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateCardDetails = () => {
    const newErrors = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      zipCode: ''
    };
    let isValid = true;

    // Card number validation
    if (!cardDetails.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }

    // Card holder validation
    if (!cardDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
      isValid = false;
    }

    // Expiry date validation
    if (!cardDetails.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please use MM/YY format';
      isValid = false;
    }

    // CVV validation
    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
      isValid = false;
    }

    // Address validation
    if (!cardDetails.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
      isValid = false;
    }

    // Zip code validation
    if (!cardDetails.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(cardDetails.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const processCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCardDetails()) {
      return;
    }
    
    const donationAmount = selectedAmount || customAmount;
    
    setIsProcessing(true);
    setServerError(null);
    
    try {
      const response = await fetch(`${API_URL}/donate/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          donationType: donationType,
          cardDetails: {
            cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
            cardHolder: cardDetails.cardHolder,
            expiryDate: cardDetails.expiryDate,
            cvv: cardDetails.cvv,
            billingAddress: cardDetails.billingAddress,
            city: cardDetails.city,
            state: cardDetails.state,
            zipCode: cardDetails.zipCode
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentResponse(data);
        setPaymentComplete(true);
      } else {
        setServerError(data.message || 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setServerError('Connection to payment server failed. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleThirdPartyPayment = async (provider: string) => {
    const donationAmount = selectedAmount || customAmount;
    setIsProcessing(true);
    setServerError(null);
    
    try {
      const response = await fetch(`${API_URL}/donate/thirdparty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          donationType: donationType,
          service: provider.toLowerCase()
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        // Open the third-party app/site in a new window
        window.open(data.redirectUrl, '_blank');
        
        // Show completion message
        setPaymentResponse({
          message: `Redirected to ${provider} to complete your ${donationType} donation of $${donationAmount}`,
          transactionId: 'PENDING' // In a real system, you'd track this pending transaction
        });
        setPaymentComplete(true);
      } else {
        setServerError(data.message || `Connection to ${provider} failed. Please try again.`);
      }
    } catch (error) {
      console.error(`${provider} redirect failed:`, error);
      setServerError(`Unable to connect to ${provider}. Please try again later.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedAmount('');
    setCustomAmount('');
    setShowPaymentOptions(false);
    setSelectedPaymentMethod(null);
    setCardDetails({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setPaymentComplete(false);
    setPaymentResponse(null);
    setServerError(null);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          
          {paymentResponse && (
            <>
              <p className="text-gray-600 mb-2">
                {paymentResponse.message || `Your ${donationType} donation of $${selectedAmount || customAmount} has been successfully processed.`}
              </p>
              
              {paymentResponse.transactionId && paymentResponse.transactionId !== 'PENDING' && (
                <p className="text-sm text-gray-500 mb-4">
                  Transaction ID: {paymentResponse.transactionId}
                </p>
              )}
            </>
          )}
          
          <p className="text-gray-600 mb-8">
            We appreciate your generous support for our choir ministry.
          </p>
          <button 
            onClick={resetForm}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-auto mx-auto">
        {serverStatus && serverStatus !== 'Server unavailable' && serverStatus !== 'Unable to connect to server' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Main Content Section - Flex container for desktop */}
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="w-full md:w-2/3 h-64 md:h-[500px] relative">
                <Image
                  src="/choir-group.png"
                  alt="Group photo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/3 p-6">
                <div className="space-y-4">
                  <h1 className='text-2xl sm:text-3xl md:text-4xl sm:ml-8 md:ml-16'>Donate</h1>
                  <p className="text-gray-800 leading-relaxed">
                    Your Donation means a lot to us and we really appreciate everyone that help us reach our goals to sing for our lord Jesus Christ and Uplift wounded hearts and bring peace to our neighbors.
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    We can wait to get your gift to buy some music instruments to make our music sounds more interesting and fun.
                  </p>
                  <p className="text-gray-800 font-medium">
                    Thank you so much!
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Amount Section - Always at bottom */}
            <div className="p-6 bg-gray-50">
              <div className="max-w-3xl mx-auto space-y-4">
                {!showPaymentOptions ? (
                  <>
                    <p className="font-medium text-center text-teal-800">Select the amount:</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount.value}
                          onClick={() => {
                            setSelectedAmount(amount.value);
                            setCustomAmount('');
                          }}
                          className={`py-3 px-4 border rounded-md text-center transition-colors
                            ${selectedAmount === amount.value 
                              ? 'border-green-600 bg-green-50 text-green-700' 
                              : 'border-gray-300 hover:border-green-600'}`}
                        >
                          {amount.label}
                        </button>
                      ))}
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Other Amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount('');
                          }}
                          className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    {/* Donation Type Selection */}
                    <div className="flex items-center justify-center space-x-6 mt-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={donationType === 'one-time'}
                          onChange={() => setDonationType('one-time')}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">One time Donation</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={donationType === 'monthly'}
                          onChange={() => setDonationType('monthly')}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">Monthly Donation</span>
                      </label>
                    </div>

                    {/* Donate Button */}
                    <button
                      onClick={handleDonate}
                      className="w-full max-w-md mx-auto block bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors mt-6"
                    >
                      Donate
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {donationType === 'one-time' ? 'One-time' : 'Monthly'} Donation: ${selectedAmount || customAmount}
                      </h2>
                      <p className="text-gray-600 mt-1">Select your payment method</p>
                    </div>
                    
                    {serverError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {serverError}
                      </div>
                    )}
                    
                    {!selectedPaymentMethod ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => handlePaymentMethodSelect('card')}
                          className="flex items-center justify-center p-4 border border-gray-300 rounded-md hover:border-green-600 hover:bg-green-50 transition-colors"
                          disabled={isProcessing}
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          <span>Credit/Debit Card</span>
                        </button>
                        
                        <button
                          onClick={() => handleThirdPartyPayment('Venmo')}
                          className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          disabled={isProcessing}
                        >
                          <span>Venmo</span>
                        </button>
                        
                        <button
                          onClick={() => handleThirdPartyPayment('CashApp')}
                          className="flex items-center justify-center p-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          disabled={isProcessing}
                        >
                          <DollarSign className="mr-2 h-5 w-5" />
                          <span>Cash App</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={processCardPayment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Card Number</label>
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.cardNumber}
                              onChange={handleCardInputChange}
                              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isProcessing}
                            />
                            {formErrors.cardNumber && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              name="cardHolder"
                              placeholder="John Doe"
                              value={cardDetails.cardHolder}
                              onChange={handleCardInputChange}
                              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.cardHolder ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isProcessing}
                            />
                            {formErrors.cardHolder && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.cardHolder}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Expiry Date</label>
                            <input
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={cardDetails.expiryDate}
                              onChange={handleCardInputChange}
                              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isProcessing}
                            />
                            {formErrors.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={handleCardInputChange}
                              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isProcessing}
                            />
                            {formErrors.cvv && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Billing Address</label>
                          <input
                            type="text"
                            name="billingAddress"
                            placeholder="123 Main St"
                            value={cardDetails.billingAddress}
                            onChange={handleCardInputChange}
                            className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              formErrors.billingAddress ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isProcessing}
                          />
                          {formErrors.billingAddress && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.billingAddress}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">City</label>
                            <input
                              type="text"
                              name="city"
                              placeholder="New York"
                              value={cardDetails.city}
                              onChange={handleCardInputChange}
                              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isProcessing}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">State</label>
                            <input
                              type="text"
                              name="state"
                              placeholder="NY"
                              value={cardDetails.state}
                              onChange={handleCardInputChange}
                              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isProcessing}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">ZIP Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              placeholder="10001"
                              value={cardDetails.zipCode}
                              onChange={handleCardInputChange}
                              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isProcessing}
                            />
                            {formErrors.zipCode && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentMethod(null)}
                            className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={isProcessing}
                          >
                            Back
                          </button>
                          
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                          >
                            {isProcessing ? 'Processing...' : 'Complete Donation'}
                          </button>
                        </div>
                      </form>
                    )}
                    
                    {!selectedPaymentMethod && !isProcessing && (
                      <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="mt-6 text-green-600 hover:text-green-700 font-medium text-center w-full"
                      >
                        Change Donation Amount
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Server Connection Issue</h2>
            <p className="text-gray-600 mb-4">
              We are having trouble connecting to our donation server. Please try again later.
            </p>
            <p className="text-sm text-gray-500">
              Status: {serverStatus || 'Checking connection...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationForm;