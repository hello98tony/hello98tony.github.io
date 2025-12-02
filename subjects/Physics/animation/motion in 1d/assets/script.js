// Vertical Projectile Motion Simulator
class VerticalProjectileSimulation {
    constructor() {
        // DOM Elements
        this.container = document.getElementById('container');
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorDisplay = document.getElementById('error-display');
        this.performanceWarning = document.getElementById('performance-warning');
        
        // Simulation Parameters
        this.velocity = 20;
        this.initialHeight = 0;
        this.gravity = 9.8;
        
        // Simulation State
        this.isSimulating = false;
        this.simulationTime = 0;
        this.vy = 0;
        
        // Statistics
        this.maxHeight = 0;
        this.flightTime = 0;
        this.impactVelocity = 0;
        
        // Three.js Components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // 3D Objects
        this.projectile = null;
        this.trajectoryLine = null;
        this.ground = null;
        this.grid = null;
        this.axesHelper = null;
        
        // Animation
        this.animationFrameId = null;
        
        // Initialize
        this.init();
    }
    
    async init() {
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                this.showError('Your browser does not support WebGL. Please try a modern browser.');
                return;
            }
            
            // Setup Three.js
            this.setupThreeJS();
            
            // Create 3D scene
            this.createSceneObjects();
            
            // Setup UI and events
            this.setupUI();
            this.setupEventListeners();
            
            // Update initial state
            this.updateTrajectory();
            this.calculateStats();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Start animation loop
            this.animate();
            
