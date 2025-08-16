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
        
        // Save/load event listeners
        this.loadProjectButton.addEventListener('click', () => this.projectInput.click());
        this.projectInput.addEventListener('change', (e) => this.handleProjectLoad(e));
        this.saveProjectButton.addEventListener('click', () => this.saveProject());
        this.exportGridButton.addEventListener('click', () => this.exportGrid());
        this.editProjectButton.addEventListener('click', () => this.switchToEditMode());
        this.viewExactButton.addEventListener('click', () => this.switchToExactMode());
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
            
            // Set default zoom to 5x
            this.pixelSize = 5;
            this.zoomSlider.value = 5;
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
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.scaledImage.width;
        tempCanvas.height = this.scaledImage.height;
        
        tempCtx.drawImage(this.scaledImage, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        this.processedImageData = this.convertToColorPalette(imageData);
        
        // Apply edge detection post-processing
        if (this.doCleanupIsolated || this.edgeEnhancement > 0) {
            this.processedImageData = this.applyEdgeDetection(this.processedImageData);
        }
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
            
            const quantizedColor = this.quantizeToColorPalette([r, g, b]);
            
            processed[i] = quantizedColor[0];
            processed[i + 1] = quantizedColor[1];
            processed[i + 2] = quantizedColor[2];
            processed[i + 3] = alpha < 255 ? 255 : alpha; // Semi-transparent becomes opaque after blending
        }
        
        return new ImageData(processed, imageData.width, imageData.height);
    }
    
    quantizeToColorPalette(rgb) {
        let closestColor = this.colorPalette[0];
        let minDistance = this.colorDistance(rgb, closestColor);
        
        for (let i = 1; i < this.colorPalette.length; i++) {
            const distance = this.colorDistance(rgb, this.colorPalette[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = this.colorPalette[i];
            }
        }
        
        return closestColor;
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
        this.pixelSize = parseInt(event.target.value);
        this.zoomValue.textContent = `${this.pixelSize}x`;
        if (this.processedImageData) {
            this.drawPixelGrid();
        }
    }
    
    handleMouseWheel(event) {
        event.preventDefault(); // Prevent page scrolling
        
        if (!this.processedImageData) return;
        
        // Determine zoom direction
        const delta = event.deltaY;
        const zoomIn = delta < 0;
        
        // Get current zoom level
        let newZoom = this.pixelSize;
        
        // Adjust zoom level
        if (zoomIn) {
            newZoom = Math.min(50, newZoom + 1); // Max zoom is 50
        } else {
            newZoom = Math.max(1, newZoom - 1); // Min zoom is 1
        }
        
        // Only update if zoom level changed
        if (newZoom !== this.pixelSize) {
            this.pixelSize = newZoom;
            this.zoomSlider.value = newZoom;
            this.zoomValue.textContent = `${newZoom}x`;
            this.drawPixelGrid();
        }
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
    
    handleBackgroundChange(bgType) {
        this.backgroundType = bgType;
        
        // Update active state
        this.bgOptionButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-bg="${bgType}"]`).classList.add('active');
        
        // Reprocess image to blend semi-transparent pixels with new background
        if (this.scaledImage && !this.isExactMode) {
            this.processImage();
            this.drawPixelGrid();
        } else if (this.processedImageData) {
            // In exact mode or no scaled image, just redraw
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
        
        this.tooltip.innerHTML = `
            <div>Position: (${pixelX}, ${pixelY})</div>
            <div>Color: rgb(${r}, ${g}, ${b})</div>
            <div>Name: ${colorName}</div>
            <div style="background: rgb(${r}, ${g}, ${b}); width: 25px; height: 25px; border: 1px solid #000; display: inline-block; margin-top: 8px;"></div>
        `;
        
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
            this.imageInfo.innerHTML = `
                <strong>Image Info:</strong><br>
                Original: ${this.originalImage.width} × ${this.originalImage.height} pixels<br>
                ${isScaled ? `Scaled: ${this.scaledImage.width} × ${this.scaledImage.height} pixels<br>` : ''}
                Processing: Converted to color palette quantization
            `;
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
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
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
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
        }
    }
    
    reprocessImage() {
        if (this.scaledImage) {
            this.processImage();
            this.drawPixelGrid();
        }
    }
    
    updateBrightness(value) {
        this.brightness = parseInt(value);
        this.brightnessValue.textContent = value;
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
        }
    }
    
    updateContrast(value) {
        this.contrast = parseFloat(value);
        this.contrastValue.textContent = parseFloat(value).toFixed(1);
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
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
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
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
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
        }
    }
    
    updateEdgeStrength(value) {
        this.edgeEnhancement = parseFloat(value);
        this.edgeValue.textContent = parseFloat(value).toFixed(1);
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
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
        
        // Reprocess image if available
        if (this.processedImageData) {
            this.reprocessImage();
        }
    }
    
    applyEdgeDetection(imageData) {
        let result = imageData;
        
        // Step 1: Isolated pixel cleanup
        if (this.doCleanupIsolated) {
            result = this.cleanupIsolatedPixels(result);
        }
        
        // Step 2: Edge enhancement/smoothing
        if (this.edgeEnhancement !== 0) {
            result = this.enhanceEdges(result, this.edgeEnhancement);
        }
        
        return result;
    }
    
    cleanupIsolatedPixels(imageData) {
        const { width, height } = imageData;
        const data = new Uint8ClampedArray(imageData.data);
        const result = new Uint8ClampedArray(imageData.data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const centerIndex = (y * width + x) * 4;
                const centerR = data[centerIndex];
                const centerG = data[centerIndex + 1];
                const centerB = data[centerIndex + 2];
                
                // Check all 8 surrounding pixels
                const neighbors = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue; // Skip center pixel
                        
                        const nx = x + dx;
                        const ny = y + dy;
                        const nIndex = (ny * width + nx) * 4;
                        
                        neighbors.push({
                            r: data[nIndex],
                            g: data[nIndex + 1],
                            b: data[nIndex + 2]
                        });
                    }
                }
                
                // Check if center pixel is isolated (different from all neighbors)
                let matchingNeighbors = 0;
                for (const neighbor of neighbors) {
                    if (neighbor.r === centerR && neighbor.g === centerG && neighbor.b === centerB) {
                        matchingNeighbors++;
                    }
                }
                
                // If pixel has no matching neighbors, replace with most common neighbor color
                if (matchingNeighbors === 0) {
                    const colorCounts = new Map();
                    for (const neighbor of neighbors) {
                        const colorKey = `${neighbor.r},${neighbor.g},${neighbor.b}`;
                        colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
                    }
                    
                    // Find most common color
                    let maxCount = 0;
                    let mostCommonColor = { r: centerR, g: centerG, b: centerB };
                    for (const [colorKey, count] of colorCounts) {
                        if (count > maxCount) {
                            maxCount = count;
                            const [r, g, b] = colorKey.split(',').map(Number);
                            mostCommonColor = { r, g, b };
                        }
                    }
                    
                    result[centerIndex] = mostCommonColor.r;
                    result[centerIndex + 1] = mostCommonColor.g;
                    result[centerIndex + 2] = mostCommonColor.b;
                }
            }
        }
        
        return new ImageData(result, width, height);
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
                const quantizedColor = this.quantizeToColorPalette([enhancedR, enhancedG, enhancedB]);
                
                result[centerIndex] = quantizedColor[0];
                result[centerIndex + 1] = quantizedColor[1];
                result[centerIndex + 2] = quantizedColor[2];
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
                backgroundType: this.backgroundType
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PixelGridViewer();
});