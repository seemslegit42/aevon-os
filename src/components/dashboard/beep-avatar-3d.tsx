
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Analyser } from '@/lib/analyser';
import { vs as backdropVS, fs as backdropFS } from '@/lib/shaders/beep-3d-backdrop-shaders.glsl';
import { vs as sphereVS } from '@/lib/shaders/beep-3d-sphere-vertex.glsl';

interface BeepAvatar3DProps {
  inputNode: AudioNode | null;
  outputNode: AudioNode | null;
  isThinking: boolean;
}

const BeepAvatar3D: React.FC<BeepAvatar3DProps> = ({ inputNode, outputNode, isThinking }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || !inputNode || !outputNode) return;

    // To prevent multiple renderers from being created
    if (rendererRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100c14);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Analysers
    const inputAnalyser = new Analyser(inputNode);
    const outputAnalyser = new Analyser(outputNode);

    // Backdrop
    const backdrop = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 5),
      new THREE.RawShaderMaterial({
        uniforms: {
          resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
          rand: { value: 0 },
        },
        vertexShader: backdropVS,
        fragmentShader: backdropFS,
        side: THREE.BackSide,
      })
    );
    scene.add(backdrop);
    
    // Sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1.5, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, // A light blue color
      metalness: 0.1,
      roughness: 0.5,
      emissive: 0x4169E1, // Royal blue emissive
      emissiveIntensity: 0.5
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
    const pointLight1 = new THREE.PointLight(0x6a0dad, 2, 10); // Purple
    pointLight1.position.set(-3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00BFFF, 2, 10); // Deep Sky Blue
    pointLight2.position.set(3, -3, 3);
    scene.add(pointLight2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), 1.2, 0.6, 0.8);
    composer.addPass(bloomPass);

    // Animation loop
    let prevTime = performance.now();
    const rotation = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);

      const t = performance.now();
      const dt = (t - prevTime) / (1000 / 60);
      prevTime = t;

      inputAnalyser.update();
      outputAnalyser.update();
      
      const inputAvg = inputAnalyser.data.reduce((a, b) => a + b) / inputAnalyser.data.length / 255;
      const outputAvg = outputAnalyser.data.reduce((a, b) => a + b) / outputAnalyser.data.length / 255;

      sphere.rotation.y += 0.001 + (outputAvg * 0.01);
      sphere.rotation.x += 0.0005 + (inputAvg * 0.005);
      
      if (shaderRef) {
        shaderRef.uniforms.time.value = t * 0.001;
        shaderRef.uniforms.inputData.value.set(
            inputAvg * 2,
            inputAnalyser.data[1] / 255 * 0.5,
            inputAnalyser.data[2] / 255 * 10,
            0
        );
        shaderRef.uniforms.outputData.value.set(
            outputAvg * 3,
            outputAnalyser.data[1] / 255 * 0.5,
            outputAnalyser.data[2] / 255 * 10,
            0
        );
      }
      
      (backdrop.material as THREE.ShaderMaterial).uniforms.rand.value = Math.random() * 1000;

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
