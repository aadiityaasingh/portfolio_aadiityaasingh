import Hero from "./components/sections/Hero";
import CustomCursor from "./components/shared/CustomCursor";
import SliderEngine from "./components/shared/SliderEngine";


function App() {
  return (
    <main>
      <CustomCursor />

      <SliderEngine>
        <Hero/>

        <div className="h-screen flex items-center justify-center text-white text-5xl">
          Skills
        </div>

        <div className="h-screen flex items-center justify-center text-white text-5xl">
          About
        </div>
      </SliderEngine>
    </main>
  );
}

export default App;