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
        
        this.colorPalette = [
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
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            const alpha = data[i + 3];
            
            // Apply brightness and contrast adjustments
            [r, g, b] = this.applyImageAdjustments(r, g, b);
            
            const quantizedColor = this.quantizeToColorPalette([r, g, b]);
            
            processed[i] = quantizedColor[0];
            processed[i + 1] = quantizedColor[1];
            processed[i + 2] = quantizedColor[2];
            processed[i + 3] = alpha;
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
    
    toggleGridLines(checked) {
        this.showGridLines = checked;
        if (this.processedImageData) {
            this.drawPixelGrid();
        }
    }
    
    drawPixelGrid() {
        if (!this.processedImageData) return;
        
        const { width, height } = this.processedImageData;
        this.canvas.width = width * this.pixelSize;
        this.canvas.height = height * this.pixelSize;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const data = this.processedImageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                this.ctx.fillRect(
                    x * this.pixelSize,
                    y * this.pixelSize,
                    this.pixelSize,
                    this.pixelSize
                );
                
                const isHovered = (x === this.hoveredPixel.x && y === this.hoveredPixel.y);
                const isPinned = (x === this.pinnedPixel.x && y === this.pinnedPixel.y);
                const isInCountSelection = this.countPixels.some(p => p.x === x && p.y === y);
                const isSpecialPixel = isInCountSelection || isPinned || isHovered;
                
                // Only draw strokes if grid lines are on OR it's a special highlighted pixel
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
                        x * this.pixelSize,
                        y * this.pixelSize,
                        this.pixelSize,
                        this.pixelSize
                    );
                }
            }
        }
    }
    
    handleMouseMove(event) {
        if (!this.processedImageData) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const pixelX = Math.floor(mouseX / this.pixelSize);
        const pixelY = Math.floor(mouseY / this.pixelSize);
        
        if (pixelX >= 0 && pixelX < this.processedImageData.width && 
            pixelY >= 0 && pixelY < this.processedImageData.height) {
            
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
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const pixelX = Math.floor(mouseX / this.pixelSize);
        const pixelY = Math.floor(mouseY / this.pixelSize);
        
        if (pixelX >= 0 && pixelX < this.processedImageData.width && 
            pixelY >= 0 && pixelY < this.processedImageData.height) {
            
            // Check if clicking the same pixel that's already pinned
            if (this.pinnedPixel.x === pixelX && this.pinnedPixel.y === pixelY) {
                // Unpin the pixel
                this.pinnedPixel = { x: -1, y: -1, color: [0, 0, 0] };
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
                this.updatePaletteHighlight([r, g, b]);
            }
            
            this.drawPixelGrid();
            this.updateTooltipDisplay();
        }
    }
    
    handleMouseDown(event) {
        if (!this.processedImageData) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const pixelX = Math.floor(mouseX / this.pixelSize);
        const pixelY = Math.floor(mouseY / this.pixelSize);
        
        if (pixelX >= 0 && pixelX < this.processedImageData.width && 
            pixelY >= 0 && pixelY < this.processedImageData.height) {
            
            this.isDragging = true;
            this.countStartPixel = { x: pixelX, y: pixelY };
            this.countEndPixel = { x: pixelX, y: pixelY };
        }
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
        
        this.tooltip.innerHTML = `
            <div>Position: (${pixelX}, ${pixelY})</div>
            <div>Color: rgb(${r}, ${g}, ${b})</div>
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
            }
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
            version: "1.0",
            settings: {
                rgbWeights: { ...this.rgbWeights },
                brightness: this.brightness,
                contrast: this.contrast,
                doCleanupIsolated: this.doCleanupIsolated,
                edgeEnhancement: this.edgeEnhancement,
                scaleSize: Math.max(this.scaledImage.width, this.scaledImage.height),
                pixelSize: this.pixelSize
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
            this.processedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Draw the exact grid
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
            
            // Update UI controls
            this.updateControlsFromSettings();
            
            // Scale and process the image
            if (settings.scaleSize && settings.scaleSize !== Math.max(img.width, img.height)) {
                this.scaledImage = this.scaleImage(img, settings.scaleSize);
            } else {
                this.scaledImage = img;
            }
            
            this.processImage();
            this.updateImageInfo();
            this.drawPixelGrid();
            
            // Update UI
            this.showModeIndicator(false);
            this.disableControls(false);
            
            // Enable buttons
            this.saveProjectButton.disabled = false;
            this.exportGridButton.disabled = false;
        };
        img.src = this.currentProjectData.originalImage;
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