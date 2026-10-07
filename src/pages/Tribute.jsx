import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CTA } from "../components";

const TypewriterText = ({ text = "28 YEARS LIVED LEGEND", speed = 90, pause = 1600 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (!isDeleting && displayedText.length === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length - 1));
      }, speed / 2);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, text, speed, pause]);

  return (
    <span className="inline-block relative">
      {displayedText}
      <span className="animate-pulse text-red-500 inline-block ml-1 opacity-90">|</span>
    </span>
  );
};

const Tribute = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white font-sans select-none overflow-x-hidden pt-20 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Navigation (Signed To God World Style) */}
        <div className="flex items-center justify-between py-4 border-b border-zinc-800/80 mb-8">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl sm:text-2xl tracking-tighter uppercase font-pixel text-white">
              SIGNEDTO<span className="text-red-600">GOD</span> WORLD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-red-600 text-white font-pixel text-[10px] sm:text-xs tracking-wider uppercase font-bold flex items-center gap-1 shadow-lg shadow-red-600/40">
              <span>🎫 SIDHU MOOSE WALA</span>
            </span>

            <Link
              to="/"
              className="text-xs font-pixel text-neutral-400 hover:text-white transition-colors ml-2"
            >
              ← HOME
            </Link>
          </div>
        </div>

        {/* Hero Banner Section 1 - "HALE MUKEYA NAHI" */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-red-900/40 p-8 sm:p-16 mb-12 flex flex-col items-center justify-center text-center shadow-2xl">
          {/* Ambient Warm Golden & Red Flare Background */}
          <div className="absolute inset-0 bg-radial-gradient from-red-600/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none text-red-600 uppercase font-pixel filter drop-shadow-[0_4px_25px_rgba(220,38,38,0.7)]">
              HALE MUKEYA NAHI
            </h1>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-widest text-white uppercase font-pixel mt-3">
              SIDHU MOOSEWALA
            </h2>
          </div>
        </div>

        {/* Hero Section 2 - "28 YEARS LIVED LEGEND" (Animated Typewriter Motion) */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-900 border border-neutral-800 p-6 sm:p-12 mb-16 shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between">
          
          {/* Official High-Res Photo Portrait Container */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden border border-red-600/40 bg-neutral-950 shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center group">
              <img
                src="/assets/sidhu_portrait.jpg"
                alt="Sidhu Moose Wala Portrait"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>

          {/* Right Text Stats with Typewriter Animation */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left">
            <span className="text-xs font-pixel uppercase tracking-[0.3em] text-red-500 mb-2">
              Immortal Legacy • 1993 - 2022
            </span>
            
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-red-600 tracking-tight leading-tight uppercase font-pixel min-h-[4.5rem] sm:min-h-[7rem] flex items-center filter drop-shadow-[0_4px_20px_rgba(220,38,38,0.5)]">
              <TypewriterText text="28 YEARS LIVED LEGEND" />
            </h3>

            <p className="text-neutral-300 font-outfit text-base sm:text-lg mt-6 leading-relaxed">
              In just 28 years, Shubhdeep Singh Sidhu redefined global Punjabi music, inspiring millions with unshakeable courage, truth, and self-belief.
            </p>
          </div>
        </div>

        {/* Section 3 - "WHO WAS SIDHU MOOSEWALA?" */}
        <div className="w-full rounded-3xl bg-zinc-950 border border-neutral-800 p-6 sm:p-12 mb-16 shadow-xl">
          <span className="text-xs font-pixel uppercase tracking-[0.25em] text-neutral-400">
            About the Artist
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-red-600 tracking-tight leading-none uppercase font-pixel mt-2 mb-4">
            WHO WAS SIDHU MOOSEWALA?
          </h2>

          <h3 className="text-sm sm:text-base font-pixel text-neutral-300 tracking-wide mb-6">
            Shubhdeep Singh Sidhu — The Legacy of Sidhu Moose Wala
          </h3>

          <div className="space-y-4 text-neutral-300 font-outfit text-base sm:text-lg leading-relaxed border-l-2 border-red-600/80 pl-4 sm:pl-6">
            <p>
              Shubhdeep Singh Sidhu, known to millions as <span className="text-white font-bold">Sidhu Moose Wala</span>, was not just an artist — he was a cultural phenomenon.
            </p>
            <p>
              Born in the small village of Moosa in Mansa, Punjab (PB31), Sidhu carved his own path to global fame with nothing but pure talent, raw authenticity, and relentless work ethic. He brought modern Punjabi rap and hip-hop to the global Billboard charts while remaining deeply rooted in his culture.
            </p>
            <p className="italic text-amber-300/90 font-medium">
              "His songs were anthems of truth, courage, and self-respect. His voice continues to inspire creators worldwide to be fearless."
            </p>
          </div>
        </div>

        {/* Section 4 - FEATURED ALBUM: MOOSETAPE (Click to open Spotify Album directly) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-pixel uppercase tracking-widest text-red-500">Official Masterpiece</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-pixel uppercase tracking-tight">
                FEATURED ALBUM
              </h2>
            </div>
          </div>

          {/* Interactive MOOSETAPE Card (Clickable -> Opens Spotify Album Directly) */}
          <a
            href="https://open.spotify.com/album/3mL4404mOYuYg92wACePvX"
            target="_blank"
            rel="noopener noreferrer"
            title="Click to open MOOSETAPE on Spotify 🎧"
            className="group relative block w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-red-950/80 via-zinc-950 to-black border border-red-600/50 p-6 sm:p-10 shadow-[0_0_50px_rgba(220,38,38,0.25)] hover:border-red-500 hover:shadow-[0_0_60px_rgba(220,38,38,0.45)] transition-all duration-500 overflow-hidden text-left cursor-pointer"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="text-xs font-pixel px-3 py-1 rounded-full bg-red-600 text-white font-bold tracking-wider uppercase shadow-md shadow-red-600/40">
                🔥 BILLBOARD CHARTED
              </span>
              <span className="text-xs font-pixel text-neutral-400 flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-green-500 inline-block" viewBox="0 0 24 24">
                  <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3.102zM18.96 14.1c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.96-.18-1.08-.66-.12-.48.18-.96.66-1.08 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.12 1.26zm.18-3.36c-3.9-2.32-10.32-2.52-14.04-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.66-1.5.36z"/>
                </svg>
                32 TRACKS • 2021
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Moosetape Official Box Image */}
              <div className="w-full sm:w-64 aspect-square rounded-2xl overflow-hidden border border-red-600/40 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500 relative bg-black">
                <img
                  src="/assets/moosetape_cover.jpg"
                  alt="Moosetape Album Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-pixel text-red-500 uppercase tracking-widest">
                    Sidhu Moose Wala
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black font-pixel text-white group-hover:text-red-500 transition-colors uppercase tracking-tight mt-1">
                    MOOSE TAPE
                  </h3>
                  <p className="text-neutral-300 font-outfit text-sm sm:text-base mt-3 leading-relaxed">
                    The legendary 32-track masterpiece that dominated global Spotify charts and redefined modern Punjabi music forever.
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Section 5 - SEAMLESS CONTINUOUS DUAL AUTO-PLAYING VIDEO REEL */}
        <div className="mb-16">
          <div className="mb-4">
            <span className="text-xs font-pixel uppercase tracking-widest text-red-500">Live Visual Motion</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-pixel uppercase tracking-tight">
              CINEMATIC VIDEO REEL
            </h2>
          </div>

          {/* Seamless Video Reel Banner with Side Text */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-950 border border-red-900/40 shadow-2xl flex flex-col lg:flex-row gap-0 items-stretch">
            
            {/* Left/Top Dual Videos Container - Zero Gap, Auto-playing Muted */}
            <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-0 border-b lg:border-b-0 lg:border-r border-red-900/40 bg-black">
              {/* Seamless Video 1 */}
              <div className="relative aspect-[4/3] sm:aspect-[9/16] md:aspect-video lg:aspect-square w-full bg-black overflow-hidden group">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="/assets/sidhu_video1.mp4"
                  poster="/assets/video_poster1.jpg"
                >
                  Your browser does not support video.
                </video>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-red-500/40 text-[10px] font-pixel text-red-400">
                  REEL #01 • LIVE
                </div>
              </div>

              {/* Seamless Video 2 (Zero gap right next to Video 1) */}
              <div className="relative aspect-[4/3] sm:aspect-[9/16] md:aspect-video lg:aspect-square w-full bg-black overflow-hidden group border-t sm:border-t-0 sm:border-l border-red-900/30">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="/assets/sidhu_video2.mp4"
                  poster="/assets/video_poster2.jpg"
                >
                  Your browser does not support video.
                </video>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/40 text-[10px] font-pixel text-amber-300">
                  REEL #02 • LIVE
                </div>
              </div>
            </div>

            {/* Right Side Cool Typography Text Overlay Card */}
            <div className="w-full lg:w-5/12 p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-br from-zinc-950 via-neutral-900 to-red-950/40 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600/20 text-red-400 font-pixel text-[10px] tracking-wider mb-4 border border-red-600/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>5911 STAGE MOTION</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-pixel text-white leading-tight uppercase">
                  RAW PASSION.<br />
                  <span className="text-red-600">UNMATCHED STAGE PRESENCE.</span>
                </h3>

                <p className="text-neutral-300 font-outfit text-sm sm:text-base mt-4 leading-relaxed italic border-l-2 border-red-600/70 pl-3">
                  "Real emotion in every single frame. Sidhu Moose Wala in motion, delivering raw authenticity and electrifying energy to millions worldwide."
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-neutral-800 my-10" />
        <CTA />
      </div>
    </div>
  );
};

export default Tribute;
