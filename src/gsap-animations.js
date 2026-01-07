// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class PortfolioAnimations {
    constructor() {
        console.log("Initializing Portfolio Animations...");
        this.initHero();
        this.initReveals();
        this.initExperienceTimeline();
        this.initSkillInteractions();
        this.initStatsCounter();

        // Refresh ScrollTrigger after a short delay to ensure layout is settled
        window.addEventListener('load', () => {
            setTimeout(() => ScrollTrigger.refresh(), 500);
        });
    }

    initHero() {
        const tl = gsap.timeline();

        tl.from("#hero h1", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        })
            .from("#hero p", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8")
            .from("#hero .flex-wrap a", {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.4");
    }

    initReveals() {
        // More robust reveal logic: animate elements individually as they enter the viewport
        const revealElements = document.querySelectorAll(".animate-on-scroll, section h2, #skills .p-8, #projects .group, .p-6.bg-light-surface");

        revealElements.forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: (i % 3) * 0.1, // Slight stagger for grid items
                ease: "power2.out",
                clearProps: "all" // Important: ensure JS doesn't lock properties after animation
            });
        });
    }

    initExperienceTimeline() {
        const experienceSection = document.querySelector("#experience");
        if (!experienceSection) return;

        const timelineLines = experienceSection.querySelectorAll(".border-l-2");
        const dots = experienceSection.querySelectorAll(".rounded-full");

        timelineLines.forEach((line) => {
            gsap.from(line, {
                scaleY: 0,
                transformOrigin: "top center",
                scrollTrigger: {
                    trigger: line,
                    start: "top 80%",
                    end: "bottom 60%",
                    scrub: 1
                }
            });
        });

        dots.forEach(dot => {
            gsap.from(dot, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                scrollTrigger: {
                    trigger: dot,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    initSkillInteractions() {
        // "Data Stream" interaction for skill cards
        const categories = document.querySelectorAll("#skills .grid > div");

        categories.forEach(category => {
            const listItems = category.querySelectorAll("li");
            const icon = category.querySelector("img, i");

            category.addEventListener("mouseenter", () => {
                gsap.to(category, {
                    y: -5,
                    borderColor: "rgba(66, 133, 244, 0.5)",
                    boxShadow: "0 20px 40px -20px rgba(66, 133, 244, 0.3)",
                    duration: 0.4,
                    ease: "power2.out"
                });

                if (icon) {
                    gsap.to(icon, { rotate: 10, scale: 1.1, duration: 0.3 });
                }

                gsap.to(listItems, {
                    x: 10,
                    color: document.documentElement.classList.contains('dark') ? "#4285F4" : "#1A73E8",
                    stagger: 0.05,
                    duration: 0.2
                });
            });

            category.addEventListener("mouseleave", () => {
                gsap.to(category, {
                    y: 0,
                    borderColor: "rgba(31, 41, 55, 1)",
                    boxShadow: "none",
                    duration: 0.4
                });

                if (icon) {
                    gsap.to(icon, { rotate: 0, scale: 1, duration: 0.3 });
                }

                gsap.to(listItems, {
                    x: 0,
                    color: "",
                    stagger: 0.05,
                    duration: 0.2
                });
            });
        });

        // "Code Glint" for certifications
        const certs = document.querySelectorAll(".p-6.bg-light-surface");
        certs.forEach(cert => {
            cert.style.position = "relative";
            cert.style.overflow = "hidden";

            const glint = document.createElement("div");
            glint.className = "absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none";
            cert.appendChild(glint);

            cert.addEventListener("mouseenter", () => {
                gsap.fromTo(glint,
                    { left: "-150%" },
                    { left: "150%", duration: 0.8, ease: "power2.inOut" }
                );
            });
        });
    }

    initStatsCounter() {
        const stats = document.querySelectorAll(".font-bold.border-b-2");

        stats.forEach(stat => {
            const text = stat.innerText;
            const numericValue = parseFloat(text.replace(/[^\d.]/g, ''));
            const suffix = text.replace(/[\d.\s]/g, ''); // Keep TB, %, etc.

            const obj = { count: 0 };

            gsap.to(obj, {
                count: numericValue,
                scrollTrigger: {
                    trigger: stat,
                    start: "top 95%",
                },
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                    stat.innerText = Math.round(obj.count) + (suffix ? " " + suffix : "");
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly for Three.js to initialize if needed
    setTimeout(() => {
        window.portfolioAnims = new PortfolioAnimations();
    }, 100);
});
