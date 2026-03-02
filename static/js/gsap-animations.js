document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Initial setup for hero elements
        gsap.from(".greeting", { duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
        gsap.from(".name-highlight", { duration: 1.2, x: -50, opacity: 0, ease: "power4.out", delay: 0.5 });
        gsap.from(".role", { duration: 1, y: 20, opacity: 0, ease: "back.out(1.7)", delay: 0.8 });
        gsap.from(".hero-description", { duration: 1, y: 30, opacity: 0, ease: "power2.out", delay: 1 });
        gsap.from(".hero-buttons", { duration: 1, y: 20, opacity: 0, ease: "power2.out", delay: 1.2 });
        gsap.from(".stats-row", { duration: 1.5, y: 40, opacity: 0, ease: "expo.out", delay: 1.4 });

        // Avatar and floating icons animation
        gsap.from(".avatar", { duration: 1.5, scale: 0.5, opacity: 0, ease: "elastic.out(1, 0.5)", delay: 0.5 });

        const floatIcons = document.querySelectorAll(".floating-icons i");
        if (floatIcons.length > 0) {
            gsap.from(floatIcons, {
                duration: 1,
                scale: 0,
                opacity: 0,
                ease: "back.out(2)",
                stagger: 0.2,
                delay: 1.5
            });

            // Continuous floating animation for icons
            floatIcons.forEach((icon, index) => {
                gsap.to(icon, {
                    y: "-=15",
                    x: index % 2 === 0 ? "+=10" : "-=10",
                    rotation: index % 2 === 0 ? 15 : -15,
                    duration: 2 + Math.random(),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: Math.random()
                });
            });
        }

        // Scroll triggers for project cards
        const projectCards = document.querySelectorAll(".project-card");
        if (projectCards.length > 0) {
            projectCards.forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        }

        // Scroll triggers for timeline and about items
        const timelineItems = document.querySelectorAll(".timeline-item");
        if (timelineItems.length > 0) {
            timelineItems.forEach((item, index) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                    },
                    x: -30,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.1
                });
            });
        }

        // Skill bars animation on scroll
        const skillBars = document.querySelectorAll(".skill-bar-fill");
        if (skillBars.length > 0) {
            skillBars.forEach(bar => {
                gsap.to(bar, {
                    scrollTrigger: {
                        trigger: bar.parentElement,
                        start: "top 90%"
                    },
                    width: bar.getAttribute('data-width'),
                    duration: 1.5,
                    ease: "power3.out"
                });
            });
        }

        // About Info Panel Animation
        const aboutPanels = document.querySelectorAll(".about-section");
        if (aboutPanels.length > 0) {
            aboutPanels.forEach(panel => {
                gsap.from(panel, {
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 85%"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });
        }
    }
});
