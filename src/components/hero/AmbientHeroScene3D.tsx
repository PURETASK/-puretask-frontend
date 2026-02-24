'use client';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useMemo, useRef, useEffect, useState } from 'react';

type Vec3 = [number, number, number];

const HOMES: { p: Vec3; s: Vec3; c: string }[] = [
  { p: [-1.6, 0.2, 0.4], s: [0.55, 0.55, 0.55], c: '#94A3B8' },
  { p: [-0.7, -0.1, 1.2], s: [0.62, 0.62, 0.62], c: '#4ADE80' },
  { p: [0.2, 0.3, 0.8], s: [0.48, 0.48, 0.48], c: '#94A3B8' },
  { p: [1.1, -0.2, 1.0], s: [0.58, 0.58, 0.58], c: '#4ADE80' },
  { p: [1.7, 0.25, 0.35], s: [0.5, 0.5, 0.5], c: '#94A3B8' },
];

function Homes() {
  return (
    <>
      {HOMES.map((h, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.07}
          floatIntensity={0.35}
          rotationIntensity={0.18}
        >
          <mesh position={h.p} scale={h.s}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={h.c}
              roughness={0.6}
              metalness={0.15}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

const SERVICE_NODES: Vec3[] = [
  [-1.0, 0.15, 1.8],
  [-0.2, -0.2, 1.7],
  [0.7, 0.1, 1.6],
  [1.4, -0.05, 1.5],
];

function ServiceNodes() {
  return (
    <>
      {SERVICE_NODES.map((p, i) => (
        <Float
          key={i}
          speed={1.0 + i * 0.05}
          floatIntensity={0.25}
          rotationIntensity={0}
        >
          <mesh position={p}>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshStandardMaterial
              color="#60A5FA"
              roughness={0.55}
              metalness={0.12}
              emissive="#60A5FA"
              emissiveIntensity={0.35}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function PathLinesSync() {
  const [geoms, setGeoms] = useState<THREE.BufferGeometry[]>([]);

  const curves = useMemo(() => {
    return [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.6, 0.2, 0.4),
        new THREE.Vector3(-1.0, 0.15, 1.8),
        new THREE.Vector3(-0.7, -0.1, 1.2),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, -0.1, 1.2),
        new THREE.Vector3(0.7, 0.1, 1.6),
        new THREE.Vector3(1.1, -0.2, 1.0),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.3, 0.8),
        new THREE.Vector3(1.4, -0.05, 1.5),
        new THREE.Vector3(1.7, 0.25, 0.35),
      ]),
    ];
  }, []);

  useEffect(() => {
    const created = curves.map((c) => new THREE.TubeGeometry(c, 64, 0.02, 8, false));
    setGeoms(created);
    return () => {
      created.forEach((g) => g.dispose());
    };
  }, [curves]);

  return (
    <>
      {geoms.map((geom, i) => (
        <mesh key={i} geometry={geom}>
          <meshStandardMaterial
            color="#22C55E"
            roughness={0.3}
            metalness={0}
            emissive="#22C55E"
            emissiveIntensity={0.55}
          />
        </mesh>
      ))}
    </>
  );
}

function ReliabilityAura() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.18;
  });

  return (
    <mesh ref={ring} position={[0, 0, 0.2]}>
      <torusGeometry args={[1.25, 0.035, 16, 72]} />
      <meshStandardMaterial
        color="#22C55E"
        roughness={0.25}
        metalness={0.05}
        emissive="#22C55E"
        emissiveIntensity={0.65}
      />
    </mesh>
  );
}

function CameraDrift() {
  const t = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion.current = mq.matches;
    const fn = () => {
      reduceMotion.current = mq.matches;
    };
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useFrame(({ camera }, dt) => {
    t.current += dt;
    if (reduceMotion.current) return;
    camera.position.x = Math.sin(t.current * 0.12) * 0.18;
    camera.position.y = 0.35 + Math.sin(t.current * 0.09) * 0.08;
    camera.lookAt(0, 0.05, 1.0);
  });
  return null;
}

export default function AmbientHeroScene3D() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.35, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0B0E14']} />

        <directionalLight intensity={1.1} position={[4, 5, 4]} />
        <pointLight intensity={0.75} position={[0, 0.6, 2]} color="#22C55E" />
        <directionalLight intensity={0.35} position={[-4, 2, -4]} />

        <CameraDrift />
        <Homes />
        <ServiceNodes />
        <PathLinesSync />
        <ReliabilityAura />
      </Canvas>
    </div>
  );
}
