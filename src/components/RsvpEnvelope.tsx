'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, ContactShadows } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { useLanguage } from '@/context/LanguageContext';

// ============================================================================
// COLORS - White & Green Botanical Theme
// ============================================================================
const COLORS = {
  envelope: '#F5F1E6',      // Champagne/Cream
  envelopeInner: '#FFFBF0', // Lighter cream for inside
  liner: '#8F9E8B',         // Sage Green
  seal: '#2F3E30',          // Deep Forest Green
  sealAccent: '#D4A845',    // Gold accent
  card: '#FFFFFF',          // Bright White
  textPrimary: '#1A2F1C',   // Dark Green
  textGold: '#D4A845',      // Gold
};

// ============================================================================
// TYPES
// ============================================================================
type AnimationStage = 'sealed' | 'holding' | 'breaking' | 'opening' | 'extracting' | 'presenting';

const HOLD_DURATION = 1000;

function SealParticles({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const particleCount = 24;

  const [positions] = useState(() => new Float32Array(particleCount * 3));

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 2] = Math.random() * 0.15;
    }
  }, [positions]);

  useFrame((state) => {
    if (!active || !pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += 0.008;
      posArray[i * 3] += Math.sin(state.clock.elapsedTime * 15 + i) * 0.003;

      if (posArray[i * 3 + 1] > 0.35) {
        posArray[i * 3 + 1] = -0.1;
        posArray[i * 3] = (Math.random() - 0.5) * 0.25;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef} position={[0, 0.32, 0.42]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.seal}
        size={0.012}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// SHATTER PIECES (Broken seal fragments)
// ============================================================================
interface ShatterPiece {
  id: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  rotVel: THREE.Vector3;
  scale: number;
}

function ShatterPieces({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const piecesRef = useRef<ShatterPiece[]>([]);
  const [opacity, setOpacity] = useState(1);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    piecesRef.current = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        Math.random() * 0.08 + 0.04,
        (Math.random() - 0.5) * 0.08 + 0.06
      ),
      rotVel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      ),
      scale: 0.04 + Math.random() * 0.06,
    }));
    setInitialized(true);
  }, []);

  useFrame((_, delta) => {
    if (!active || !groupRef.current || !initialized) return;

    groupRef.current.children.forEach((child, i) => {
      const piece = piecesRef.current[i];
      if (!piece) return;

      piece.position.add(piece.velocity);
      piece.velocity.y -= 0.006;

      piece.rotation.x += piece.rotVel.x * delta * 2;
      piece.rotation.y += piece.rotVel.y * delta * 2;
      piece.rotation.z += piece.rotVel.z * delta * 2;

      child.position.copy(piece.position);
      child.rotation.copy(piece.rotation);
    });

    setOpacity((prev) => Math.max(0, prev - delta * 0.6));
  });

  if (!active || !initialized) return null;

  return (
    <group ref={groupRef} position={[0, 0.32, 0.42]}>
      {piecesRef.current.map((piece) => (
        <mesh key={piece.id} scale={piece.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={COLORS.seal}
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// WAX SEAL
// ============================================================================
interface WaxSealProps {
  stage: AnimationStage;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  isHolding: boolean;
}

function WaxSeal({ stage, onHoldStart, onHoldEnd, isHolding }: WaxSealProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const { scale } = useSpring({
    scale: stage === 'breaking' ? 0 : 1,
    config: { tension: 200, friction: 20 },
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isHolding) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 60) * 0.008;
      meshRef.current.position.y = 0.32 + Math.cos(state.clock.elapsedTime * 70) * 0.004;
    } else {
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0.32;
    }
  });

  if (stage !== 'sealed' && stage !== 'holding') return null;

  return (
    <animated.group
      ref={meshRef}
      position={[0, 0.32, 0.42]}
      scale={scale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHoldStart();
      }}
      onPointerUp={onHoldEnd}
      onPointerLeave={onHoldEnd}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main seal body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.17, 0.06, 32]} />
        <meshStandardMaterial
          color={COLORS.seal}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative outer ring */}
      <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 8, 32]} />
        <meshStandardMaterial
          color={COLORS.sealAccent}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Inner circle for Y & S */}
      <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.065, 32]} />
        <meshStandardMaterial
          color={COLORS.sealAccent}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Embossed details */}
      <mesh position={[0, 0.033, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.045, 32]} />
        <meshStandardMaterial
          color={COLORS.seal}
          roughness={0.4}
        />
      </mesh>

      {/* Hover hint */}
      {hovered && (
        <Html center position={[0, 0.18, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`text-xs tracking-[0.2em] uppercase whitespace-nowrap font-light px-3 py-1 rounded-full ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
            style={{
              color: COLORS.textPrimary,
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: `1px solid ${COLORS.liner}`,
            }}
          >
            {t('rsvp.holdToOpen')}
          </div>
        </Html>
      )}
    </animated.group>
  );
}

// ============================================================================
// ENVELOPE FLAP
// ============================================================================
function EnvelopeFlap({ stage }: { stage: AnimationStage }) {
  const isOpen = stage === 'opening' || stage === 'extracting' || stage === 'presenting';

  const { rotation } = useSpring({
    rotation: isOpen ? Math.PI : 0,
    config: { tension: 35, friction: 22 },
  });

  return (
    <animated.group position={[0, 0.45, 0]} rotation-x={rotation}>
      {/* Flap outer - Champagne paper */}
      <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[1.3, 0.65]} />
        <meshStandardMaterial
          color={COLORS.envelope}
          roughness={0.8}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Flap inner - Sage Green liner */}
      <mesh position={[0, 0.32, -0.001]} rotation={[Math.PI / 2, Math.PI, 0]}>
        <planeGeometry args={[1.28, 0.63]} />
        <meshStandardMaterial
          color={COLORS.liner}
          roughness={0.6}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Subtle liner pattern overlay */}
      <mesh position={[0, 0.32, -0.002]} rotation={[Math.PI / 2, Math.PI, 0]}>
        <planeGeometry args={[1.2, 0.55]} />
        <meshStandardMaterial
          color="#A8B5A5"
          roughness={0.5}
          transparent
          opacity={0.3}
          side={THREE.FrontSide}
        />
      </mesh>
    </animated.group>
  );
}

// ============================================================================
// INVITATION CARD
// ============================================================================
function InvitationCard({ stage, onCardReady }: { stage: AnimationStage; onCardReady?: () => void }) {
  const [showContent, setShowContent] = useState(false);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const isExtracting = stage === 'extracting';
  const isPresenting = stage === 'presenting';
  const isVisible = isExtracting || isPresenting;

  const { posY, posZ, scale, opacity } = useSpring({
    posY: isPresenting ? 0.9 : isExtracting ? 0.6 : -0.15,
    posZ: isPresenting ? 1.2 : 0.2,
    scale: isPresenting ? 1.15 : 1,
    opacity: isVisible ? 1 : 0,
    config: isExtracting
      ? { tension: 18, friction: 28 }
      : { tension: 50, friction: 18 },
    onRest: () => {
      if (isPresenting) {
        setShowContent(true);
        onCardReady?.();
      }
    },
  });

  return (
    <animated.group position-y={posY} position-z={posZ} scale={scale}>
      {/* Card base - Bright White */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.75, 0.015]} />
        <animated.meshStandardMaterial
          color={COLORS.card}
          roughness={0.85}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Card border - subtle sage */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[1.06, 0.71]} />
        <meshStandardMaterial
          color={COLORS.card}
          roughness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Decorative border line */}
      <mesh position={[0, 0, 0.009]}>
        <ringGeometry args={[0.28, 0.29, 64]} />
        <meshStandardMaterial
          color={COLORS.liner}
          roughness={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Corner accents */}
      {[[-0.48, 0.32], [0.48, 0.32], [-0.48, -0.32], [0.48, -0.32]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.009]}>
          <circleGeometry args={[0.015, 16]} />
          <meshStandardMaterial
            color={COLORS.liner}
            roughness={0.5}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Text content */}
      {showContent && (
        <Html
          transform
          occlude
          position={[0, 0.02, 0.01]}
          style={{
            width: '260px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            {/* Names */}
            <h2
              className={`text-2xl tracking-wide ${isAmharic ? 'font-ethiopic font-light' : ''}`}
              style={{
                fontFamily: isAmharic ? 'inherit' : 'var(--font-cormorant), Georgia, serif',
                color: COLORS.textPrimary,
                fontWeight: 500,
              }}
            >
              {t('hero.yonatan')} & {t('hero.saron')}
            </h2>

            {/* Decorative divider */}
            <div
              className="w-16 h-[1px] my-2"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.liner}, transparent)`,
              }}
            />

            {/* Date */}
            <p
              className={`text-sm tracking-[0.25em] uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
              style={{
                fontFamily: isAmharic ? 'inherit' : 'var(--font-cormorant), Georgia, serif',
                color: COLORS.textPrimary,
                fontWeight: 600,
              }}
            >
              {isAmharic ? `${t('hero.month')} 4, 2026` : 'September 4, 2026'}
            </p>

            {/* Subtitle */}
            <p
              className={`text-[10px] tracking-[0.2em] uppercase mt-3 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
              style={{
                fontFamily: isAmharic ? 'inherit' : 'var(--font-inter), sans-serif',
                color: COLORS.liner,
                fontWeight: 500,
              }}
            >
              {t('rsvp.youreInvited')}
            </p>
          </div>
        </Html>
      )}
    </animated.group>
  );
}