            // Show performance warning if needed
            this.checkPerformance();
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize simulation. Please refresh the page.');
        }
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    setupThreeJS() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a20);
        this.scene.fog = new THREE.Fog(0x0a0a20, 30, 150);
        
        // Camera - FIXED POSITION (no rotation)
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 15, 40); // Side view
        this.camera.lookAt(0, 5, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Accent lights
        const pointLight1 = new THREE.PointLight(0x00aaff, 0.4, 50);
        pointLight1.position.set(-15, 10, -10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff00aa, 0.4, 50);
        pointLight2.position.set(15, 10, 10);
        this.scene.add(pointLight2);
    }
    
    createSceneObjects() {
        this.createGround();
        this.createGrid();
        this.createAxes();
        this.createProjectile();
        this.createTrajectoryLine();
    }
    
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            side: THREE.DoubleSide,
            roughness: 0.9,
            metalness: 0.1
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.01;
        this.ground.receiveShadow = true;
        
        this.scene.add(this.ground);
    }
    
    createGrid() {
        this.grid = new THREE.GridHelper(200, 20, 0x555555, 0x333333);
        this.grid.position.y = 0.01;
        this.scene.add(this.grid);
    }
    
    createAxes() {
        this.axesHelper = new THREE.AxesHelper(15);
        this.axesHelper.position.y = 0.02;
        this.scene.add(this.axesHelper);
    }
    
    createProjectile() {
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff3366,
            specular: 0x333333,
            shininess: 100,
            emissive: 0xff0033,
            emissiveIntensity: 0.2
        });
        
        this.projectile = new THREE.Mesh(geometry, material);
        this.projectile.castShadow = true;
        this.projectile.position.set(0, this.initialHeight, 0);
        
        this.scene.add(this.projectile);
    }
    
    createTrajectoryLine() {
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffaa,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });
        
        this.trajectoryLine = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.trajectoryLine);
    }
    
    updateTrajectory() {
        if (!this.trajectoryLine) return;
        
        const points = [];
        const steps = 100;
        
        // Calculate time of flight
        const t_flight = (this.velocity + 
                         Math.sqrt(this.velocity * this.velocity + 
                                 2 * this.gravity * this.initialHeight)) / this.gravity;
        
        if (t_flight <= 0) return;
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * t_flight;
            const y = this.initialHeight + this.velocity * t - 0.5 * this.gravity * t * t;
            
            if (y >= -0.1) {
                points.push(new THREE.Vector3(0, y, 0));
            }
        }
        
        this.trajectoryLine.geometry.setFromPoints(points);
    }
    
    calculateStats() {
        // Time to reach max height
        const t_max = this.velocity / this.gravity;
        
        // Max height
        this.maxHeight = this.initialHeight + 
                        this.velocity * t_max - 
                        0.5 * this.gravity * t_max * t_max;
        
        // Total flight time
        this.flightTime = (this.velocity + 
                          Math.sqrt(this.velocity * this.velocity + 
                                  2 * this.gravity * this.initialHeight)) / this.gravity;
        
        // Impact velocity
        this.impactVelocity = Math.sqrt(this.velocity * this.velocity + 
                                       2 * this.gravity * this.initialHeight);
        
        // Update UI
        this.updateStatsUI();
    }
    
    updateStatsUI() {
        document.getElementById('maxHeight').textContent = 
            this.maxHeight >= 0 ? this.maxHeight.toFixed(2) + ' m' : '-';
        document.getElementById('flightTime').textContent = 
            this.flightTime >= 0 ? this.flightTime.toFixed(2) + ' s' : '-';
        document.getElementById('impactVelocity').textContent = 
            this.impactVelocity >= 0 ? this.impactVelocity.toFixed(2) + ' m/s' : '-';
    }
    
    launchProjectile() {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        this.simulationTime = 0;
        this.vy = this.velocity;
        
        // Calculate stats
        this.calculateStats();
        
        // Reset projectile position
        this.projectile.position.set(0, this.initialHeight, 0);
        
        // Start simulation
        this.animateProjectile();
    }
    
    animateProjectile() {
        if (!this.isSimulating) return;
        
        // Update time
        this.simulationTime += 0.016; // ~60fps
        
        // Calculate new position
        const y = this.initialHeight + this.velocity * this.simulationTime - 
                  0.5 * this.gravity * this.simulationTime * this.simulationTime;
        
        // Update projectile position (NO ROTATION)
        this.projectile.position.set(0, Math.max(y, 0), 0);
        
        // Check if projectile hit the ground
        if (y <= 0) {
            this.isSimulating = false;
            this.projectile.position.set(0, 0, 0);
            return;
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animateProjectile());
    }
    
    resetSimulation() {
        this.isSimulating = false;
        this.simulationTime = 0;
        
        // Reset projectile position
        this.projectile.position.set(0, this.initialHeight, 0);
        
        // Clear stats display
        document.getElementById('maxHeight').textContent = '-';
        document.getElementById('flightTime').textContent = '-';
        document.getElementById('impactVelocity').textContent = '-';
        
        // Update trajectory
        this.updateTrajectory();
        
        // Calculate stats
        this.calculateStats();
    }
    
    toggleGrid() {
        if (this.grid) this.grid.visible = !this.grid.visible;
        if (this.axesHelper) this.axesHelper.visible = !this.axesHelper.visible;
    }
    
    toggleTrajectory() {
        if (this.trajectoryLine) this.trajectoryLine.visible = !this.trajectoryLine.visible;
    }
    
    setupUI() {
        // Set initial values
        document.getElementById('velocityValue').textContent = this.velocity + ' m/s';
        document.getElementById('heightValue').textContent = this.initialHeight + ' m';
        document.getElementById('gravityValue').textContent = this.gravity + ' m/s²';
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Sliders
        document.getElementById('velocitySlider').addEventListener('input', (e) => {
            this.velocity = parseFloat(e.target.value);
            document.getElementById('velocityValue').textContent = this.velocity + ' m/s';
            if (!this.isSimulating) {
                this.updateTrajectory();
                this.calculateStats();
            }
        });
        
        document.getElementById('heightSlider').addEventListener('input', (e) => {
            this.initialHeight = parseFloat(e.target.value);
            document.getElementById('heightValue').textContent = this.initialHeight + ' m';
            if (!this.isSimulating) {
                this.projectile.position.set(0, this.initialHeight, 0);
                this.updateTrajectory();
                this.calculateStats();
            }
        });
        
        document.getElementById('gravitySlider').addEventListener('input', (e) => {
            this.gravity = parseFloat(e.target.value);
            document.getElementById('gravityValue').textContent = this.gravity + ' m/s²';
            if (!this.isSimulating) {
                this.updateTrajectory();
                this.calculateStats();
            }
        });
        
        // Buttons
        document.getElementById('launchBtn').addEventListener('click', () => this.launchProjectile());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());
        document.getElementById('toggleGridBtn').addEventListener('click', () => this.toggleGrid());
        document.getElementById('toggleTrajectoryBtn').addEventListener('click', () => this.toggleTrajectory());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            
            switch(e.key.toLowerCase()) {
                case ' ':
                case 'enter':
                    e.preventDefault();
                    this.launchProjectile();
                    break;
                case 'r':
                    this.resetSimulation();
                    break;
                case 'g':
                    this.toggleGrid();
                    break;
                case 't':
                    this.toggleTrajectory();
                    break;
            }
        });
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        // Fixed camera - no movement
        this.renderer.render(this.scene, this.camera);
    }
    
    hideLoadingScreen() {
        const progress = this.loadingScreen.querySelector('.loading-progress');
        let progressValue = 0;
        
        const interval = setInterval(() => {
            progressValue += 10;
            progress.value = progressValue;
            
            if (progressValue >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        this.loadingScreen.style.display = 'none';
                    }, 500);
                }, 300);
            }
        }, 50);
    }
    
    checkPerformance() {
        const isLowPowerDevice = 
            navigator.hardwareConcurrency < 4 || 
            (navigator.deviceMemory && navigator.deviceMemory < 4);
        
        if (isLowPowerDevice) {
            setTimeout(() => {
                this.performanceWarning.style.display = 'flex';
            }, 2000);
        }
    }
    
    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
        
        setTimeout(() => {
            this.errorDisplay.style.display = 'none';
        }, 5000);
    }
    
    cleanup() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simulation = new VerticalProjectileSimulation();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Dismiss performance warning
    document.getElementById('dismiss-warning')?.addEventListener('click', function() {
        this.parentElement.style.display = 'none';
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.simulation) {
        window.simulation.cleanup();
    }
});
