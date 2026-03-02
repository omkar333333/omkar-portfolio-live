document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0015); // Pure black deep space fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a circular glowing texture for stars
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    // Intense bright center, smooth fade to transparent
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.1, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(canvas);

    // Completely White, Yellow, and Blue stars as requested!
    const starColors = [
        new THREE.Color(0xffffff), // Pure White
        new THREE.Color(0xffffff), // Pure White (more frequent)
        new THREE.Color(0x88c0ff), // Glowing Blue
        new THREE.Color(0x4f74ff), // Deep Glowing Blue
        new THREE.Color(0xffe082), // Glowing Yellow
        new THREE.Color(0xffca28)  // Deep Yellow/Gold
    ];

    // Create Particles (Stars)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 800 : 3000; // More stars for space feel

    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);

    // Store original positions for subtle drifting
    const driftData = [];

    for (let i = 0; i < particlesCount; i++) {
        // Distribute stars in a large sphere around the camera
        const radius = Math.random() * 80 + 10; // Further away
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi) - 20; // offset back deeper

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        // Choose random realistic star color
        // Bias towards white/light blue (first few colors in the array)
        let colorIndex = Math.floor(Math.pow(Math.random(), 2) * starColors.length);
        if (colorIndex >= starColors.length) colorIndex = starColors.length - 1;
        const color = starColors[colorIndex];

        colorsArray[i * 3] = color.r;
        colorsArray[i * 3 + 1] = color.g;
        colorsArray[i * 3 + 2] = color.b;

        // Vary sizes significantly - many small stars, few large glowing ones
        // Base size is smaller, multiplier creates occasional large bright stars
        sizesArray[i] = (Math.random() * 0.8 + 0.2) * (Math.random() > 0.95 ? 3.0 : 1.0);

        // Very slow, subtle drift
        driftData.push({
            vx: (Math.random() - 0.5) * 0.005,
            vy: (Math.random() - 0.5) * 0.005,
            vz: (Math.random() - 0.5) * 0.005,
            startX: x, startY: y, startZ: z,
            range: Math.random() * 1.5 + 0.5
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

    // Custom shader material to allow per-particle sizes and glowing colors
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: starTexture }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // === Cosmic Entities (Suns and Black Holes) === //
    const celestialBodies = [];

    function createSun(x, y, z, size, colorHex) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Core
        const coreGeo = new THREE.SphereGeometry(size * 0.2, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // Glow (Sprite)
        const glowMat = new THREE.SpriteMaterial({
            map: starTexture,
            color: colorHex,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });
        const glow = new THREE.Sprite(glowMat);
        glow.scale.set(size * 3, size * 3, 1);
        group.add(glow);

        // Ambient outer glow
        const outerGlow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: starTexture,
            color: colorHex,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        }));
        outerGlow.scale.set(size * 6, size * 6, 1);
        group.add(outerGlow);

        particlesMesh.add(group);
        return { type: 'sun', object: group };
    }

    function createBlackHole(x, y, z, size) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Core (Singularity)
        const coreGeo = new THREE.SphereGeometry(size, 64, 64);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);

        // Event Horizon Glow (slight bright edge)
        const horizonGeo = new THREE.SphereGeometry(size * 1.05, 32, 32);
        const horizonMat = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
        group.add(horizonMesh);

        // Accretion Disk particles
        const particleGeo = new THREE.BufferGeometry();
        const diskParticles = 6000;
        const posArray = new Float32Array(diskParticles * 3);
        const colorArray = new Float32Array(diskParticles * 3);
        const sizeArray = new Float32Array(diskParticles);

        const color1 = new THREE.Color(0xff3300); // fiery inner
        const color2 = new THREE.Color(0xaa88ff); // purplish/blue outer

        for (let i = 0; i < diskParticles; i++) {
            const theta = Math.random() * Math.PI * 2;
            const rRatio = Math.pow(Math.random(), 2);
            const r = size * 1.2 + rRatio * size * 3.5;

            posArray[i * 3] = r * Math.cos(theta);
            posArray[i * 3 + 1] = (Math.random() - 0.5) * size * 0.1; // flat disk
            posArray[i * 3 + 2] = r * Math.sin(theta);

            const mixColor = color1.clone().lerp(color2, rRatio);
            colorArray[i * 3] = mixColor.r;
            colorArray[i * 3 + 1] = mixColor.g;
            colorArray[i * 3 + 2] = mixColor.b;

            sizeArray[i] = (Math.random() * 1.5 + 0.5) * (rRatio < 0.2 ? 2 : 1);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

        const diskMat = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: starTexture }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const disk = new THREE.Points(particleGeo, diskMat);
        disk.rotation.x = Math.PI / 2 + 0.3; // tilted disk
        disk.rotation.y = 0.2;
        group.add(disk);

        group.userData.disk = disk;

        particlesMesh.add(group);
        return { type: 'blackhole', object: group };
    }

    // Add 2 Suns and 1 Black Hole gracefully separated
    celestialBodies.push(createSun(-25, 12, -45, 8, 0x4488ff)); // Blue Giant
    celestialBodies.push(createSun(30, -15, -50, 6, 0xff8833)); // Orange Sun
    celestialBodies.push(createBlackHole(-10, -5, -25, 4.0)); // Black Hole
    // =========================================== //

    camera.position.z = 5;

    // Mouse interaction for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        material.uniforms.time.value = elapsedTime;

        // Parallax mouse effect
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.0001; // extremely slow base spin
        particlesMesh.rotation.x += (+targetY - particlesMesh.rotation.x) * 0.03;
        particlesMesh.rotation.y += (+targetX - particlesMesh.rotation.y) * 0.03;

        // Smooth individual particle drifting
        const positions = particlesGeometry.attributes.position.array;

        for (let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;
            const data = driftData[i];

            positions[ix] += data.vx;
            positions[iy] += data.vy;
            positions[iz] += data.vz;

            // Bounce back if they drift too far from start
            if (Math.abs(positions[ix] - data.startX) > data.range) data.vx *= -1;
            if (Math.abs(positions[iy] - data.startY) > data.range) data.vy *= -1;
            if (Math.abs(positions[iz] - data.startZ) > data.range) data.vz *= -1;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Update celestial bodies animations
        celestialBodies.forEach(body => {
            if (body.type === 'blackhole') {
                body.object.userData.disk.rotation.z -= 0.005; // Spin the disk
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