// ============================================================================
// ENVELOPE BODY
// ============================================================================
function EnvelopeBody({ stage }: { stage: AnimationStage }) {
  const isPresenting = stage === 'presenting';

  const { posY, opacity } = useSpring({
    posY: isPresenting ? -1.2 : 0,
    opacity: isPresenting ? 0 : 1,
    config: { tension: 35, friction: 20 },
  });

  return (
    <animated.group position-y={posY}>
      {/* Main envelope body - Champagne */}
      <mesh position={[0, 0, -0.025]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.0, 0.05]} />
        <animated.meshStandardMaterial
          color={COLORS.envelope}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Inner pocket */}
      <mesh position={[0, -0.08, 0.08]}>
        <boxGeometry args={[1.3, 0.75, 0.01]} />
        <animated.meshStandardMaterial
          color={COLORS.envelopeInner}
          roughness={0.85}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Visible liner through opening */}
      <mesh position={[0, 0.18, 0.04]}>
        <planeGeometry args={[1.2, 0.35]} />
        <animated.meshStandardMaterial
          color={COLORS.liner}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Edge highlight */}
      <mesh position={[0, -0.5, 0.01]}>
        <planeGeometry args={[1.4, 0.01]} />
        <meshBasicMaterial color="#E8E4DC" transparent opacity={0.6} />
      </mesh>
    </animated.group>
  );
}

