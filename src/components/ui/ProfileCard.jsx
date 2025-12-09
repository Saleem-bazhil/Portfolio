import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ProfileCard.css';

// Constants
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg, rgba(18, 21, 30, 0.95) 0%, rgba(26, 31, 46, 0.85) 100%)';
const DEFAULT_AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTIxNTFFIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzAwRTVGRiIvPgo8cmVjdCB4PSI2MCIgeT0iMTMwIiB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHJ4PSIxMCIgZmlsbD0iIzAwRTVGRiIvPgo8L3N2Zz4K';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1600,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 220,
  TILT_SENSITIVITY: 0.12,
  MOBILE_TILT_SENSITIVITY: 4,
  FLOAT_ANIMATION_DURATION: 6
};

// Utility functions
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// Custom hook for tilt animation
const useTiltEngine = (enableTilt, sensitivity = ANIMATION_CONFIG.TILT_SENSITIVITY) => {
  return useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.16 * (1 / sensitivity);
    const INITIAL_TAU = 0.8;
    let initialUntil = 0;

    const setVarsFromXY = (x, y, element) => {
      if (!element) return;

      const width = element.clientWidth || 1;
      const height = element.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = (percentX - 50) / 50;
      const centerY = (percentY - 50) / 50;

      const distanceFromCenter = Math.hypot(centerX, centerY);
      const tiltIntensity = 1 + distanceFromCenter * 0.5;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 30, 70)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 30, 70)}%`,
        '--pointer-from-center': `${clamp(distanceFromCenter, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-centerY * sensitivity * 15)}deg`,
        '--rotate-y': `${round(centerX * sensitivity * 15)}deg`,
        '--tilt-intensity': tiltIntensity,
        '--card-scale': (1 + distanceFromCenter * 0.03)
      };

      for (const [k, v] of Object.entries(properties)) {
        element.style.setProperty(k, v);
      }
    };

    const step = (ts, element) => {
      if (!running || !element) return;
      
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY, element);

      const stillFar = Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame((timestamp) => step(timestamp, element));
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = (element) => {
      if (running || !element) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame((timestamp) => step(timestamp, element));
    };

    return {
      setImmediate(x, y, element) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY, element);
      },
      setTarget(x, y, element) {
        targetX = x;
        targetY = y;
        start(element);
      },
      toCenter(element) {
        if (!element) return;
        this.setTarget(element.clientWidth / 2, element.clientHeight / 2, element);
      },
      beginInitial(durationMs, element) {
        initialUntil = performance.now() + durationMs;
        start(element);
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, [enableTilt, sensitivity]);
};

// Custom hook for event listeners
const useEventListeners = (ref, callbacks, dependencies) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { onPointerEnter, onPointerMove, onPointerLeave, onClick } = callbacks;

    if (onPointerEnter) element.addEventListener('pointerenter', onPointerEnter);
    if (onPointerMove) element.addEventListener('pointermove', onPointerMove);
    if (onPointerLeave) element.addEventListener('pointerleave', onPointerLeave);
    if (onClick) element.addEventListener('click', onClick);

    return () => {
      if (onPointerEnter) element.removeEventListener('pointerenter', onPointerEnter);
      if (onPointerMove) element.removeEventListener('pointermove', onPointerMove);
      if (onPointerLeave) element.removeEventListener('pointerleave', onPointerLeave);
      if (onClick) element.removeEventListener('click', onClick);
    };
  }, dependencies);
};

const ProfileCardComponent = ({
  avatarUrl = DEFAULT_AVATAR_PLACEHOLDER,
  iconUrl,
  grainUrl,
  innerGradient = DEFAULT_INNER_GRADIENT,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(0, 229, 255, 0.3)',
  behindGlowSize = '70%',
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = ANIMATION_CONFIG.MOBILE_TILT_SENSITIVITY,
  miniAvatarUrl,
  name = 'SALEEM BAZHIL',
  title = 'Full Stack Developer',
  handle = 'salesmbazhil',
  status = 'Online',
  contactText = 'Contact Me',
  showUserInfo = true,
  onContactClick,
  tiltSensitivity = ANIMATION_CONFIG.TILT_SENSITIVITY,
  enableFloatAnimation = true
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useTiltEngine(enableTilt, tiltSensitivity);

  // Image loading handler
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(false);
    setImageError(true);
  }, []);

  // Get mouse/touch offsets
  const getOffsets = useCallback((evt, el) => {
    const rect = el.getBoundingClientRect();
    return { 
      x: evt.clientX - rect.left, 
      y: evt.clientY - rect.top 
    };
  }, []);

  // Pointer event handlers
  const handlePointerMove = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y, wrapRef.current);
    },
    [tiltEngine, getOffsets]
  );

  const handlePointerEnter = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      setIsHovering(true);
      shell.classList.add('active', 'entering');
      
      if (enterTimerRef.current) {
        clearTimeout(enterTimerRef.current);
      }
      
      enterTimerRef.current = setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y, wrapRef.current);
    },
    [tiltEngine, getOffsets]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    setIsHovering(false);
    tiltEngine.toCenter(wrapRef.current);

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.3;
      
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };

    if (leaveRafRef.current) {
      cancelAnimationFrame(leaveRafRef.current);
    }
    
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  // Device orientation handler for mobile tilt
  const handleDeviceOrientation = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y, wrapRef.current);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  // Mobile tilt permission handler
  const handleMobileTiltClick = useCallback(() => {
    if (!enableMobileTilt || location.protocol !== 'https:') return;

    const DeviceMotionEvent = window.DeviceMotionEvent;
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent
        .requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
  }, [enableMobileTilt, handleDeviceOrientation]);

  // Set up event listeners
  useEventListeners(
    shellRef,
    {
      onPointerEnter: handlePointerEnter,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onClick: enableMobileTilt ? handleMobileTiltClick : null
    },
    [handlePointerEnter, handlePointerMove, handlePointerLeave, handleMobileTiltClick]
  );

  // Initialize tilt engine and floating animation
  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    const card = cardRef.current;
    if (!shell || !card) return;

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    
    tiltEngine.setImmediate(initialX, initialY, wrapRef.current);
    tiltEngine.toCenter(wrapRef.current);
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION, wrapRef.current);

    // Add floating animation class
    if (enableFloatAnimation) {
      card.classList.add('pc-card-floating');
    }

    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      
      tiltEngine.cancel();
      shell.classList.remove('entering', 'active');
      if (card) card.classList.remove('pc-card-floating');
      
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [enableTilt, tiltEngine, handleDeviceOrientation, enableFloatAnimation]);

  // Card style memoization
  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none',
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient': innerGradient,
    '--behind-glow-color': behindGlowColor,
    '--behind-glow-size': behindGlowSize,
    '--float-animation-duration': `${ANIMATION_CONFIG.FLOAT_ANIMATION_DURATION}s`
  }), [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  // Contact button click handler
  const handleContactClick = useCallback((e) => {
    e.stopPropagation();
    onContactClick?.();
  }, [onContactClick]);

  // Determine avatar source
  const finalAvatarUrl = imageError ? DEFAULT_AVATAR_PLACEHOLDER : avatarUrl;
  const finalMiniAvatarUrl = miniAvatarUrl || finalAvatarUrl;

  return (
    <div 
      ref={wrapRef} 
      className={`pc-card-wrapper ${className}`.trim()} 
      style={cardStyle}
      role="region"
      aria-label="Profile card"
    >
      {behindGlowEnabled && (
        <div className="pc-behind" data-hovering={isHovering} />
      )}
      
      <div ref={shellRef} className="pc-card-shell">
        <section ref={cardRef} className="pc-card">
          <div className="pc-inside">
            {/* Enhanced Visual Effects */}
            <div className="pc-shine" aria-hidden="true" />
            <div className="pc-glare" aria-hidden="true" />
            <div className="pc-particle-field" aria-hidden="true" />
            
            {/* Avatar Content */}
            <div className="pc-content pc-avatar-content">
              <div className="avatar-container">
                <img
                  className={`avatar ${imageLoaded ? 'avatar-loaded' : 'avatar-loading'}`}
                  src={finalAvatarUrl}
                  alt={`${name} avatar`}
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <div className="avatar-glow" aria-hidden="true" />
              </div>
              
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={finalMiniAvatarUrl}
                        alt={`${name} mini avatar`}
                        loading="lazy"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status" data-status={status.toLowerCase()}>
                        {status}
                      </div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    type="button"
                    aria-label={`Contact ${name}`}
                  >
                    <span className="pc-contact-btn-text">{contactText}</span>
                    <div className="pc-contact-btn-glow" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Text Content */}
            <div className="pc-content">
              <div className="pc-details">
                <h3>
                  <span className="pc-name-text">{name}</span>
                  <div className="pc-name-glow" aria-hidden="true" />
                </h3>
                <p>{title}</p>
              </div>
            </div>

            {/* 3D Depth Elements */}
            <div className="pc-depth-layer pc-depth-1" aria-hidden="true" />
            <div className="pc-depth-layer pc-depth-2" aria-hidden="true" />
            <div className="pc-depth-layer pc-depth-3" aria-hidden="true" />
          </div>
        </section>
      </div>
    </div>
  );
};

// Performance optimization with React.memo and custom comparison
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.avatarUrl === nextProps.avatarUrl &&
    prevProps.name === nextProps.name &&
    prevProps.title === nextProps.title &&
    prevProps.handle === nextProps.handle &&
    prevProps.status === nextProps.status &&
    prevProps.contactText === nextProps.contactText &&
    prevProps.enableTilt === nextProps.enableTilt &&
    prevProps.showUserInfo === nextProps.showUserInfo &&
    prevProps.enableFloatAnimation === nextProps.enableFloatAnimation
  );
};

const ProfileCard = React.memo(ProfileCardComponent, areEqual);
ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;