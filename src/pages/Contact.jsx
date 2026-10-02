import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";
import { useTheme } from "../context/ThemeContext";

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
    <section className="relative flex lg:flex-row flex-col gap-10 max-container">
      {alert.show && <Alert {...alert} />}

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
    </section>
  );
};

export default Contact;
