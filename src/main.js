import './styles.css'
import Lenis from '@studio-freight/lenis';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 900) {
    const lenis = new Lenis();
    const videoContainer = document.querySelector(".video-container-desktop");
    const videoTitleElements = document.querySelectorAll(".video-title p");

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const breakpoints = [
      { maxWidth: 1000, translateY: -100, movMultiplier: 450 },
      { maxWidth: 1100, translateY: -100, movMultiplier: 500 },
      { maxWidth: 1200, translateY: -100, movMultiplier: 550 },
      { maxWidth: 1300, translateY: -100, movMultiplier: 600 },
    ];

    const getInitialValues = () => {
      const width = window.innerWidth;

      for (const bp of breakpoints) {
        if (width < bp.maxWidth) {
          return {
            translateY: bp.translateY,
            movementMultiplier: bp.movMultiplier
          };
        }
      }

      return {
        translateY: -95,
        movementMultiplier: 650,
      };
    };

    const initialValues = getInitialValues();

    const animationState = {
      scrollProgress: 0,
      initialTranslateY: initialValues.translateY,
      currentTranslateY: initialValues.translateY,
      movementMultiplier: initialValues.movementMultiplier,
      scale: 0.25,
      fontSize: 80,
      gap: 2,
      targetMouseX: 0,
      currentMouseX: 0,
    };

    window.addEventListener("resize", () => {
      const newValues = getInitialValues();
      animationState.initialTranslateY = newValues.translateY;
      animationState.movementMultiplier = newValues.movementMultiplier;

      if (animationState.scrollProgress === 0) {
        animationState.currentTranslateY = newValues.translateY;
      }
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".intro",
        start: "top bottom",
        end: "top 15%",
        scrub: true,
        onUpdate: (self) => {
          animationState.scrollProgress = self.progress;

          animationState.currentTranslateY = gsap.utils.interpolate(
            animationState.initialTranslateY,
            0,
            animationState.scrollProgress
          );

          animationState.scale = gsap.utils.interpolate(
            0.25,
            1,
            animationState.scrollProgress
          );

          animationState.gap = gsap.utils.interpolate(
            2,
            1,
            animationState.scrollProgress
          );

          if (animationState.scrollProgress < 0.4) {
            const firstPartProgress = animationState.scrollProgress / 0.4;
            animationState.fontSize = gsap.utils.interpolate(
              80,
              40,
              firstPartProgress
            );
          } else {
            const secondPartProgress = (animationState.scrollProgress - 0.4) / 0.6;
            animationState.fontSize = gsap.utils.interpolate(
              40,
              20,
              secondPartProgress
            );
          }
        }
      }
    });

    document.addEventListener("mousemove", (e) => {
      animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    });

    const animate = () => {
      if (window.innerWidth < 900) return;

      const {
        scale,
        targetMouseX,
        currentMouseX,
        currentTranslateY,
        fontSize,
        gap,
        movementMultiplier,
      } = animationState;

      const scaleMovementMultiplier = (1 - scale) * movementMultiplier;
      const maxHorizontalMovement = scale < 0.95 ? targetMouseX * scaleMovementMultiplier : 0;

      animationState.currentMouseX = gsap.utils.interpolate(
        currentMouseX,
        maxHorizontalMovement,
        0.05
      );

      videoContainer.style.transform = `translateY(${currentTranslateY}%) translateX(${animationState.currentMouseX}px) scale(${scale})`;
      videoContainer.style.gap = `${gap}em`;

      videoTitleElements.forEach((element) => {
        element.style.fontSize = `${fontSize}px`;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
});


// DATE DISPLAY
function updateTime() {
  const options = {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const timeString = new Date().toLocaleTimeString('en-GB', options);
  document.getElementById('lagos-time').textContent = "Lagos, Nigeria " +timeString;
}

updateTime(); 
setInterval(updateTime, 1000); // updates by the second to ensure it's current

  //COLOR THEME SWITCHING 
 
  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.querySelector(".theme-changer");
    const root = document.documentElement;
  
    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    }
  
    themeToggle.addEventListener("click", () => {
      root.classList.toggle("dark");
  
      // Save preference to localStorage
      if (root.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  });