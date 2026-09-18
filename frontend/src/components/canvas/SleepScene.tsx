import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAudio } from '../../context/AudioContext';

const CelestialAcousticSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const { isShieldEngaged, isStandbyMode, telemetry, bluetoothState } = useAudio();

  // Color dynamics: Tranquil indigo in zero-sound standby, luminous cyan/rose when shield engages on a spike
  const sphereColor = useMemo(() => {
    if (bluetoothState === 'TIER_A_HARDWARE_LOCKED') {
      return '#06b6d4'; // Cyan for hardware ANC lock
    }
    if (isShieldEngaged) {
      return '#f43f5e'; // Reactive rose/crimson when dynamic speech shield activates
    }
    return '#6366f1'; // Deep serene indigo during zero-sound standby
  }, [isShieldEngaged, bluetoothState]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle rotation
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;

    // Scale dynamics: gentle breathing during silence, reactive pulse on decibel spike
    const normalizedDb = Math.max(0, (telemetry.currentDb - 35) / 40);
    const targetScale = isShieldEngaged
      ? 1.55 + normalizedDb * 0.4 + Math.sin(t * 4) * 0.08 // Fast reactive ripple on noise spike
      : 1.35 + Math.sin(t * 0.8) * 0.04; // Calm, meditative breathing during pure silence

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    if (materialRef.current) {
      const targetDistort = isShieldEngaged ? 0.45 + normalizedDb * 0.3 : 0.18;
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.08);
      materialRef.current.speed = isShieldEngaged ? 3.5 : 0.8;
      materialRef.current.emissiveIntensity = isShieldEngaged ? 0.6 : (isStandbyMode ? 0.15 : 0.3);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={sphereColor}
          emissive={sphereColor}
          roughness={0.25}
          metalness={0.85}
          distort={0.2}
          speed={1}
        />
      </mesh>
    </Float>
  );
};

export const SleepScene: React.FC = () => {
  const { isStandbyMode, isShieldEngaged, bluetoothState } = useAudio();

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#818cf8" />
        <pointLight position={[-10, -5, -5]} intensity={0.8} color="#06b6d4" />
        <Stars radius={40} depth={40} count={1000} factor={3} saturation={0.5} fade speed={0.8} />

        <CelestialAcousticSphere />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.8}
        />
      </Canvas>

      {/* Floating Status Badges */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-night-900/80 text-slate-200 border border-white/10 backdrop-blur-md shadow-lg">
          <span className={`w-2 h-2 rounded-full mr-2 ${
            isShieldEngaged ? 'bg-rose-500 animate-ping' :
            bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? 'bg-cyan-400' : 'bg-emerald-400 animate-pulse'
          }`} />
          {isShieldEngaged ? 'Dynamic Bandpass Active (Spike Masked)' :
           bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? 'Tier A Hardware ANC Locked' :
           isStandbyMode ? 'Zero-Sound Standby (Pure Silence)' : 'Acoustic Monitor Armed'}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none text-right">
        <p className="text-[11px] text-slate-400">Three.js Acoustic Resonance Shader</p>
      </div>
    </div>
  );
};