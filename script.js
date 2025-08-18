class PixelGridViewer {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fileInput = document.getElementById('fileInput');
        this.zoomSlider = document.getElementById('zoomSlider');
        this.zoomValue = document.getElementById('zoomValue');
        this.showGridLinesCheckbox = document.getElementById('showGridLines');
        this.tooltip = document.getElementById('tooltip');
        this.imageInfo = document.getElementById('imageInfo');
        this.canvasContainer = document.querySelector('.canvas-container');
        this.scalePresetButtons = document.querySelectorAll('.scale-preset');
        this.customScaleInput = document.getElementById('customScale');
        this.scaleButton = document.getElementById('scaleButton');
        this.finalDimensions = document.getElementById('finalDimensions');
        this.topPalette = document.getElementById('topPalette');
        this.bottomPalette = document.getElementById('bottomPalette');
        this.topPaletteName = document.getElementById('topPaletteName');
        this.bottomPaletteName = document.getElementById('bottomPaletteName');
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsContent = document.getElementById('settingsContent');
        
        // RGB weighting controls
        this.redWeight = document.getElementById('redWeight');
        this.greenWeight = document.getElementById('greenWeight');
        this.blueWeight = document.getElementById('blueWeight');
        this.redValue = document.getElementById('redValue');
        this.greenValue = document.getElementById('greenValue');
        this.blueValue = document.getElementById('blueValue');
        this.presetButtons = document.querySelectorAll('.preset-btn[data-preset]');
        
        // Brightness and contrast controls
        this.brightnessSlider = document.getElementById('brightnessSlider');
        this.contrastSlider = document.getElementById('contrastSlider');
        this.brightnessValue = document.getElementById('brightnessValue');
        this.contrastValue = document.getElementById('contrastValue');
        this.adjustmentButtons = document.querySelectorAll('.preset-btn[data-adjustment]');
        
        // Edge detection controls
        this.cleanupIsolated = document.getElementById('cleanupIsolated');
        this.edgeStrength = document.getElementById('edgeStrength');
        this.edgeValue = document.getElementById('edgeValue');
        this.edgeButtons = document.querySelectorAll('.preset-btn[data-edge]');
        
        // Blur effect controls
        this.gaussianBlurSlider = document.getElementById('gaussianBlurSlider');
        this.gaussianBlurValue = document.getElementById('gaussianBlurValue');
        this.motionBlurSlider = document.getElementById('motionBlurSlider');
        this.motionBlurValue = document.getElementById('motionBlurValue');
        this.radialBlurSlider = document.getElementById('radialBlurSlider');
        this.radialBlurValue = document.getElementById('radialBlurValue');
        
        // Dithering controls
        this.ditheringButtons = document.querySelectorAll('.dithering-btn');
        this.ditheringIntensity = document.getElementById('ditheringIntensity');
        this.ditheringValue = document.getElementById('ditheringValue');
        
        // JPEG compression controls
        this.jpegCompressionSlider = document.getElementById('jpegCompressionSlider');
        this.jpegCompressionValue = document.getElementById('jpegCompressionValue');
        this.jpegPassesSlider = document.getElementById('jpegPassesSlider');
        this.jpegPassesValue = document.getElementById('jpegPassesValue');
        this.jpegButtons = document.querySelectorAll('.preset-btn[data-jpeg]');
        
        // Resize handling controls
        this.resizeButtons = document.querySelectorAll('.resize-btn');
        
        // Coordinate mapping controls
        this.setCoordinateRefBtn = document.getElementById('setCoordinateRef');
        this.toggleCornerMarkersBtn = document.getElementById('toggleCornerMarkers');
        this.coordinateModal = document.getElementById('coordinateModal');
        this.selectedPixelCoords = document.getElementById('selectedPixelCoords');
        this.worldXInput = document.getElementById('worldXInput');
        this.worldYInput = document.getElementById('worldYInput');
        this.confirmCoordinatesBtn = document.getElementById('confirmCoordinates');
        this.cancelCoordinatesBtn = document.getElementById('cancelCoordinates');
        
        // Debug controls
        this.toggleDebugPanelBtn = document.getElementById('toggleDebugPanel');
        
        // Save/load controls
        this.projectInput = document.getElementById('projectInput');
        this.loadProjectButton = document.getElementById('loadProjectButton');
        this.saveProjectButton = document.getElementById('saveProjectButton');
        this.exportGridButton = document.getElementById('exportGridButton');
        this.modeIndicator = document.getElementById('modeIndicator');
        this.modeText = document.getElementById('modeText');
        this.editProjectButton = document.getElementById('editProjectButton');
        this.viewExactButton = document.getElementById('viewExactButton');
        
        this.originalImage = null;
        this.scaledImage = null;
        this.processedImageData = null;
        this.pixelSize = 5;
        this.offsetX = 0;
        this.offsetY = 0;
        this.hoveredPixel = { x: -1, y: -1 };
        this.pinnedPixel = { x: -1, y: -1, color: [0, 0, 0] };
        this.pinnedTooltipPos = { x: 0, y: 0 };
        this.countMode = false;
        this.countStartPixel = { x: -1, y: -1 };
        this.countEndPixel = { x: -1, y: -1 };
        this.countPixels = [];
        this.isDragging = false;
        this.isPanning = false;
        this.lastPanX = 0;
        this.lastPanY = 0;
        this.panHasMoved = false;
        this.backgroundType = 'checkered'; // Default background
        
        // Background preference (for future slider implementation)
        this.backgroundPreference = 1.0; // 1.0 = normal, >1.0 = prefer background pixels
        
        // Resize handling mode ('crop', 'fit', 'expand')
        this.resizeHandling = 'crop'; // Default to Approach 1
        
        // Focus mode state
        this.focusMode = 'off'; // 'off', 'vertical', 'horizontal', 'cross'
        this.focusPixel = { x: -1, y: -1 }; // Currently focused pixel coordinates
        
        // RGB weighting values (default to human eye perception)
        this.rgbWeights = { r: 0.3, g: 0.59, b: 0.11 };
        
        // Image adjustment values
        this.brightness = 0;
        this.contrast = 1.0;
        
        // Edge detection values
        this.doCleanupIsolated = false;
        this.edgeEnhancement = 0.0;
        this.showGridLines = true;
        
        // Blur effect values
        this.gaussianBlurPercent = 0;
        this.motionBlurPercent = 0;
        this.radialBlurPercent = 0;
        
        // Dithering settings
        this.ditheringType = 'none';
        this.ditheringIntensityValue = 50;
        
        // JPEG compression settings
        this.jpegCompressionAmount = 0; // 0-100 (higher = more compression)
        this.jpegPasses = 1; // 1-5 passes
        
        // Bayer matrices for ordered dithering
        this.bayerMatrices = {
            '2x2': [
                [0, 2],
                [3, 1]
            ],
            '4x4': [
                [0, 8, 2, 10],
                [12, 4, 14, 6],
                [3, 11, 1, 9],
                [15, 7, 13, 5]
            ],
            '8x8': [
                [0, 32, 8, 40, 2, 34, 10, 42],
                [48, 16, 56, 24, 50, 18, 58, 26],
                [12, 44, 4, 36, 14, 46, 6, 38],
                [60, 28, 52, 20, 62, 30, 54, 22],
                [3, 35, 11, 43, 1, 33, 9, 41],
                [51, 19, 59, 27, 49, 17, 57, 25],
                [15, 47, 7, 39, 13, 45, 5, 37],
                [63, 31, 55, 23, 61, 29, 53, 21]
            ]
        };
        
        // Coordinate mapping system
        this.coordinateMapping = {
            isEnabled: false,
            referencePoint: { grid: {x: 0, y: 0}, world: {x: 0, y: 0} },
            showCornerMarkers: false
        };
        this.isSettingCoordinateReference = false;
        
        // Project state
        this.currentProjectData = null;
        this.isExactMode = false;
        
        // Old color palette for backwards compatibility mapping
        this.oldColorPalette = [
            [0, 0, 0],         // Black
            [68, 68, 68],      // Dark Gray
            [136, 136, 136],   // Gray
            [187, 187, 187],   // Light Gray
            [255, 255, 255],   // White
            [136, 0, 21],      // Dark Red
            [255, 34, 34],     // Red
            [255, 136, 0],     // Orange
            [255, 221, 0],     // Gold
            [255, 255, 51],    // Yellow
            [255, 255, 187],   // Light Yellow
            [34, 102, 34],     // Dark Green
            [68, 170, 51],     // Medium Green
            [85, 204, 68],     // Green
            [187, 255, 187],   // Light Green
            [0, 136, 136],     // Teal
            [0, 85, 85],       // Dark Teal
            [68, 255, 255],    // Cyan
            [0, 0, 136],       // Dark Blue
            [51, 68, 255],     // Blue
            [187, 221, 255],   // Light Blue
            [136, 34, 221],    // Purple
            [221, 187, 255],   // Light Purple
            [68, 34, 136],     // Dark Purple
            [255, 68, 255],    // Magenta
            [255, 187, 221],   // Pink
            [255, 221, 238],   // Light Pink
            [136, 68, 0],      // Brown
            [170, 85, 0],      // Dark Brown
            [255, 221, 187]    // Peach
        ];
        
        this.colorPalette = [
            [0, 0, 0],         // Black
            [60, 60, 60],      // Dark Gray
            [120, 120, 120],   // Gray
            [210, 210, 210],   // Light Gray
            [255, 255, 255],   // White
            [96, 0, 24],       // Deep Red
            [237, 28, 36],     // Red
            [255, 127, 39],    // Orange
            [246, 170, 9],     // Gold
            [249, 221, 59],    // Yellow
            [255, 250, 188],   // Light Yellow
            [14, 185, 104],    // Dark Green
            [19, 230, 123],    // Green
            [135, 255, 94],    // Light Green
            [12, 129, 110],    // Dark Teal
            [16, 174, 166],    // Teal
            [19, 225, 190],    // Light Teal
            [40, 80, 158],     // Dark Blue
            [64, 147, 228],    // Blue
            [96, 247, 242],    // Cyan
            [107, 80, 246],    // Indigo
            [153, 177, 251],   // Light Indigo
            [120, 12, 153],    // Dark Purple
            [170, 56, 185],    // Purple
            [224, 159, 249],   // Light Purple
            [203, 0, 122],     // Dark Pink
            [236, 31, 128],    // Pink
            [243, 141, 169],   // Light Pink
            [104, 70, 52],     // Dark Brown
            [149, 104, 42],    // Brown
            [248, 178, 119]    // Beige
        ];
        
        this.colorNames = [
            "Black", "Dark Gray", "Gray", "Light Gray", "White",
            "Deep Red", "Red", "Orange", "Gold", "Yellow", "Light Yellow",
            "Dark Green", "Green", "Light Green", "Dark Teal", "Teal", "Light Teal",
            "Dark Blue", "Blue", "Cyan", "Indigo", "Light Indigo",
            "Dark Purple", "Purple", "Light Purple", "Dark Pink", "Pink", "Light Pink",
            "Dark Brown", "Brown", "Beige"
        ];
        
        this.initEventListeners();
        this.createPaletteTooltips();
    }
    
    initEventListeners() {
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.zoomSlider.addEventListener('input', (e) => this.handleZoomChange(e));
        this.showGridLinesCheckbox.addEventListener('change', (e) => this.toggleGridLines(e.target.checked));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent context menu
        this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
        this.canvasContainer.addEventListener('mousedown', (e) => this.handleContainerMouseDown(e));
        this.canvasContainer.addEventListener('mousemove', (e) => this.handleContainerMouseMove(e));
        this.canvasContainer.addEventListener('mouseup', (e) => this.handleContainerMouseUp(e));
        this.canvasContainer.addEventListener('mouseleave', (e) => this.handleContainerMouseLeave(e));
        
        // Background option event listeners
        this.bgOptionButtons = document.querySelectorAll('.bg-option');
        this.bgOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleBackgroundChange(e.target.dataset.bg));
        });
        
        // Background integration slider
        this.bgIntegrationSlider = document.getElementById('bgIntegrationSlider');
        this.bgIntegrationValue = document.getElementById('bgIntegrationValue');
        this.bgIntegrationSlider.addEventListener('input', (e) => this.handleBgIntegrationChange(e.target.value));
        
        // Focus mode event listeners
        this.focusButtons = document.querySelectorAll('.focus-btn');
        this.focusStatus = document.getElementById('focusStatus');
        this.focusButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFocusChange(e.target.dataset.focus));
        });
        
        this.scalePresetButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePresetClick(e));
        });
        this.scaleButton.addEventListener('click', () => this.handleScaleImage());
        this.settingsToggle.addEventListener('click', () => this.toggleSettings());
        
        // RGB weighting event listeners
        this.redWeight.addEventListener('input', (e) => this.updateRGBWeight('r', e.target.value));
        this.greenWeight.addEventListener('input', (e) => this.updateRGBWeight('g', e.target.value));
        this.blueWeight.addEventListener('input', (e) => this.updateRGBWeight('b', e.target.value));
        
        this.presetButtons.forEach(button => {
            button.addEventListener('click', (e) => this.applyWeightPreset(e.target.dataset.preset));
        });
        
        // Brightness and contrast event listeners
        this.brightnessSlider.addEventListener('input', (e) => this.updateBrightness(e.target.value));
        this.contrastSlider.addEventListener('input', (e) => this.updateContrast(e.target.value));
        
        this.adjustmentButtons.forEach(button => {
            button.addEventListener('click', (e) => this.applyAdjustmentPreset(e.target.dataset.adjustment));
        });
        
        // Edge detection event listeners
        this.cleanupIsolated.addEventListener('change', (e) => this.updateCleanupIsolated(e.target.checked));
        this.edgeStrength.addEventListener('input', (e) => this.updateEdgeStrength(e.target.value));
        
        this.edgeButtons.forEach(button => {
            button.addEventListener('click', (e) => this.applyEdgePreset(e.target.dataset.edge));
        });
        
        // Blur effect event listeners (use mouseup/touchend for performance with large images)
        this.gaussianBlurSlider.addEventListener('mouseup', (e) => this.updateGaussianBlur(e.target.value));
        this.gaussianBlurSlider.addEventListener('touchend', (e) => this.updateGaussianBlur(e.target.value));
        this.motionBlurSlider.addEventListener('mouseup', (e) => this.updateMotionBlur(e.target.value));
        this.motionBlurSlider.addEventListener('touchend', (e) => this.updateMotionBlur(e.target.value));
        this.radialBlurSlider.addEventListener('mouseup', (e) => this.updateRadialBlur(e.target.value));
        this.radialBlurSlider.addEventListener('touchend', (e) => this.updateRadialBlur(e.target.value));
        
        // Update blur display values on input (real-time) but don't process
        this.gaussianBlurSlider.addEventListener('input', (e) => this.updateGaussianBlurDisplay(e.target.value));
        this.motionBlurSlider.addEventListener('input', (e) => this.updateMotionBlurDisplay(e.target.value));
        this.radialBlurSlider.addEventListener('input', (e) => this.updateRadialBlurDisplay(e.target.value));
        
        // Resize handling event listeners
        this.resizeButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleResizeMethodChange(e.target.dataset.resize));
        });
        
        // Dithering event listeners
        this.ditheringButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleDitheringTypeChange(e.target.dataset.dithering));
        });
        this.ditheringIntensity.addEventListener('input', (e) => this.updateDitheringIntensity(e.target.value));
        
        // JPEG compression event listeners
        this.jpegCompressionSlider.addEventListener('input', (e) => this.updateJpegCompressionAmount(e.target.value));
        this.jpegPassesSlider.addEventListener('input', (e) => this.updateJpegPasses(e.target.value));
        this.jpegButtons.forEach(button => {
            button.addEventListener('click', (e) => this.applyJpegPreset(e.target.dataset.jpeg));
        });
        
        // Coordinate mapping event listeners
        this.setCoordinateRefBtn.addEventListener('click', () => this.startCoordinateSetup());
        this.toggleCornerMarkersBtn.addEventListener('click', () => this.toggleCornerMarkers());
        this.confirmCoordinatesBtn.addEventListener('click', () => this.confirmCoordinateReference());
        this.cancelCoordinatesBtn.addEventListener('click', () => this.cancelCoordinateSetup());
        this.coordinateModal.addEventListener('click', (e) => {
            if (e.target === this.coordinateModal) this.cancelCoordinateSetup();
        });
        
        // Debug panel event listener
        this.toggleDebugPanelBtn.addEventListener('click', () => this.toggleDebugPanel());
        
        // Save/load event listeners
        this.loadProjectButton.addEventListener('click', () => this.projectInput.click());
        this.projectInput.addEventListener('change', (e) => this.handleProjectLoad(e));
        this.saveProjectButton.addEventListener('click', () => this.saveProject());
        this.exportGridButton.addEventListener('click', () => this.exportGrid());
        this.editProjectButton.addEventListener('click', () => this.switchToEditMode());
        this.viewExactButton.addEventListener('click', () => this.switchToExactMode());
    }
    
    resetNonColorSettings() {
        // Reset brightness and contrast
        this.brightness = 0;
        this.contrast = 1.0;
        this.brightnessSlider.value = 0;
        this.contrastSlider.value = 1.0;
        this.brightnessValue.textContent = '0';
        this.contrastValue.textContent = '1.0';
        
        // Reset edge detection
        this.doCleanupIsolated = false;
        this.edgeEnhancement = 0.0;
        this.cleanupIsolated.checked = false;
        this.edgeStrength.value = 0;
        this.edgeValue.textContent = '0.0';
        
        // Reset background preference
        this.backgroundPreference = 1.0;
        this.bgIntegrationSlider.value = 1.0;
        this.bgIntegrationValue.textContent = '1.0x';
        
        // Reset blur effects
        this.gaussianBlurPercent = 0;
        this.motionBlurPercent = 0;
        this.radialBlurPercent = 0;
        this.gaussianBlurSlider.value = 0;
        this.motionBlurSlider.value = 0;
        this.radialBlurSlider.value = 0;
        this.updateGaussianBlurDisplay(0);
        this.updateMotionBlurDisplay(0);
        this.updateRadialBlurDisplay(0);
        
        // Reset dithering
        this.ditheringType = 'none';
        this.ditheringIntensityValue = 50;
        this.ditheringButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-dithering="none"]').classList.add('active');
        this.ditheringIntensity.value = 50;
        this.ditheringValue.textContent = '50%';
        
        // Reset resize handling to default
        this.resizeHandling = 'crop';
        this.resizeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-resize="crop"]').classList.add('active');
        
        // Note: RGB weighting (color sensitivity) is intentionally NOT reset
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file || !(file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg'))) {
            alert('Please select a PNG, JPG, or JPEG file');
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            
            // Reset all settings except color weighting when loading new image
            this.resetNonColorSettings();
            
            // Set default zoom to 5x
            this.pixelSize = 5;
            this.zoomSlider.value = this.zoomToSliderPosition(5);
            this.zoomValue.textContent = '5x';
            
            // Auto-scale to 64px if either dimension is larger
            const maxDimension = Math.max(img.width, img.height);
            if (maxDimension > 64) {
                // Scale to 64px before first display
                this.scaleImage(img, 64, (scaledImg) => {
                    this.scaledImage = scaledImg;
                    this.customScaleInput.value = 64;
                    
                    // Set active state on 64px preset button
                    this.scalePresetButtons.forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.dataset.size === '64') {
                            btn.classList.add('active');
                        }
                    });
                    
                    this.processImage();
                    this.updateImageInfo();
                    this.drawPixelGrid();
                    this.scaleButton.disabled = false;
                    
                    // Enable save/export buttons
                    this.saveProjectButton.disabled = false;
                    this.exportGridButton.disabled = false;
                });
            } else {
                // Image is already small enough, don't scale
                this.scaledImage = img;
                this.customScaleInput.value = maxDimension;
                this.processImage();
                this.updateImageInfo();
                this.drawPixelGrid();
                this.scaleButton.disabled = false;
                
                // Enable save/export buttons
                this.saveProjectButton.disabled = false;
                this.exportGridButton.disabled = false;
            }
        };
        img.src = URL.createObjectURL(file);
    }
    
    processImage() {
        // Step 1: Create temp processed image with all effects (except scaling/quantization)
        this.createTempProcessedImage();
    }
    
    // Separate method for reprocessing without regenerating blur effects
    reprocessFromTempImage() {
        if (this.tempProcessedImage) {
            this.scaleAndQuantizeTempImage();
        } else {
            // Fallback to full processing if temp image doesn't exist
            this.processImage();
        }
    }
    
    createTempProcessedImage() {
        // Step 1: Create oversized canvas (2x each dimension = 4x area)
        const fullCanvas = document.createElement('canvas');
        const fullCtx = fullCanvas.getContext('2d');
        
        const originalWidth = this.originalImage.width;
        const originalHeight = this.originalImage.height;
        const fullWidth = originalWidth * 2;
        const fullHeight = originalHeight * 2;
        
        fullCanvas.width = fullWidth;
        fullCanvas.height = fullHeight;
        
        // Center original image in the oversized canvas
        const offsetX = Math.floor((fullWidth - originalWidth) / 2);
        const offsetY = Math.floor((fullHeight - originalHeight) / 2);
        fullCtx.drawImage(this.originalImage, offsetX, offsetY);
        
        // Get the full image data and apply blur effects
        let fullImageData = fullCtx.getImageData(0, 0, fullWidth, fullHeight);
        fullImageData = this.applyBlurEffects(fullImageData, fullWidth, fullHeight);
        fullCtx.putImageData(fullImageData, 0, 0);
        
        // Store the full processed image for debug display
        this.tempProcessedImageFull = new Image();
        this.tempProcessedImageFull.src = fullCanvas.toDataURL();
        
        // Step 2: Detect content boundaries and create bounded image
        const bounds = this.detectContentBoundaries(fullImageData);
        
        // Create bounded canvas with minimal content area
        const boundCanvas = document.createElement('canvas');
        const boundCtx = boundCanvas.getContext('2d');
        
        boundCanvas.width = bounds.width;
        boundCanvas.height = bounds.height;
        
        // Extract only the content area
        const boundImageData = fullCtx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
        boundCtx.putImageData(boundImageData, 0, 0);
        
        // Store bounded image and its offset info for coordinate mapping
        this.tempProcessedImageBound = new Image();
        this.tempProcessedImageBoundOffset = { x: bounds.x - offsetX, y: bounds.y - offsetY };
        
        // Step 3: Create cropped image (original dimensions) for Approach 1
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        
        croppedCanvas.width = originalWidth;
        croppedCanvas.height = originalHeight;
        
        // Extract original dimensions from the full processed image
        const croppedImageData = fullCtx.getImageData(offsetX, offsetY, originalWidth, originalHeight);
        croppedCtx.putImageData(croppedImageData, 0, 0);
        
        // Store cropped image
        this.tempProcessedImageCropped = new Image();
        this.tempProcessedImageCropped.src = croppedCanvas.toDataURL();
        
        // Set unique identifier to prevent race conditions
        const currentProcessId = Date.now();
        this.currentProcessId = currentProcessId;
        
        this.tempProcessedImageBound.onload = () => {
            // Only proceed if this is the most recent process
            if (this.currentProcessId === currentProcessId) {
                this.scaleAndQuantizeTempImage();
                
                // Handle pending expand mode adjustment if there is one
                if (this.pendingExpandModeAdjustment !== undefined) {
                    this.handleExpandModeScaleAdjustment(this.pendingExpandModeAdjustment);
                    this.pendingExpandModeAdjustment = undefined; // Clear the pending adjustment
                }
            }
        };
        
        this.tempProcessedImageBound.src = boundCanvas.toDataURL();
        
        // For backward compatibility, set tempProcessedImage to the bounded version
        this.tempProcessedImage = this.tempProcessedImageBound;
    }
    
    detectContentBoundaries(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        let minX = width, minY = height, maxX = -1, maxY = -1;
        
        // Scan all pixels to find non-transparent content
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const alpha = data[index + 3];
                
                // If pixel is not fully transparent
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }
        
        // If no content found, return original dimensions centered
        if (maxX === -1) {
            const centerX = Math.floor(width / 2);
            const centerY = Math.floor(height / 2);
            return { x: centerX, y: centerY, width: 1, height: 1 };
        }
        
        // Return bounding box (inclusive coordinates, so add 1 to width/height)
        return {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }
    
    scaleAndQuantizeTempImage() {
        let targetSize = parseInt(this.customScaleInput.value) || 64;
        let sourceImage;
        
        // Choose source image based on resize handling mode
        switch (this.resizeHandling) {
            case 'crop':
                sourceImage = this.tempProcessedImageCropped;
                break;
            case 'fit':
            case 'expand':
                sourceImage = this.tempProcessedImageBound;
                break;
            default:
                sourceImage = this.tempProcessedImageBound;
        }
        
        // In expand mode, the scale setting refers directly to the bound dimensions
        // No recalculation needed here - scale adjustment happens in handleExpandModeScaleAdjustment
        
        this.scaleImage(sourceImage, targetSize, (scaledImg) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCanvas.width = scaledImg.width;
            tempCanvas.height = scaledImg.height;
            tempCtx.drawImage(scaledImg, 0, 0);
            
            let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Apply edge detection at scaled resolution (post-scaling, pre-quantization)
            if (this.doCleanupIsolated || this.edgeEnhancement !== 0) {
                imageData = this.applyEdgeDetection(imageData);
            }
            
            // Apply JPEG compression at scaled resolution (post-scaling, pre-quantization)
            this.applyJpegCompression(imageData, (compressedImageData) => {
                // Store scaled un-quantized version for debug display
                const unquantizedCanvas = document.createElement('canvas');
                const unquantizedCtx = unquantizedCanvas.getContext('2d');
                unquantizedCanvas.width = tempCanvas.width;
                unquantizedCanvas.height = tempCanvas.height;
                unquantizedCtx.putImageData(compressedImageData, 0, 0);
                
                // Store the canvas directly instead of converting to image
                this.scaledUnquantizedCanvas = unquantizedCanvas;
                
                this.processedImageData = this.convertToColorPalette(compressedImageData);
            
                // Apply isolated pixel cleanup AFTER quantization (final cleanup step)
                if (this.doCleanupIsolated) {
                    this.processedImageData = this.cleanupIsolatedPixels(this.processedImageData);
                }
                
                // Update debug panel if it exists
                this.updateDebugPanel();
                
                // Update image info with final dimensions
                this.updateImageInfo();
                
                // Update final dimensions display next to scale button
                this.updateFinalDimensions();
                
                // Redraw after processing complete
                this.drawPixelGrid();
            });
        });
    }
    
    convertToColorPalette(imageData) {
        const data = imageData.data;
        const processed = new Uint8ClampedArray(data.length);
        
        // Get background color for blending
        const bgColor = this.getBackgroundColorForBlending();
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            const alpha = data[i + 3];
            
            // Handle transparency
            if (alpha === 0) {
                // Fully transparent - keep as is, will be skipped in drawing
                processed[i] = r;
                processed[i + 1] = g;
                processed[i + 2] = b;
                processed[i + 3] = alpha;
                continue;
            } else if (alpha < 255) {
                // Semi-transparent - blend with background
                const alphaRatio = alpha / 255;
                const invAlphaRatio = 1 - alphaRatio;
                
                r = Math.round(r * alphaRatio + bgColor[0] * invAlphaRatio);
                g = Math.round(g * alphaRatio + bgColor[1] * invAlphaRatio);
                b = Math.round(b * alphaRatio + bgColor[2] * invAlphaRatio);
            }
            // Fully opaque pixels (alpha === 255) use original colors
            
            // Apply brightness and contrast adjustments
            [r, g, b] = this.applyImageAdjustments(r, g, b);
            
            // Apply dithering if enabled
            if (this.ditheringType !== 'none' && this.ditheringIntensityValue > 0) {
                const pixelIndex = i / 4;
                const x = pixelIndex % imageData.width;
                const y = Math.floor(pixelIndex / imageData.width);
                
                const ditherOffset = this.calculateDitherOffset(x, y);
                
                r = Math.max(0, Math.min(255, r + ditherOffset));
                g = Math.max(0, Math.min(255, g + ditherOffset));
                b = Math.max(0, Math.min(255, b + ditherOffset));
            }
            
            const quantizedResult = this.quantizeToColorPalette([r, g, b]);
            
            if (quantizedResult.isBackground) {
                // Background match - convert to transparent
                processed[i] = r; // Keep original values but mark transparent
                processed[i + 1] = g;
                processed[i + 2] = b;
                processed[i + 3] = 0; // Make fully transparent
            } else {
                // Regular palette color
                processed[i] = quantizedResult.color[0];
                processed[i + 1] = quantizedResult.color[1];
                processed[i + 2] = quantizedResult.color[2];
                processed[i + 3] = alpha < 255 ? 255 : alpha; // Semi-transparent becomes opaque after blending
            }
        }
        
        return new ImageData(processed, imageData.width, imageData.height);
    }
    
    quantizeToColorPalette(rgb) {
        let closestColor = this.colorPalette[0];
        let minDistance = this.colorDistance(rgb, closestColor);
        let isBackgroundMatch = false;
        
        // Check palette colors
        for (let i = 1; i < this.colorPalette.length; i++) {
            const distance = this.colorDistance(rgb, this.colorPalette[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = this.colorPalette[i];
                isBackgroundMatch = false;
            }
        }
        
        // Check background color if applicable (cream/green/blue only)
        const backgroundRGB = this.getBackgroundColorForQuantization();
        if (backgroundRGB && this.backgroundPreference > 0) {
            const bgDistance = this.colorDistance(rgb, backgroundRGB);
            // Apply background preference multiplier (higher preference = closer match)
            const adjustedBgDistance = bgDistance / this.backgroundPreference;
            if (adjustedBgDistance < minDistance) {
                minDistance = adjustedBgDistance;
                closestColor = backgroundRGB;
                isBackgroundMatch = true;
            }
        }
        
        // Return color with background match flag
        return { color: closestColor, isBackground: isBackgroundMatch };
    }
    
    colorDistance(color1, color2) {
        // Use weighted Euclidean distance based on RGB sensitivity settings
        const dr = color1[0] - color2[0];
        const dg = color1[1] - color2[1];
        const db = color1[2] - color2[2];
        
        // Use configurable RGB weights
        return Math.sqrt(this.rgbWeights.r * dr * dr + this.rgbWeights.g * dg * dg + this.rgbWeights.b * db * db);
    }
    
    handleZoomChange(event) {
        const oldZoom = this.pixelSize;
        const sliderPosition = parseInt(event.target.value);
        const newZoom = this.sliderPositionToZoom(sliderPosition);
        
        if (oldZoom !== newZoom && this.processedImageData) {
            // Check if container is scrollable
            const isScrollable = this.canvasContainer.scrollWidth > this.canvasContainer.clientWidth || 
                                 this.canvasContainer.scrollHeight > this.canvasContainer.clientHeight;
            
            if (isScrollable) {
                // Calculate center of container (not image) for zoom slider behavior
                const centerX = this.canvasContainer.scrollLeft + this.canvasContainer.clientWidth / 2;
                const centerY = this.canvasContainer.scrollTop + this.canvasContainer.clientHeight / 2;
                
                // Apply zoom-to-cursor transformation using center point
                this.applyZoomToPoint(oldZoom, newZoom, centerX, centerY);
            } else {
                // Traditional center zoom when not scrollable
                this.pixelSize = newZoom;
                this.drawPixelGrid();
            }
        } else {
            this.pixelSize = newZoom;
        }
        
        this.zoomValue.textContent = `${newZoom}x`;
    }
    
    handleMouseWheel(event) {
        event.preventDefault(); // Prevent page scrolling
        
        if (!this.processedImageData) return;
        
        // Determine zoom direction
        const delta = event.deltaY;
        const zoomIn = delta < 0;
        
        // Get current slider position and calculate step
        const currentSliderPos = this.zoomToSliderPosition(this.pixelSize);
        const stepSize = 2; // 1 slider unit per wheel step (matches slider increments)
        
        let newSliderPos;
        if (zoomIn) {
            newSliderPos = Math.min(100, currentSliderPos + stepSize);
        } else {
            newSliderPos = Math.max(0, currentSliderPos - stepSize);
        }
        
        const oldZoom = this.pixelSize;
        const newZoom = this.sliderPositionToZoom(newSliderPos);
        
        // Only update if zoom level changed
        if (newZoom !== oldZoom) {
            // Check if container is scrollable (has scrollbars)
            const isScrollable = this.canvasContainer.scrollWidth > this.canvasContainer.clientWidth || 
                                 this.canvasContainer.scrollHeight > this.canvasContainer.clientHeight;
            
            if (isScrollable) {
                // Zoom-to-cursor behavior: calculate mouse position relative to container
                const containerRect = this.canvasContainer.getBoundingClientRect();
                const mouseX = event.clientX - containerRect.left + this.canvasContainer.scrollLeft;
                const mouseY = event.clientY - containerRect.top + this.canvasContainer.scrollTop;
                
                // Apply zoom-to-cursor transformation
                this.applyZoomToPoint(oldZoom, newZoom, mouseX, mouseY);
            } else {
                // Traditional center zoom when not scrollable
                this.pixelSize = newZoom;
                this.drawPixelGrid();
            }
            
            // Update UI with slider position
            this.zoomSlider.value = newSliderPos;
            this.zoomValue.textContent = `${newZoom}x`;
        }
    }
    
    // Non-linear zoom mapping functions
    sliderPositionToZoom(position) {
        // Map slider position (0-100) to zoom level (1-50) using logarithmic curve
        // Fine control at low zoom, coarse at high zoom
        const minZoom = 1;
        const maxZoom = 50;
        const minPos = 0;
        const maxPos = 100;
        
        // Logarithmic scaling: zoom = minZoom * (maxZoom/minZoom)^(position/maxPos)
        const zoomRatio = Math.pow(maxZoom / minZoom, (position - minPos) / (maxPos - minPos));
        return Math.round(minZoom * zoomRatio * 10) / 10; // Round to 1 decimal
    }
    
    zoomToSliderPosition(zoom) {
        // Map zoom level (1-50) back to slider position (0-100)
        const minZoom = 1;
        const maxZoom = 50;
        const minPos = 0;
        const maxPos = 100;
        
        // Inverse of logarithmic: position = maxPos * log(zoom/minZoom) / log(maxZoom/minZoom)
        const position = minPos + (maxPos - minPos) * Math.log(zoom / minZoom) / Math.log(maxZoom / minZoom);
        return Math.round(position);
    }
    
    applyZoomToPoint(oldZoom, newZoom, pointX, pointY) {
        // Calculate the zoom ratio
        const zoomRatio = newZoom / oldZoom;
        
        // Calculate the current scroll position
        const currentScrollX = this.canvasContainer.scrollLeft;
        const currentScrollY = this.canvasContainer.scrollTop;
        
        // Calculate the point's position relative to current scroll
        const relativeX = pointX - currentScrollX;
        const relativeY = pointY - currentScrollY;
        
        // Update zoom level
        this.pixelSize = newZoom;
        this.drawPixelGrid(); // This updates canvas size
        
        // Calculate new scroll position to keep the point in the same relative position
        const newScrollX = (pointX * zoomRatio) - relativeX;
        const newScrollY = (pointY * zoomRatio) - relativeY;
        
        // Apply new scroll position
        this.canvasContainer.scrollLeft = newScrollX;
        this.canvasContainer.scrollTop = newScrollY;
    }
    
    toggleGridLines(checked) {
        this.showGridLines = checked;
        if (this.processedImageData) {
            this.drawPixelGrid();
        }
    }
    
    drawPixelGrid() {
        if (!this.processedImageData) return;
        
        const { width, height } = this.processedImageData;
        
        // Calculate larger canvas dimensions (50% larger)
        const canvasWidth = Math.floor(width * 1.5) * this.pixelSize;
        const canvasHeight = Math.floor(height * 1.5) * this.pixelSize;
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw checkered background
        this.drawCheckeredBackground(canvasWidth, canvasHeight);
        
        // Calculate image offset to center it
        const imageOffsetX = Math.floor((canvasWidth - (width * this.pixelSize)) / 2);
        const imageOffsetY = Math.floor((canvasHeight - (height * this.pixelSize)) / 2);
        
        const data = this.processedImageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const alpha = data[index + 3];
                
                // Skip fully transparent pixels - don't draw pixel or grid
                if (alpha === 0) {
                    continue;
                }
                
                this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                this.ctx.fillRect(
                    imageOffsetX + x * this.pixelSize,
                    imageOffsetY + y * this.pixelSize,
                    this.pixelSize,
                    this.pixelSize
                );
                
                const isHovered = (x === this.hoveredPixel.x && y === this.hoveredPixel.y);
                const isPinned = (x === this.pinnedPixel.x && y === this.pinnedPixel.y);
                const isInCountSelection = this.countPixels.some(p => p.x === x && p.y === y);
                const isSpecialPixel = isInCountSelection || isPinned || isHovered;
                
                // Only draw strokes if grid lines are on OR it's a special highlighted pixel
                // Note: Only draw grid for opaque pixels (alpha > 0, which we already checked above)
                if (this.showGridLines || isSpecialPixel) {
                    if (isInCountSelection) {
                        this.ctx.strokeStyle = '#ff6600';
                        this.ctx.lineWidth = 3;
                    } else if (isPinned) {
                        this.ctx.strokeStyle = '#0066ff';
                        this.ctx.lineWidth = 4;
                    } else if (isHovered) {
                        this.ctx.strokeStyle = '#ff0000';
                        this.ctx.lineWidth = 3;
                    } else {
                        this.ctx.strokeStyle = '#333';
                        this.ctx.lineWidth = 1;
                    }
                    this.ctx.strokeRect(
                        imageOffsetX + x * this.pixelSize,
                        imageOffsetY + y * this.pixelSize,
                        this.pixelSize,
                        this.pixelSize
                    );
                }
            }
        }
        
        // Draw focus dimming overlay (affects everything except focused pixels)
        this.drawFocusDimmingOverlay(imageOffsetX, imageOffsetY, width, height);
        
        // Draw focus glow
        this.drawFocusGlow(imageOffsetX, imageOffsetY, width, height);
        
        // Draw corner markers if enabled
        if (this.coordinateMapping.showCornerMarkers && this.coordinateMapping.isEnabled) {
            this.drawCornerMarkers(imageOffsetX, imageOffsetY, width, height);
        }
    }
    
    drawFocusDimmingOverlay(imageOffsetX, imageOffsetY, width, height) {
        if (this.focusMode === 'off' || this.focusPixel.x < 0) return;
        
        // Apply dimming only to non-focused areas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; // 60% dimming
        
        const data = this.processedImageData.data;
        
        // Dim everything except viable pixels in focused row/column
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const alpha = data[index + 3];
                
                // Check if this pixel is in the focused row/column
                const isInFocusedColumn = (this.focusMode === 'vertical' || this.focusMode === 'cross') && x === this.focusPixel.x;
                const isInFocusedRow = (this.focusMode === 'horizontal' || this.focusMode === 'cross') && y === this.focusPixel.y;
                
                // Skip dimming for viable pixels in focused areas
                if ((isInFocusedColumn || isInFocusedRow) && alpha > 0) {
                    continue;
                }
                
                // Dim this pixel area
                this.ctx.fillRect(
                    imageOffsetX + x * this.pixelSize,
                    imageOffsetY + y * this.pixelSize,
                    this.pixelSize,
                    this.pixelSize
                );
            }
        }
        
        // Also dim areas outside the image bounds
        const imageWidth = width * this.pixelSize;
        const imageHeight = height * this.pixelSize;
        
        // Dim left area
        if (imageOffsetX > 0) {
            this.ctx.fillRect(0, 0, imageOffsetX, this.canvas.height);
        }
        // Dim right area
        if (imageOffsetX + imageWidth < this.canvas.width) {
            this.ctx.fillRect(imageOffsetX + imageWidth, 0, this.canvas.width - (imageOffsetX + imageWidth), this.canvas.height);
        }
        // Dim top area
        if (imageOffsetY > 0) {
            this.ctx.fillRect(0, 0, this.canvas.width, imageOffsetY);
        }
        // Dim bottom area
        if (imageOffsetY + imageHeight < this.canvas.height) {
            this.ctx.fillRect(0, imageOffsetY + imageHeight, this.canvas.width, this.canvas.height - (imageOffsetY + imageHeight));
        }
    }
    
    drawFocusGlow(imageOffsetX, imageOffsetY, width, height) {
        if (this.focusMode === 'off' || this.focusPixel.x < 0) return;
        
        this.ctx.strokeStyle = 'rgba(147, 51, 234, 0.7)'; // Purple glow
        this.ctx.lineWidth = 5; // Thicker border
        this.ctx.setLineDash([]);
        
        const data = this.processedImageData.data;
        
        if (this.focusMode === 'vertical' || this.focusMode === 'cross') {
            // Find segments of non-transparent pixels in the focused column
            const segments = this.findPixelSegments('vertical', this.focusPixel.x, width, height, data);
            segments.forEach(segment => {
                const columnX = imageOffsetX + this.focusPixel.x * this.pixelSize;
                const startY = imageOffsetY + segment.start * this.pixelSize;
                const segmentHeight = (segment.end - segment.start + 1) * this.pixelSize;
                
                this.ctx.strokeRect(
                    columnX - 2.5,
                    startY - 2.5,
                    this.pixelSize + 5,
                    segmentHeight + 5
                );
            });
        }
        
        if (this.focusMode === 'horizontal' || this.focusMode === 'cross') {
            // Find segments of non-transparent pixels in the focused row
            const segments = this.findPixelSegments('horizontal', this.focusPixel.y, width, height, data);
            segments.forEach(segment => {
                const rowY = imageOffsetY + this.focusPixel.y * this.pixelSize;
                const startX = imageOffsetX + segment.start * this.pixelSize;
                const segmentWidth = (segment.end - segment.start + 1) * this.pixelSize;
                
                this.ctx.strokeRect(
                    startX - 2.5,
                    rowY - 2.5,
                    segmentWidth + 5,
                    this.pixelSize + 5
                );
            });
        }
    }
    
    findPixelSegments(direction, lineIndex, width, height, data) {
        const segments = [];
        let currentSegment = null;
        
        if (direction === 'vertical') {
            // Scan down the column at x = lineIndex
            for (let y = 0; y < height; y++) {
                const index = (y * width + lineIndex) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 0) { // Non-transparent pixel
                    if (currentSegment === null) {
                        currentSegment = { start: y, end: y };
                    } else {
                        currentSegment.end = y;
                    }
                } else { // Transparent pixel
                    if (currentSegment !== null) {
                        segments.push(currentSegment);
                        currentSegment = null;
                    }
                }
            }
        } else if (direction === 'horizontal') {
            // Scan across the row at y = lineIndex
            for (let x = 0; x < width; x++) {
                const index = (lineIndex * width + x) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 0) { // Non-transparent pixel
                    if (currentSegment === null) {
                        currentSegment = { start: x, end: x };
                    } else {
                        currentSegment.end = x;
                    }
                } else { // Transparent pixel
                    if (currentSegment !== null) {
                        segments.push(currentSegment);
                        currentSegment = null;
                    }
                }
            }
        }
        
        // Don't forget the last segment if it reaches the end
        if (currentSegment !== null) {
            segments.push(currentSegment);
        }
        
        return segments;
    }
    
    drawCornerMarkers(imageOffsetX, imageOffsetY, width, height) {
        if (!this.coordinateMapping.isEnabled) return;
        
        const corners = [
            { x: 0, y: 0, label: 'TL' },                    // Top-left
            { x: width - 1, y: 0, label: 'TR' },           // Top-right
            { x: 0, y: height - 1, label: 'BL' },          // Bottom-left
            { x: width - 1, y: height - 1, label: 'BR' }   // Bottom-right
        ];
        
        corners.forEach(corner => {
            const worldCoords = this.gridToWorldCoordinates(corner.x, corner.y);
            if (!worldCoords) return;
            
            // Calculate marker position so the bottom point indicates the actual corner pixel
            const cornerCenterX = imageOffsetX + corner.x * this.pixelSize + this.pixelSize / 2;
            const cornerCenterY = imageOffsetY + corner.y * this.pixelSize + this.pixelSize / 2;
            
            // Position the pin so its point is at the corner pixel center
            const markerX = cornerCenterX;
            const markerY = cornerCenterY - 16; // Move pin up so point touches corner pixel
            
            // Draw map pin-style marker
            this.ctx.save();
            
            // Pin body (teardrop shape)
            this.ctx.fillStyle = '#2563eb'; // Blue color
            this.ctx.strokeStyle = '#1e40af'; // Darker blue border
            this.ctx.lineWidth = 2;
            
            // Draw the circular top part of the pin
            const pinRadius = 12;
            this.ctx.beginPath();
            this.ctx.arc(markerX, markerY - 8, pinRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw the pointed bottom part of the pin
            this.ctx.beginPath();
            this.ctx.moveTo(markerX - 6, markerY + 4);
            this.ctx.lineTo(markerX, markerY + 16); // Point at corner pixel
            this.ctx.lineTo(markerX + 6, markerY + 4);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw inner circle (white dot in the pin)
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(markerX, markerY - 8, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw coordinate label
            this.ctx.fillStyle = 'white';
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.lineWidth = 3;
            this.ctx.font = 'bold 12px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const coordText = `(${this.formatCoordinate(worldCoords.x)}, ${this.formatCoordinate(worldCoords.y)})`;
            
            // Position label to avoid overlap with pin (pin is now higher up)
            let labelX = markerX;
            let labelY = markerY - 45; // Further up since pin moved up
            
            // Adjust label position for corner markers to stay within canvas
            if (corner.label === 'TL' || corner.label === 'TR') {
                labelY = cornerCenterY + 25; // Move below the corner pixel for top corners
            }
            if (corner.label === 'TR' || corner.label === 'BR') {
                labelX = markerX - 40; // Move left for right corners
            }
            if (corner.label === 'TL' || corner.label === 'BL') {
                labelX = markerX + 40; // Move right for left corners
            }
            
            // Draw text with stroke for better visibility
            this.ctx.strokeText(coordText, labelX, labelY);
            this.ctx.fillText(coordText, labelX, labelY);
            
            this.ctx.restore();
        });
    }
    
    drawCheckeredBackground(canvasWidth, canvasHeight) {
        if (this.backgroundType === 'checkered') {
            const checkerSize = this.pixelSize * 2; // 2x2 image pixels
            const color1 = '#F8F4F0';
            const color2 = '#E3F0D4';
            
            // Always draw checkered pattern at full opacity
            for (let y = 0; y < canvasHeight; y += checkerSize) {
                for (let x = 0; x < canvasWidth; x += checkerSize) {
                    const isEvenRow = Math.floor(y / checkerSize) % 2 === 0;
                    const isEvenCol = Math.floor(x / checkerSize) % 2 === 0;
                    const useColor1 = isEvenRow === isEvenCol;
                    
                    this.ctx.fillStyle = useColor1 ? color1 : color2;
                    this.ctx.fillRect(x, y, checkerSize, checkerSize);
                }
            }
        } else {
            // Solid color backgrounds
            let bgColor;
            switch (this.backgroundType) {
                case 'light':
                    bgColor = '#F8F4F0';
                    break;
                case 'green':
                    bgColor = '#E3F0D4';
                    break;
                case 'blue':
                    bgColor = '#9EBDFF';
                    break;
                case 'dark':
                    bgColor = '#161B22';
                    break;
                default:
                    bgColor = '#F8F4F0';
            }
            
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    }
    
    isPixelInFocus(canvasX, canvasY) {
        if (this.focusMode === 'off' || this.focusPixel.x < 0 || !this.processedImageData) return true;
        
        const offset = this.getImageOffset();
        const { width, height } = this.processedImageData;
        
        // Convert canvas coordinates to image pixel coordinates
        const imageStartX = offset.x;
        const imageStartY = offset.y;
        const imageEndX = offset.x + width * this.pixelSize;
        const imageEndY = offset.y + height * this.pixelSize;
        
        // Check if we're outside the image area
        if (canvasX < imageStartX || canvasX >= imageEndX || canvasY < imageStartY || canvasY >= imageEndY) {
            return false; // Background areas outside image are not in focus
        }
        
        // Calculate which image pixel this canvas coordinate belongs to
        const imagePixelX = Math.floor((canvasX - offset.x) / this.pixelSize);
        const imagePixelY = Math.floor((canvasY - offset.y) / this.pixelSize);
        
        // Determine if this pixel is in the focused row/column
        switch (this.focusMode) {
            case 'vertical':
                return imagePixelX === this.focusPixel.x;
            case 'horizontal':
                return imagePixelY === this.focusPixel.y;
            case 'cross':
                return imagePixelX === this.focusPixel.x || imagePixelY === this.focusPixel.y;
            default:
                return true;
        }
    }
    
    getImageOffset() {
        if (!this.processedImageData) return { x: 0, y: 0 };
        
        const { width, height } = this.processedImageData;
        const canvasWidth = Math.floor(width * 1.5) * this.pixelSize;
        const canvasHeight = Math.floor(height * 1.5) * this.pixelSize;
        const imageOffsetX = Math.floor((canvasWidth - (width * this.pixelSize)) / 2);
        const imageOffsetY = Math.floor((canvasHeight - (height * this.pixelSize)) / 2);
        
        return { x: imageOffsetX, y: imageOffsetY };
    }
    
    getBackgroundColorForBlending() {
        // Return RGB color for blending semi-transparent pixels
        switch (this.backgroundType) {
            case 'checkered':
                return [248, 244, 240]; // Use light cream for checkered
            case 'light':
                return [248, 244, 240]; // #F8F4F0
            case 'green':
                return [227, 240, 212]; // #E3F0D4
            case 'blue':
                return [158, 189, 255]; // #9EBDFF
            case 'dark':
                return [22, 27, 34];    // #161B22
            default:
                return [248, 244, 240]; // Default to light cream
        }
    }
    
    getBackgroundColorForQuantization() {
        // Return RGB color for background-aware quantization (cream/green/blue only)
        switch (this.backgroundType) {
            case 'light':
                return [248, 244, 240]; // #F8F4F0 (cream)
            case 'green':
                return [227, 240, 212]; // #E3F0D4
            case 'blue':
                return [158, 189, 255]; // #9EBDFF
            default:
                return null; // No background quantization for checkered/dark
        }
    }
    
    handleBackgroundChange(bgType) {
        this.backgroundType = bgType;
        
        // Update active state
        this.bgOptionButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-bg="${bgType}"]`).classList.add('active');
        
        
        // Reprocess image for background-aware quantization and semi-transparent blending (fast - no blur recalculation)
        if (this.scaledImage && !this.isExactMode) {
            this.reprocessImageFast();
            this.drawPixelGrid();
        } else if (this.processedImageData) {
            // In exact mode or no scaled image, just redraw (exact mode preserves original processing)
            this.drawPixelGrid();
        }
    }
    
    handleBgIntegrationChange(value) {
        this.backgroundPreference = parseFloat(value);
        this.bgIntegrationValue.textContent = `${this.backgroundPreference}x`;
        
        // Immediately reprocess image with new preference setting (fast - no blur recalculation)
        if (this.scaledImage && !this.isExactMode) {
            this.reprocessImageFast();
            this.drawPixelGrid();
        }
    }
    
    handleFocusChange(focusType) {
        this.focusMode = focusType;
        
        // Update active state
        this.focusButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-focus="${focusType}"]`).classList.add('active');
        
        // Update status text
        const statusText = {
            'off': 'Focus: Off',
            'vertical': 'Focus: Column',
            'horizontal': 'Focus: Row',
            'cross': 'Focus: Cross'
        };
        this.focusStatus.textContent = statusText[focusType];
        
        // If changing focus type while pixel is pinned, update focus coordinates
        if (this.pinnedPixel.x >= 0 && focusType !== 'off') {
            this.focusPixel = { x: this.pinnedPixel.x, y: this.pinnedPixel.y };
        } else if (focusType === 'off') {
            this.focusPixel = { x: -1, y: -1 };
        }
        
        // Redraw to apply focus effects
        if (this.processedImageData) {
            this.drawPixelGrid();
        }
    }
    
    handleMouseMove(event) {
        if (!this.processedImageData) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate image offset and adjust mouse coordinates
        const offset = this.getImageOffset();
        const adjustedX = mouseX - offset.x;
        const adjustedY = mouseY - offset.y;
        
        const pixelX = Math.floor(adjustedX / this.pixelSize);
        const pixelY = Math.floor(adjustedY / this.pixelSize);
        
        if (pixelX >= 0 && pixelX < this.processedImageData.width && 
            pixelY >= 0 && pixelY < this.processedImageData.height) {
            
            // Check if pixel is transparent - if so, treat as if outside image bounds
            const index = (pixelY * this.processedImageData.width + pixelX) * 4;
            const alpha = this.processedImageData.data[index + 3];
            if (alpha === 0) {
                if (!this.countMode) {
                    this.hoveredPixel = { x: -1, y: -1 };
                    this.drawPixelGrid();
                    this.updateTooltipDisplay();
                }
                return;
            }
            
            if (this.isDragging) {
                this.countEndPixel = { x: pixelX, y: pixelY };
                this.updateCountSelection();
                this.showCountTooltip(event.pageX, event.pageY);
                return;
            }
            
            if (!this.countMode && (this.hoveredPixel.x !== pixelX || this.hoveredPixel.y !== pixelY)) {
                this.hoveredPixel = { x: pixelX, y: pixelY };
                this.drawPixelGrid();
            }
            
            if (!this.countMode) {
                // Use pageX/pageY instead of clientX/clientY to account for page scroll
                this.updateTooltipDisplay(event.pageX, event.pageY, pixelX, pixelY);
            }
        } else {
            if (!this.countMode) {
                this.hoveredPixel = { x: -1, y: -1 };
                this.drawPixelGrid();
                this.updateTooltipDisplay();
            }
        }
    }
    
    handleClick(event) {
        if (!this.processedImageData) return;
        
        // Handle coordinate reference setup mode
        if (this.isSettingCoordinateReference) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            const offset = this.getImageOffset();
            const adjustedX = mouseX - offset.x;
            const adjustedY = mouseY - offset.y;
            
            const pixelX = Math.floor(adjustedX / this.pixelSize);
            const pixelY = Math.floor(adjustedY / this.pixelSize);
            
            if (pixelX >= 0 && pixelX < this.processedImageData.width && 
                pixelY >= 0 && pixelY < this.processedImageData.height) {
                this.showCoordinateModal(pixelX, pixelY);
            }
            return;
        }
        
        if (this.countMode) {
            this.exitCountMode();
            return;
        }
        
        if (this.isDragging) {
            return;
        }
        
        // Prevent click after actual panning movement
        if (this.panHasMoved) {
            this.panHasMoved = false;
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate image offset and adjust mouse coordinates
        const offset = this.getImageOffset();
        const adjustedX = mouseX - offset.x;
        const adjustedY = mouseY - offset.y;
        
        const pixelX = Math.floor(adjustedX / this.pixelSize);
        const pixelY = Math.floor(adjustedY / this.pixelSize);
        
        if (pixelX >= 0 && pixelX < this.processedImageData.width && 
            pixelY >= 0 && pixelY < this.processedImageData.height) {
            
            // Check if pixel is transparent - if so, don't allow interaction
            const checkIndex = (pixelY * this.processedImageData.width + pixelX) * 4;
            const checkAlpha = this.processedImageData.data[checkIndex + 3];
            if (checkAlpha === 0) {
                return;
            }
            
            // Check if clicking the same pixel that's already pinned
            if (this.pinnedPixel.x === pixelX && this.pinnedPixel.y === pixelY) {
                // Unpin the pixel
                this.pinnedPixel = { x: -1, y: -1, color: [0, 0, 0] };
                this.focusPixel = { x: -1, y: -1 }; // Clear focus when unpinning
                this.updatePaletteHighlight(null);
            } else {
                // Pin new pixel and store current tooltip position
                const index = (pixelY * this.processedImageData.width + pixelX) * 4;
                const r = this.processedImageData.data[index];
                const g = this.processedImageData.data[index + 1];
                const b = this.processedImageData.data[index + 2];
                
                this.pinnedPixel = { x: pixelX, y: pixelY, color: [r, g, b] };
                // Store the tooltip position where it was clicked (with 25px offset)
                this.pinnedTooltipPos = { x: event.pageX + 25, y: event.pageY + 25 };
                
                // Update focus if in focus mode
                if (this.focusMode !== 'off') {
                    this.focusPixel = { x: pixelX, y: pixelY };
                }
                
                this.updatePaletteHighlight([r, g, b]);
            }
            
            this.drawPixelGrid();
            this.updateTooltipDisplay();
        }
    }
    
    handleMouseDown(event) {
        if (event.button === 2) { // Right click
            if (!this.processedImageData) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            // Calculate image offset and adjust mouse coordinates
            const offset = this.getImageOffset();
            const adjustedX = mouseX - offset.x;
            const adjustedY = mouseY - offset.y;
            
            const pixelX = Math.floor(adjustedX / this.pixelSize);
            const pixelY = Math.floor(adjustedY / this.pixelSize);
            
            if (pixelX >= 0 && pixelX < this.processedImageData.width && 
                pixelY >= 0 && pixelY < this.processedImageData.height) {
                
                // Check if pixel is transparent - if so, don't allow drag counting
                const checkIndex = (pixelY * this.processedImageData.width + pixelX) * 4;
                const checkAlpha = this.processedImageData.data[checkIndex + 3];
                if (checkAlpha === 0) {
                    return;
                }
                
                this.isDragging = true;
                this.countStartPixel = { x: pixelX, y: pixelY };
                this.countEndPixel = { x: pixelX, y: pixelY };
            }
        }
        // Left click is handled by container events for panning
    }
    
    handleMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            
            if (this.countPixels.length > 1) {
                this.countMode = true;
            } else {
                this.exitCountMode();
            }
        }
    }
    
    handleContainerMouseDown(event) {
        if (event.button === 0) { // Left click only
            this.isPanning = true;
            this.lastPanX = event.clientX;
            this.lastPanY = event.clientY;
            this.panHasMoved = false;
            this.canvasContainer.style.cursor = 'grabbing';
            event.preventDefault();
        }
    }
    
    handleContainerMouseMove(event) {
        if (this.isPanning) {
            const deltaX = this.lastPanX - event.clientX;
            const deltaY = this.lastPanY - event.clientY;
            
            // Only set panHasMoved if there was actual movement
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                this.panHasMoved = true;
            }
            
            this.canvasContainer.scrollLeft += deltaX;
            this.canvasContainer.scrollTop += deltaY;
            
            this.lastPanX = event.clientX;
            this.lastPanY = event.clientY;
        }
    }
    
    handleContainerMouseUp(event) {
        if (this.isPanning) {
            this.isPanning = false;
            this.canvasContainer.style.cursor = 'default';
            // panHasMoved flag will be checked and cleared in handleClick
        }
    }
    
    handleContainerMouseLeave(event) {
        if (this.isPanning) {
            this.isPanning = false;
            this.canvasContainer.style.cursor = 'default';
            this.panHasMoved = false; // Reset since we're leaving
        }
    }
    
    handleMouseLeave() {
        this.hoveredPixel = { x: -1, y: -1 };
        this.drawPixelGrid();
        this.updateTooltipDisplay();
    }
    
    updateTooltipDisplay(mouseX = null, mouseY = null, hoveredX = null, hoveredY = null) {
        // Always show pinned pixel info if there's a pinned pixel
        if (this.pinnedPixel.x >= 0) {
            // Use the stored tooltip position from when the pixel was clicked
            this.showTooltip(this.pinnedTooltipPos.x, this.pinnedTooltipPos.y, this.pinnedPixel.x + 1, this.pinnedPixel.y + 1, this.pinnedPixel.color);
        } else if (mouseX !== null && mouseY !== null && hoveredX !== null && hoveredY !== null) {
            // Show hovered pixel info only if no pixel is pinned
            const index = (hoveredY * this.processedImageData.width + hoveredX) * 4;
            const r = this.processedImageData.data[index];
            const g = this.processedImageData.data[index + 1];
            const b = this.processedImageData.data[index + 2];
            this.showTooltip(mouseX, mouseY, hoveredX + 1, hoveredY + 1, [r, g, b]);
            // Also highlight the hovered color in the palette tooltips
            this.updatePaletteHighlight([r, g, b]);
        } else {
            this.hideTooltip();
            // Clear palette highlight when not hovering over anything
            this.updatePaletteHighlight(null);
        }
    }
    
    exitCountMode() {
        this.countMode = false;
        this.countPixels = [];
        this.isDragging = false;
        this.countStartPixel = { x: -1, y: -1 };
        this.countEndPixel = { x: -1, y: -1 };
        this.drawPixelGrid();
        this.updateTooltipDisplay();
    }
    
    updateCountSelection() {
        if (this.countStartPixel.x === -1) return;
        
        this.countPixels = [];
        const startX = this.countStartPixel.x;
        const startY = this.countStartPixel.y;
        const endX = this.countEndPixel.x;
        const endY = this.countEndPixel.y;
        
        if (startX === endX) {
            const minY = Math.min(startY, endY);
            const maxY = Math.max(startY, endY);
            for (let y = minY; y <= maxY; y++) {
                this.countPixels.push({ x: startX, y });
            }
        } else if (startY === endY) {
            const minX = Math.min(startX, endX);
            const maxX = Math.max(startX, endX);
            for (let x = minX; x <= maxX; x++) {
                this.countPixels.push({ x, y: startY });
            }
        }
        
        this.drawPixelGrid();
    }
    
    showCountTooltip(mouseX, mouseY) {
        const count = this.countPixels.length;
        const direction = this.getCountDirection();
        
        this.tooltip.innerHTML = `
            <div>Count Mode: ${direction}</div>
            <div>Selected: ${count} pixel${count !== 1 ? 's' : ''}</div>
        `;
        
        // Position tooltip 25px right and below cursor
        this.tooltip.style.left = `${mouseX + 25}px`;
        this.tooltip.style.top = `${mouseY + 25}px`;
        this.tooltip.style.display = 'block';
    }
    
    getCountDirection() {
        if (this.countStartPixel.x === -1 || this.countPixels.length <= 1) return 'Click & Drag';
        
        if (this.countStartPixel.x === this.countEndPixel.x) {
            return 'Vertical';
        } else if (this.countStartPixel.y === this.countEndPixel.y) {
            return 'Horizontal';
        }
        
        return 'Click & Drag';
    }
    
    showTooltip(mouseX, mouseY, pixelX, pixelY, color) {
        const [r, g, b] = color;
        const matchingIndex = this.findMatchingColorIndex(color);
        const colorName = matchingIndex !== -1 ? this.colorNames[matchingIndex] : 'Unknown';
        
        let tooltipContent = `
            <div>Position: (${pixelX}, ${pixelY})</div>
            <div>Color: rgb(${r}, ${g}, ${b})</div>
            <div>Name: ${colorName}</div>
        `;
        
        // Add world coordinates if mapping is enabled
        // Note: pixelX, pixelY are display coordinates (1-based), convert to grid coordinates (0-based)
        const worldCoords = this.gridToWorldCoordinates(pixelX - 1, pixelY - 1);
        if (worldCoords) {
            tooltipContent += `<div>World: (${this.formatCoordinate(worldCoords.x)}, ${this.formatCoordinate(worldCoords.y)})</div>`;
        }
        
        tooltipContent += `<div style="background: rgb(${r}, ${g}, ${b}); width: 25px; height: 25px; border: 1px solid #000; display: inline-block; margin-top: 8px;"></div>`;
        
        this.tooltip.innerHTML = tooltipContent;
        
        // Position tooltip 25px right and below cursor
        this.tooltip.style.left = `${mouseX + 25}px`;
        this.tooltip.style.top = `${mouseY + 25}px`;
        this.tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        this.tooltip.style.display = 'none';
    }
    
    handlePresetClick(event) {
        const size = event.target.dataset.size;
        this.customScaleInput.value = size;
        
        // Update active state
        this.scalePresetButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    handleScaleImage() {
        const targetSize = parseInt(this.customScaleInput.value);
        if (!this.originalImage || !targetSize || targetSize < 8 || targetSize > 1024) {
            alert('Please enter a valid size between 8 and 1024 pixels');
            return;
        }
        
        this.scaleImage(this.originalImage, targetSize, (scaledImg) => {
            this.scaledImage = scaledImg;
            this.processImage();
            this.updateImageInfo();
            this.drawPixelGrid();
            
            // Clear active state from preset buttons
            this.scalePresetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }
    
    scaleImage(img, maxDimension, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;
        
        if (img.width > img.height) {
            newWidth = maxDimension;
            newHeight = Math.round(maxDimension / aspectRatio);
        } else {
            newHeight = maxDimension;
            newWidth = Math.round(maxDimension * aspectRatio);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Scale the image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Create a new image element
        const scaledImg = new Image();
        scaledImg.onload = () => {
            callback(scaledImg);
        };
        scaledImg.src = canvas.toDataURL();
        scaledImg.width = newWidth;
        scaledImg.height = newHeight;
    }
    
    createPaletteTooltips() {
        // Create palette colors for both tooltips
        this.populatePalette(this.topPalette);
        this.populatePalette(this.bottomPalette);
    }
    
    populatePalette(container) {
        container.innerHTML = '';
        this.colorPalette.forEach((color, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            colorDiv.dataset.colorIndex = index;
            container.appendChild(colorDiv);
        });
    }
    
    updatePaletteHighlight(selectedColor) {
        // Remove all active classes
        document.querySelectorAll('.palette-color').forEach(el => {
            el.classList.remove('active');
        });
        
        if (selectedColor) {
            // Find matching color in palette
            const matchingIndex = this.findMatchingColorIndex(selectedColor);
            if (matchingIndex !== -1) {
                // Highlight in both palettes
                const topColor = this.topPalette.querySelector(`[data-color-index="${matchingIndex}"]`);
                const bottomColor = this.bottomPalette.querySelector(`[data-color-index="${matchingIndex}"]`);
                
                if (topColor) topColor.classList.add('active');
                if (bottomColor) bottomColor.classList.add('active');
                
                // Show color name in both palette name displays
                const colorName = this.colorNames[matchingIndex];
                this.topPaletteName.textContent = colorName;
                this.topPaletteName.style.display = 'block';
                this.bottomPaletteName.textContent = colorName;
                this.bottomPaletteName.style.display = 'block';
            }
        } else {
            // Hide color names when no color is highlighted
            this.topPaletteName.style.display = 'none';
            this.bottomPaletteName.style.display = 'none';
        }
    }
    
    findMatchingColorIndex(color) {
        for (let i = 0; i < this.colorPalette.length; i++) {
            const paletteColor = this.colorPalette[i];
            if (paletteColor[0] === color[0] && 
                paletteColor[1] === color[1] && 
                paletteColor[2] === color[2]) {
                return i;
            }
        }
        return -1;
    }
    
    findOldColorIndex(color) {
        for (let i = 0; i < this.oldColorPalette.length; i++) {
            const paletteColor = this.oldColorPalette[i];
            if (paletteColor[0] === color[0] && 
                paletteColor[1] === color[1] && 
                paletteColor[2] === color[2]) {
                return i;
            }
        }
        return -1;
    }
    
    mapOldColorsToNew(imageData) {
        const newImageData = new ImageData(imageData.width, imageData.height);
        const data = imageData.data;
        const newData = newImageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Find which old color index this pixel represents
            const oldColorIndex = this.findOldColorIndex([r, g, b]);
            
            if (oldColorIndex >= 0 && oldColorIndex < this.colorPalette.length) {
                // Map to new color at same index
                const newColor = this.colorPalette[oldColorIndex];
                newData[i] = newColor[0];       // R
                newData[i + 1] = newColor[1];   // G
                newData[i + 2] = newColor[2];   // B
                newData[i + 3] = a;             // A (preserve alpha)
            } else {
                // If no match found, keep original color
                newData[i] = r;
                newData[i + 1] = g;
                newData[i + 2] = b;
                newData[i + 3] = a;
            }
        }
        
        return newImageData;
    }
    
    updateImageInfo() {
        if (this.originalImage) {
            const isScaled = this.scaledImage !== this.originalImage;
            let finalDims = '';
            if (this.processedImageData) {
                finalDims = `Final Result: ${this.processedImageData.width} × ${this.processedImageData.height} pixels<br>`;
            }
            
            let boundedInfo = '';
            if (this.tempProcessedImageBound && this.tempProcessedImageBoundOffset) {
                const expandedWidth = this.tempProcessedImageBound.width;
                const expandedHeight = this.tempProcessedImageBound.height;
                const originalWidth = this.originalImage.width;
                const originalHeight = this.originalImage.height;
                
                // Check if blur effects expanded the image
                if (expandedWidth > originalWidth || expandedHeight > originalHeight) {
                    boundedInfo = `After Blur: ${expandedWidth} × ${expandedHeight} pixels (expanded)<br>`;
                }
            }
            
            this.imageInfo.innerHTML = `
                <strong>Image Info:</strong><br>
                Original: ${this.originalImage.width} × ${this.originalImage.height} pixels<br>
                ${boundedInfo}
                ${isScaled ? `Scaled: ${this.scaledImage.width} × ${this.scaledImage.height} pixels<br>` : ''}
                ${finalDims}
                Processing: Converted to color palette quantization
            `;
        }
    }
    
    updateFinalDimensions() {
        if (this.finalDimensions && this.processedImageData) {
            this.finalDimensions.textContent = `${this.processedImageData.width} × ${this.processedImageData.height}`;
        } else if (this.finalDimensions) {
            this.finalDimensions.textContent = '';
        }
    }
    
    toggleSettings() {
        this.settingsToggle.classList.toggle('collapsed');
        this.settingsContent.classList.toggle('collapsed');
    }
    
    updateRGBWeight(channel, value) {
        const numValue = parseFloat(value);
        this.rgbWeights[channel] = numValue;
        
        // Update display
        if (channel === 'r') {
            this.redValue.textContent = numValue.toFixed(2);
        } else if (channel === 'g') {
            this.greenValue.textContent = numValue.toFixed(2);
        } else if (channel === 'b') {
            this.blueValue.textContent = numValue.toFixed(2);
        }
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyWeightPreset(preset) {
        // Remove active state from all preset buttons
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        
        let weights;
        switch (preset) {
            case 'human':
                weights = { r: 0.3, g: 0.59, b: 0.11 };
                break;
            case 'balanced':
                weights = { r: 0.33, g: 0.33, b: 0.33 };
                break;
            case 'green':
                weights = { r: 0.15, g: 0.7, b: 0.15 };
                break;
            default:
                return;
        }
        
        // Update weights and UI
        this.rgbWeights = weights;
        this.redWeight.value = weights.r;
        this.greenWeight.value = weights.g;
        this.blueWeight.value = weights.b;
        this.redValue.textContent = weights.r.toFixed(2);
        this.greenValue.textContent = weights.g.toFixed(2);
        this.blueValue.textContent = weights.b.toFixed(2);
        
        // Add active state to clicked button
        document.querySelector(`[data-preset="${preset}"]`).classList.add('active');
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    reprocessImage() {
        if (this.originalImage) {
            this.processImage();
        }
    }
    
    // Fast reprocessing for non-blur effects
    reprocessImageFast() {
        if (this.originalImage) {
            this.reprocessFromTempImage();
        }
    }
    
    updateBrightness(value) {
        this.brightness = parseInt(value);
        this.brightnessValue.textContent = value;
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateContrast(value) {
        this.contrast = parseFloat(value);
        this.contrastValue.textContent = parseFloat(value).toFixed(1);
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyAdjustmentPreset(preset) {
        // Remove active state from all adjustment preset buttons
        this.adjustmentButtons.forEach(btn => btn.classList.remove('active'));
        
        let brightness, contrast;
        switch (preset) {
            case 'reset':
                brightness = 0;
                contrast = 1.0;
                break;
            case 'bright':
                brightness = 20;
                contrast = 1.2;
                break;
            case 'high-contrast':
                brightness = 0;
                contrast = 1.5;
                break;
            default:
                return;
        }
        
        // Update values and UI
        this.brightness = brightness;
        this.contrast = contrast;
        this.brightnessSlider.value = brightness;
        this.contrastSlider.value = contrast;
        this.brightnessValue.textContent = brightness;
        this.contrastValue.textContent = contrast.toFixed(1);
        
        // Add active state to clicked button
        document.querySelector(`[data-adjustment="${preset}"]`).classList.add('active');
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyImageAdjustments(r, g, b) {
        // Apply contrast first (multiply by contrast factor, centered around 128)
        r = ((r - 128) * this.contrast) + 128;
        g = ((g - 128) * this.contrast) + 128;
        b = ((b - 128) * this.contrast) + 128;
        
        // Apply brightness (add brightness value)
        r += this.brightness;
        g += this.brightness;
        b += this.brightness;
        
        // Clamp values to 0-255 range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        
        return [r, g, b];
    }
    
    updateCleanupIsolated(checked) {
        this.doCleanupIsolated = checked;
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateEdgeStrength(value) {
        this.edgeEnhancement = parseFloat(value);
        this.edgeValue.textContent = parseFloat(value).toFixed(1);
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateGaussianBlur(value) {
        // Store previous dimensions for expand mode scale adjustment
        const oldExpandedMaxDim = this.tempProcessedImageBound ? 
            Math.max(this.tempProcessedImageBound.width, this.tempProcessedImageBound.height) : null;
        
        this.gaussianBlurPercent = parseFloat(value);
        
        // Calculate actual pixel amount for display
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (this.gaussianBlurPercent / 100) * maxDimension;
        this.gaussianBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
        
        // Reprocess image if available
        if (this.processedImageData) {
            // Store the oldExpandedMaxDim for expand mode adjustment after reprocessing completes
            this.pendingExpandModeAdjustment = oldExpandedMaxDim;
            this.reprocessImage();
        }
    }
    
    updateMotionBlur(value) {
        // Store previous dimensions for expand mode scale adjustment
        const oldExpandedMaxDim = this.tempProcessedImageBound ? 
            Math.max(this.tempProcessedImageBound.width, this.tempProcessedImageBound.height) : null;
        
        this.motionBlurPercent = parseFloat(value);
        
        // Calculate actual pixel amount for display
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (this.motionBlurPercent / 100) * maxDimension;
        this.motionBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
        
        // Reprocess image if available
        if (this.processedImageData) {
            // Store the oldExpandedMaxDim for expand mode adjustment after reprocessing completes
            this.pendingExpandModeAdjustment = oldExpandedMaxDim;
            this.reprocessImage();
        }
    }
    
    updateRadialBlur(value) {
        // Store previous dimensions for expand mode scale adjustment
        const oldExpandedMaxDim = this.tempProcessedImageBound ? 
            Math.max(this.tempProcessedImageBound.width, this.tempProcessedImageBound.height) : null;
        
        this.radialBlurPercent = parseFloat(value);
        
        // Calculate actual pixel amount for display
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (this.radialBlurPercent / 100) * maxDimension;
        this.radialBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
        
        // Reprocess image if available
        if (this.processedImageData) {
            // Store the oldExpandedMaxDim for expand mode adjustment after reprocessing completes
            this.pendingExpandModeAdjustment = oldExpandedMaxDim;
            this.reprocessImage();
        }
    }
    
    // Display-only update methods (real-time feedback without processing)
    updateGaussianBlurDisplay(value) {
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (parseFloat(value) / 100) * maxDimension;
        this.gaussianBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
    }
    
    updateMotionBlurDisplay(value) {
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (parseFloat(value) / 100) * maxDimension;
        this.motionBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
    }
    
    updateRadialBlurDisplay(value) {
        const maxDimension = this.originalImage ? Math.max(this.originalImage.width, this.originalImage.height) : 100;
        const pixelAmount = (parseFloat(value) / 100) * maxDimension;
        this.radialBlurValue.textContent = parseFloat(value).toFixed(1) + '% (' + pixelAmount.toFixed(1) + 'px)';
    }
    
    handleExpandModeScaleAdjustment(oldExpandedMaxDim) {
        // Only adjust scale in expand mode when dimensions actually changed
        if (this.resizeHandling !== 'expand' || !oldExpandedMaxDim || !this.tempProcessedImageBound) {
            return;
        }
        
        const newExpandedMaxDim = Math.max(this.tempProcessedImageBound.width, this.tempProcessedImageBound.height);
        
        // Only adjust if dimensions changed
        if (oldExpandedMaxDim !== newExpandedMaxDim) {
            const currentScale = parseInt(this.customScaleInput.value) || 64;
            
            // Simple proportional adjustment: whatever change happened to the largest dimension
            // should also happen to the scale value
            // Example: 300→330 (1.1x larger), so 55px → 60.5px → 61px
            const dimensionRatio = newExpandedMaxDim / oldExpandedMaxDim;
            const newScale = Math.round(currentScale * dimensionRatio);
            
            // Clamp to valid range
            const clampedScale = Math.max(8, Math.min(1024, newScale));
            
            if (clampedScale !== currentScale) {
                this.customScaleInput.value = clampedScale;
                
                // Show notification if clamped
                if (newScale !== clampedScale) {
                    console.log(`Scale adjusted and clamped to ${clampedScale < newScale ? 'minimum' : 'maximum'} (${clampedScale}px)`);
                }
                
                // Trigger actual scaling operation with the new scale value
                this.scaleAndQuantizeTempImage();
            }
        }
    }
    
    handleDitheringTypeChange(newType) {
        // Update active state
        this.ditheringButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-dithering="${newType}"]`).classList.add('active');
        
        this.ditheringType = newType;
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateDitheringIntensity(value) {
        this.ditheringIntensityValue = parseInt(value);
        this.ditheringValue.textContent = value + '%';
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateJpegCompressionAmount(value) {
        this.jpegCompressionAmount = parseInt(value);
        this.jpegCompressionValue.textContent = value + '%';
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    updateJpegPasses(value) {
        this.jpegPasses = parseInt(value);
        this.jpegPassesValue.textContent = value;
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyJpegPreset(preset) {
        switch (preset) {
            case 'none':
                this.jpegCompressionAmount = 0;
                this.jpegPasses = 1;
                break;
            case 'light':
                this.jpegCompressionAmount = 25;
                this.jpegPasses = 1;
                break;
            case 'medium':
                this.jpegCompressionAmount = 50;
                this.jpegPasses = 2;
                break;
            case 'heavy':
                this.jpegCompressionAmount = 75;
                this.jpegPasses = 3;
                break;
            case 'deepfry':
                this.jpegCompressionAmount = 95;
                this.jpegPasses = 4;
                break;
        }
        
        // Update UI
        this.jpegCompressionSlider.value = this.jpegCompressionAmount;
        this.jpegCompressionValue.textContent = this.jpegCompressionAmount + '%';
        this.jpegPassesSlider.value = this.jpegPasses;
        this.jpegPassesValue.textContent = this.jpegPasses;
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    calculateDitherOffset(x, y) {
        const intensity = this.ditheringIntensityValue / 100; // Convert percentage to 0-1
        
        switch (this.ditheringType) {
            case 'bayer2x2':
                return this.getBayerOffset(x, y, '2x2', intensity);
            case 'bayer4x4':
                return this.getBayerOffset(x, y, '4x4', intensity);
            case 'bayer8x8':
                return this.getBayerOffset(x, y, '8x8', intensity);
            case 'floyd':
                return this.getFloydSteinbergOffset(x, y, intensity);
            default:
                return 0;
        }
    }
    
    getBayerOffset(x, y, matrixType, intensity) {
        const matrix = this.bayerMatrices[matrixType];
        const size = matrix.length;
        const matrixValue = matrix[y % size][x % size];
        const maxValue = size * size - 1;
        
        // Convert matrix value to offset range (-128 to +127)
        const normalizedValue = (matrixValue / maxValue) - 0.5;
        return Math.round(normalizedValue * 255 * intensity);
    }
    
    getFloydSteinbergOffset(x, y, intensity) {
        // For Floyd-Steinberg, we'll use a simple random offset
        // True Floyd-Steinberg requires error diffusion which is more complex
        // This is a simplified version for immediate implementation
        const randomValue = (Math.random() - 0.5);
        return Math.round(randomValue * 64 * intensity);
    }
    
    applyJpegCompression(imageData, callback) {
        // Skip compression if amount is 0
        if (this.jpegCompressionAmount === 0) {
            callback(imageData);
            return;
        }
        
        // Create temporary canvas for compression
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        
        // Put image data on canvas
        tempCtx.putImageData(imageData, 0, 0);
        
        // Convert compression amount (0-100) to quality (100-0)
        const quality = (100 - this.jpegCompressionAmount) / 100;
        
        let currentCanvas = tempCanvas;
        let passesRemaining = this.jpegPasses;
        
        const processNextPass = () => {
            if (passesRemaining <= 0) {
                // All passes complete, extract final image data
                const finalCtx = currentCanvas.getContext('2d');
                const finalImageData = finalCtx.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
                callback(finalImageData);
                return;
            }
            
            // For multiple passes, make each pass progressively more aggressive
            // This ensures cumulative degradation effect with visible differences
            const totalPasses = this.jpegPasses;
            const currentPass = totalPasses - passesRemaining + 1;
            const baseQuality = quality;
            
            // Each pass gets progressively lower quality for cumulative effect
            const qualityReduction = (currentPass - 1) * 0.1; // Each pass reduces quality by 10%
            const adjustedQuality = Math.max(0.1, baseQuality - qualityReduction);
            
            // Apply JPEG compression for this pass
            const dataURL = currentCanvas.toDataURL('image/jpeg', adjustedQuality);
            
            // Create new canvas for next pass
            const nextCanvas = document.createElement('canvas');
            const nextCtx = nextCanvas.getContext('2d');
            nextCanvas.width = currentCanvas.width;
            nextCanvas.height = currentCanvas.height;
            
            // Load compressed image
            const compressedImg = new Image();
            compressedImg.onload = () => {
                nextCtx.drawImage(compressedImg, 0, 0);
                currentCanvas = nextCanvas;
                passesRemaining--;
                processNextPass();
            };
            compressedImg.src = dataURL;
        };
        
        processNextPass();
    }
    
    handleResizeMethodChange(newMethod) {
        const oldMethod = this.resizeHandling;
        
        // Update active state
        this.resizeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-resize="${newMethod}"]`).classList.add('active');
        
        // Calculate new scale value based on mode switching logic
        if (oldMethod !== newMethod && this.originalImage && this.tempProcessedImageBound) {
            const currentScale = parseInt(this.customScaleInput.value) || 64;
            const originalMaxDim = Math.max(this.originalImage.width, this.originalImage.height);
            const expandedMaxDim = Math.max(this.tempProcessedImageBound.width, this.tempProcessedImageBound.height);
            let newScale = currentScale;
            
            // Apply mode switching logic:
            // Key insight: Scale setting always refers to the SOURCE dimensions of that mode
            if (oldMethod === 'crop' && newMethod === 'expand') {
                // 1→3: scale was for original dims, now should be for bound dims
                // Compare original with bound and scale proportionally
                const dimensionRatio = expandedMaxDim / originalMaxDim;
                newScale = Math.round(currentScale * dimensionRatio);
            } else if (oldMethod === 'fit' && newMethod === 'expand') {
                // 2→3: scale was for bound dims (fit), now should be for bound dims (expand)
                // Apply inverse calculation: scale gets larger to account for dimensional differences
                const dimensionRatio = expandedMaxDim / originalMaxDim;
                newScale = Math.round(currentScale * dimensionRatio);
            } else if (oldMethod === 'expand' && newMethod === 'crop') {
                // 3→1: scale was for bound dims, now should be for original dims
                const dimensionRatio = originalMaxDim / expandedMaxDim;
                newScale = Math.round(currentScale * dimensionRatio);
            } else if (oldMethod === 'expand' && newMethod === 'fit') {
                // 3→2: scale was for bound dims (expand), now should be for bound dims (fit)
                // Use same calculation as 3→1 but keep using tempProcessedImageBound as source
                const dimensionRatio = originalMaxDim / expandedMaxDim;
                newScale = Math.round(currentScale * dimensionRatio);
            } else if (oldMethod === 'crop' && newMethod === 'fit') {
                // 1→2: scale was for original dims, now should be for bound dims
                // Keep same scale number - no change needed
                newScale = currentScale;
            } else if (oldMethod === 'fit' && newMethod === 'crop') {
                // 2→1: scale was for bound dims, now should be for original dims
                // Keep same scale number - no change needed
                newScale = currentScale;
            }
            
            // Clamp to valid range
            newScale = Math.max(8, Math.min(1024, newScale));
            this.customScaleInput.value = newScale;
        }
        
        this.resizeHandling = newMethod;
        
        // Reprocess with new method
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyEdgePreset(preset) {
        // Remove active state from all edge preset buttons
        this.edgeButtons.forEach(btn => btn.classList.remove('active'));
        
        let cleanup, enhancement;
        switch (preset) {
            case 'none':
                cleanup = false;
                enhancement = 0.0;
                break;
            case 'cleanup':
                cleanup = true;
                enhancement = 0.0;
                break;
            case 'enhance':
                cleanup = true;
                enhancement = 0.5;
                break;
            case 'smooth':
                cleanup = true;
                enhancement = -0.3;
                break;
            default:
                return;
        }
        
        // Update values and UI
        this.doCleanupIsolated = cleanup;
        this.edgeEnhancement = enhancement;
        this.cleanupIsolated.checked = cleanup;
        this.edgeStrength.value = enhancement;
        this.edgeValue.textContent = enhancement.toFixed(1);
        
        // Add active state to clicked button
        document.querySelector(`[data-edge="${preset}"]`).classList.add('active');
        
        // Reprocess image if available (fast - no blur recalculation)
        if (this.processedImageData) {
            this.reprocessImageFast();
        }
    }
    
    applyEdgeDetection(imageData) {
        let result = imageData;
        
        // Edge enhancement/smoothing only (isolated pixel cleanup moved to post-quantization)
        if (this.edgeEnhancement !== 0) {
            result = this.enhanceEdges(result, this.edgeEnhancement);
        }
        
        return result;
    }
    
    applyBlurEffects(imageData, width, height) {
        let result = imageData;
        
        // Convert percentages to pixel values based on image dimensions
        const maxDimension = Math.max(width, height);
        
        // Apply Gaussian blur
        if (this.gaussianBlurPercent > 0) {
            const gaussianBlurPixels = (this.gaussianBlurPercent / 100) * maxDimension;
            result = this.applyGaussianBlur(result, width, height, gaussianBlurPixels);
        }
        
        // Apply Motion blur
        if (this.motionBlurPercent > 0) {
            const motionBlurPixels = (this.motionBlurPercent / 100) * maxDimension;
            result = this.applyMotionBlur(result, width, height, motionBlurPixels);
        }
        
        // Apply Rotational blur
        if (this.radialBlurPercent > 0) {
            const rotationalBlurPixels = (this.radialBlurPercent / 100) * maxDimension;
            result = this.applyRotationalBlur(result, width, height, rotationalBlurPixels);
        }
        
        return result;
    }
    
    applyGaussianBlur(imageData, width, height, radius) {
        if (radius <= 0) return imageData;
        
        const data = imageData.data;
        const output = new Uint8ClampedArray(data.length);
        
        // Simple box blur approximation (3 passes for Gaussian-like effect)
        const kernelSize = Math.ceil(radius * 2) + 1;
        const halfKernel = Math.floor(kernelSize / 2);
        
        // Horizontal pass
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let count = 0;
                
                for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                    const px = Math.max(0, Math.min(width - 1, x + kx));
                    const idx = (y * width + px) * 4;
                    
                    r += data[idx];
                    g += data[idx + 1];
                    b += data[idx + 2];
                    a += data[idx + 3];
                    count++;
                }
                
                const idx = (y * width + x) * 4;
                output[idx] = r / count;
                output[idx + 1] = g / count;
                output[idx + 2] = b / count;
                output[idx + 3] = a / count;
            }
        }
        
        // Vertical pass
        const final = new Uint8ClampedArray(data.length);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let count = 0;
                
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    const py = Math.max(0, Math.min(height - 1, y + ky));
                    const idx = (py * width + x) * 4;
                    
                    r += output[idx];
                    g += output[idx + 1];
                    b += output[idx + 2];
                    a += output[idx + 3];
                    count++;
                }
                
                const idx = (y * width + x) * 4;
                final[idx] = r / count;
                final[idx + 1] = g / count;
                final[idx + 2] = b / count;
                final[idx + 3] = a / count;
            }
        }
        
        // Create proper ImageData object
        const result = new ImageData(final, width, height);
        return result;
    }
    
    applyMotionBlur(imageData, width, height, length) {
        if (length <= 0) return imageData;
        
        const data = imageData.data;
        const output = new Uint8ClampedArray(data.length);
        
        // Horizontal motion blur with proper fractional sampling
        const samples = Math.max(1, Math.round(length * 2)); // More samples for smoother blur
        const halfLength = length / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let totalWeight = 0;
                
                for (let s = 0; s < samples; s++) {
                    // Distribute samples evenly across the blur length
                    const offset = (s / Math.max(1, samples - 1)) * length - halfLength;
                    const px = Math.round(x + offset);
                    
                    // Only sample if within bounds
                    if (px >= 0 && px < width) {
                        const idx = (y * width + px) * 4;
                        const weight = 1; // Equal weighting for all samples
                        
                        r += data[idx] * weight;
                        g += data[idx + 1] * weight;
                        b += data[idx + 2] * weight;
                        a += data[idx + 3] * weight;
                        totalWeight += weight;
                    }
                }
                
                const idx = (y * width + x) * 4;
                if (totalWeight > 0) {
                    output[idx] = Math.round(r / totalWeight);
                    output[idx + 1] = Math.round(g / totalWeight);
                    output[idx + 2] = Math.round(b / totalWeight);
                    output[idx + 3] = Math.round(a / totalWeight);
                } else {
                    // Fallback to original pixel if no valid samples
                    output[idx] = data[idx];
                    output[idx + 1] = data[idx + 1];
                    output[idx + 2] = data[idx + 2];
                    output[idx + 3] = data[idx + 3];
                }
            }
        }
        
        // Create proper ImageData object
        const result = new ImageData(output, width, height);
        return result;
    }
    
    applyRotationalBlur(imageData, width, height, radius) {
        if (radius <= 0) return imageData;
        
        const data = imageData.data;
        const output = new Uint8ClampedArray(data.length);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Convert radius to angle (more samples for stronger blur)
        const maxAngle = (radius / 10) * Math.PI / 6; // Up to 30 degrees for max radius
        const samples = Math.ceil(radius * 2);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let count = 0;
                
                // Calculate distance and angle from center
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Current angle of the pixel
                    const baseAngle = Math.atan2(dy, dx);
                    
                    // Sample along a circular arc around the center
                    for (let s = 0; s < samples; s++) {
                        // Distribute angle offsets symmetrically around the base angle
                        const angleOffset = (s / (samples - 1) - 0.5) * maxAngle;
                        const sampleAngle = baseAngle + angleOffset;
                        
                        // Calculate sample position
                        const sampleX = centerX + Math.cos(sampleAngle) * distance;
                        const sampleY = centerY + Math.sin(sampleAngle) * distance;
                        
                        // Clamp to image bounds
                        const px = Math.max(0, Math.min(width - 1, Math.round(sampleX)));
                        const py = Math.max(0, Math.min(height - 1, Math.round(sampleY)));
                        const idx = (py * width + px) * 4;
                        
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        a += data[idx + 3];
                        count++;
                    }
                } else {
                    // Center pixel - no blur
                    const idx = (y * width + x) * 4;
                    r = data[idx];
                    g = data[idx + 1];
                    b = data[idx + 2];
                    a = data[idx + 3];
                    count = 1;
                }
                
                const idx = (y * width + x) * 4;
                output[idx] = r / count;
                output[idx + 1] = g / count;
                output[idx + 2] = b / count;
                output[idx + 3] = a / count;
            }
        }
        
        // Create proper ImageData object
        const result = new ImageData(output, width, height);
        return result;
    }
    
    updateDebugPanel() {
        // Create debug panel if it doesn't exist
        if (!document.getElementById('debugPanel')) {
            this.createDebugPanel();
        }
        
        const maxSize = 150; // Smaller size to fit 5 stages
        
        // 1. Update original image
        const originalCanvas = document.getElementById('debugOriginal');
        const originalDims = document.getElementById('debugOriginalDims');
        if (originalCanvas && this.originalImage) {
            const ctx = originalCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.originalImage.width, maxSize / this.originalImage.height);
            originalCanvas.width = this.originalImage.width * scale;
            originalCanvas.height = this.originalImage.height * scale;
            ctx.drawImage(this.originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
            
            if (originalDims) {
                originalDims.textContent = `${this.originalImage.width} × ${this.originalImage.height} px`;
            }
        }
        
        // 2. Update temp processed full (2x canvas)
        const fullCanvas = document.getElementById('debugTempProcessedFull');
        const fullDims = document.getElementById('debugTempProcessedFullDims');
        if (fullCanvas && this.tempProcessedImageFull) {
            const ctx = fullCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.tempProcessedImageFull.width, maxSize / this.tempProcessedImageFull.height);
            fullCanvas.width = this.tempProcessedImageFull.width * scale;
            fullCanvas.height = this.tempProcessedImageFull.height * scale;
            ctx.drawImage(this.tempProcessedImageFull, 0, 0, fullCanvas.width, fullCanvas.height);
            
            if (fullDims) {
                fullDims.textContent = `${this.tempProcessedImageFull.width} × ${this.tempProcessedImageFull.height} px`;
            }
        }
        
        // 3. Update temp processed bound (cropped)
        const boundCanvas = document.getElementById('debugTempProcessedBound');
        const boundDims = document.getElementById('debugTempProcessedBoundDims');
        if (boundCanvas && this.tempProcessedImageBound) {
            const ctx = boundCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.tempProcessedImageBound.width, maxSize / this.tempProcessedImageBound.height);
            boundCanvas.width = this.tempProcessedImageBound.width * scale;
            boundCanvas.height = this.tempProcessedImageBound.height * scale;
            ctx.drawImage(this.tempProcessedImageBound, 0, 0, boundCanvas.width, boundCanvas.height);
            
            if (boundDims) {
                const offset = this.tempProcessedImageBoundOffset;
                boundDims.textContent = `${this.tempProcessedImageBound.width} × ${this.tempProcessedImageBound.height} px (offset: ${offset.x}, ${offset.y})`;
            }
        }
        
        // 4. Update temp processed cropped (original dimensions)
        const croppedCanvas = document.getElementById('debugTempProcessedCropped');
        const croppedDims = document.getElementById('debugTempProcessedCroppedDims');
        if (croppedCanvas && this.tempProcessedImageCropped) {
            const ctx = croppedCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.tempProcessedImageCropped.width, maxSize / this.tempProcessedImageCropped.height);
            croppedCanvas.width = this.tempProcessedImageCropped.width * scale;
            croppedCanvas.height = this.tempProcessedImageCropped.height * scale;
            ctx.drawImage(this.tempProcessedImageCropped, 0, 0, croppedCanvas.width, croppedCanvas.height);
            
            if (croppedDims) {
                croppedDims.textContent = `${this.tempProcessedImageCropped.width} × ${this.tempProcessedImageCropped.height} px (original dims)`;
            }
        }
        
        // 5. Update scaled un-quantized
        const unquantizedCanvas = document.getElementById('debugScaledUnquantized');
        const unquantizedDims = document.getElementById('debugScaledUnquantizedDims');
        if (unquantizedCanvas && this.scaledUnquantizedCanvas) {
            const ctx = unquantizedCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.scaledUnquantizedCanvas.width, maxSize / this.scaledUnquantizedCanvas.height);
            unquantizedCanvas.width = this.scaledUnquantizedCanvas.width * scale;
            unquantizedCanvas.height = this.scaledUnquantizedCanvas.height * scale;
            ctx.drawImage(this.scaledUnquantizedCanvas, 0, 0, unquantizedCanvas.width, unquantizedCanvas.height);
            
            if (unquantizedDims) {
                unquantizedDims.textContent = `${this.scaledUnquantizedCanvas.width} × ${this.scaledUnquantizedCanvas.height} px`;
            }
        }
        
        // 6. Update final result
        const finalCanvas = document.getElementById('debugFinalResult');
        const finalDims = document.getElementById('debugFinalResultDims');
        if (finalCanvas && this.processedImageData) {
            const ctx = finalCanvas.getContext('2d');
            const scale = Math.min(maxSize / this.processedImageData.width, maxSize / this.processedImageData.height);
            finalCanvas.width = this.processedImageData.width * scale;
            finalCanvas.height = this.processedImageData.height * scale;
            
            // Create temporary canvas to draw the final result
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = this.processedImageData.width;
            tempCanvas.height = this.processedImageData.height;
            tempCtx.putImageData(this.processedImageData, 0, 0);
            
            ctx.drawImage(tempCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
            
            if (finalDims) {
                finalDims.textContent = `${this.processedImageData.width} × ${this.processedImageData.height} px`;
            }
        }
    }
    
    createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 15px;
            z-index: 1000;
            font-family: Inter, sans-serif;
            color: #e6edf3;
            font-size: 12px;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        debugPanel.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #f0f6fc;">Debug Panel - Processing Pipeline</h4>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">1. Original Image:</div>
                <div id="debugOriginalDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugOriginal" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">2. Temp Processed Full (2x):</div>
                <div id="debugTempProcessedFullDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugTempProcessedFull" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">3. Temp Processed Bound:</div>
                <div id="debugTempProcessedBoundDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugTempProcessedBound" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">4. Temp Processed Cropped:</div>
                <div id="debugTempProcessedCroppedDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugTempProcessedCropped" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">5. Scaled Un-quantized:</div>
                <div id="debugScaledUnquantizedDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugScaledUnquantized" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 500;">6. Final Result:</div>
                <div id="debugFinalResultDims" style="font-size: 11px; color: #8b949e; margin-bottom: 3px;"></div>
                <canvas id="debugFinalResult" style="border: 1px solid #30363d; margin: 5px 0;"></canvas>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
    }
    
    // Coordinate mapping methods
    startCoordinateSetup() {
        this.isSettingCoordinateReference = true;
        this.setCoordinateRefBtn.classList.add('active');
        this.setCoordinateRefBtn.textContent = 'Click a pixel...';
    }
    
    cancelCoordinateSetup() {
        this.isSettingCoordinateReference = false;
        this.setCoordinateRefBtn.classList.remove('active');
        this.setCoordinateRefBtn.textContent = 'Set Coordinate Reference';
        this.coordinateModal.style.display = 'none';
    }
    
    showCoordinateModal(gridX, gridY) {
        this.selectedPixelCoords.textContent = `(${gridX}, ${gridY})`;
        this.worldXInput.value = '';
        this.worldYInput.value = '';
        this.coordinateModal.style.display = 'flex';
        this.worldXInput.focus();
        
        // Store the selected pixel temporarily
        this.tempSelectedPixel = { x: gridX, y: gridY };
    }
    
    confirmCoordinateReference() {
        const worldX = parseFloat(this.worldXInput.value);
        const worldY = parseFloat(this.worldYInput.value);
        
        if (isNaN(worldX) || isNaN(worldY)) {
            alert('Please enter valid numeric coordinates');
            return;
        }
        
        // Set the coordinate mapping
        this.coordinateMapping.referencePoint = {
            grid: { x: this.tempSelectedPixel.x, y: this.tempSelectedPixel.y },
            world: { x: worldX, y: worldY }
        };
        this.coordinateMapping.isEnabled = true;
        
        this.cancelCoordinateSetup();
        this.drawPixelGrid(); // Redraw to show changes
    }
    
    toggleCornerMarkers() {
        this.coordinateMapping.showCornerMarkers = !this.coordinateMapping.showCornerMarkers;
        this.toggleCornerMarkersBtn.classList.toggle('active', this.coordinateMapping.showCornerMarkers);
        if (this.processedImageData) {
            this.drawPixelGrid();
        }
    }
    
    gridToWorldCoordinates(gridX, gridY) {
        if (!this.coordinateMapping.isEnabled) return null;
        
        const ref = this.coordinateMapping.referencePoint;
        const deltaX = gridX - ref.grid.x;
        const deltaY = gridY - ref.grid.y;
        
        return {
            x: ref.world.x + deltaX,
            y: ref.world.y + deltaY
        };
    }
    
    formatCoordinate(value) {
        return value.toFixed(1).replace(/\.0$/, '');
    }
    
    toggleDebugPanel() {
        const debugPanel = document.getElementById('debugPanel');
        
        if (!debugPanel) {
            // Create and show debug panel
            this.createDebugPanel();
            this.updateDebugPanel();
            this.toggleDebugPanelBtn.textContent = 'Hide Debug Panel';
            this.toggleDebugPanelBtn.classList.add('active');
        } else {
            // Toggle visibility
            const isVisible = debugPanel.style.display !== 'none';
            if (isVisible) {
                debugPanel.style.display = 'none';
                this.toggleDebugPanelBtn.textContent = 'Show Debug Panel';
                this.toggleDebugPanelBtn.classList.remove('active');
            } else {
                debugPanel.style.display = 'block';
                this.updateDebugPanel();
                this.toggleDebugPanelBtn.textContent = 'Hide Debug Panel';
                this.toggleDebugPanelBtn.classList.add('active');
            }
        }
    }
    
    cleanupIsolatedPixels(imageData) {
        console.log('FINAL VERSION: Post-quantization isolated pixel cleanup');
        
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        let changeCount = 0;
        
        // Process each pixel to find truly isolated noise pixels
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const pixelIndex = (row * width + col) * 4;
                
                // Get center pixel color
                const centerR = data[pixelIndex];
                const centerG = data[pixelIndex + 1]; 
                const centerB = data[pixelIndex + 2];
                const centerA = data[pixelIndex + 3];
                
                // Skip transparent pixels
                if (centerA === 0) continue;
                
                // Collect neighbor colors (8-connected neighborhood)
                const neighborColors = [];
                
                for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
                    for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
                        // Skip center pixel
                        if (deltaRow === 0 && deltaCol === 0) continue;
                        
                        const neighborRow = row + deltaRow;
                        const neighborCol = col + deltaCol;
                        
                        // Check if neighbor is within image bounds
                        if (neighborRow >= 0 && neighborRow < height && 
                            neighborCol >= 0 && neighborCol < width) {
                            
                            const neighborIndex = (neighborRow * width + neighborCol) * 4;
                            const neighborA = data[neighborIndex + 3];
                            
                            // Only consider opaque neighbors
                            if (neighborA > 0) {
                                neighborColors.push({
                                    r: data[neighborIndex],
                                    g: data[neighborIndex + 1],
                                    b: data[neighborIndex + 2]
                                });
                            }
                        }
                    }
                }
                
                // Need enough neighbors to make a determination
                if (neighborColors.length < 4) continue;
                
                // Check if center pixel matches ANY neighbor
                let hasMatch = false;
                for (const neighbor of neighborColors) {
                    if (centerR === neighbor.r && centerG === neighbor.g && centerB === neighbor.b) {
                        hasMatch = true;
                        break;
                    }
                }
                
                // If pixel is truly isolated (no matching neighbors), replace it
                if (!hasMatch) {
                    // Find most common neighbor color
                    const colorFreq = new Map();
                    
                    neighborColors.forEach(color => {
                        const key = `${color.r},${color.g},${color.b}`;
                        colorFreq.set(key, (colorFreq.get(key) || 0) + 1);
                    });
                    
                    let mostCommonColor = null;
                    let highestCount = 0;
                    
                    colorFreq.forEach((count, colorKey) => {
                        if (count > highestCount) {
                            highestCount = count;
                            const [r, g, b] = colorKey.split(',').map(Number);
                            mostCommonColor = { r, g, b };
                        }
                    });
                    
                    // Replace the isolated pixel
                    if (mostCommonColor) {
                        data[pixelIndex] = mostCommonColor.r;
                        data[pixelIndex + 1] = mostCommonColor.g;
                        data[pixelIndex + 2] = mostCommonColor.b;
                        // Keep original alpha
                        changeCount++;
                    }
                }
            }
        }
        
        console.log('Cleaned up', changeCount, 'isolated pixels');
        return imageData;
    }
    
    enhanceEdges(imageData, strength) {
        const { width, height } = imageData;
        const data = imageData.data;
        const result = new Uint8ClampedArray(data);
        
        // Simple edge detection kernel (Sobel-like)
        const kernelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const kernelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const centerIndex = (y * width + x) * 4;
                
                let gradientXR = 0, gradientXG = 0, gradientXB = 0;
                let gradientYR = 0, gradientYG = 0, gradientYB = 0;
                
                // Apply convolution kernels
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                        const r = data[pixelIndex];
                        const g = data[pixelIndex + 1];
                        const b = data[pixelIndex + 2];
                        
                        const weightX = kernelX[ky + 1][kx + 1];
                        const weightY = kernelY[ky + 1][kx + 1];
                        
                        gradientXR += r * weightX;
                        gradientXG += g * weightX;
                        gradientXB += b * weightX;
                        
                        gradientYR += r * weightY;
                        gradientYG += g * weightY;
                        gradientYB += b * weightY;
                    }
                }
                
                // Calculate edge magnitude
                const edgeMagnitudeR = Math.sqrt(gradientXR * gradientXR + gradientYR * gradientYR);
                const edgeMagnitudeG = Math.sqrt(gradientXG * gradientXG + gradientYG * gradientYG);
                const edgeMagnitudeB = Math.sqrt(gradientXB * gradientXB + gradientYB * gradientYB);
                
                // Apply edge enhancement or smoothing
                const originalR = data[centerIndex];
                const originalG = data[centerIndex + 1];
                const originalB = data[centerIndex + 2];
                
                // Positive strength enhances edges, negative strength smooths them
                let enhancedR = Math.min(255, Math.max(0, originalR + edgeMagnitudeR * strength));
                let enhancedG = Math.min(255, Math.max(0, originalG + edgeMagnitudeG * strength));
                let enhancedB = Math.min(255, Math.max(0, originalB + edgeMagnitudeB * strength));
                
                // Re-quantize the enhanced color to ensure it stays within our palette
                const quantizedResult = this.quantizeToColorPalette([enhancedR, enhancedG, enhancedB]);
                
                if (quantizedResult.isBackground) {
                    // Background match - convert to transparent
                    result[centerIndex + 3] = 0; // Make fully transparent
                } else {
                    // Regular palette color
                    result[centerIndex] = quantizedResult.color[0];
                    result[centerIndex + 1] = quantizedResult.color[1];
                    result[centerIndex + 2] = quantizedResult.color[2];
                }
            }
        }
        
        return new ImageData(result, width, height);
    }
    
    saveProject() {
        if (!this.originalImage || !this.processedImageData) {
            alert('No image loaded to save');
            return;
        }
        
        // Convert original image to base64
        const originalCanvas = document.createElement('canvas');
        const originalCtx = originalCanvas.getContext('2d');
        originalCanvas.width = this.originalImage.width;
        originalCanvas.height = this.originalImage.height;
        originalCtx.drawImage(this.originalImage, 0, 0);
        const originalImageData = originalCanvas.toDataURL('image/png');
        
        // Convert processed grid to base64
        const gridCanvas = document.createElement('canvas');
        const gridCtx = gridCanvas.getContext('2d');
        gridCanvas.width = this.processedImageData.width;
        gridCanvas.height = this.processedImageData.height;
        gridCtx.putImageData(this.processedImageData, 0, 0);
        const processedGridData = gridCanvas.toDataURL('image/png');
        
        // Create project data
        const projectData = {
            version: "2.0",
            settings: {
                rgbWeights: { ...this.rgbWeights },
                brightness: this.brightness,
                contrast: this.contrast,
                doCleanupIsolated: this.doCleanupIsolated,
                edgeEnhancement: this.edgeEnhancement,
                scaleSize: Math.max(this.scaledImage.width, this.scaledImage.height),
                pixelSize: this.pixelSize,
                backgroundType: this.backgroundType,
                backgroundPreference: this.backgroundPreference,
                resizeHandling: this.resizeHandling,
                gaussianBlurPercent: this.gaussianBlurPercent || 0,
                motionBlurPercent: this.motionBlurPercent || 0,
                radialBlurPercent: this.radialBlurPercent || 0,
                ditheringType: this.ditheringType || 'none',
                ditheringIntensity: this.ditheringIntensityValue || 50,
                coordinateMapping: {
                    isEnabled: this.coordinateMapping.isEnabled,
                    referencePoint: { ...this.coordinateMapping.referencePoint },
                    showCornerMarkers: this.coordinateMapping.showCornerMarkers
                }
            },
            originalImage: originalImageData,
            processedGrid: processedGridData,
            metadata: {
                timestamp: new Date().toISOString(),
                originalDimensions: {
                    width: this.originalImage.width,
                    height: this.originalImage.height
                },
                finalDimensions: {
                    width: this.processedImageData.width,
                    height: this.processedImageData.height
                }
            }
        };
        
        // Download the file
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixel-rick-project-${Date.now()}.pxlrck`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    exportGrid() {
        if (!this.processedImageData) {
            alert('No processed grid to export');
            return;
        }
        
        // Create canvas with processed grid
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.processedImageData.width;
        canvas.height = this.processedImageData.height;
        ctx.putImageData(this.processedImageData, 0, 0);
        
        // Download as PNG
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixel-rick-grid-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
    
    handleProjectLoad(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const projectData = JSON.parse(e.target.result);
                this.loadProject(projectData);
            } catch (error) {
                alert('Invalid project file format');
                console.error('Project load error:', error);
            }
        };
        reader.readAsText(file);
    }
    
    loadProject(projectData) {
        this.currentProjectData = projectData;
        
        // Start in exact mode by default
        this.switchToExactMode();
    }
    
    switchToExactMode() {
        if (!this.currentProjectData) return;
        
        this.isExactMode = true;
        
        // Load the exact processed grid
        const img = new Image();
        img.onload = () => {
            // Create ImageData from the processed grid
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const loadedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Map old colors to new colors for backwards compatibility
            this.processedImageData = this.mapOldColorsToNew(loadedImageData);
            
            // Restore coordinate mapping if saved
            const settings = this.currentProjectData.settings;
            if (settings.coordinateMapping) {
                this.coordinateMapping.isEnabled = settings.coordinateMapping.isEnabled || false;
                this.coordinateMapping.referencePoint = settings.coordinateMapping.referencePoint || { grid: {x: 0, y: 0}, world: {x: 0, y: 0} };
                this.coordinateMapping.showCornerMarkers = settings.coordinateMapping.showCornerMarkers || false;
                
                // Update coordinate mapping UI state
                this.toggleCornerMarkersBtn.classList.toggle('active', this.coordinateMapping.showCornerMarkers);
            }
            
            // Draw the exact grid with new colors
            this.drawPixelGrid();
            
            // Update UI
            this.updateImageInfo();
            this.showModeIndicator(true);
            this.disableControls(true);
            
            // Enable buttons
            this.saveProjectButton.disabled = false;
            this.exportGridButton.disabled = false;
        };
        img.src = this.currentProjectData.processedGrid;
    }
    
    switchToEditMode() {
        if (!this.currentProjectData) return;
        
        this.isExactMode = false;
        
        // Load original image
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            
            // Apply saved settings
            const settings = this.currentProjectData.settings;
            this.rgbWeights = { ...settings.rgbWeights };
            this.brightness = settings.brightness;
            this.contrast = settings.contrast;
            this.doCleanupIsolated = settings.doCleanupIsolated;
            this.edgeEnhancement = settings.edgeEnhancement;
            this.pixelSize = settings.pixelSize || 20;
            this.backgroundType = settings.backgroundType || 'checkered';
            this.backgroundPreference = settings.backgroundPreference || 1.0;
            this.resizeHandling = settings.resizeHandling || 'crop';
            this.gaussianBlurPercent = settings.gaussianBlurPercent || 0;
            this.motionBlurPercent = settings.motionBlurPercent || 0;
            this.radialBlurPercent = settings.radialBlurPercent || 0;
            this.ditheringType = settings.ditheringType || 'none';
            this.ditheringIntensityValue = settings.ditheringIntensity || 50;
            
            // Restore coordinate mapping if saved
            if (settings.coordinateMapping) {
                this.coordinateMapping.isEnabled = settings.coordinateMapping.isEnabled || false;
                this.coordinateMapping.referencePoint = settings.coordinateMapping.referencePoint || { grid: {x: 0, y: 0}, world: {x: 0, y: 0} };
                this.coordinateMapping.showCornerMarkers = settings.coordinateMapping.showCornerMarkers || false;
            }
            
            // Update UI controls
            this.updateControlsFromSettings();
            
            // Update background button state
            this.bgOptionButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-bg="${this.backgroundType}"]`)?.classList.add('active');
            
            // Scale and process the image
            if (settings.scaleSize && settings.scaleSize !== Math.max(img.width, img.height)) {
                this.scaleImage(img, settings.scaleSize, (scaledImg) => {
                    this.scaledImage = scaledImg;
                    this.finishEditModeSetup();
                });
            } else {
                this.scaledImage = img;
                this.finishEditModeSetup();
            }
        };
        img.src = this.currentProjectData.originalImage;
    }
    
    finishEditModeSetup() {
        this.processImage();
        this.updateImageInfo();
        this.drawPixelGrid();
        
        // Update UI
        this.showModeIndicator(false);
        this.disableControls(false);
        
        // Enable buttons
        this.saveProjectButton.disabled = false;
        this.exportGridButton.disabled = false;
    }
    
    updateControlsFromSettings() {
        // RGB weights
        this.redWeight.value = this.rgbWeights.r;
        this.greenWeight.value = this.rgbWeights.g;
        this.blueWeight.value = this.rgbWeights.b;
        this.redValue.textContent = this.rgbWeights.r.toFixed(2);
        this.greenValue.textContent = this.rgbWeights.g.toFixed(2);
        this.blueValue.textContent = this.rgbWeights.b.toFixed(2);
        
        // Brightness and contrast
        this.brightnessSlider.value = this.brightness;
        this.contrastSlider.value = this.contrast;
        this.brightnessValue.textContent = this.brightness;
        this.contrastValue.textContent = this.contrast.toFixed(1);
        
        // Edge detection
        this.cleanupIsolated.checked = this.doCleanupIsolated;
        this.edgeStrength.value = this.edgeEnhancement;
        this.edgeValue.textContent = this.edgeEnhancement.toFixed(1);
        
        // Zoom
        this.zoomSlider.value = this.pixelSize;
        this.zoomValue.textContent = `${this.pixelSize}x`;
        
        // Background integration
        this.bgIntegrationSlider.value = this.backgroundPreference;
        this.bgIntegrationValue.textContent = `${this.backgroundPreference}x`;
        
        // Scale size - update custom input and preset button states
        if (this.currentProjectData && this.currentProjectData.settings.scaleSize) {
            const scaleSize = this.currentProjectData.settings.scaleSize;
            this.customScaleInput.value = scaleSize;
            
            // Update scale preset button states
            this.scalePresetButtons.forEach(btn => btn.classList.remove('active'));
            const matchingPreset = document.querySelector(`[data-size="${scaleSize}"]`);
            if (matchingPreset) {
                matchingPreset.classList.add('active');
            }
        }
        
        // Resize handling buttons
        this.resizeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-resize="${this.resizeHandling}"]`)?.classList.add('active');
        
        // Blur controls
        this.gaussianBlurSlider.value = this.gaussianBlurPercent;
        this.motionBlurSlider.value = this.motionBlurPercent;
        this.radialBlurSlider.value = this.radialBlurPercent;
        this.updateGaussianBlurDisplay(this.gaussianBlurPercent);
        this.updateMotionBlurDisplay(this.motionBlurPercent);
        this.updateRadialBlurDisplay(this.radialBlurPercent);
        
        // Dithering controls
        this.ditheringButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-dithering="${this.ditheringType}"]`)?.classList.add('active');
        this.ditheringIntensity.value = this.ditheringIntensityValue;
        this.ditheringValue.textContent = this.ditheringIntensityValue + '%';
        
        // Coordinate mapping UI state
        this.toggleCornerMarkersBtn.classList.toggle('active', this.coordinateMapping.showCornerMarkers);
        
    }
    
    showModeIndicator(isExact) {
        this.modeIndicator.style.display = 'block';
        
        if (isExact) {
            this.modeText.textContent = 'Viewing saved grid exactly as processed';
            this.editProjectButton.style.display = 'inline-block';
            this.viewExactButton.style.display = 'none';
        } else {
            this.modeText.textContent = 'Editing mode - results may differ from saved grid';
            this.editProjectButton.style.display = 'none';
            this.viewExactButton.style.display = 'inline-block';
        }
    }
    
    disableControls(disabled) {
        // Main controls
        this.fileInput.disabled = disabled;
        this.scaleButton.disabled = disabled;
        this.customScaleInput.disabled = disabled;
        // Keep zoom slider enabled in exact mode for viewing convenience
        // this.zoomSlider.disabled = disabled;
        
        // Scale preset buttons
        this.scalePresetButtons.forEach(btn => btn.disabled = disabled);
        
        // RGB controls
        this.redWeight.disabled = disabled;
        this.greenWeight.disabled = disabled;
        this.blueWeight.disabled = disabled;
        this.presetButtons.forEach(btn => btn.disabled = disabled);
        
        // Brightness/contrast controls
        this.brightnessSlider.disabled = disabled;
        this.contrastSlider.disabled = disabled;
        this.adjustmentButtons.forEach(btn => btn.disabled = disabled);
        
        // Edge detection controls
        this.cleanupIsolated.disabled = disabled;
        this.edgeStrength.disabled = disabled;
        this.edgeButtons.forEach(btn => btn.disabled = disabled);
        
        // Settings toggle
        this.settingsToggle.style.pointerEvents = disabled ? 'none' : 'auto';
        this.settingsToggle.style.opacity = disabled ? '0.6' : '1';
        
        // Keep coordinate mapping controls enabled in exact mode for viewing convenience
        // (Users should be able to view coordinates even in exact mode)
        // this.setCoordinateRefBtn.disabled = disabled;
        // this.toggleCornerMarkersBtn.disabled = disabled;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PixelGridViewer();
});