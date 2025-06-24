"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Analyser } from '@/lib/analyser';
import { vs, fs } from '@/lib/shaders/beep-3d-sphere-vertex.glsl';
import { cn } from '@/lib/utils';
import type { AvatarState } from '@/types/dashboard';
import { useAvatarPresetStore } from '@/stores/avatar-preset.store';

interface BeepAvatar3DProps {
  inputNode: AudioNode | null;
  outputNode: AudioNode | null;
  avatarState: AvatarState;
}

const stateToUniformMap: Record<AvatarState, number> = {
    idle: 0,
    listening: 1,
    speaking_neutral: 2,
    thinking: 3,
    tool_call: 4,
    security_alert: 5,
    speaking_helpful: 6,
    speaking_insightful: 7,
    speaking_cautious: 8,
};

const BeepAvatar3D: React.FC<BeepAvatar3DProps> = ({ inputNode, outputNode, avatarState }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activePreset = useAvatarPresetStore(state => state.getActivePreset());

  const uniformsRef = useRef({
      time: { value: 0.0 },
      inputData: { value: new THREE.Vector4(0, 0, 0, 0) },
      outputData: { value: new THREE.Vector4(0, 0, 0, 0) },
      uAvatarState: { value: stateToUniformMap.idle },
      // Preset uniforms
      uPointSize: { value: activePreset.particleSize },
      uMotionSpeed: { value: activePreset.motionSpeed },
      uNoiseStrength: { value: activePreset.noiseStrength },
      uColorIdle: { value: new THREE.Color(...activePreset.colors.idle) },
      uColorListening: { value: new THREE.Color(...activePreset.colors.listening) },
      uColorThinking: { value: new THREE.Color(...activePreset.colors.thinking) },
      uColorToolCall: { value: new THREE.Color(...activePreset.colors.tool_call) },
      uColorSecurity: { value: new THREE.Color(...activePreset.colors.security_alert) },
      uColorSpeakingNeutral: { value: new THREE.Color(...activePreset.colors.speaking_neutral) },
      uColorSpeakingHelpful: { value: new THREE.Color(...activePreset.colors.speaking_helpful) },
      uColorSpeakingInsightful: { value: new THREE.Color(...activePreset.colors.speaking_insightful) },
      uColorSpeakingCautious: { value: new THREE.Color(...activePreset.colors.speaking_cautious) },
  });

  useEffect(() => {
    uniformsRef.current.uAvatarState.value = stateToUniformMap[avatarState] ?? stateToUniformMap.idle;
  }, [avatarState]);

  useEffect(() => {
    // Update uniforms when preset changes
    uniformsRef.current.uPointSize.value = activePreset.particleSize;
    uniformsRef.current.uMotionSpeed.value = activePreset.motionSpeed;
    uniformsRef.current.uNoiseStrength.value = activePreset.noiseStrength;
    uniformsRef.current.uColorIdle.value.setRGB(...activePreset.colors.idle);
    uniformsRef.current.uColorListening.value.setRGB(...activePreset.colors.listening);
    uniformsRef.current.uColorThinking.value.setRGB(...activePreset.colors.thinking);
    uniformsRef.current.uColorToolCall.value.setRGB(...activePreset.colors.tool_call);
    uniformsRef.current.uColorSecurity.value.setRGB(...activePreset.colors.security_alert);
    uniformsRef.current.uColorSpeakingNeutral.value.setRGB(...activePreset.colors.speaking_neutral);
    uniformsRef.current.uColorSpeakingHelpful.value.setRGB(...activePreset.colors.speaking_helpful);
    uniformsRef.current.uColorSpeakingInsightful.value.setRGB(...activePreset.colors.speaking_insightful);
    uniformsRef.current.uColorSpeakingCautious.value.setRGB(...activePreset.colors.speaking_cautious);
  }, [activePreset]);

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
    
    const uniforms = uniformsRef.current;

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
