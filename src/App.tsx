import { useCallback, useEffect, useRef, useState } from 'react';
import { AmbientAudioController } from './components/AmbientAudioController';
import { BakeryFooter } from './components/BakeryFooter';
import { BakerySliderDrawer } from './components/BakerySliderDrawer';
import { BakersSecretModal } from './components/BakersSecretModal';
import { CakeFinisherModal } from './components/CakeFinisherModal';
import { DirectionsMapSection } from './components/DirectionsMapSection';
import { HearthBakeScheduleModal } from './components/HearthBakeScheduleModal';
import { PairingSommelierModal } from './components/PairingSommelierModal';
import { PostcardGeneratorModal } from './components/PostcardGeneratorModal';
import { RecipeCardModal } from './components/RecipeCardModal';
import { SourdoughHydrationModal } from './components/SourdoughHydrationModal';
import { StoryFrameCanvas } from './components/StoryFrameCanvas';
import { StoryStageCard } from './components/StoryStageCard';
import { TableReservationModal } from './components/TableReservationModal';
import { TopBar } from './components/TopBar';
import { WheatChaffOverlay } from './components/WheatChaffOverlay';
import {
  EASTER_EGG_ITEMS,
  EasterEggItem,
  TOTAL_EASTER_EGGS,
  getDiscoveredEggIds,
  markEggFound,
  saveDiscoveredEggIds,
} from './utils/bakersSecretHunt';
import { getRecipeCard } from './utils/recipeCardsData';
import { StorySpeed } from './utils/timelineControls';
import {
  getThemeFromStorage,
  saveThemeToStorage,
} from './utils/themeEnvironment';
import {
  DEFAULT_VIDEO_DURATION,
  LANDING_VIDEO_SRC,
  STORY_BEATS,
  STORY_VIDEO_SRC,
  TOTAL_TRACK_VH,
  clampProgress,
  computeScrollProgress,
  computeStageTextMotion,
  getActiveBeat,
  getActiveChapter,
  getHarvestAtmosphereOpacity,
  getLandingVideoOpacity,
  getScrollYForProgress,
  lerpProgress,
  progressToVideoTime,
} from './utils/storyTimeline';

