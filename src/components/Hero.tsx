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
import { useLanguage } from '@/context/LanguageContext';
import { useNavView } from '@/context/ViewContext';

// Slideshow images — dark theme ("Save the Date") keeps the original engagement shoot.
const SLIDESHOW_IMAGES_DARK = [
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_1.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_4.jpeg',
];

// Light theme ("Final Invite") uses the newer pre-wedding shoot. eng-main-image is the
// primary shot — kept first and given a longer on-screen duration (MAIN_SLIDE_DURATION).
const SLIDESHOW_IMAGES_LIGHT = [
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/eng-main-image.jpg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/hereyes.jpg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/laughing.jpg',
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/enjoyingeachother.jpg',
  `https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/${encodeURIComponent('looking at each other.jpg')}`,
];

// The cover-crop below is always centered on the image, which is fine for the
// portrait slides (they only ever crop top/bottom, and the couple is
// centered vertically in all of them). eng-main-image.jpg is the one
// landscape-oriented slide, so on a narrow phone viewport the cover-crop has
// to cut width instead — and since the couple sits toward the left third of
// that specific frame (the horses fill the center/right), a centered crop
// on a portrait phone cuts them out entirely, leaving only horses visible.
// Bias just this image's crop window toward the left (0 = left edge,
// 0.5 = centered/default) so the couple stays in frame. 0 is clamped by
// maxOffsetX to the furthest-left position that still fully covers the
// viewport (no exposed edge), which is what "far left" means here.
const FOCAL_X_OVERRIDES: Record<string, number> = {
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/eng-main-image.jpg': 0,
};

// Preload both slideshow sets eagerly (not just the active theme's) so a
// manual theme toggle never triggers a fresh Suspense-loading pass mid-
// session. Confirmed via direct testing: switching activeView swaps
// `images`, which makes useTexture(images) suspend to load the other set's
// textures for the first time — and that suspend-then-resolve cycle can
// leave the canvas rendering nothing at all afterward (not even the scene's
// background color), independent of the WebGL context or canvas size being
// fine, and unrecoverable by any further interaction. Preloading both sets
// up front means useTexture() always resolves from cache on toggle instead
// of suspending, sidestepping the whole failure mode.
[...SLIDESHOW_IMAGES_DARK, ...SLIDESHOW_IMAGES_LIGHT].forEach((url) => useTexture.preload(url));

const SLIDE_DURATION = 6000;
const MAIN_SLIDE_DURATION = 9000;

function Fireflies({ count = 350, color = '#FFBF47' }: { count?: number; color?: string }) {
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
      <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  );
}

const PLANE_Z = -8;
const COVER_BUFFER = 1.05; // Safety buffer to prevent edge gaps

