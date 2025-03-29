"use client";

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRotateLeft, 
  faRotateRight,
  faFont,
  faCrop,
  faCheck,
  faTimes,
  faBars
} from '@fortawesome/free-solid-svg-icons';

export default function ImageEditor() {
  // State variables for filter values
  const [brightness, setBrightness] = useState("100");
  const [saturation, setSaturation] = useState("100");
  const [inversion, setInversion] = useState("0");
  const [grayscale, setGrayscale] = useState("0");
  const [blurry, setBlurry] = useState("0");
  const [sepia, setSepia] = useState("0");
  const [transparent, setTransparent] = useState("100");
  const [coloration, setColoration] = useState("0");
  
  // State variables for rotation and flip
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  
  // State for active filter
  const [activeFilter, setActiveFilter] = useState("brightness");
  
  // State for slider value and image
  const [sliderValue, setSliderValue] = useState("100");
  const [image, setImage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [hasStoredImage, setHasStoredImage] = useState(false);
  
  // Text overlay state
  const [textOverlays, setTextOverlays] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState("24");
  const [isAddingText, setIsAddingText] = useState(false);
  
  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const previewContainerRef = useRef(null);

  // Storage key constant for consistency
  const STORAGE_KEY = 'lastGeneratedImageBase64';

  // Check for stored image on component mount
  useEffect(() => {
    const storedImage = localStorage.getItem(STORAGE_KEY);
    if (storedImage) {
      setHasStoredImage(true);
      setImage(storedImage);
      setIsDisabled(false);
    }
  }, []);

  // Function to load image from file
  const loadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setImage(imageUrl);
      setIsDisabled(false);
      resetFilter();
      localStorage.setItem(STORAGE_KEY, imageUrl);
      setHasStoredImage(true);
      setTextOverlays([]);
    };
    reader.readAsDataURL(file);
  };

  // Function to load image from localStorage
  const loadStoredImage = () => {
    const storedImage = localStorage.getItem(STORAGE_KEY);
    if (storedImage) {
      setImage(storedImage);
      setIsDisabled(false);
      resetFilter();
      setTextOverlays([]);
    }
  };

  // Function to handle filter option click
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    switch (filterId) {
      case "brightness": setSliderValue(brightness); break;
      case "saturation": setSliderValue(saturation); break;
      case "inversion": setSliderValue(inversion); break;
      case "grayscale": setSliderValue(grayscale); break;
      case "blur": setSliderValue(blurry); break;
      case "sepia": setSliderValue(sepia); break;
      case "transparent": setSliderValue(transparent); break;
      case "coloration": setSliderValue(coloration); break;
    }
  };

  // Function to update filter value
  const updateFilter = (value) => {
    setSliderValue(value);
    switch (activeFilter) {
      case "brightness": setBrightness(value); break;
      case "saturation": setSaturation(value); break;
      case "inversion": setInversion(value); break;
      case "grayscale": setGrayscale(value); break;
      case "blur": setBlurry(value); break;
      case "sepia": setSepia(value); break;
      case "transparent": setTransparent(value); break;
      case "coloration": setColoration(value); break;
    }
  };

  // Get max value for slider based on active filter
  const getSliderMax = () => {
    switch (activeFilter) {
      case "brightness":
      case "saturation": return "200";
      case "inversion":
      case "grayscale":
      case "sepia":
      case "transparent":
      case "coloration": return "100";
      case "blur": return "50";
      default: return "100";
    }
  };

  // Function to handle rotation options
  const handleRotateOptions = (option) => {
    if (option === "left") setRotate(rotate - 90);
    else if (option === "right") setRotate(rotate + 90);
    else if (option === "horizontal") setFlipHorizontal(flipHorizontal === 1 ? -1 : 1);
    else if (option === "vertical") setFlipVertical(flipVertical === 1 ? -1 : 1);
  };

  // Function to reset filters
  const resetFilter = () => {
    setBrightness("100");
    setSaturation("100");
    setInversion("0");
    setGrayscale("0");
    setBlurry("0");
    setSepia("0");
    setTransparent("100");
    setColoration("0");
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setActiveFilter("brightness");
    setSliderValue("100");
    setTextOverlays([]);
    setIsCropping(false);
  };

  // Function to clear stored image
  const clearStoredImage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasStoredImage(false);
    if (image === localStorage.getItem(STORAGE_KEY)) {
      setImage(null);
      setIsDisabled(true);
    }
  };

  // Text overlay functions
  const startAddingText = () => {
    setIsAddingText(true);
    setIsCropping(false);
  };

  const cancelAddingText = () => {
    setIsAddingText(false);
    setCurrentText("");
  };

  const confirmText = () => {
    if (!currentText.trim()) {
      cancelAddingText();
      return;
    }
    setTextOverlays([...textOverlays, {
      content: currentText,
      x: 100,
      y: 100,
      color: textColor,
      size: textSize,
      id: Date.now()
    }]);
    setIsAddingText(false);
    setCurrentText("");
  };

  const handleTextDragStart = (id, e) => {
    e.dataTransfer.setData("textId", id.toString());
  };

  const handleTextDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("textId"));
    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTextOverlays(textOverlays.map(text => 
      text.id === id ? { ...text, x, y } : text
    ));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter(text => text.id !== id));
  };

  // Crop functions
  const startCropping = () => {
    setIsCropping(true);
    setIsAddingText(false);
  };

  const cancelCropping = () => {
    setIsCropping(false);
    setCropStart({ x: 0, y: 0 });
    setCropEnd({ x: 0, y: 0 });
  };

  const handleCropMouseDown = (e) => {
    if (!isCropping) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    setCropStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCropEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
  };

  const handleCropMouseMove = (e) => {
    if (!isDragging || !isCropping) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    setCropEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (!imageRef.current || !isCropping) return;
    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    if (width === 0 || height === 0) {
      cancelCropping();
      return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageRef.current, startX, startY, width, height, 0, 0, width, height);
    
    setImage(canvas.toDataURL('image/jpeg'));
    setIsCropping(false);
    setCropStart({ x: 0, y: 0 });
    setCropEnd({ x: 0, y: 0 });
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
  };

  // Function to save the current edits to localStorage
  const saveEdits = () => {
    if (!imageRef.current || !image || image === "/image-placeholder.svg") {
      alert('No image to save');
      return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageRef.current.naturalWidth || imageRef.current.width;
    canvas.height = imageRef.current.naturalHeight || imageRef.current.height;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blurry}px) sepia(${sepia}%) opacity(${transparent}%) hue-rotate(${coloration}deg)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) ctx.rotate(rotate * Math.PI / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(imageRef.current, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    textOverlays.forEach(text => {
      ctx.font = `${text.size}px Arial`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.content, text.x, text.y);
    });
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    localStorage.setItem("lastGeneratedImageBase64", imageData);
    setHasStoredImage(true);
    alert('Changes saved successfully!');
  };

  // Function to download the image
  const saveImage = () => {
    if (!image || image === "/image-placeholder.svg") {
      alert('Please load an image first');
      return;
    }
    
    const link = document.createElement("a");
    link.download = "edited-image.jpg";
    link.href = image;
    link.click();
  };

  return (
    <div className={`max-w-7xl mx-auto p-4 ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
         <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Image Editor</h2>
        {/* Mobile menu button */}
        <button
          className="md:hidden bg-green-500 text-white p-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          {isMobileMenuOpen ? 'Close' : 'Tools'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Tools Panel - Left Side */}
        <div className={`w-full md:w-80 bg-gray-100 p-4 rounded-lg shadow-md ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          {/* Filters Section */}
          <div className="mb-6 pb-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['brightness', 'saturation', 'inversion', 'grayscale', 'blur', 'sepia', 'transparent', 'coloration'].map(filter => (
                <button
                  key={filter}
                  className={`p-2 border rounded-md text-center ${activeFilter === filter ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-300'}`}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                <span>{sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max={getSliderMax()}
                value={sliderValue}
                onChange={(e) => updateFilter(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Rotate & Flip Section */}
          <div className="mb-6 pb-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Rotate & Flip</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md"
                onClick={() => handleRotateOptions("left")}
              >
                <FontAwesomeIcon icon={faRotateLeft} /> Left
              </button>
              <button 
                className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md"
                onClick={() => handleRotateOptions("right")}
              >
                <FontAwesomeIcon icon={faRotateRight} /> Right
              </button>
              <button 
                className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md"
                onClick={() => handleRotateOptions("horizontal")}
              >
                <i className='bx bx-reflect-vertical'></i> Flip H
              </button>
              <button 
                className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md"
                onClick={() => handleRotateOptions("vertical")}
              >
                <i className='bx bx-reflect-horizontal'></i> Flip V
              </button>
            </div>
          </div>

          {/* Text Tools Section */}
          <div className="mb-6 pb-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Text Tools</h3>
            <button 
              className="w-full flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md mb-3"
              onClick={startAddingText}
            >
              <FontAwesomeIcon icon={faFont} /> Add Text
            </button>
            
            {isAddingText && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                  autoFocus
                />
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <span className="text-sm">Color:</span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="border border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-sm">Size:</span>
                    <input
                      type="range"
                      min="10"
                      max="72"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm w-10">{textSize}px</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-500 text-white rounded-md"
                    onClick={confirmText}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Add
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md"
                    onClick={cancelAddingText}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Crop Tools Section */}
          <div className="mb-6 pb-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Crop Tools</h3>
            {!isCropping ? (
              <button
                className="w-full flex items-center justify-center gap-2 p-2 bg-white border border-gray-300 rounded-md"
                onClick={startCropping}
              >
                <FontAwesomeIcon icon={faCrop} /> Crop Image
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-500 text-white rounded-md"
                  onClick={applyCrop}
                >
                  <FontAwesomeIcon icon={faCheck} /> Apply
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md"
                  onClick={cancelCropping}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Image Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Image Controls</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-md"
                onClick={resetFilter}
              >
                Reset All
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={loadImage}
              />
              <button
                className="p-2 bg-white border border-gray-300 rounded-md col-span-2"
                onClick={() => fileInputRef.current.click()}
              >
                Choose Image
              </button>
              {hasStoredImage && (
                <>
                  <button
                    className="p-2 bg-white border border-gray-300 rounded-md"
                    onClick={loadStoredImage}
                  >
                    Use Stored
                  </button>
                  <button
                    className="p-2 bg-white border border-gray-300 rounded-md"
                    onClick={clearStoredImage}
                  >
                    Clear Stored
                  </button>
                </>
              )}
              <button
                className="p-2 bg-yellow-500 text-white rounded-md"
                onClick={saveEdits}
              >
                Save Edits
              </button>
              <button
                className="p-2 bg-green-600 text-white rounded-md"
                onClick={saveImage}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden relative min-h-[400px]">
          <div
            className="w-full h-full flex justify-center items-center relative"
            ref={previewContainerRef}
            onDrop={handleTextDrop}
            onDragOver={handleDragOver}
            onMouseDown={isCropping ? handleCropMouseDown : undefined}
            onMouseMove={isCropping ? handleCropMouseMove : undefined}
            onMouseUp={isCropping ? handleCropMouseUp : undefined}
            onMouseLeave={isCropping ? handleCropMouseUp : undefined}
          >
            <img
              ref={imageRef}
              src={image || "/image-placeholder.svg"}
              alt="preview-img"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blurry}px) sepia(${sepia}%) opacity(${transparent}%) hue-rotate(${coloration}deg)`,
                transform: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
              }}
            />
            
            {/* Text overlays */}
            {textOverlays.map(text => (
              <div
                key={text.id}
                className="absolute cursor-move select-none p-1  bg-opacity-30 rounded-sm"
                style={{
                  left: `${text.x}px`,
                  top: `${text.y}px`,
                  color: text.color,
                  fontSize: `${text.size}px`
                }}
                draggable
                onDragStart={(e) => handleTextDragStart(text.id, e)}
                onDoubleClick={() => removeTextOverlay(text.id)}
              >
                {text.content}
              </div>
            ))}
            
            {/* Crop rectangle */}
            {isCropping && (
              <div
                className="absolute border-2 border-dashed border-white bg-black bg-opacity-30 pointer-events-none shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]"
                style={{
                  left: `${Math.min(cropStart.x, cropEnd.x)}px`,
                  top: `${Math.min(cropStart.y, cropEnd.y)}px`,
                  width: `${Math.abs(cropEnd.x - cropStart.x)}px`,
                  height: `${Math.abs(cropEnd.y - cropStart.y)}px`
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}