export default function App() {
  const storyVideoRef = useRef<HTMLVideoElement | null>(null);
  const landingVideoRef = useRef<HTMLVideoElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const stageCardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const smoothedProgressRef = useRef(0);
  const progressRef = useRef(0);
  const durationRef = useRef(DEFAULT_VIDEO_DURATION);
  const autoScrollRef = useRef(false);
  const isStoryVideoModeRef = useRef(false);
  const lastManualScrollAtRef = useRef(0);
  const lastProgrammaticScrollYRef = useRef(0);
  const lastProgrammaticScrollTimeRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const hasUserScrolledRef = useRef(false);
  const storyTransitionStartTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isStoryVideoMode, setIsStoryVideoMode] = useState(false);
  const [landingVideoError, setLandingVideoError] = useState(false);
  const [storyVideoError, setStoryVideoError] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isDay, setIsDay] = useState(() => getThemeFromStorage());
  const [activeRecipeTag, setActiveRecipeTag] = useState<string | null>(null);
  const [foundEggIds, setFoundEggIds] = useState<string[]>(() =>
    getDiscoveredEggIds()
  );
  const [isEasterEggModalOpen, setIsEasterEggModalOpen] = useState(false);
  const [isCakeFinisherOpen, setIsCakeFinisherOpen] = useState(false);
  const [isSliderWindowOpen, setIsSliderWindowOpen] = useState(false);
  const [isBakeScheduleOpen, setIsBakeScheduleOpen] = useState(false);
  const [isHydrationOpen, setIsHydrationOpen] = useState(false);
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);
  const [storySpeed, setStorySpeed] = useState<StorySpeed>(1.0);
  const storySpeedRef = useRef<StorySpeed>(1.0);

  const handleToggleSliderWindow = useCallback(() => {
    setIsSliderWindowOpen((prev) => !prev);
  }, []);

  const handleCloseSliderWindow = useCallback(() => {
    setIsSliderWindowOpen(false);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: StorySpeed) => {
    setStorySpeed(newSpeed);
    storySpeedRef.current = newSpeed;
    if (storyVideoRef.current) {
      storyVideoRef.current.playbackRate = newSpeed;
    }
  }, []);

  const handleToggleEnvironment = useCallback((newIsDay: boolean) => {
    setIsDay(newIsDay);
    saveThemeToStorage(newIsDay);
  }, []);

  const handleOpenRecipeCard = useCallback((tag: string) => {
    setActiveRecipeTag(tag);
  }, []);

  const handleCloseRecipeCard = useCallback(() => {
    setActiveRecipeTag(null);
  }, []);

  const handleDiscoverEasterEgg = useCallback((egg: EasterEggItem) => {
    setFoundEggIds((prev) => {
      const updated = markEggFound(egg.id, prev);
      saveDiscoveredEggIds(updated);
      if (updated.length >= TOTAL_EASTER_EGGS) {
        setIsEasterEggModalOpen(true);
      }
      return updated;
    });
  }, []);

  const handleOpenEasterEggModal = useCallback(() => {
    setIsEasterEggModalOpen(true);
  }, []);

  const handleCloseEasterEggModal = useCallback(() => {
    setIsEasterEggModalOpen(false);
  }, []);

  const handleOpenCakeFinisher = useCallback(() => {
    setIsCakeFinisherOpen(true);
  }, []);

  const handleCloseCakeFinisher = useCallback(() => {
    setIsCakeFinisherOpen(false);
  }, []);

  const handleOpenBakeSchedule = useCallback(() => {
    setIsBakeScheduleOpen(true);
  }, []);

  const handleCloseBakeSchedule = useCallback(() => {
    setIsBakeScheduleOpen(false);
  }, []);

  const handleOpenHydration = useCallback(() => {
    setIsHydrationOpen(true);
  }, []);

  const handleCloseHydration = useCallback(() => {
    setIsHydrationOpen(false);
  }, []);

  const handleOpenSommelier = useCallback(() => {
    setIsSommelierOpen(true);
  }, []);

  const handleCloseSommelier = useCallback(() => {
    setIsSommelierOpen(false);
  }, []);

  const handleOpenTableReservation = useCallback(() => {
    setIsTableReservationOpen(true);
  }, []);

  const handleCloseTableReservation = useCallback(() => {
    setIsTableReservationOpen(false);
  }, []);

  const handleOpenPostcard = useCallback(() => {
    setIsPostcardOpen(true);
  }, []);

  const handleClosePostcard = useCallback(() => {
    setIsPostcardOpen(false);
  }, []);

  const activeRecipeCard = activeRecipeTag
    ? getRecipeCard(activeRecipeTag)
    : null;

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleRegisterCard = useCallback(
    (beatId: string, node: HTMLDivElement | null) => {
      if (node) {
        stageCardElementsRef.current.set(beatId, node);
        const beat = STORY_BEATS.find((b) => b.id === beatId);
        if (beat?.isPrologue) {
          node.style.transform = 'translate3d(0, 0px, 0) scale(1.0001)';
          node.style.opacity = '1';
          node.style.visibility = 'visible';
          node.style.pointerEvents = 'auto';
        } else {
          node.style.transform = 'translate3d(0, 24px, 0) scale(1.0001)';
          node.style.opacity = '0';
          node.style.visibility = 'hidden';
          node.style.pointerEvents = 'none';
        }
      } else {
        stageCardElementsRef.current.delete(beatId);
      }
    },
    []
  );

  const getStoryTrackHeight = useCallback(() => {
    const mapEl = document.getElementById('visit-directions');
    if (mapEl) {
      return mapEl.offsetTop;
    }
    return (TOTAL_TRACK_VH * window.innerHeight) / 100;
  }, []);

  const handleRegisterScrollIndicator = useCallback(
    (node: HTMLDivElement | null) => {
      scrollIndicatorRef.current = node;
    },
    []
  );

  const markUserScrolled = useCallback(() => {
    if (!hasUserScrolledRef.current) {
      hasUserScrolledRef.current = true;
      setHasUserScrolled(true);
    }
  }, []);

  const ensureVideoPlaying = useCallback((video: HTMLVideoElement | null) => {
    if (!video || !video.paused) return;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay may wait for first gesture on restricted devices
      });
    }
  }, []);

  const stopStoryVideoMode = useCallback(() => {
    if (isStoryVideoModeRef.current || autoScrollRef.current) {
      storyTransitionStartTimeRef.current = 0;
      isStoryVideoModeRef.current = false;
      autoScrollRef.current = false;
      setIsStoryVideoMode(false);
      setIsAutoScrolling(false);

      const video = storyVideoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
    }
  }, []);

  const startStoryVideoMode = useCallback(
    (targetProgress?: number) => {
      markUserScrolled();
      storyTransitionStartTimeRef.current = performance.now();
      isStoryVideoModeRef.current = true;
      setIsStoryVideoMode(true);
      setIsAutoScrolling(true);
      autoScrollRef.current = true;

      const video = storyVideoRef.current;
      if (video) {
        video.playbackRate = storySpeedRef.current;
        if (targetProgress !== undefined && targetProgress >= 0) {
          progressRef.current = targetProgress;
          setProgress(targetProgress);
          video.currentTime = progressToVideoTime(
            targetProgress,
            durationRef.current
          );
        } else if (progressRef.current >= 0.99) {
          progressRef.current = 0;
          setProgress(0);
          video.currentTime = 0;
          window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
          video.currentTime = progressToVideoTime(
            progressRef.current,
            durationRef.current
          );
        }
        ensureVideoPlaying(video);
      }
    },
    [markUserScrolled, ensureVideoPlaying]
  );

  const syncScrollProgress = useCallback((markManualScroll: boolean) => {
    const storyTrackHeight = getStoryTrackHeight();
    const viewportHeight = window.innerHeight;
    const nextProgress = computeScrollProgress(
      window.scrollY,
      storyTrackHeight,
      viewportHeight
    );

    progressRef.current = nextProgress;

    if (markManualScroll) {
      lastManualScrollAtRef.current = performance.now();
    }

    setProgress((prev) =>
      Math.abs(nextProgress - prev) > 0.003 ? nextProgress : prev
    );
  }, [getStoryTrackHeight]);

  const jumpToProgress = useCallback(
    (targetProgress: number) => {
      markUserScrolled();
      stopStoryVideoMode();
      const storyTrackHeight = getStoryTrackHeight();
      const viewportHeight = window.innerHeight;
      const targetY = getScrollYForProgress(
        targetProgress,
        storyTrackHeight,
        viewportHeight
      );
      lastManualScrollAtRef.current = performance.now();
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [markUserScrolled, stopStoryVideoMode, getStoryTrackHeight]
  );

  const jumpToDirectionsSection = useCallback(() => {
    markUserScrolled();
    stopStoryVideoMode();
    const el = document.getElementById('visit-directions');
    if (el) {
      lastManualScrollAtRef.current = performance.now();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [markUserScrolled, stopStoryVideoMode]);

  const toggleAutoScroll = useCallback(() => {
    if (isStoryVideoModeRef.current) {
      stopStoryVideoMode();
    } else {
      startStoryVideoMode();
    }
  }, [startStoryVideoMode, stopStoryVideoMode]);

  const handleStartJourney = useCallback(() => {
    markUserScrolled();
    startStoryVideoMode(0.008);
  }, [markUserScrolled, startStoryVideoMode]);

  const handleReturnToTop = useCallback(() => {
    jumpToProgress(0);
  }, [jumpToProgress]);

  useEffect(() => {
    syncScrollProgress(false);

    // Initial play check for the landing video loop
    ensureVideoPlaying(landingVideoRef.current);

    const handleScroll = () => {
      if (window.scrollY > 0) {
        markUserScrolled();
      }

      // If story video mode is active:
      if (isStoryVideoModeRef.current) {
        const timeSinceProgrammatic =
          performance.now() - lastProgrammaticScrollTimeRef.current;
        const scrollDelta = Math.abs(
          window.scrollY - lastProgrammaticScrollYRef.current
        );

        // Treat as programmatic if commanded recently (within 400ms) or within normal async browser scroll coalescing threshold
        const isProgrammatic =
          timeSinceProgrammatic < 400 || scrollDelta < 300;

        // Only interrupt story mode if the user is actively dragging the scrollbar or intentionally interacting
        if (!isProgrammatic && isUserInteractingRef.current) {
          stopStoryVideoMode();
        } else {
          // Programmatic scroll driven by video playback loop: skip redundant state sync
          return;
        }
      }

      syncScrollProgress(!autoScrollRef.current);
      if (progressRef.current <= 0.04) {
        ensureVideoPlaying(landingVideoRef.current);
      }
    };

    const handleResize = () => {
      syncScrollProgress(false);
    };

    const handleWheel = (e: WheelEvent) => {
      // Only interrupt on intentional scroll wheel gesture (> 8px), ignoring inertia micro-jitter
      if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 8) {
        markUserScrolled();
        stopStoryVideoMode();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const delta = Math.abs(e.touches[0].clientY - touchStartYRef.current);
        // Only interrupt on deliberate swipe gesture (> 25px)
        if (delta > 25) {
          markUserScrolled();
          stopStoryVideoMode();
        }
      }
    };

    const handlePointerDown = () => {
      isUserInteractingRef.current = true;
    };

    const handlePointerUp = () => {
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 200);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(
          e.key
        )
      ) {
        if (isStoryVideoModeRef.current) {
          stopStoryVideoMode();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markUserScrolled, syncScrollProgress, stopStoryVideoMode, ensureVideoPlaying]);

  useEffect(() => {
    let rafId = 0;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const dtSeconds = Math.min(0.1, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      const landingVideo = landingVideoRef.current;
      const isAtLanding = progressRef.current <= 0.01;

      if (isAtLanding && landingVideo) {
        ensureVideoPlaying(landingVideo);
      } else if (landingVideo && !landingVideo.paused) {
        if (isStoryVideoModeRef.current) {
          if (!storyTransitionStartTimeRef.current) {
            storyTransitionStartTimeRef.current = now;
          }
          // Allow landing video to play smoothly through the 2-second crossfade transition before pausing
          if (now - storyTransitionStartTimeRef.current > 2200) {
            landingVideo.pause();
          }
        } else if (progressRef.current > 0.04) {
          landingVideo.pause();
        }
      } else if (!isStoryVideoModeRef.current && progressRef.current <= 0.01) {
        storyTransitionStartTimeRef.current = 0;
      }

      // Until the user performs a scroll action and while at the landing stage,
      // the landing video plays in an infinite loop and the story scroll animation does not trigger.
      if (!hasUserScrolledRef.current && isAtLanding) {
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = 'scaleX(0)';
        }
        for (const beat of STORY_BEATS) {
          const cardEl = stageCardElementsRef.current.get(beat.id);
          if (!cardEl) continue;
          if (beat.isPrologue) {
            cardEl.style.transform = 'translate3d(0, 0px, 0) scale(1.0001)';
            cardEl.style.opacity = '1';
            cardEl.style.visibility = 'visible';
            cardEl.style.pointerEvents = 'auto';
          } else {
            cardEl.style.transform = 'translate3d(0, 24px, 0) scale(1.0001)';
            cardEl.style.opacity = '0';
            cardEl.style.visibility = 'hidden';
            cardEl.style.pointerEvents = 'none';
          }
        }
        if (scrollIndicatorRef.current) {
          scrollIndicatorRef.current.style.opacity = '1';
          scrollIndicatorRef.current.style.visibility = 'visible';
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      let activeCurrentTime = 0;
      let activeProgress = 0;

      // When Story Button is clicked: native 4K video plays forward and drives the scroll position at continuous 60 FPS
      if (isStoryVideoModeRef.current) {
        const video = storyVideoRef.current;
        if (video && video.readyState >= 1) {
          ensureVideoPlaying(video);
          const videoDur = Math.max(1, video.duration || durationRef.current || 30);

          if (!video.paused && !video.ended) {
            const rate = video.playbackRate || storySpeedRef.current || 1;
            // High-resolution continuous sub-frame delta progression on every RAF frame (120 FPS / 60 FPS)
            const deltaProgress = (dtSeconds * rate) / videoDur;
            let nextProgress = clampProgress(progressRef.current + deltaProgress);

            // Synchronize with video playback smoothly:
            if (!video.seeking && video.currentTime > 0) {
              const videoProgress = clampProgress(video.currentTime / videoDur);
              const drift = videoProgress - nextProgress;
              if (Math.abs(drift * videoDur) > 1.2) {
                // Large seek or background tab resume: snap
                nextProgress = videoProgress;
              } else {
                // Gentle continuous drift correction (0.04 per frame) without any perceptible step or hitch
                nextProgress = clampProgress(nextProgress + drift * 0.04);
              }
            }

            progressRef.current = nextProgress;

            const storyTrackHeight = getStoryTrackHeight();
            const viewportHeight = window.innerHeight;
            const targetY = getScrollYForProgress(
              nextProgress,
              storyTrackHeight,
              viewportHeight
            );

            lastProgrammaticScrollYRef.current = targetY;
            lastProgrammaticScrollTimeRef.current = performance.now();
            window.scrollTo(0, targetY);

            activeProgress = nextProgress;
            activeCurrentTime = nextProgress * videoDur;
            smoothedProgressRef.current = nextProgress;

            // Throttle setProgress state updates so React DOM tree only re-renders occasionally for chapter label updates
            setProgress((prev) =>
              Math.abs(nextProgress - prev) > 0.008 ? nextProgress : prev
            );

            if (nextProgress >= 0.999 || video.ended) {
              stopStoryVideoMode();
            }
          } else {
            // Auto-recovery: if video paused unexpectedly while story mode is active, resume playback seamlessly
            if (video.paused && !video.ended && progressRef.current < 0.995) {
              ensureVideoPlaying(video);
            }
            activeProgress = progressRef.current;
            activeCurrentTime = progressRef.current * videoDur;
            smoothedProgressRef.current = activeProgress;
          }
        }
      } else {
        // Manual scroll mode: calculate continuous scroll progress and smooth with linear interpolation (lerp)
        const storyTrackHeight = getStoryTrackHeight();
        const viewportHeight = window.innerHeight;
        const targetProgress = computeScrollProgress(
          window.scrollY,
          storyTrackHeight,
          viewportHeight
        );

        // Linear interpolation (lerp) for 60fps / 120fps buttery-smooth motion:
        smoothedProgressRef.current = lerpProgress(
          smoothedProgressRef.current,
          targetProgress,
          0.25
        );

        activeProgress = clampProgress(smoothedProgressRef.current);
        const videoDur =
          storyVideoRef.current?.duration ||
          durationRef.current ||
          DEFAULT_VIDEO_DURATION;
        activeCurrentTime = activeProgress * videoDur;
      }

      // 1. Directly drive top progress bar fill using GPU transform scaleX with transform-origin: left
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${activeProgress})`;
      }

      // 2. Directly drive each stage text overlay container with smoothstep Hermite curves and sub-pixel scale(1.0001)
      for (const beat of STORY_BEATS) {
        const cardEl = stageCardElementsRef.current.get(beat.id);
        if (!cardEl) continue;

        const { opacity, y } = computeStageTextMotion(
          activeCurrentTime,
          beat.videoStartSeconds,
          beat.videoEndSeconds,
          { isPrologue: beat.isPrologue, isTheEnd: beat.isTheEnd }
        );

        const safeY = Math.abs(y) < 0.0001 ? 0 : y;
        cardEl.style.transform = `translate3d(0, ${safeY.toFixed(3)}px, 0) scale(1.0001)`;
        cardEl.style.opacity = opacity.toFixed(4);
        cardEl.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
        cardEl.style.pointerEvents = opacity > 0.001 ? 'auto' : 'none';
      }

      // 3. Directly drive landing scroll indicator
      if (scrollIndicatorRef.current) {
        const indOpacity = Math.max(0, Math.min(1, 1 - activeCurrentTime / 3.0));
        scrollIndicatorRef.current.style.opacity = indOpacity.toFixed(3);
        scrollIndicatorRef.current.style.visibility =
          indOpacity > 0.01 ? 'visible' : 'hidden';
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ensureVideoPlaying, stopStoryVideoMode]);

  const handleStoryVideoMetadata = () => {
    const video = storyVideoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      durationRef.current = video.duration;
    }
  };

  const activeChapter = getActiveChapter(progress);
  const activeBeat = getActiveBeat(progress);
  const harvestAtmosphereIntensity = getHarvestAtmosphereOpacity(progress);
  const landingOpacity = isStoryVideoMode ? 0 : getLandingVideoOpacity(progress);

  return (
    <div
      className="relative min-h-screen w-full text-white"
      data-testid="bakery-journey-app"
      data-active-chapter={activeChapter.id}
      data-active-beat={activeBeat.id}
      data-has-scrolled={hasUserScrolled}
      data-landing-opacity={landingOpacity}
      data-story-video-mode={isStoryVideoMode}
    >
      {quotaExceeded && (
        <div className="bg-amber-100/95 border-b border-amber-300 text-amber-950 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-md backdrop-blur-md flex items-center justify-between gap-3">
          <span className="flex-1 text-center">
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            to update your billing or quota. The interactive diorama fallback is active below.
          </span>
          <button
            type="button"
            onClick={() => setQuotaExceeded(false)}
            className="p-1 rounded text-amber-900 hover:text-black hover:bg-amber-200/60 transition-colors cursor-pointer text-xs font-bold shrink-0"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* Background layers: Story Video (Story Button) + Frame Sequence Canvas (Scrollbar) + Landing Hero Loop */}
      <div className="fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden bg-stone-950 pointer-events-none">
        {/* Layer 1: Story Mode 4K frame sequence animation canvas (Active when controlled with scrollbar/wheel) */}
        <StoryFrameCanvas
          progress={progress}
          opacity={isStoryVideoMode ? 0 : 1}
        />

        {/* Layer 2: Story Mode 4K native video (Active when Story Button is clicked) */}
        {!storyVideoError && (
          <video
            ref={storyVideoRef}
            src={STORY_VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            onLoadedMetadata={handleStoryVideoMetadata}
            onError={() => setStoryVideoError(true)}
            onEnded={stopStoryVideoMode}
            onStalled={() => {
              if (isStoryVideoModeRef.current && storyVideoRef.current) {
                ensureVideoPlaying(storyVideoRef.current);
              }
            }}
            onWaiting={() => {
              // Video is buffering next segment chunks; keep story mode active
            }}
            aria-label="Story mode 4K journey video"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{
              opacity: isStoryVideoMode ? 1 : 0,
            }}
          />
        )}

        {/* Layer 3: Infinite Looping Landing Hero Video */}
        {!landingVideoError && (
          <video
            ref={landingVideoRef}
            src={LANDING_VIDEO_SRC}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            onCanPlay={() => ensureVideoPlaying(landingVideoRef.current)}
            onError={() => setLandingVideoError(true)}
            aria-label="Golden Grain Bakery landing hero loop"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{
              opacity: landingOpacity,
            }}
          />
        )}

        {/* Subtle cinematic golden shimmer bridging landing video into story frames */}
        {!isStoryVideoMode && progress > 0.01 && progress < 0.045 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-amber-300/10 to-transparent pointer-events-none transition-opacity duration-[2000ms]"
            style={{
              opacity: Math.sin(
                Math.min(1, Math.max(0, (progress - 0.01) / 0.035)) * Math.PI
              ) * 0.3,
            }}
          />
        )}

        {/* Subtle bottom-edge gradient only so the entire visual stays vibrant and clear */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 sm:h-56 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none"
        />

        {/* Dawn-to-Dusk Lighting Shift (Candlelit Evening Service mode) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-b from-[#090b14]/55 via-[#18121a]/35 to-[#1a0f05]/50 backdrop-brightness-[0.88] backdrop-contrast-[1.08] pointer-events-none transition-opacity duration-700 ease-in-out ${
            isDay ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>

      <WheatChaffOverlay
        intensity={harvestAtmosphereIntensity}
        chapterId={activeChapter.id}
      />
      <AmbientAudioController progress={progress} />

      <TopBar
        activeChapterId={activeChapter.id}
        progress={progress}
        progressFillRef={progressFillRef}
        isAutoScrolling={isAutoScrolling}
        onJumpToChapter={jumpToProgress}
        onToggleAutoScroll={toggleAutoScroll}
        isDay={isDay}
        onToggleEnvironment={handleToggleEnvironment}
        easterEggsFound={foundEggIds.length}
        totalEasterEggs={TOTAL_EASTER_EGGS}
        onOpenEasterEggModal={handleOpenEasterEggModal}
        storySpeed={storySpeed}
        onSpeedChange={handleSpeedChange}
        onToggleSliderWindow={handleToggleSliderWindow}
      />

      <main className="relative z-10 w-full">
        <div
          id="story-track"
          className="relative w-full"
          style={{ height: `${TOTAL_TRACK_VH}vh` }}
        >
          <div className="sticky top-0 h-[100dvh] w-full pointer-events-none flex flex-col justify-end overflow-hidden">
            {STORY_BEATS.map((beat) => {
              const egg = EASTER_EGG_ITEMS.find(
                (e) => e.stageBeatId === beat.id
              );
              return (
                <StoryStageCard
                  key={beat.id}
                  beat={beat}
                  isActive={activeBeat.id === beat.id}
                  onRegisterCard={handleRegisterCard}
                  onRegisterScrollIndicator={
                    beat.isPrologue ? handleRegisterScrollIndicator : undefined
                  }
                  onStartJourney={
                    beat.isPrologue ? handleStartJourney : undefined
                  }
                  onReturnToTop={
                    beat.isEpilogue ? handleReturnToTop : undefined
                  }
                  onJumpToDirections={
                    beat.isTheEnd ? jumpToDirectionsSection : undefined
                  }
                  onOpenRecipeCard={handleOpenRecipeCard}
                  easterEggItem={egg}
                  isEasterEggFound={egg ? foundEggIds.includes(egg.id) : false}
                  onDiscoverEasterEgg={handleDiscoverEasterEgg}
                  onOpenCakeFinisher={handleOpenCakeFinisher}
                />
              );
            })}
          </div>
        </div>

        <DirectionsMapSection />
      </main>

      <BakeryFooter
        onReturnToTop={() => jumpToProgress(0)}
        onJumpToDirections={jumpToDirectionsSection}
      />

      <RecipeCardModal
        card={activeRecipeCard}
        onClose={handleCloseRecipeCard}
      />

      <BakersSecretModal
        isOpen={isEasterEggModalOpen}
        foundIds={foundEggIds}
        onClose={handleCloseEasterEggModal}
      />

      <CakeFinisherModal
        isOpen={isCakeFinisherOpen}
        onClose={handleCloseCakeFinisher}
      />

      <BakerySliderDrawer
        isOpen={isSliderWindowOpen}
        onClose={handleCloseSliderWindow}
        onJumpToChapter={jumpToProgress}
        onOpenCakeFinisher={handleOpenCakeFinisher}
        onOpenEasterEggModal={handleOpenEasterEggModal}
        onOpenBakeSchedule={handleOpenBakeSchedule}
        onOpenHydrationInspector={handleOpenHydration}
        onOpenPairingSommelier={handleOpenSommelier}
        onOpenTableReservation={handleOpenTableReservation}
        onOpenPostcardGenerator={handleOpenPostcard}
        onJumpToDirections={jumpToDirectionsSection}
        easterEggsFound={foundEggIds.length}
        totalEasterEggs={TOTAL_EASTER_EGGS}
      />

      <HearthBakeScheduleModal
        isOpen={isBakeScheduleOpen}
        onClose={handleCloseBakeSchedule}
      />

      <SourdoughHydrationModal
        isOpen={isHydrationOpen}
        onClose={handleCloseHydration}
      />

      <PairingSommelierModal
        isOpen={isSommelierOpen}
        onClose={handleCloseSommelier}
      />

      <TableReservationModal
        isOpen={isTableReservationOpen}
        onClose={handleCloseTableReservation}
      />

      <PostcardGeneratorModal
        isOpen={isPostcardOpen}
        onClose={handleClosePostcard}
      />
    </div>
  );
}

