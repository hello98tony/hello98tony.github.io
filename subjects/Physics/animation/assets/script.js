// Projectile Motion Visualizer - Simulation Engine
class ProjectileSimulation {
    constructor() {
        // DOM Elements
        this.container = document.getElementById('container');
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorDisplay = document.getElementById('error-display');
        
        // Three.js Components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Simulation Objects
        this.projectile = null;
        this.trajectoryLine = null;
        this.ground = null;
        this.grid = null;
        this.axesHelper = null;
        
        // Physics Parameters
        this.velocity = 20;
        this.angle = 45;
        this.gravity = 9.8;
        this.initialHeight = 0;
        
        // Simulation State
        this.isSimulating = false;
        this.simulationTime = 0;
        this.vx = 0;
        this.vy = 0;
        
        // Statistics
        this.maxHeight = 0;
        this.flightRange = 0;
        this.flightTime = 0;
        this.impactVelocity = 0;
        
        // Animation
        this.animationId = null;
        
        // Initialize
        this.init();
    }
    
    // Initialize the simulation
    async init() {
        try {
            // Setup Three.js
            this.setupThreeJS();
            
            // Create scene objects
            this.createGround();
            this.createGrid();
            this.createAxes();
            this.createProjectile();
            this.createTrajectoryLine();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            this.initUI();
            
            // Calculate initial stats
            this.calculateStats();
            this.updateTrajectoryLine();
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
            
            // Start animation loop
            this.animate();
            
        } catch (error) {
            this.showError('Failed to initialize simulation: ' + error.message);
        }
    }
    
