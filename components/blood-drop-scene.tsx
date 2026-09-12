'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export function BloodDropScene() {
  return <div className="relative aspect-[1.75] min-h-[320px] w-full">
    <Canvas camera={{ position: [0, 0.2, 5.2], fov: 34 }} dpr={[1, 1.15]} frameloop="always" gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={["#101d2d"]} />
      <ambientLight intensity={1.2} color="#ffd9dc" />
      <directionalLight position={[3, 4, 4]} intensity={2.2} color="#fff1f2" />
      <pointLight position={[-3, 0, 2]} intensity={3.5} color="#c52f4b" />
      <BloodDrop />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.8} enableDamping dampingFactor={0.08} />
    </Canvas>
    <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffbec8]">Live reaction model</p><p className="mt-1 text-xs text-[#b4c3d3]">Tap, drag, or watch the drop rotate</p></div>
  </div>
}

function BloodDrop() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => { if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.35 })
  return <group ref={group} position={[0, 0.25, 0]}>
    <mesh position={[0, -0.25, 0]} scale={[0.9, 1.05, 0.9]}>
      <sphereGeometry args={[0.9, 24, 24]} />
      <meshPhysicalMaterial color="#b51f3b" roughness={0.16} metalness={0.08} clearcoat={0.55} clearcoatRoughness={0.12} transmission={0.04} />
    </mesh>
    <mesh position={[0, 1.02, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.58, 1.5, 24]} />
      <meshPhysicalMaterial color="#b51f3b" roughness={0.16} metalness={0.08} clearcoat={0.55} clearcoatRoughness={0.12} transmission={0.04} />
    </mesh>
    <mesh position={[-0.3, 0.15, 0.77]} rotation={[0.2, 0, -0.25]}>
      <sphereGeometry args={[0.17, 12, 12]} />
      <meshBasicMaterial color="#ffd9df" transparent opacity={0.82} />
    </mesh>
    {[[-1.55, 0.9, -0.2], [1.45, -0.15, -0.4], [1.65, 1.15, 0.2], [-1.4, -1.1, 0.1]].map(([x, y, z], index) => <DropletParticle key={index} position={[x, y, z]} delay={index * 0.8} />)}
  </group>
}

function DropletParticle({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5 + delay) * 0.16 })
  return <mesh ref={ref} position={position} scale={0.13}>
    <sphereGeometry args={[1, 12, 12]} />
    <meshStandardMaterial color="#ed536a" emissive="#7d1127" emissiveIntensity={0.7} />
  </mesh>
}
