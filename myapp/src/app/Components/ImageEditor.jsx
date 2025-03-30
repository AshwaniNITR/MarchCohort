"use client";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { Button } from "@/components/ui/button";
import "animate.css";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  faRotateLeft,
  faRotateRight,
  faFont,
  faCrop,
  faCheck,
  faTimes,
  faBars,
  faSliders,
  faSync,
  faImage,
  faFolderOpen,
  faTrash,
  faSave,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const FONT_FAMILIES = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: '"Times New Roman", serif' },
  { name: "Courier New", value: '"Courier New", monospace' },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Comic Sans", value: '"Comic Sans MS", cursive' },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Papyrus", value: "Papyrus, fantasy" },
  { name: "Brush Script", value: '"Brush Script MT", cursive' },
  { name: "Wingdings", value: "Wingdings, fantasy" },
  { name: "Creepster", value: '"Creepster", cursive' }, // Requires Google Font import
  { name: "Press Start 2P", value: '"Press Start 2P", cursive' }, // Retro gaming font
  { name: "Rubik Glitch", value: '"Rubik Glitch", sans-serif' }, // Cool glitch effect
  { name: "Bungee Shade", value: '"Bungee Shade", cursive' }, // Fun 3D effect
  { name: "Fredoka One", value: '"Fredoka One", cursive' }, // Rounded fun font
];

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
  const [isImageHovered, setIsImageHovered] = useState(false);

  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");

  // Refs
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const previewContainerRef = useRef(null);

  // New state for image position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle mouse down on image
  const handleImageMouseDown = (e) => {
    if (isCropping || isAddingText) return;
    setIsDraggingImage(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  // Handle mouse move for dragging
  const handleImageMouseMove = (e) => {
    if (!isDraggingImage) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // Handle mouse up
  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  // Reset position when image changes or filters are reset
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [
    image,
    brightness,
    saturation,
    inversion,
    grayscale,
    blurry,
    sepia,
    transparent,
    coloration,
    rotate,
  ]);

  // Storage key constant for consistency
  const STORAGE_KEY = "lastGeneratedImageBase64";

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
      case "brightness":
        setSliderValue(brightness);
        break;
      case "saturation":
        setSliderValue(saturation);
        break;
      case "inversion":
        setSliderValue(inversion);
        break;
      case "grayscale":
        setSliderValue(grayscale);
        break;
      case "blur":
        setSliderValue(blurry);
        break;
      case "sepia":
        setSliderValue(sepia);
        break;
      case "transparent":
        setSliderValue(transparent);
        break;
      case "coloration":
        setSliderValue(coloration);
        break;
    }
  };

  // Function to update filter value
  const updateFilter = (value) => {
    setSliderValue(value);
    switch (activeFilter) {
      case "brightness":
        setBrightness(value);
        break;
      case "saturation":
        setSaturation(value);
        break;
      case "inversion":
        setInversion(value);
        break;
      case "grayscale":
        setGrayscale(value);
        break;
      case "blur":
        setBlurry(value);
        break;
      case "sepia":
        setSepia(value);
        break;
      case "transparent":
        setTransparent(value);
        break;
      case "coloration":
        setColoration(value);
        break;
    }
  };

  // Get max value for slider based on active filter
  const getSliderMax = () => {
    switch (activeFilter) {
      case "brightness":
      case "saturation":
        return "200";
      case "inversion":
      case "grayscale":
      case "sepia":
      case "transparent":
      case "coloration":
        return "100";
      case "blur":
        return "50";
      default:
        return "100";
    }
  };

  // Function to handle rotation options
  const handleRotateOptions = (option) => {
    if (option === "left") setRotate(rotate - 90);
    else if (option === "right") setRotate(rotate + 90);
    else if (option === "horizontal")
      setFlipHorizontal(flipHorizontal === 1 ? -1 : 1);
    else if (option === "vertical")
      setFlipVertical(flipVertical === 1 ? -1 : 1);
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
    setTextOverlays([
      ...textOverlays,
      {
        content: currentText,
        x: 100,
        y: 100,
        color: textColor,
        size: textSize,
        fontFamily: fontFamily,
        id: Date.now(),
      },
    ]);
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
    setTextOverlays(
      textOverlays.map((text) => (text.id === id ? { ...text, x, y } : text))
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter((text) => text.id !== id));
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
    ctx.drawImage(
      imageRef.current,
      startX,
      startY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    setImage(canvas.toDataURL("image/jpeg"));
    setIsCropping(false);
    setCropStart({ x: 0, y: 0 });
    setCropEnd({ x: 0, y: 0 });
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
  };

  // Function to save the current edits to localStorage
  const saveEdits = async () => {
    if (!imageRef.current || !image || image === "/image-placeholder.svg") {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No image to save!",
        confirmButtonColor: "#7c3aed", // purple-600
        background: "#1a1a1a", // dark background
        color: "#ffffff", // white text
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageRef.current.naturalWidth || imageRef.current.width;
    canvas.height = imageRef.current.naturalHeight || imageRef.current.height;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blurry}px) sepia(${sepia}%) opacity(${transparent}%) hue-rotate(${coloration}deg)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(
      imageRef.current,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    textOverlays.forEach((text) => {
      ctx.font = `${text.size}px ${text.fontFamily || "Arial"}`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.content, text.x - position.x, text.y - position.y);
    });

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    localStorage.setItem("lastGeneratedImageBase64", imageData);
    setHasStoredImage(true);
    await Swal.fire({
      title: "Success!",
      text: "Your edits have been saved.",
      icon: "success",
      confirmButtonText: "Cool",
      confirmButtonColor: "#7c3aed", // purple-600
      background: "#111827", // gray-900
      color: "#f3f4f6", // gray-100
      iconColor: "#7c3aed",
      backdrop: `
        rgba(0,0,0,0.7)
        url("/images/confetti.gif")
        center top
        no-repeat
      `,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutUp
          animate__faster
        `,
      },
    });
  };

  // Function to download the image
  const saveImage = () => {
    if (!imageRef.current || !image || image === "/image-placeholder.svg") {
      alert("Please load an image first");
      return;
    }

    // Create a canvas to draw the final image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the image's natural size
    canvas.width = imageRef.current.naturalWidth || imageRef.current.width;
    canvas.height = imageRef.current.naturalHeight || imageRef.current.height;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blurry}px) sepia(${sepia}%) opacity(${transparent}%) hue-rotate(${coloration}deg)`;

    // Apply transformations (rotation and flip)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);

    // Draw the image (accounting for transformations)
    ctx.drawImage(
      imageRef.current,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    // Reset transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Draw all text overlays
    textOverlays.forEach((text) => {
      ctx.font = `${text.size}px ${text.fontFamily || "Arial"}`;
      ctx.fillStyle = text.color;
      // Adjust text position based on image dragging offset
      ctx.fillText(text.content, text.x - position.x, text.y - position.y);
    });

    // Create download link
    const link = document.createElement("a");
    link.download = "edited-image.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
  };

  return (
    <div
      className={`max-w-7xl mx-auto p-4 ${
        isDisabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Image Editor
        </h2>
        {/* Mobile menu button */}
        <button
          className="md:hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          {isMobileMenuOpen ? "Close" : "Tools"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tools Panel - Left Side */}
        <div
          className={`w-full md:w-80 bg-gray-900/50 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/10 transition-all duration-300 ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          {/* Filters Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faSliders} className="text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Filters</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                "brightness",
                "saturation",
                "inversion",
                "grayscale",
                "blur",
                "sepia",
                "transparent",
                "coloration",
              ].map((filter) => (
                <button
                  key={filter}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-white/80">
                <span>
                  {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                </span>
                <span>{sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max={getSliderMax()}
                value={sliderValue}
                onChange={(e) => updateFilter(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
              />
            </div>
          </div>

          {/* Rotate & Flip Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Rotate & Flip
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={() => handleRotateOptions("left")}
              >
                <FontAwesomeIcon icon={faRotateLeft} /> Left
              </button>
              <button
                className="flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={() => handleRotateOptions("right")}
              >
                <FontAwesomeIcon icon={faRotateRight} /> Right
              </button>
              <button
                className="flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={() => handleRotateOptions("horizontal")}
              >
                <i className="bx bx-reflect-vertical"></i> Flip H
              </button>
              <button
                className="flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={() => handleRotateOptions("vertical")}
              >
                <i className="bx bx-reflect-horizontal"></i> Flip V
              </button>
            </div>
          </div>

          {/* Text Tools Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Text Tools
            </h3>
            <button
              className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg mb-4 transition-all"
              onClick={startAddingText}
            >
              <FontAwesomeIcon icon={faFont} /> Add Text
            </button>

            {isAddingText && (
              <div className="space-y-4 bg-white/5 p-4 rounded-lg">
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <span className="text-sm text-white/80">Font:</span>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm flex-1"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex items-center gap-3">
                    <span className="text-sm text-white/80">Color:</span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="border border-white/20 rounded-lg h-8 w-8 cursor-pointer bg-transparent"
                    />
                  </label>

                  <label className="flex items-center gap-3">
                    <span className="text-sm text-white/80">Size:</span>
                    <input
                      type="range"
                      min="10"
                      max="72"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                    />
                    <span className="text-sm w-10 text-white/80">
                      {textSize}px
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
                    onClick={confirmText}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Add
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    onClick={cancelAddingText}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Crop Tools Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Crop Tools
            </h3>
            {!isCropping ? (
              <button
                className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={startCropping}
              >
                <FontAwesomeIcon icon={faCrop} /> Crop Image
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
                  onClick={applyCrop}
                >
                  <FontAwesomeIcon icon={faCheck} /> Apply
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                  onClick={cancelCropping}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Image Controls */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Image Controls
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="p-3 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                onClick={resetFilter}
              >
                <FontAwesomeIcon icon={faSync} /> Reset
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={loadImage}
              />
              <button
                className="p-3 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg col-span-2 transition-all"
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon={faFolderOpen} /> Choose Image
              </button>
              {hasStoredImage && (
                <>
                  <button
                    className="p-3 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    onClick={loadStoredImage}
                  >
                    <FontAwesomeIcon icon={faImage} /> Use Stored
                  </button>
                  <button
                    className="p-3 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    onClick={clearStoredImage}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Clear Stored
                  </button>
                </>
              )}
              <button
                className="p-3 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30"
                onClick={saveEdits}
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
              <button
                className="p-3 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/30"
                onClick={saveImage}
              >
                <FontAwesomeIcon icon={faDownload} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        {/* Preview Panel */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden relative min-h-[500px]">
          <div
            className={`w-full h-full flex justify-center items-center p-4 relative overflow-hidden ${
              isImageHovered ? "" : ""
            }`}
            ref={previewContainerRef}
            onMouseMove={handleImageMouseMove}
            onMouseUp={handleImageMouseUp}
            //onMouseLeave={handleImageMouseUp}
            onDrop={handleTextDrop}
            onDragOver={handleDragOver}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => {
              () => {
                setIsImageHovered(false);
              };
            }}
          >
            <div
              className={`absolute inset-0  opacity-0 transition-opacity duration-300 ${
                isImageHovered ? "opacity-100" : ""
              }`}
            ></div>

            {/* Image Container - Now Draggable */}
            <div
              className="relative"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDraggingImage ? "grabbing" : "grab",
              }}
              onMouseDown={handleImageMouseDown}
            >
              <img
                ref={imageRef}
                src={image || "/image-placeholder.svg"}
                alt="preview-img"
                className={`max-w-full border max-h-full object-contain transition-transform duration-300 ${
                  isImageHovered ? "" : ""
                }`}
                style={{
                  filter: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blurry}px) sepia(${sepia}%) opacity(${transparent}%) hue-rotate(${coloration}deg)`,
                  transform: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`,
                }}
              />
            </div>

            {/* Text overlays - now positioned relative to the container */}
            {textOverlays.map((text) => (
              <div
                key={text.id}
                className="absolute cursor-move select-none p-2 rounded-sm transition-all hover:bg-black/30 hover:backdrop-blur-sm"
                style={{
                  left: `${text.x + position.x}px`,
                  top: `${text.y + position.y}px`,
                  color: text.color,
                  fontSize: `${text.size}px`,
                  fontFamily: text.fontFamily || "Arial, sans-serif",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  zIndex: 10,
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
                className="absolute border-2 border-dashed border-white bg-black/30 pointer-events-none shadow-[0_0_0_1000px_rgba(0,0,0,0.7)]"
                style={{
                  left: `${Math.min(cropStart.x, cropEnd.x)}px`,
                  top: `${Math.min(cropStart.y, cropEnd.y)}px`,
                  width: `${Math.abs(cropEnd.x - cropStart.x)}px`,
                  height: `${Math.abs(cropEnd.y - cropStart.y)}px`,
                }}
              />
            )}
          </div>

          {/* Reset Position Button */}
          <div className="">
            <button
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all z-20"
              onClick={() => setPosition({ x: 0, y: 0 })}
              title="Reset Image Position"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </button>
            <button
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all z-20"
              onClick={() => setPosition({ x: 0, y: 0 })}
              title="Reset Image Position"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </button>
          </div>
                       
        </div>
      </div>
    </div>
  );
}
