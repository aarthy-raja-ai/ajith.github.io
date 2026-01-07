// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Global ScrollTrigger Configuration
ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true
});

// Handle mobile scroll normalization for smoother experience on touch devices
if (ScrollTrigger.isTouch) {
    ScrollTrigger.normalizeScroll(true);
}

class PortfolioAnimations {
    constructor() {
        console.log("🚀 Portfolio Animations: Initializing...");
        this.mm = gsap.matchMedia();
        this.init();
    }

    init() {
        // Run specific animations based on screen size
        this.mm.add({
            isDesktop: "(min-width: 1024px)",
            isMobile: "(max-width: 1023px)"
        }, (context) => {
            let { isDesktop, isMobile } = context.conditions;

            this.initHero(isMobile);
            this.initReveals(isMobile);
            this.initExperienceTimeline(isMobile);
            this.initSkillInteractions();
            this.initStatsCounter();
            this.initAuroraAnimation();

            return () => {
                // Cleanup logic if needed when switching media queries
            };
        });

        // Global refresh after everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
                console.log("✅ ScrollTrigger Refreshed");
            }, 500);
        });

        // Debounced resize refresh
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
        });
    }

    initHero(isMobile) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to("#hero h1", {
            y: 0,
            opacity: 1,
            duration: isMobile ? 1 : 1.2,
        })
            .to("#hero p", {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, "-=0.8")
            .to("#hero .flex-wrap", {
                y: 0,
                opacity: 1,
                duration: 0.6,
            }, "-=0.4");

        // Background canvas fade in
        gsap.to("#hero-canvas", { opacity: 0.6, duration: 2, delay: 0.5 });
    }

    initReveals(isMobile) {
        const revealElements = document.querySelectorAll(".animate-on-scroll, section h2, #skills .p-8, #projects .group, .p-6.bg-light-surface");

        revealElements.forEach((el, i) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? "top 95%" : "top 85%", // Trigger earlier on mobile
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: isMobile ? 0 : (i % 3) * 0.1, // Less stagger on mobile for snappiness
                clearProps: "transform" // Keep opacity but clear the transform for better layout
            });
        });
    }

    initExperienceTimeline(isMobile) {
        const experienceSection = document.querySelector("#experience");
        if (!experienceSection) return;

        const timelineLines = experienceSection.querySelectorAll(".border-l-2");
        const dots = experienceSection.querySelectorAll(".rounded-full");

        timelineLines.forEach((line) => {
            gsap.fromTo(line,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    transformOrigin: "top center",
                    scrollTrigger: {
                        trigger: line,
                        start: "top 80%",
                        end: "bottom 60%",
                        scrub: 1
                    }
                }
            );
        });

        dots.forEach(dot => {
            gsap.to(dot, {
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: dot,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    initSkillInteractions() {
        const categories = document.querySelectorAll("#skills .grid > div");

        const skillColors = {
            "Google Cloud": "rgba(66, 133, 244, 0.5)",
            "Agentic AI": "rgba(168, 85, 247, 0.5)",
            "DevOps & Infra": "rgba(16, 185, 129, 0.5)"
        };

        categories.forEach(category => {
            const title = category.querySelector("h3")?.innerText;
            const glowColor = skillColors[title] || "rgba(66, 133, 244, 0.5)";
            const listItems = category.querySelectorAll("li");

            category.addEventListener("mouseenter", () => {
                gsap.to(category, {
                    y: -8,
                    borderColor: glowColor,
                    boxShadow: `0 25px 50px -12px ${glowColor.replace('0.5', '0.3')}`,
                    duration: 0.4
                });

                gsap.to(listItems, {
                    x: 10,
                    color: glowColor.replace('0.5', '1'),
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

                gsap.to(listItems, {
                    x: 0,
                    color: "",
                    stagger: 0.05,
                    duration: 0.2
                });
            });
        });
    }

    initStatsCounter() {
        const stats = document.querySelectorAll(".font-bold.border-b-2");

        stats.forEach(stat => {
            const text = stat.innerText;
            const numericValue = parseFloat(text.replace(/[^\d.]/g, ''));
            const suffix = text.replace(/[\d.\s]/g, '');

            const obj = { count: 0 };

            gsap.to(obj, {
                count: numericValue,
                scrollTrigger: {
                    trigger: stat,
                    start: "top 95%",
                },
                duration: 2,
                onUpdate: () => {
                    stat.innerText = Math.round(obj.count) + (suffix ? " " + suffix : "");
                }
            });
        });
    }

    initAuroraAnimation() {
        gsap.to(".aurora-orb", {
            x: "random(-100, 100)",
            y: "random(-50, 50)",
            duration: "random(15, 25)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 5,
                from: "random"
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Three.js starts first if present
    setTimeout(() => {
        window.portfolioAnims = new PortfolioAnimations();
    }, 150);
});
