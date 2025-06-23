
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Analyser } from '@/lib/analyser';
import { vs, fs } from '@/lib/shaders/beep-3d-sphere-vertex.glsl';
import { cn } from '@/lib/utils';

interface BeepAvatar3DProps {
  inputNode: AudioNode | null;
  outputNode: AudioNode | null;
}

const BeepAvatar3D: React.FC<BeepAvatar3DProps> = ({ inputNode, outputNode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || !inputNode || !outputNode) return;
    if (rendererRef.current) return; // Prevent re-initialization

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Analysers
    const inputAnalyser = new Analyser(inputNode);
    const outputAnalyser = new Analyser(outputNode);

    // Points material with custom shaders
    const uniforms = {
      time: { value: 0.0 },
      pointSize: { value: 3.5 },
      inputData: { value: new THREE.Vector4(0, 0, 0, 0) },
      outputData: { value: new THREE.Vector4(0, 0, 0, 0) },
    };

    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    // Points geometry
    const pointsGeometry = new THREE.IcosahedronGeometry(1.5, 128);
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Glass-like ring behind the orb
    const ringGeometry = new THREE.RingGeometry(2.1, 2.2, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -0.1;
    scene.add(ring);
    
    // Post-processing for glow effect
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight),
        1.2, // strength
        1.0, // radius
        0.5  // threshold
    );
    composer.addPass(bloomPass);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      inputAnalyser.update();
      outputAnalyser.update();

      const inputAvg = inputAnalyser.data.reduce((a, b) => a + b, 0) / inputAnalyser.data.length / 255;
      const outputAvg = outputAnalyser.data.reduce((a, b) => a + b, 0) / outputAnalyser.data.length / 255;
      
      points.rotation.y = elapsedTime * 0.05;

      uniforms.time.value = elapsedTime;
      uniforms.inputData.value.set(
        inputAvg,
        inputAnalyser.data[5] / 255, 
        inputAnalyser.data[10] / 255,
        0
      );
      uniforms.outputData.value.set(
        outputAvg,
        outputAnalyser.data[5] / 255,
        outputAnalyser.data[10] / 255,
        0
      );

      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const { clientWidth, clientHeight } = currentMount;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      composer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [inputNode, outputNode]);

  return <div ref={mountRef} className={cn("w-full h-full", "bg-avatar-nebula")} />;
};

export default BeepAvatar3D;