    // Setup Three.js components
    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a20);
        this.scene.fog = new THREE.Fog(0x0a0a20, 10, 100);
        
        // Camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 15, 40);
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
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Add some point lights for better visualization
        const pointLight1 = new THREE.PointLight(0x00aaff, 0.5, 100);
        pointLight1.position.set(-20, 10, -10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff00aa, 0.5, 100);
        pointLight2.position.set(20, 10, 10);
        this.scene.add(pointLight2);
    }
    
    // Create ground plane
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a2e,
            side: THREE.DoubleSide,
            roughness: 0.9,
            metalness: 0.1,
            wireframe: false
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.01;
        this.ground.receiveShadow = true;
        
        this.scene.add(this.ground);
        
        // Add grid texture
        const gridTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(100,100,150,0.3)" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
        `));
        
        groundMaterial.map = gridTexture;
        groundMaterial.needsUpdate = true;
    }
    
    // Create grid helper
    createGrid() {
        this.grid = new THREE.GridHelper(200, 20, 0x555555, 0x333333);
        this.grid.position.y = 0.01;
        this.scene.add(this.grid);
    }
    
    // Create axes helper
    createAxes() {
        this.axesHelper = new THREE.AxesHelper(15);
        this.axesHelper.position.y = 0.02;
        this.scene.add(this.axesHelper);
    }
    
    // Create projectile
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
    
    // Create trajectory line
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
    
    // Update trajectory line based on current parameters
    updateTrajectoryLine() {
        if (!this.trajectoryLine) return;
        
        const points = [];
        const steps = 100;
        const angleRad = this.angle * Math.PI / 180;
        
        // Calculate time of flight
        const t_flight = (this.velocity * Math.sin(angleRad) + 
                        Math.sqrt(Math.pow(this.velocity * Math.sin(angleRad), 2) + 
                                2 * this.gravity * this.initialHeight)) / this.gravity;
        
        if (t_flight <= 0) return;
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * t_flight;
            const x = this.velocity * Math.cos(angleRad) * t;
            const y = this.initialHeight + this.velocity * Math.sin(angleRad) * t - 
                     0.5 * this.gravity * t * t;
            
            if (y >= -0.1) {
                points.push(new THREE.Vector3(x, y, 0));
            }
        }
        
        this.trajectoryLine.geometry.setFromPoints(points);
    }
    
    // Calculate projectile statistics
    calculateStats() {
        const angleRad = this.angle * Math.PI / 180;
        
        // Time to reach max height
        const t_max = this.velocity * Math.sin(angleRad) / this.gravity;
        
        // Max height
        this.maxHeight = this.initialHeight + 
                        this.velocity * Math.sin(angleRad) * t_max - 
                        0.5 * this.gravity * t_max * t_max;
        
        // Total flight time
        this.flightTime = (this.velocity * Math.sin(angleRad) + 
                          Math.sqrt(Math.pow(this.velocity * Math.sin(angleRad), 2) + 
                                  2 * this.gravity * this.initialHeight)) / this.gravity;
        
        // Range
        this.flightRange = this.velocity * Math.cos(angleRad) * this.flightTime;
        
        // Impact velocity
        const vx_final = this.velocity * Math.cos(angleRad);
        const vy_final = this.velocity * Math.sin(angleRad) - this.gravity * this.flightTime;
        this.impactVelocity = Math.sqrt(vx_final * vx_final + vy_final * vy_final);
        
        // Update UI
        this.updateStatsUI();
    }
    
    // Update statistics in UI
    updateStatsUI() {
        document.getElementById('maxHeight').textContent = 
            this.maxHeight >= 0 ? this.maxHeight.toFixed(2) + ' m' : '-';
        document.getElementById('range').textContent = 
            this.flightRange >= 0 ? this.flightRange.toFixed(2) + ' m' : '-';
        document.getElementById('flightTime').textContent = 
            this.flightTime >= 0 ? this.flightTime.toFixed(2) + ' s' : '-';
        document.getElementById('impactVelocity').textContent = 
            this.impactVelocity >= 0 ? this.impactVelocity.toFixed(2) + ' m/s' : '-';
    }
    
    // Launch projectile
    launchProjectile() {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        this.simulationTime = 0;
        
        const angleRad = this.angle * Math.PI / 180;
        this.vx = this.velocity * Math.cos(angleRad);
        this.vy = this.velocity * Math.sin(angleRad);
        
        // Calculate stats
        this.calculateStats();
        
        // Reset projectile position
        this.projectile.position.set(0, this.initialHeight, 0);
        
        // Start simulation animation
        this.animateProjectile();
    }
    
    // Reset simulation
    resetSimulation() {
        this.isSimulating = false;
        this.simulationTime = 0;
        
        // Reset projectile position
        this.projectile.position.set(0, this.initialHeight, 0);
        
        // Clear stats
        document.getElementById('maxHeight').textContent = '-';
        document.getElementById('range').textContent = '-';
        document.getElementById('flightTime').textContent = '-';
        document.getElementById('impactVelocity').textContent = '-';
        
        // Update trajectory line
        this.updateTrajectoryLine();
    }
    
    // Toggle grid visibility
    toggleGrid() {
        if (this.grid) this.grid.visible = !this.grid.visible;
        if (this.axesHelper) this.axesHelper.visible = !this.axesHelper.visible;
    }
    
    // Toggle trajectory visibility
    toggleTrajectory() {
        if (this.trajectoryLine) this.trajectoryLine.visible = !this.trajectoryLine.visible;
    }
    
    // Animate projectile
    animateProjectile() {
        if (!this.isSimulating) return;
        
        // Update time
        this.simulationTime += 0.016;
        
        // Calculate new position
        const x = this.vx * this.simulationTime;
        const y = this.initialHeight + this.vy * this.simulationTime - 
                  0.5 * this.gravity * this.simulationTime * this.simulationTime;
        
        // Update projectile position
        this.projectile.position.set(x, Math.max(y, 0), 0);
        
        // Add subtle rotation
        this.projectile.rotation.x += 0.1;
        this.projectile.rotation.y += 0.05;
        
        // Check if projectile hit the ground
        if (y <= 0) {
            this.isSimulating = false;
            this.projectile.position.set(x, 0, 0);
            return;
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animateProjectile());
    }
    
    // Setup event listeners
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Slider events
        document.getElementById('velocitySlider').addEventListener('input', (e) => {
            this.velocity = parseFloat(e.target.value);
            document.getElementById('velocityValue').textContent = this.velocity + ' m/s';
            this.updateTrajectoryLine();
            this.calculateStats();
        });
        
        document.getElementById('angleSlider').addEventListener('input', (e) => {
            this.angle = parseFloat(e.target.value);
            document.getElementById('angleValue').textContent = this.angle + '°';
            this.updateTrajectoryLine();
            this.calculateStats();
        });
        
        document.getElementById('gravitySlider').addEventListener('input', (e) => {
            this.gravity = parseFloat(e.target.value);
            document.getElementById('gravityValue').textContent = this.gravity + ' m/s²';
            this.updateTrajectoryLine();
            this.calculateStats();
        });
        
        document.getElementById('heightSlider').addEventListener('input', (e) => {
            this.initialHeight = parseFloat(e.target.value);
            document.getElementById('heightValue').textContent = this.initialHeight + ' m';
            this.projectile.position.y = this.initialHeight;
            this.updateTrajectoryLine();
            this.calculateStats();
        });
        
        // Button events
        document.getElementById('launchBtn').addEventListener('click', () => this.launchProjectile());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());
        document.getElementById('toggleGridBtn').addEventListener('click', () => this.toggleGrid());
        document.getElementById('toggleTrajectoryBtn').addEventListener('click', () => this.toggleTrajectory());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.launchProjectile();
                    break;
                case 'r':
                case 'R':
                    this.resetSimulation();
                    break;
                case 'g':
                case 'G':
                    this.toggleGrid();
                    break;
                case 't':
                case 'T':
                    this.toggleTrajectory();
                    break;
            }
        });
    }
    
    // Initialize UI
    initUI() {
        // Update initial values
        document.getElementById('velocityValue').textContent = this.velocity + ' m/s';
        document.getElementById('angleValue').textContent = this.angle + '°';
        document.getElementById('gravityValue').textContent = this.gravity + ' m/s²';
        document.getElementById('heightValue').textContent = this.initialHeight + ' m';
    }
    
    // Handle window resize
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    // Main animation loop
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Smooth camera movement
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.sin(time * 0.3) * 20;
        this.camera.position.z = 30 + Math.cos(time * 0.2) * 10;
        this.camera.lookAt(0, 5, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Show error message
    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.classList.remove('error-hidden');
        
        setTimeout(() => {
            this.errorDisplay.classList.add('error-hidden');
        }, 5000);
    }
    
    // Clean up resources
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.simulation = new ProjectileSimulation();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.simulation) {
        window.simulation.dispose();
    }
});
