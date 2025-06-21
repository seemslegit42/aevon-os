
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Analyser } from '@/lib/analyser';
import { vs as sphereVS } from '@/lib/shaders/beep-3d-sphere-vertex.glsl';

interface BeepAvatar3DProps {
  inputNode: AudioNode | null;
  outputNode: AudioNode | null;
}

const BeepAvatar3D: React.FC<BeepAvatar3DProps> = ({ inputNode, outputNode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || !inputNode || !outputNode) return;

    // To prevent multiple renderers from being created
    if (rendererRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Analysers
    const inputAnalyser = new Analyser(inputNode);
    const outputAnalyser = new Analyser(outputNode);
    
    // Sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1.5, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, // Light Sky Blue
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x6f00ff, // A vibrant purple
      emissiveIntensity: 0.8
    });

    let shaderRef: THREE.Shader | null = null;
    sphereMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.inputData = { value: new THREE.Vector4(0,0,0,0) };
      shader.uniforms.outputData = { value: new THREE.Vector4(0,0,0,0) };
      shader.vertexShader = sphereVS;
      shaderRef = shader;
    };
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Lights
    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 12); // Cyan
    pointLight1.position.set(-4, 4, 4);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 3, 12); // Magenta
    pointLight2.position.set(4, -4, 4);
    scene.add(pointLight2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // Adjusted bloom pass for a stronger, more refined glow
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      inputAnalyser.update();
      outputAnalyser.update();
      
      const inputAvg = inputAnalyser.data.reduce((a, b) => a + b) / inputAnalyser.data.length / 255;
      const outputAvg = outputAnalyser.data.reduce((a, b) => a + b) / outputAnalyser.data.length / 255;

      sphere.rotation.y += 0.0015 + (outputAvg * 0.008);
      sphere.rotation.x += 0.0008 + (inputAvg * 0.004);
      
      if (shaderRef) {
        shaderRef.uniforms.time.value = elapsedTime;
        shaderRef.uniforms.inputData.value.set(
            inputAvg * 2.5,
            inputAnalyser.data[1] / 255 * 0.6,
            inputAnalyser.data[2] / 255 * 12,
            0
        );
        shaderRef.uniforms.outputData.value.set(
            outputAvg * 3.5,
            outputAnalyser.data[1] / 255 * 0.6,
            outputAnalyser.data[2] / 255 * 12,
            0
        );
      }

      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [inputNode, outputNode]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default BeepAvatar3D;
