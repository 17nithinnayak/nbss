import { useEffect, useRef, useState } from "react";

const filenameOrder = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const localPhotos = Object.entries(
  import.meta.glob("../assets/landing/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}", {
    eager: true,
    import: "default",
    query: "?url",
  })
)
  .sort(([first], [second]) => filenameOrder.compare(first, second))
  .map(([, url]) => url);

const fallbackPhotos = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2200&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=85",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=85",
];

const slides = localPhotos.length ? localPhotos : fallbackPhotos;

export function Landing() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const thumbnailRail = useRef(null);

  useEffect(() => {
    if (!isPlaying || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    thumbnailRail.current?.children[activeSlide]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeSlide]);

  function moveSlide(direction) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <main className="min-h-[calc(100svh-84px)] bg-[#101311] text-white">
      <section className="mx-auto max-w-[1680px] px-0 pb-5 pt-0 sm:px-5 sm:pt-5 lg:px-8">
        <div className="relative flex h-[min(72svh,760px)] min-h-[340px] items-center justify-center overflow-hidden bg-[#101311] sm:rounded-sm">
          <img
            key={`backdrop-${slides[activeSlide]}`}
            src={slides[activeSlide]}
            alt=""
            aria-hidden="true"
            className="landing-backdrop-enter absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-[30px]"
          />
          <div className="absolute inset-0 bg-black/35" />
          <img
            key={slides[activeSlide]}
            src={slides[activeSlide]}
            alt={`NBSS community photo ${activeSlide + 1}`}
            className="landing-photo-enter relative z-10 h-full w-full object-contain p-2 drop-shadow-2xl sm:p-5 lg:p-8"
          />
        </div>

        <div className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-white/15 px-1 py-3 sm:px-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => moveSlide(-1)}
              aria-label="Previous photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 5v14M16 5v14" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => moveSlide(1)}
              aria-label="Next photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="font-mono text-xs tabular-nums text-white/65" aria-live="polite">
            {String(activeSlide + 1).padStart(2, "0")} <span className="px-1 text-white/30">/</span> {String(slides.length).padStart(2, "0")}
          </p>
        </div>

        <div
          ref={thumbnailRail}
          className="landing-thumbnail-rail mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-2 overflow-x-auto py-4 sm:gap-3"
          role="group"
          aria-label="Choose a slideshow photo"
        >
          {slides.map((photo, index) => (
            <button
              key={photo}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`relative aspect-[1.55] w-24 flex-none snap-start overflow-hidden bg-white/10 transition-all sm:w-[min(10vw,132px)] ${
                activeSlide === index ? "opacity-100 ring-1 ring-inset ring-white/80" : "opacity-45 hover:opacity-90"
              }`}
            >
              <img src={photo} alt="" className="h-full w-full object-cover" />
              {activeSlide === index && <span className="tricolor-stripe absolute inset-x-0 bottom-0" />}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}