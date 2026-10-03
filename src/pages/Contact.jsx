import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";
import { useTheme } from "../context/ThemeContext";
import { socialLinks } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const { isNight } = useTheme();

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentAnimation("hit");

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Om Sharma",
          from_email: form.email,
          user_name: form.name,
          user_email: form.email,
          reply_to: form.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          showAlert({
            show: true,
            text: "Thank you for your message 😃",
            type: "success",
          });

          setTimeout(() => {
            hideAlert(false);
            setCurrentAnimation("idle");
            setForm({
              name: "",
              email: "",
              message: "",
            });
          }, 3000);
        },
        (error) => {
          setLoading(false);
          console.error("EmailJS Error:", error);
          setCurrentAnimation("idle");

          showAlert({
            show: true,
            text: error?.text ? `EmailJS Error: ${error.text}` : "I didn't receive your message 😢",
            type: "danger",
          });
        }
      );
  };

  return (
    <section className="relative flex flex-col gap-10 max-container">
      {alert.show && <Alert {...alert} />}

      {/* Top Section: Form + 3D Fox Canvas */}
      <div className="flex lg:flex-row flex-col gap-10 w-full">
        {/* Left Column: Contact Form */}
        <div className="flex-1 min-w-[50%] flex flex-col justify-center">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-space uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Let's Build Together
            </div>

            <h1 className="head-text">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
                Touch
              </span>
            </h1>
          </div>

          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${isNight ? "text-slate-300" : "text-slate-600"}`}>
            Have a question, job proposal, or project idea? Drop a message below and I'll get back to you promptly!
          </p>

          <div
            className={`mt-8 p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
              isNight
                ? "bg-slate-900/90 border-slate-800 shadow-slate-950/50"
                : "bg-white border-slate-200/80 shadow-blue-500/10"
            }`}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6"
            >
              <label className={`font-semibold font-outfit text-sm ${isNight ? "text-slate-200" : "text-slate-700"}`}>
                Your Name
                <input
                  type="text"
                  name="name"
                  className={`input mt-1.5 ${
                    isNight
                      ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="e.g. Alex Morgan"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <label className={`font-semibold font-outfit text-sm ${isNight ? "text-slate-200" : "text-slate-700"}`}>
                Email Address
                <input
                  type="email"
                  name="email"
                  className={`input mt-1.5 ${
                    isNight
                      ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="alex@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <label className={`font-semibold font-outfit text-sm ${isNight ? "text-slate-200" : "text-slate-700"}`}>
                Your Message
                <textarea
                  name="message"
                  rows="4"
                  className={`textarea mt-1.5 ${
                    isNight
                      ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="Share project details, opportunities, or feedback..."
                  required
                  value={form.message}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn font-outfit font-bold text-base py-3.5 mt-2 flex items-center justify-center gap-2 group"
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <span>{loading ? "Sending Message..." : "Send Message"}</span>
                <span className="group-hover:translate-x-1 transition-transform">✉️</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive 3D Fox Canvas */}
        <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
          <Canvas
            camera={{
              position: [0, 0, 5],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
          >
            <directionalLight
              position={[0, 0, 1]}
              intensity={isNight ? 1.2 : 2.5}
              color={isNight ? "#a5b4fc" : "#ffffff"}
            />
            <ambientLight intensity={isNight ? 0.6 : 1} />
            <pointLight
              position={[5, 10, 0]}
              intensity={isNight ? 1 : 2}
              color={isNight ? "#818cf8" : "#ffffff"}
            />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={isNight ? 1 : 2}
            />

            <Suspense fallback={<Loader />}>
              <Fox
                currentAnimation={currentAnimation}
                position={[0.5, 0.35, 0]}
                rotation={[12.629, -0.6, 0]}
                scale={[0.5, 0.5, 0.5]}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Bottom Full-Width Section: 3D Styled Coding & Social Profiles */}
      <div className="w-full mt-10 pt-8 border-t border-slate-700/30">
        <div className="flex flex-col items-start mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Verified Profiles & Channels
          </div>
          <h3 className="subhead-text">Coding & Social Profiles</h3>
          <p className={`mt-1.5 text-sm sm:text-base ${isNight ? "text-slate-300" : "text-slate-600"}`}>
            Connect with Om across competitive programming platforms and official developer handles:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
          {socialLinks
            .filter((s) => s.name !== "Contact")
            .map((profile) => (
              <a
                key={profile.name}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 shadow-xl select-none min-w-0 ${
                  isNight
                    ? "bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800 hover:border-cyan-500/50 shadow-cyan-950/30 hover:shadow-cyan-500/20"
                    : "bg-gradient-to-b from-white to-slate-50 border-slate-200/90 hover:border-blue-400 shadow-blue-500/10 hover:shadow-blue-500/20"
                }`}
              >
                {/* 3D Elevated Icon Badge */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg shrink-0 ${
                    isNight
                      ? "bg-slate-900 border border-slate-700/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.5)] group-hover:border-cyan-400/60"
                      : "bg-slate-100 border border-slate-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.08)] group-hover:border-blue-400"
                  }`}
                >
                  <img
                    src={profile.iconUrl}
                    alt={profile.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] icon-hover-animate"
                  />
                </div>

                <div className="text-center w-full min-w-0">
                  <span
                    className={`block text-xs sm:text-sm font-bold font-poppins truncate transition-colors ${
                      isNight ? "text-slate-100 group-hover:text-cyan-300" : "text-slate-800 group-hover:text-blue-600"
                    }`}
                  >
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-0.5 mt-0.5">
                    Connect ↗
                  </span>
                </div>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