function ParallaxBackground({ currentSlide, images }: { currentSlide: number; images: string[] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera, viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const textures = useTexture(images);

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
  const targetOpacities = useRef(images.map((_, i) => i < 0 ? 0 : 1));
  const currentOpacities = useRef(images.map(() => 1));

  useEffect(() => {
    targetOpacities.current = images.map((_, i) => i < currentSlide ? 0 : 1);
  }, [currentSlide, images]);

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
    images.forEach((_, i) => {
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

    return textures.map((texture, i) => {
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
      width *= COVER_BUFFER;
      height *= COVER_BUFFER;

      // Bias the crop window horizontally per FOCAL_X_OVERRIDES (see comment
      // at its definition) instead of always cropping from center. Only has
      // an effect when this slide is actually being cropped in width (i.e.
      // width > vw) — a plain center-crop (offset 0) otherwise.
      const focalX = FOCAL_X_OVERRIDES[images[i]] ?? 0.5;
      const maxOffsetX = Math.max(0, (width - vw) / 2);
      const offsetX = THREE.MathUtils.clamp(width * (0.5 - focalX), -maxOffsetX, maxOffsetX);

      return { width, height, offsetX };
    });
  }, [textures, images, viewportAtDepth.width, viewportAtDepth.height]);

  return (
    <group ref={groupRef} position={[0, 0, PLANE_Z]}>
      {textures.map((texture, index) => {
        const dims = slideDimensions[index];
        // Small z-offset between slides in the stack (for proper layering)
        const zOffset = -index * 0.01;

        return (
          <mesh key={index} position={[dims.offsetX, 0, zOffset]}>
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
function WarmGlow({ color = '#FFB347' }: { color?: string }) {
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
            color={color}
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

// ─────────────────────────────────────────────────────────────────────────────
// Per-theme scene configuration — "Save the Date" (dark) vs "Final Invite" (light)
// ─────────────────────────────────────────────────────────────────────────────
interface SceneLight {
  kind: 'point' | 'spot';
  position: [number, number, number];
  intensity: number;
  color: string;
  angle?: number;
  penumbra?: number;
}

interface SceneTheme {
  background: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  envPreset: 'sunset' | 'dawn';
  ambientIntensity: number;
  ambientColor: string;
  lights: SceneLight[];
  fireflyColor: string;
  glowColor: string;
  bloom: { luminanceThreshold: number; luminanceSmoothing: number; intensity: number };
  vignetteDarkness: number;
}

const SCENE_THEMES: Record<'dark' | 'light', SceneTheme> = {
  dark: {
    background: '#0a0908',
    fogColor: '#0a0908',
    fogNear: 18,
    fogFar: 65,
    envPreset: 'sunset',
    ambientIntensity: 0.35,
    ambientColor: '#FFF5E6',
    lights: [
      { kind: 'point', position: [12, 12, 8], intensity: 1.2, color: '#FFB347' },
      { kind: 'point', position: [-12, 6, 8], intensity: 0.9, color: '#DDA15E' },
      { kind: 'point', position: [0, -8, 10], intensity: 0.4, color: '#FFECD2' },
      { kind: 'spot', position: [0, 18, 12], intensity: 0.9, color: '#FFF8F0', angle: 0.45, penumbra: 1 },
      { kind: 'spot', position: [-8, 8, 10], intensity: 0.4, color: '#DDA15E', angle: 0.5, penumbra: 0.9 },
    ],
    fireflyColor: '#FFBF47',
    glowColor: '#FFB347',
    bloom: { luminanceThreshold: 0.25, luminanceSmoothing: 0.9, intensity: 0.5 },
    vignetteDarkness: 0.75,
  },
  light: {
    background: '#F7F1E1',
    fogColor: '#E3E1C9',
    fogNear: 22,
    fogFar: 70,
    envPreset: 'dawn',
    ambientIntensity: 0.55,
    ambientColor: '#FFF6E4',
    lights: [
      { kind: 'point', position: [12, 12, 8], intensity: 0.9, color: '#FFF6E4' },
      { kind: 'point', position: [-12, 6, 8], intensity: 0.65, color: '#C9C79E' },
      { kind: 'point', position: [0, -8, 10], intensity: 0.3, color: '#F7F1E1' },
      { kind: 'spot', position: [0, 18, 12], intensity: 0.65, color: '#FFF6E4', angle: 0.45, penumbra: 1 },
      { kind: 'spot', position: [-8, 8, 10], intensity: 0.35, color: '#8C9A5E', angle: 0.5, penumbra: 0.9 },
    ],
    fireflyColor: '#A9822F',
    glowColor: '#A9822F',
    bloom: { luminanceThreshold: 0.4, luminanceSmoothing: 0.9, intensity: 0.3 },
    vignetteDarkness: 0.15,
  },
};

function Scene({ currentSlide }: { currentSlide: number }) {
  const { activeView } = useNavView();
  const isLight = activeView === 'final-invite';
  const theme = SCENE_THEMES[isLight ? 'light' : 'dark'];
  const images = isLight ? SLIDESHOW_IMAGES_LIGHT : SLIDESHOW_IMAGES_DARK;

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fogColor, theme.fogNear, theme.fogFar]} />

      <Environment preset={theme.envPreset} />

      <ambientLight intensity={theme.ambientIntensity} color={theme.ambientColor} />
      {theme.lights.map((light, i) =>
        light.kind === 'point' ? (
          <pointLight key={i} position={light.position} intensity={light.intensity} color={light.color} />
        ) : (
          <spotLight
            key={i}
            position={light.position}
            intensity={light.intensity}
            color={light.color}
            angle={light.angle}
            penumbra={light.penumbra}
          />
        )
      )}

      <WarmGlow color={theme.glowColor} />

      <Suspense fallback={null}>
        <ParallaxBackground currentSlide={currentSlide} images={images} />
      </Suspense>

      {!isLight && <Fireflies count={350} color={theme.fireflyColor} />}

      <EffectComposer>
        <Bloom
          luminanceThreshold={theme.bloom.luminanceThreshold}
          luminanceSmoothing={theme.bloom.luminanceSmoothing}
          height={350}
          intensity={theme.bloom.intensity}
        />
        <Vignette eskil={false} offset={0.12} darkness={theme.vignetteDarkness} />
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
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between items-center h-full w-full">
      {/* Seamless Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, transparent 50%, rgba(var(--surface-rgb),0.3) 75%, rgba(var(--surface-rgb),0.7) 100%),
            linear-gradient(to bottom, rgba(var(--surface-rgb),0.4) 0%, transparent 15%, transparent 60%, rgba(var(--surface-rgb),0.95) 100%)
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
                className={`text-ink-heading tracking-[0.5em] text-sm sm:text-base md:text-lg font-extrabold uppercase mb-3 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
              >
                {t('hero.month')}
              </motion.p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div
                variants={lineExpand}
                custom={2.6}
                className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-accent/80 origin-right"
              />
              <div className="overflow-hidden">
                <motion.span
                  variants={maskReveal}
                  custom={2.4}
                  style={{ filter: 'none' }}
                  className="gold-shimmer font-serif text-6xl sm:text-7xl md:text-8xl italic block"
                >
                  4
                </motion.span>
              </div>
              <motion.div
                variants={lineExpand}
                custom={2.6}
                className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-accent/80 origin-left"
              />
            </div>

            <div className="overflow-hidden">
              <motion.p
                variants={maskReveal}
                custom={2.5}
                className={`editorial-label text-ink-heading tracking-[0.6em] text-xs sm:text-sm md:text-base font-bold uppercase mt-3 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
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
              className={`editorial-label text-accent tracking-[0.4em] text-xs sm:text-sm md:text-base font-bold uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
            >
              {t('hero.location')}
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
                style={{ filter: 'none' }}
                className={`gold-shimmer text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}
              >
                {t('hero.yonatan')}
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
                className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-accent/50 origin-right"
              />
              <span className={`text-accent/90 text-xl sm:text-2xl md:text-3xl font-serif italic ${isAmharic ? 'font-ethiopic not-italic' : ''}`}>&</span>
              <motion.div
                variants={lineExpand}
                custom={1.5}
                className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-accent/50 origin-left"
              />
            </motion.div>

            {/* SARON - Masked Slide-Up Reveal with Gold Shimmer */}
            <div className="overflow-hidden">
              <motion.h1
                variants={maskReveal}
                custom={0.8}
                style={{ filter: 'none' }}
                className={`gold-shimmer text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}
              >
                {t('hero.saron')}
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
              style={{ filter: 'none' }}
              className={`gold-shimmer tracking-[0.4em] text-xs sm:text-sm uppercase font-black ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
            >
              {t('hero.scroll')}
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
              <div className="w-[1px] h-12 bg-gradient-to-b from-accent/60 to-transparent" />
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

  const { activeView } = useNavView();
  const isLight = activeView === 'final-invite';
  const images = isLight ? SLIDESHOW_IMAGES_LIGHT : SLIDESHOW_IMAGES_DARK;
  const totalSlides = images.length;

  // Crossfade the canvas briefly on theme toggle so the relight isn't seen mid-transition
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const isFirstView = useRef(true);
  useEffect(() => {
    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }
    setCanvasOpacity(0);
    const timer = setTimeout(() => setCanvasOpacity(1), 400);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Image set changes with the theme (different slide counts) — restart the
  // slideshow from the main/first slide rather than risk an out-of-range index.
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeView]);

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

  // R3F's Canvas measures its container via ResizeObserver on mount to size
  // its WebGL drawing buffer — but right as the Preloader unmounts and the
  // Canvas mounts in its place, that first measurement can land before
  // layout has fully settled, leaving the buffer stuck at the browser's
  // 300x150 default (confirmed via canvas.width/height) until some other
  // event (a scroll, a window resize) forces a re-measure. The whole scene —
  // including the slideshow photo — still renders, just into that tiny
  // buffer, so it's invisible at normal viewing size. Nudge a resize shortly
  // after the Canvas mounts so guests don't land on an apparently-blank Hero.
  //
  // The same stall reproduces on a manual theme toggle, not just first
  // mount: switching activeView swaps `images`, so ParallaxBackground
  // suspends to load a whole new texture set (e.g. arriving via a dark-mode
  // Save the Date link, then switching to light) — the newly-resolved
  // textures can hit the same "no frame gets painted" stall, leaving the
  // Hero blank after the crossfade back in. Re-run the same nudge on every
  // activeView change, not just the initial mount.
  useEffect(() => {
    if (!preloaderComplete) return;
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, activeView]);

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

  // Auto-advance slideshow (only after preloader). The main/first slide in the
  // light-mode set gets a longer duration, so this reschedules per-slide instead
  // of running on a fixed setInterval.
  useEffect(() => {
    if (!visible || !preloaderComplete) return;

    const duration = isLight && currentSlide === 0 ? MAIN_SLIDE_DURATION : SLIDE_DURATION;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, duration);

    return () => clearTimeout(timer);
  }, [totalSlides, visible, preloaderComplete, currentSlide, isLight]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-screen overflow-hidden bg-surface transition-colors duration-500"
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
            <motion.div
              animate={{ opacity: canvasOpacity }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                // Purely decorative background — no clickable 3D objects in
                // the scene. Blocking pointer events at the DOM level means
                // taps/clicks never reach the canvas or R3F's own internal
                // pointer/raycasting system at all, so they can't affect the
                // slideshow or scene state in any way.
                style={{ pointerEvents: 'none' }}
              >
                <Suspense fallback={null}>
                  <Scene currentSlide={currentSlide} />
                </Suspense>
              </Canvas>
            </motion.div>
          </motion.div>

          <HeroOverlay />
        </>
      )}
    </div>
  );
}
