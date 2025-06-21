
"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass';
import { fs as backdropFS, vs as backdropVS } from '@/lib/shaders/beep-avatar-backdrop-shader';
import { vs as sphereVS } from '@/lib/shaders/beep-avatar-sphere-shader';

interface BeepAvatarProps {
    isThinking: boolean;
}

const BeepAvatar: React.FC<BeepAvatarProps> = ({ isThinking }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        isThinking: false,
        renderer: null as THREE.WebGLRenderer | null,
        camera: null as THREE.PerspectiveCamera | null,
        sphereMaterial: null as THREE.MeshStandardMaterial | null,
    }).current;

    useEffect(() => {
        stateRef.isThinking = isThinking;
    }, [isThinking, stateRef]);

    useEffect(() => {
        if (!mountRef.current) return;

        let animationFrameId: number;
        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x100c14);

        // Camera
        stateRef.camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        stateRef.camera.position.z = 4;
        
        // Renderer
        stateRef.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        stateRef.renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        stateRef.renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(stateRef.renderer.domElement);

        // Backdrop
        const backdrop = new THREE.Mesh(
            new THREE.IcosahedronGeometry(10, 5),
            new THREE.RawShaderMaterial({
                uniforms: {
                    resolution: { value: new THREE.Vector2(1, 1) },
                    rand: { value: 0 },
                },
                vertexShader: backdropVS,
                fragmentShader: backdropFS,
                glslVersion: THREE.GLSL3,
                side: THREE.BackSide,
            })
        );
        scene.add(backdrop);

        // Sphere
        const sphereGeometry = new THREE.IcosahedronGeometry(1, 10);
        stateRef.sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x000010,
            metalness: 0.5,
            roughness: 0.1,
            emissive: 0x000010,
            emissiveIntensity: 1.5,
        });

        stateRef.sphereMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.uniforms.inputData = { value: new THREE.Vector4() };
            shader.uniforms.outputData = { value: new THREE.Vector4() };
            stateRef.sphereMaterial!.userData.shader = shader;
            shader.vertexShader = sphereVS;
        };

        const sphere = new THREE.Mesh(sphereGeometry, stateRef.sphereMaterial);
        scene.add(sphere);

        // Post-processing
        const composer = new EffectComposer(stateRef.renderer);
        composer.addPass(new RenderPass(scene, stateRef.camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 1.0;
        bloomPass.radius = 0.5;
        composer.addPass(bloomPass);

        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();
            
            if (stateRef.sphereMaterial?.userData.shader) {
                const shader = stateRef.sphereMaterial.userData.shader;
                shader.uniforms.time.value = elapsedTime;
                
                if (stateRef.isThinking) {
                    // More dynamic "thinking" animation inspired by audio visualization
                    const time = elapsedTime * 3.0;
                    const pulse1 = Math.sin(time) * 0.5 + 0.5; // Fast pulse
                    const pulse2 = Math.sin(elapsedTime * 0.8) * 0.5 + 0.5; // Slow wave
                    
                    const inputVal1 = (Math.sin(elapsedTime * 5.0) * 0.5 + 0.5) * 0.1;
                    const inputVal2 = (Math.cos(elapsedTime * 3.5) * 0.5 + 0.5) * 0.05;
                    
                    shader.uniforms.inputData.value.set(inputVal1, inputVal2, inputVal1 * 10, 0);
                    
                    const outputVal1 = (0.2 + pulse1 * 0.3) * pulse2;
                    const outputVal2 = (0.05 + pulse2 * 0.1) * pulse1;

                    shader.uniforms.outputData.value.set(outputVal1 * 2, outputVal2, outputVal1 * 10, 0);
                    
                    sphere.rotation.y += 0.002;
                    sphere.rotation.x += 0.001 * Math.sin(elapsedTime * 0.5);

                } else {
                    // Gentle breathing when idle
                    const breath = Math.sin(elapsedTime * 0.5) * 0.5 + 0.5;
                    const outputVal = 0.1 + breath * 0.1;

                    shader.uniforms.inputData.value.set(0.1, 0.1 * 0.1, 0.1 * 10, 0); // Reset input
                    shader.uniforms.outputData.value.set(outputVal * 2, outputVal * 0.1, outputVal * 10, 0);
                    
                    sphere.rotation.y += 0.001;
                    sphere.rotation.x *= 0.95; // Dampen x rotation to settle
                }
            }
            
            composer.render();
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (currentMount && stateRef.renderer && stateRef.camera) {
                const width = currentMount.clientWidth;
                const height = currentMount.clientHeight;
                stateRef.renderer.setSize(width, height);
                stateRef.camera.aspect = width / height;
                stateRef.camera.updateProjectionMatrix();
                composer.setSize(width, height);
                (backdrop.material as THREE.RawShaderMaterial).uniforms.resolution.value.set(width * window.devicePixelRatio, height * window.devicePixelRatio);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (stateRef.renderer) {
                currentMount.removeChild(stateRef.renderer.domElement);
                stateRef.renderer.dispose();
            }
            scene.remove(sphere);
            sphereGeometry.dispose();
            stateRef.sphereMaterial?.dispose();
        };
    }, [stateRef]);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default BeepAvatar;
