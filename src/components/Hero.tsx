'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useTexture,
  Environment,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Preloader from './Preloader';

// Slideshow images
const SLIDESHOW_IMAGES = [
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_1.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_4.jpeg',
];
const SLIDE_DURATION = 6000;

function Fireflies({ count = 350 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouse.current.x = (touch.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (touch.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.003 + Math.random() / 500;
      const x = (Math.random() - 0.5) * 55;
      const y = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 20 + 5;
      const brightness = 0.6 + Math.random() * 0.4;
      temp.push({ time, factor, speed, x, y, z, brightness, baseX: x, baseY: y });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const { factor, speed, z, brightness, baseX, baseY } = particle;
      particle.time += speed;
      const { time } = particle;

      const mouseWorldX = mouse.current.x * 20;
      const mouseWorldY = -mouse.current.y * 15;
      const attractionStrength = 0.15;

      const targetX = baseX + Math.sin(time * factor * 0.008) * 0.6 + Math.sin(t * 0.3) * 0.15;
      const targetY = baseY + Math.cos(time * factor * 0.008) * 0.6 + Math.sin(time * 0.4) * 0.4;

      const dx = mouseWorldX - targetX;
      const dy = mouseWorldY - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attraction = Math.max(0, 1 - dist / 15) * attractionStrength;

      dummy.position.set(
        targetX + dx * attraction,
        targetY + dy * attraction,
        z + Math.sin(time * factor * 0.004) * 0.4
      );

      const pulse = 0.5 + Math.sin(time * 2.5 + i) * 0.5;
      const scale = (0.018 + Math.sin(time * 1.5) * 0.012) * brightness * (0.8 + pulse * 0.2);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;

    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        mouse.current.x * 0.025,
        0.015
      );
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        -mouse.current.y * 0.018,
        0.015
      );
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#FFBF47" transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  );
}

const PLANE_Z = -8;
const COVER_BUFFER = 1.05; // Safety buffer to prevent edge gaps

function ParallaxBackground({ currentSlide }: { currentSlide: number }) {  const groupRef = useRef<THREE.Group>(null!);
  const { camera, viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const textures = useTexture(SLIDESHOW_IMAGES);

  // Track materials for opacity animation
  const materialRefs = useRef<THREE.MeshBasicMaterial[]>([]);

  // CRITICAL: Get viewport dimensions at the actual Z-depth of the planes
  // The default viewport assumes z=0, but our planes are at z=-8
  const viewportAtDepth = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, PLANE_Z));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouse.current.x = (touch.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (touch.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Smooth opacity transitions
  // Logic: "Stack" model.
  // - Slides < currentSlide are "peeled off" (opacity 0).
  // - currentSlide is visible (opacity 1).
  // - Slides > currentSlide are waiting behind (opacity 1).
  // When looping 3 -> 0: All become 1. 0 fades in on top of 3. Seamless.
  const targetOpacities = useRef(SLIDESHOW_IMAGES.map((_, i) => i < 0 ? 0 : 1));
  const currentOpacities = useRef(SLIDESHOW_IMAGES.map(() => 1));

  useEffect(() => {
    targetOpacities.current = SLIDESHOW_IMAGES.map((_, i) => i < currentSlide ? 0 : 1);
  }, [currentSlide]);

  useFrame(() => {
    // Parallax rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.012,
        0.015
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.008,
        0.015
      );
    }

    // Smooth opacity transitions
    SLIDESHOW_IMAGES.forEach((_, i) => {
      const target = targetOpacities.current[i];
      currentOpacities.current[i] = THREE.MathUtils.lerp(currentOpacities.current[i], target, 0.025);

      const mat = materialRefs.current[i];
      if (mat) {
        mat.opacity = currentOpacities.current[i];
      }
    });
  });

  // Calculate COVER dimensions for each texture at the correct z-depth
  const slideDimensions = useMemo(() => {
    const vw = viewportAtDepth.width;
    const vh = viewportAtDepth.height;
    const screenAspect = vw / vh;

    return textures.map((texture) => {
      const img = texture.image as HTMLImageElement;
      const imageWidth = img?.width || 1;
      const imageHeight = img?.height || 1;
      const imageAspect = imageWidth / imageHeight;

      let width: number, height: number;

      if (screenAspect > imageAspect) {
        // Screen is WIDER than image - match width, height will overflow
        width = vw;
        height = vw / imageAspect;
      } else {
        // Screen is TALLER than image - match height, width will overflow
        height = vh;
        width = vh * imageAspect;
      }

      // Apply safety buffer to prevent edge gaps
      return {
        width: width * COVER_BUFFER,
        height: height * COVER_BUFFER,
      };
    });
  }, [textures, viewportAtDepth.width, viewportAtDepth.height]);

  return (
    <group ref={groupRef} position={[0, 0, PLANE_Z]}>
      {textures.map((texture, index) => {
        const dims = slideDimensions[index];
        // Small z-offset between slides in the stack (for proper layering)
        const zOffset = -index * 0.01;

        return (
          <mesh key={index} position={[0, 0, zOffset]}>
            <planeGeometry args={[dims.width, dims.height]} />
            <meshBasicMaterial
              ref={(el) => { if (el) materialRefs.current[index] = el; }}
              map={texture}
              toneMapped={false}
              transparent
              opacity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Soft warm light rays
function WarmGlow() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[10, 8, -5]} rotation={[0, 0, -Math.PI / 5]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 10) * Math.PI * 0.4 - Math.PI / 6]}>
          <planeGeometry args={[0.15 + i * 0.05, 70]} />
          <meshBasicMaterial
            color="#FFB347"
            transparent
            opacity={0.008 - i * 0.0006}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ currentSlide }: { currentSlide: number }) {
  return (
    <>
      <color attach="background" args={['#0a0908']} />
      <fog attach="fog" args={['#0a0908', 18, 65]} />

      <Environment preset="sunset" />

      <ambientLight intensity={0.35} color="#FFF5E6" />
      <pointLight position={[12, 12, 8]} intensity={1.2} color="#FFB347" />
      <pointLight position={[-12, 6, 8]} intensity={0.9} color="#DDA15E" />
      <pointLight position={[0, -8, 10]} intensity={0.4} color="#FFECD2" />
      <spotLight position={[0, 18, 12]} angle={0.45} penumbra={1} intensity={0.9} color="#FFF8F0" />
      <spotLight position={[-8, 8, 10]} angle={0.5} penumbra={0.9} intensity={0.4} color="#DDA15E" />

      <WarmGlow />

      <Suspense fallback={null}>
        <ParallaxBackground currentSlide={currentSlide} />
      </Suspense>

      <Fireflies count={350} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} height={350} intensity={0.5} />
        <Vignette eskil={false} offset={0.12} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const maskReveal = {
  hidden: { y: '100%', opacity: 0 },
  visible: (delay: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 1.2,
      delay,
      ease: luxuryEase,
    },
  }),
};