// ============================================================================
// SCENE
// ============================================================================
function EnvelopeScene({ onCardPresented }: { onCardPresented?: () => void }) {
  const [stage, setStage] = useState<AnimationStage>('sealed');
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = () => {
    if (stage !== 'sealed') return;

    setIsHolding(true);
    setStage('holding');

    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setStage('breaking');

      setTimeout(() => setStage('opening'), 400);
      setTimeout(() => setStage('extracting'), 1400);
      setTimeout(() => setStage('presenting'), 3200);
    }, HOLD_DURATION);
  };

  const handleHoldEnd = () => {
    if (stage !== 'holding') return;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setIsHolding(false);
    setStage('sealed');
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Soft natural lighting for light background */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#FFF5E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <pointLight position={[-3, 2, 4]} intensity={0.3} color="#ffffff" />
      <pointLight position={[0, -1, 3]} intensity={0.15} color="#FFF8F0" />

      {/* Soft contact shadows */}
      <ContactShadows
        position={[0, -0.7, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={2}
        color="#8B8B8B"
      />

      {/* Main envelope group */}
      <group position={[0, 0.05, 0]}>
        <EnvelopeBody stage={stage} />
        <EnvelopeFlap stage={stage} />

        <WaxSeal
          stage={stage}
          onHoldStart={handleHoldStart}
          onHoldEnd={handleHoldEnd}
          isHolding={isHolding}
        />

        <SealParticles active={isHolding} />
        <ShatterPieces active={stage === 'breaking' || stage === 'opening'} />

        <InvitationCard stage={stage} onCardReady={onCardPresented} />
      </group>
    </>
  );
}

// ============================================================================
// RESPONSIVE CAMERA
// ============================================================================
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (size.width < 640) {
      camera.position.z = 4.2;
    } else {
      camera.position.z = 3.2;
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// ============================================================================
// MAIN EXPORT
// ============================================================================
interface RsvpEnvelopeProps {
  onCardPresented?: () => void;
  className?: string;
}

export default function RsvpEnvelope({ onCardPresented, className = '' }: RsvpEnvelopeProps) {
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-[550px] flex items-center justify-center ${className}`}>
        <p className={`text-[#8F9E8B] text-sm tracking-widest uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}>
          {t('rsvp.loadingEnvelope')}
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-[550px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        shadows
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ResponsiveCamera />
          <EnvelopeScene onCardPresented={onCardPresented} />
        </Suspense>
      </Canvas>

      {/* Instruction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none w-full px-4 text-center">
        <p
          className={`text-xs tracking-[0.25em] uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
          style={{ color: COLORS.liner }}
        >
          {t('rsvp.openInstruction')}
        </p>
      </div>
    </div>
  );
}
