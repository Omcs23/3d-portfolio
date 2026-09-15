import { Html } from "@react-three/drei";

const Loader = () => {
  // If full-screen intro Preloader is active, suppress canvas spinner to prevent visual overlap
  const isPreloaderActive =
    typeof document !== "undefined" &&
    !!document.querySelector("[data-preloader='true']");

  if (isPreloaderActive) return null;

  return (
    <Html>
      <div className="flex justify-center items-center">
        <div className="w-14 h-14 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </Html>
  );
};

export default Loader;
