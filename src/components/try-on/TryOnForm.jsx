import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateTryOn, getRandomSeed } from '../../api/tryOn';

const TryOnForm = ({ selectedClothing }) => {
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [clothingPrompt, setClothingPrompt] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [avatarSex, setAvatarSex] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [useSeed, setUseSeed] = useState(false);
  const [seed, setSeed] = useState(-1);
  const [lastSeed, setLastSeed] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [avatarImageError, setAvatarImageError] = useState(null);
  const [clothingImageError, setClothingImageError] = useState(null);
  const [backgroundImageError, setBackgroundImageError] = useState(null);

  // Set clothing image from props if available
  useEffect(() => {
    if (selectedClothing) {
      console.log("Selected clothing received:", selectedClothing);
      // If selectedClothing is already a data URL, use it directly
      if (selectedClothing.startsWith('data:')) {
        console.log("Using direct data URL");
        setClothingImage(selectedClothing);
      } 
      // If it's a path to an image file, convert it to a data URL
      else {
        console.log("Converting image path to data URL:", selectedClothing);
        fetch(selectedClothing)
          .then(response => {
            console.log("Fetch response:", response);
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            console.log("Blob created:", blob);
            const reader = new FileReader();
            reader.onload = () => {
              console.log("Image converted to data URL");
              setClothingImage(reader.result);
            };
            reader.readAsDataURL(blob);
          })
          .catch(err => {
            console.error("Error loading selected clothing image:", err);
            setError("Failed to load the selected clothing. Please try again or select another item.");
          });
      }
    }
  }, [selectedClothing]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    setAvatarImageError(null);
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarImageError('Please upload a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarImage(reader.result);
      };
      reader.onerror = () => {
        setAvatarImageError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingUpload = (e) => {
    const file = e.target.files[0];
    setClothingImageError(null);
    if (file) {
      if (!file.type.startsWith('image/')) {
        setClothingImageError('Please upload a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setClothingImage(reader.result);
      };
      reader.onerror = () => {
        setClothingImageError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    setBackgroundImageError(null);
    if (file) {
      if (!file.type.startsWith('image/')) {
        setBackgroundImageError('Please upload a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImage(reader.result);
      };
      reader.onerror = () => {
        setBackgroundImageError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!avatarImage && !avatarPrompt) {
      setError("Please upload an avatar image or provide an avatar prompt");
      return;
    }
    
    if (!clothingImage && !clothingPrompt) {
      setError("Please upload a clothing image or provide a clothing prompt");
      return;
    }
    
    console.log("Submitting try-on with:");
    console.log("Avatar image:", avatarImage ? "Avatar image provided" : "No avatar image");
    console.log("Avatar prompt:", avatarPrompt || "No prompt");
    console.log("Clothing image:", clothingImage ? "Clothing image provided" : "No clothing image");
    console.log("Clothing prompt:", clothingPrompt || "No prompt");
    
    setLoading(true);
    setError(null);
    
    try {
      // Use random seed if not specified
      const seedToUse = useSeed ? seed : getRandomSeed();
      console.log("Using seed:", seedToUse);
      
      // Call the try-on API
      const resultImage = await generateTryOn(
        avatarImage,
        clothingImage,
        backgroundImage,
        avatarPrompt || null,
        clothingPrompt || null,
        backgroundPrompt || null,
        avatarSex || null,
        seedToUse
      );
      
      console.log("Try-on result received");
      
      // Store the result and the seed used
      setResult(resultImage);
      setLastSeed(seedToUse);
      
    } catch (error) {
      console.error("Error generating try-on result:", error);
      setError(`Failed to generate try-on: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = () => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = result;
    link.download = `try-on-result-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const regenerateWithSameSeed = () => {
    if (lastSeed !== null) {
      setSeed(lastSeed);
      setUseSeed(true);
      handleSubmit(new Event('submit'));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Virtual Try-On Studio</h2>
      
      {selectedClothing && !result && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg mb-7 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <strong className="font-semibold">Great choice!</strong> 
            <span className="block sm:inline ml-1">You've selected an item to try on. Now please add your avatar to see how it looks.</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-7 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <strong className="font-semibold">Error:</strong> 
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Avatar Section */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center text-lg dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Upload Avatar
            </h3>
            
            <div className="flex flex-col items-center">
              {avatarImage ? (
                <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white">
                  <img 
                    src={avatarImage} 
                    alt="Avatar Preview" 
                    className="max-h-64 max-w-full object-contain mx-auto d-block"
                    style={{ display: 'block', margin: '0 auto', background: 'white' }}
                    onError={() => setAvatarImageError('Failed to load the image. Please try another file.')}
                  />
                  <button 
                    type="button"
                    onClick={() => setAvatarImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {avatarImageError && (
                    <div className="absolute bottom-2 left-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{avatarImageError}</div>
                  )}
                </div>
              ) : (
                <div className="mb-4 w-full h-64 bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 dark:text-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No avatar selected</p>
                  {avatarImageError && (
                    <div className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{avatarImageError}</div>
                  )}
                </div>
              )}
              
              <label className="w-full">
                <button 
                  type="button"
                  className="btn btn-primary w-full flex items-center justify-center h-11 dark:text-white"
                  onClick={() => document.getElementById('avatar-upload').click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload Avatar
                </button>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                />
              </label>
              
              {showAdvanced && (
                <div className="mt-4 w-full space-y-3">
                  <input 
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Avatar prompt (optional)"
                    value={avatarPrompt}
                    onChange={(e) => setAvatarPrompt(e.target.value)}
                  />
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={avatarSex}
                    onChange={(e) => setAvatarSex(e.target.value)}
                  >
                    <option value="">Auto-detect gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Clothing Section */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center text-lg dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Upload Clothing
            </h3>
            
            <div className="flex flex-col items-center">
              {clothingImage ? (
                <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white">
                  <img 
                    src={clothingImage} 
                    alt="Clothing Preview" 
                    className="max-h-64 max-w-full object-contain mx-auto d-block"
                    style={{ display: 'block', margin: '0 auto', background: 'white' }}
                    onError={() => setClothingImageError('Failed to load the image. Please try another file.')}
                  />
                  <button 
                    type="button"
                    onClick={() => setClothingImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {clothingImageError && (
                    <div className="absolute bottom-2 left-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{clothingImageError}</div>
                  )}
                </div>
              ) : (
                <div className="mb-4 w-full h-64 bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 dark:text-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No clothing selected</p>
                  {clothingImageError && (
                    <div className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{clothingImageError}</div>
                  )}
                </div>
              )}
              
              <label className="w-full">
                <button 
                  type="button"
                  className="btn btn-primary w-full flex items-center justify-center h-11 dark:text-white"
                  onClick={() => document.getElementById('clothing-upload').click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload Clothing
                </button>
                <input 
                  id="clothing-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleClothingUpload} 
                />
              </label>
              
              {showAdvanced && (
                <div className="mt-4 w-full">
                  <input 
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Clothing prompt (optional)"
                    value={clothingPrompt}
                    onChange={(e) => setClothingPrompt(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Background Section */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center text-lg dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Background (Optional)
            </h3>
            
            <div className="flex flex-col items-center">
              {backgroundImage ? (
                <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white">
                  <img 
                    src={backgroundImage} 
                    alt="Background Preview" 
                    className="max-h-64 max-w-full object-contain mx-auto d-block"
                    style={{ display: 'block', margin: '0 auto', background: 'white' }}
                    onError={() => setBackgroundImageError('Failed to load the image. Please try another file.')}
                  />
                  <button 
                    type="button"
                    onClick={() => setBackgroundImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {backgroundImageError && (
                    <div className="absolute bottom-2 left-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{backgroundImageError}</div>
                  )}
                </div>
              ) : (
                <div className="mb-4 w-full h-64 bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 dark:text-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No background selected</p>
                  {backgroundImageError && (
                    <div className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">{backgroundImageError}</div>
                  )}
                </div>
              )}
              
              <label className="w-full">
                <button 
                  type="button"
                  className="btn btn-secondary w-full flex items-center justify-center h-11 dark:text-white"
                  onClick={() => document.getElementById('background-upload').click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload Background
                </button>
                <input 
                  id="background-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleBackgroundUpload} 
                />
              </label>
              
              {showAdvanced && (
                <div className="mt-4 w-full">
                  <input 
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Background prompt (optional)"
                    value={backgroundPrompt}
                    onChange={(e) => setBackgroundPrompt(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Advanced Options Toggle */}
        <div className="mb-8">
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium flex items-center transition-colors dark:text-white"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Hide Advanced Options
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Show Advanced Options
              </>
            )}
          </button>
        </div>
        
        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="mb-8 border rounded-lg border-gray-200 p-6 bg-gray-50/50 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-medium text-lg text-gray-800 mb-4 dark:text-white">Advanced Settings</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="useSeed"
                checked={useSeed}
                onChange={() => setUseSeed(!useSeed)}
                className="mr-3 h-5 w-5 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="useSeed" className="text-gray-700 dark:text-gray-100">Use specific seed for consistent results</label>
            </div>
            {useSeed && (
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                placeholder="Seed number"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            )}
          </div>
        )}
        
        {/* Generate Button */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="btn btn-primary px-10 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none dark:text-gray-900"
            disabled={loading || ((!avatarImage && !avatarPrompt) || (!clothingImage && !clothingPrompt))}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Try-On...
              </span>
            ) : "Generate Try-On"}
          </button>
        </div>
      </form>
      
      {/* Results Section */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 border-t border-gray-200 pt-8"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Try-On Result</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-inner">
            <div className="flex justify-center">
              <div className="relative max-w-md">
                <img 
                  src={result} 
                  alt="Try-On Result" 
                  className="mx-auto max-h-[500px] rounded-lg shadow-lg"
                />
                {lastSeed !== null && (
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-md text-sm">
                    Seed: {lastSeed}
                    <button 
                      onClick={regenerateWithSameSeed}
                      title="Regenerate with same seed"
                      className="ml-2 text-primary hover:text-primary/80"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-5 mt-8">
              <button 
                onClick={handleSaveImage}
                className="btn btn-primary px-5 py-3 flex items-center shadow-md hover:shadow-lg transition-all dark:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save Image
              </button>
              <button className="btn btn-secondary px-5 py-3 flex items-center shadow-md hover:shadow-lg transition-all dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button 
                onClick={() => setResult(null)}
                className="btn btn-outline px-5 py-3 flex items-center shadow-md hover:shadow-lg transition-all dark:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Another
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TryOnForm; 