// Fade in variant for secondary elements
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 1.0,
      delay,
      ease: luxuryEase,
    },
  }),
};

// Line expand variant
const lineExpand = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (delay: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1.0,
      delay,
      ease: luxuryEase,
    },
  }),
};

// ============================================================================ 
// HERO OVERLAY - Cinematic Luxury Design
// ============================================================================ 
function HeroOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between items-center h-full w-full">
      {/* Seamless Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, transparent 50%, rgba(10,9,8,0.3) 75%, rgba(10,9,8,0.7) 100%),
            linear-gradient(to bottom, rgba(10,9,8,0.4) 0%, transparent 15%, transparent 60%, rgba(10,9,8,0.95) 100%)
          `
        }}
      />

      {/* --- CENTER: DATE BLOCK --- */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center z-10 pt-[30vh]"
      >
        {/* Breathing container - activates after reveal */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4 // Start breathing after reveal completes
          }}
          className="flex flex-col items-center gap-4"
        >
            {/* Date Group */}
          <div className="flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.p
                variants={maskReveal}
                custom={2.2}
                className="text-[#FFF5E6] tracking-[0.5em] text-sm sm:text-base md:text-lg font-bold uppercase mb-3 drop-shadow-lg"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,1)' }}
              >
                September
              </motion.p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div
                variants={lineExpand}
                custom={2.6}
                className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4A845]/60 origin-right"
              />
              <div className="overflow-hidden">
                <motion.span
                  variants={maskReveal}
                  custom={2.4}
                  className="gold-shimmer font-serif text-6xl sm:text-7xl md:text-8xl italic block"
                >
                  4
                </motion.span>
              </div>
              <motion.div
                variants={lineExpand}
                custom={2.6}
                className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4A845]/60 origin-left"
              />
            </div>

            <div className="overflow-hidden">
              <motion.p
                variants={maskReveal}
                custom={2.5}
                className="editorial-label text-[#FFF5E6]/80 tracking-[0.6em] text-xs sm:text-sm md:text-base font-light uppercase mt-3"
              >
                2026
              </motion.p>
            </div>
          </div>

          {/* Location - Editorial Typography */}
          <div className="overflow-hidden mt-4">
            <motion.p
              variants={maskReveal}
              custom={2.8}
              className="editorial-label text-[#D4A845]/90 tracking-[0.4em] text-xs sm:text-sm md:text-base font-light uppercase"
            >
              Wrightsville, Pennsylvania
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Shared Centerline Wrapper */}
      <div className="relative w-full max-w-[92vw] md:max-w-3xl flex flex-col items-center h-full">

        {/* --- TOP: NAMES BLOCK with Cinematic Reveal --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center mt-[15vh] sm:mt-[18vh]"
        >
          {/* Breathing wrapper - activates after reveal */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3.5
            }}
            className="flex flex-col items-center"
          >
            {/* YONATAN - Masked Slide-Up Reveal with Gold Shimmer */}
            <div className="overflow-hidden">
              <motion.h1
                variants={maskReveal}
                custom={0.5}
                className="gold-shimmer font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em]"
              >
                Yonatan
              </motion.h1>
            </div>

            {/* Ampersand Divider */}
            <motion.div
              variants={fadeIn}
              custom={1.4}
              className="flex items-center gap-2 sm:gap-3 my-1 sm:my-2"
            >
              <motion.div
                variants={lineExpand}
                custom={1.5}
                className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4A845]/50 origin-right"
              />
              <span className="text-[#D4A845]/90 text-xl sm:text-2xl md:text-3xl font-serif italic">&</span>
              <motion.div
                variants={lineExpand}
                custom={1.5}
                className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4A845]/50 origin-left"
              />
            </motion.div>

            {/* SARON - Masked Slide-Up Reveal with Gold Shimmer */}
            <div className="overflow-hidden">
              <motion.h1
                variants={maskReveal}
                custom={0.8}
                className="gold-shimmer font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em]"
              >
                Saron
              </motion.h1>
            </div>
          </motion.div>
        </motion.div>

        {/* --- BOTTOM: SCROLL PROMPT --- */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4 w-full">
          {/* SCROLL Text */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3.2}
            className="overflow-hidden"
          >
             <motion.p
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="gold-shimmer tracking-[0.4em] text-xs sm:text-sm uppercase font-bold"
            >
              Scroll
            </motion.p>
          </motion.div>

          {/* Vertical Line */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3.5}
            className="pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4A845]/60 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = SLIDESHOW_IMAGES.length;

  useEffect(() => {
    setMounted(true);

    // Check if preloader was already shown this session
    if (sessionStorage.getItem('preloaderShown') === 'true') {
      setPreloaderComplete(true);
    }

    // Optimize performance by pausing rendering when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for reactive gold shimmer - Direct DOM update to avoid re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        // Convert mouse X to percentage (0-100)
        const percentage = (e.clientX / window.innerWidth) * 100;
        containerRef.current.style.setProperty('--mouse-x', `${percentage}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-advance slideshow (only after preloader)
  useEffect(() => {
    if (!visible || !preloaderComplete) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [totalSlides, visible, preloaderComplete]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-screen overflow-hidden bg-[#0a0908]"
      style={{
        pointerEvents: visible ? 'auto' : 'none',
        // Default value for SSR/initial render
        '--mouse-x': '50%',
      } as React.CSSProperties}
    >
      {/* Preloader - shows first (skipped if already shown this session) */}
      {mounted && !preloaderComplete && (
        <Preloader onComplete={() => {
          sessionStorage.setItem('preloaderShown', 'true');
          setPreloaderComplete(true);
        }} />
      )}

      {/* Main content - only renders after preloader */}
      {mounted && preloaderComplete && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0"
          >
            <Canvas
              frameloop={visible ? "always" : "never"}
              camera={{ position: [0, 0, 12], fov: 50 }}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                stencil: false,
              }}
              dpr={[1, 2]}
            >
              <Suspense fallback={null}>
                <Scene currentSlide={currentSlide} />
              </Suspense>
            </Canvas>
          </motion.div>

          <HeroOverlay />
        </>
      )}
    </div>
  );
}
