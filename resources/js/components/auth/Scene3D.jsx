import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 800 }) {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 80;
            const speed = 0.005 + Math.random() * 0.01;
            const xFactor = -30 + Math.random() * 60;
            const yFactor = -30 + Math.random() * 60;
            const zFactor = -30 + Math.random() * 60;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s * 0.5 + 0.5, s * 0.5 + 0.5, s * 0.5 + 0.5);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
        </instancedMesh>
    );
}

function FloatingOrb({ position, color, scale, speed }) {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.x = state.clock.elapsedTime * speed;
        mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            <mesh ref={mesh} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>
        </Float>
    );
}

function DistortedBlob({ position, scale, color }) {
    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
            <Sphere position={position} args={[1, 64, 64]} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.08}
                />
            </Sphere>
        </Float>
    );
}

function RotatingRing({ position, radius, color }) {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    });

    return (
        <mesh ref={mesh} position={position} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
    );
}

function GoldenRing({ position }) {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
    });

    return (
        <mesh ref={mesh} position={position}>
            <torusGeometry args={[3, 0.015, 8, 100]} />
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} transparent opacity={0.4} />
        </mesh>
    );
}

function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B8860B" />
            <pointLight position={[0, 0, 5]} intensity={0.3} color="#D4AF37" />
            <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={0.5} color="#D4AF37" />
        </>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
            >
                <color attach="background" args={['#0A0908']} />
                <fog attach="fog" args={['#0A0908', 10, 40]} />

                <SceneLights />

                <ParticleField count={600} />

                <FloatingOrb position={[-5, 3, -3]} color="#D4AF37" scale={[0.6, 0.6, 0.6]} speed={0.2} />
                <FloatingOrb position={[5, -2, -5]} color="#B8860B" scale={[0.8, 0.8, 0.8]} speed={0.15} />
                <FloatingOrb position={[-3, -4, -2]} color="#CD7F32" scale={[0.5, 0.5, 0.5]} speed={0.25} />
                <FloatingOrb position={[4, 4, -4]} color="#F7E7CE" scale={[0.4, 0.4, 0.4]} speed={0.18} />

                <DistortedBlob position={[0, 0, -8]} scale={[4, 4, 4]} color="#D4AF37" />
                <DistortedBlob position={[-6, 2, -6]} scale={[2, 2, 2]} color="#B8860B" />

                <GoldenRing position={[0, 0, -4]} />
                <RotatingRing position={[0, 0, -2]} radius={2.5} color="#D4AF37" />
                <RotatingRing position={[0, 0, -6]} radius={4} color="#B8860B" />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, -4]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial
                        color="#0A0908"
                        transparent
                        opacity={0.8}
                    />
                </mesh>

                <gridHelper args={[40, 40, '#D4AF37', '#D4AF37']} position={[0, -5.9, -4]} color="#D4AF37" />
            </Canvas>
        </div>
    );
}
