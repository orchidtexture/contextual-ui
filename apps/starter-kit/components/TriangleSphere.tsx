'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SphereMeshProps {
  count?: number;
  radius?: number;
}

function SphereMesh({ count = 900, radius = 1.85 }: SphereMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const spinSpeedRef = useRef(0.2);

  // Reusable dummy object to calculate matrix transformations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Calculate uniform positions on a sphere using the Golden Ratio (Fibonacci sphere)
  const particles = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle (~2.3999 rad)
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y: 1 to -1
      const r = Math.sqrt(Math.max(0, 1 - y * y)); // radius at y
      const theta = phi * i;

      points.push(
        new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
      );
    }
    return points;
  }, [count]);

  // Apply positions, rotations, and color variations to each triangle instance
  const initialized = useRef(false);
  useFrame(() => {
    if (initialized.current || !meshRef.current) return;

    const palette = [
      new THREE.Color('#4fabf0'), // Primary brand accent
      new THREE.Color('#38bdf8'), // Sky blue
      new THREE.Color('#60a5fa'), // Blue
      new THREE.Color('#818cf8'), // Indigo accent
      new THREE.Color('#0284c7'), // Deep cyan
      new THREE.Color('#e0f2fe'), // Bright highlight
    ];

    particles.forEach((pos, i) => {
      dummy.position.copy(pos).multiplyScalar(radius);
      dummy.lookAt(0, 0, 0); // Point triangles toward center
      dummy.rotateX(Math.PI / 2); // Lay flat on the sphere tangent surface
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color variation across the sphere surface
      const colorIndex = (i + Math.floor((pos.y + 1) * 2.5)) % palette.length;
      meshRef.current.setColorAt(i, palette[Math.abs(colorIndex)]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    initialized.current = true;
  });

  // Smooth frame loop for rotation and mouse responsiveness
  useFrame((state, delta) => {
    // Constant auto-rotation + impulse decay
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * spinSpeedRef.current;
      spinSpeedRef.current = THREE.MathUtils.damp(spinSpeedRef.current, 0.25, 1.8, delta);
    }

    // Interactive pointer sway on the group wrapper (bounded to prevent edge overflow)
    if (groupRef.current) {
      const targetX = -state.pointer.y * 0.35;
      const targetY = state.pointer.x * 0.4;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        4,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetY,
        4,
        delta
      );
    }
  });

  const handleClick = () => {
    // Impulse spin on user click
    spinSpeedRef.current += 3.0;
  };

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        onClick={handleClick}
        onPointerOver={() => {
          if (typeof document !== 'undefined') {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') {
            document.body.style.cursor = 'auto';
          }
        }}
      >
        {/* A 3-sided cone geometry forms a flat triangle shape */}
        <coneGeometry args={[0.055, 0.007, 3]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// Inner subtle wireframe sphere to give depth and graph-like topology
function InnerGraphCore({ radius = 1.66 }: { radius?: number }) {
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.12;
      coreRef.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[radius, 14, 14]} />
      <meshBasicMaterial
        wireframe
        color="#4fabf0"
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

// Subtle orbital ring
function OrbitalRing({ radius = 2.25 }: { radius?: number }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
      ringRef.current.rotation.x = Math.sin(delta * 0.2) * 0.1 + 0.3;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[0.4, 0.2, 0]}>
      <ringGeometry args={[radius, radius + 0.012, 64]} />
      <meshBasicMaterial
        color="#4fabf0"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Automatically adjusts camera distance on narrow or portrait viewports to prevent side cropping
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const baseDistance = 6.8;

    if (aspect < 1) {
      // Pull back proportionally so sphere is never cut off horizontally
      camera.position.z = baseDistance / Math.max(aspect, 0.5);
    } else {
      camera.position.z = baseDistance;
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export interface TriangleSphereProps {
  className?: string;
  count?: number;
  radius?: number;
}

export function TriangleSphere({
  className = 'w-full h-full min-h-[340px]',
  count = 900,
  radius = 1.85,
}: TriangleSphereProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="w-full h-full overflow-visible"
      >
        <ResponsiveCamera />
        <ambientLight intensity={0.5} />
        <SphereMesh count={count} radius={radius} />
        <InnerGraphCore radius={radius * 0.9} />
        <OrbitalRing radius={radius * 1.2} />
      </Canvas>
    </div>
  );
}

export default TriangleSphere;
