import Hero from "./components/sections/Hero";
import CustomCursor from "./components/shared/CustomCursor";
import SliderEngine from "./components/shared/SliderEngine";
import Skills from "./components/sections/Skills";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";


function App() {
  return (
    <main>
      <CustomCursor />

      <SliderEngine>
        <Hero/>

        <Skills />

        <About />
        <Projects/>
        <Contact />
      </SliderEngine>
    </main>
  );
}

export default App;