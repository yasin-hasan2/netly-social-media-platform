import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

export default function InfiniteScroll({
  width = "100%",
  maxHeight = "100vh",
  items = [],
  itemMinHeight = 200,
  isTilted = false,
  tiltDirection = "left",
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = "down",
  pauseOnHover = false,
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  const getTiltTransform = () => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateX(15deg) rotateZ(-15deg) skewX(15deg)"
      : "rotateX(15deg) rotateZ(15deg) skewX(-15deg)";
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onPress: ({ target }) => {
        target.style.cursor = "grabbing";
      },
      onRelease: ({ target }) => {
        target.style.cursor = "grab";
      },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaY : deltaY;
        const distance = isDragging ? d * 2 : d * 5;
        gsap.to(container, {
          y: `+=${distance}`,
          duration: 0.5,
          ease: "expo.out",
        });
      },
    });

    let rafId;
    if (autoplay) {
      const directionFactor = autoplayDirection === "down" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

      const tick = () => {
        gsap.set(container, {
          y: `+=${speedPerFrame}`,
        });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => (rafId = requestAnimationFrame(tick));

        container.addEventListener("mouseenter", stopTicker);
        container.addEventListener("mouseleave", startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener("mouseenter", stopTicker);
          container.removeEventListener("mouseleave", startTicker);
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    items,
    autoplay,
    autoplaySpeed,
    autoplayDirection,
    pauseOnHover,
    isTilted,
    tiltDirection,
  ]);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full overflow-hidden"
      ref={wrapperRef}
      style={{ maxHeight }}
    >
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="flex flex-col px-4 cursor-grab"
        style={{
          width,
          transform: getTiltTransform(),
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="w-full mb-6 select-none"
            style={{
              minHeight: `${itemMinHeight}px`,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
