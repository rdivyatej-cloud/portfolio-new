/* ==========================================================================
   DIVYATEJ RALLAPALLI — PORTFOLIO 2026
   Master Script: 3D ID Card, Custom Cursor, Floating Nav Spy, Project Modals,
   Interactive Storyboard, Clipboard Utilities, Form Mailer & Scroll Animations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // Set Copyright Year
    const copyrightYear = document.getElementById("copyright-year");
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    initPreloader();
    initCustomCursor();
    initNavbarAndScroll();
    initStoryboard();
    initScrollReveal();
});

/* ==========================================================================
   2. 3D ACCESS BADGE LOADER OVERLAY
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById("preloader");
    const progressBar = document.getElementById("loader-progress-bar");
    const percentLabel = document.getElementById("loader-percent");
    const enterBtn = document.getElementById("enter-site-btn");
    const calibratingLabel = document.getElementById("calibrating-label");
    const skipBtn = document.getElementById("skip-loader-btn");
    const badgeContainer = document.getElementById("badge-card-3d");

    if (!preloader) return;

    let progress = 0;
    let isCompleted = false;

    // Fast, smooth ticker (completes in ~1.5s)
    const interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            progress = 100;
            if (progressBar) progressBar.style.width = "100%";
            if (percentLabel) percentLabel.textContent = "100%";
            if (calibratingLabel) calibratingLabel.style.display = "none";
            if (enterBtn) {
                enterBtn.style.display = "inline-flex";
                if (typeof lucide !== "undefined") lucide.createIcons();
            }
            return;
        }

        // Accelerating curve
        const step = Math.max(2, Math.floor((100 - progress) * 0.18));
        progress = Math.min(100, progress + step);

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentLabel) percentLabel.textContent = `${progress}%`;
    }, 45);

    // Failsafe timeout: User is NEVER stuck (max 2.2s)
    const failsafe = setTimeout(() => {
        if (calibratingLabel) calibratingLabel.style.display = "none";
        if (enterBtn) {
            enterBtn.style.display = "inline-flex";
            if (typeof lucide !== "undefined") lucide.createIcons();
        }
        if (progressBar) progressBar.style.width = "100%";
        if (percentLabel) percentLabel.textContent = "100%";
    }, 2200);

    function dismissLoader() {
        if (isCompleted) return;
        isCompleted = true;
        clearInterval(interval);
        clearTimeout(failsafe);

        preloader.classList.add("fade-out");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 700);
    }

    if (enterBtn) enterBtn.addEventListener("click", dismissLoader);
    if (skipBtn) skipBtn.addEventListener("click", dismissLoader);

    // Pressing ESC dismisses the loader immediately
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !isCompleted) {
            dismissLoader();
        }
    });

    // 3D Tilt Effect on mousemove over preloader
    if (badgeContainer) {
        preloader.addEventListener("mousemove", (e) => {
            if (isCompleted) return;
            const rect = preloader.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 22; // max 22 deg
            const rotateY = (x / rect.width) * 22;

            badgeContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        preloader.addEventListener("mouseleave", () => {
            badgeContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }
}

/* ==========================================================================
   3. CUSTOM INTERACTIVE CURSOR
   ========================================================================== */
function initCustomCursor() {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    if (!dot || !ring) return;

    // Disable on touch screens
    if (window.matchMedia("(pointer: coarse)").matches) {
        dot.style.display = "none";
        ring.style.display = "none";
        return;
    }

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            dot.style.opacity = "1";
            ring.style.opacity = "1";
        }

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    document.addEventListener("mouseleave", () => {
        isVisible = false;
        dot.style.opacity = "0";
        ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
    });

    // Smooth lerp for trailing ring
    function follow() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);

    // Hover state expansion
    function bindHoverables() {
        const hoverables = document.querySelectorAll("a, button, input, textarea, .room-card, .era-pill-btn, .skill-category-card, .social-box, .cert-item-card, .pillar-card");
        hoverables.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                ring.classList.add("cursor-hover");
                dot.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                ring.classList.remove("cursor-hover");
                dot.classList.remove("cursor-hover");
            });
        });
    }

    bindHoverables();
    // Re-check periodically for dynamically injected elements
    setInterval(bindHoverables, 2500);
}

/* ==========================================================================
   4. FLOATING PILL NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbarAndScroll() {
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById("scroll-progress-line");
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    const sections = ["home", "projects", "experience", "about", "skills", "contact"];

    function onScroll() {
        const scrollY = window.scrollY;

        // Header style
        if (scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll Progress Line
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressBar) {
            const percent = (scrollY / docHeight) * 100;
            progressBar.style.width = `${percent}%`;
        }

        // Scroll Spy for Pill Nav
        const scrollPosition = scrollY + 280;
        let currentSection = "home";

        for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
                const top = el.offsetTop;
                const height = el.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSection = sectionId;
                    break;
                }
            }
        }

        navLinks.forEach((link) => {
            if (link.getAttribute("data-section") === currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        mobileNavLinks.forEach((link) => {
            if (link.getAttribute("data-section") === currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile Hamburger Toggle
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileDrawer.classList.toggle("open");
        });

        // Close drawer after clicking link
        mobileNavLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileDrawer.classList.remove("open");
            });
        });
    }
}

/* ==========================================================================
   5. SPATIAL PROJECTS & ARCHITECTURAL MODAL
   ========================================================================== */
const PROJECTS_DATA = {
    "flyrank-capstone": {
        number: "01",
        id: "flyrank-capstone",
        title: "FlyRank Capstone — Usage Metering & Billing Engine",
        subtitle: "High-Throughput Token Metering & Stripe Webhook Pipeline",
        category: "Backend & Cloud Systems",
        stack: ["Node.js", "Express", "PostgreSQL", "Stripe API", "Docker"],
        description: "A production backend service that tracks billable API calls and AI token usage, enforces tenant-based quotas, and calculates usage costs.",
        features: [
            "Idempotency-based usage recording preventing double-billing on client retries.",
            "Per-tenant quota enforcement responding with deterministic 402/429 limits.",
            "Live usage and cost rollup API calculating tier-based pricing.",
            "Cryptographic Stripe webhook integration with signature validation.",
            "Event deduplication pipeline ensuring forged payloads are rejected.",
            "Multi-container deployment orchestrated via Docker Compose and seed scripts."
        ],
        githubUrl: "https://github.com/rdivyatej-cloud/flyrank-capstone-metering-billing",
        accentColor: "#00e5ff"
    },
    "smart-expense-tracker": {
        number: "02",
        id: "smart-expense-tracker",
        title: "Smart Expense Tracker",
        subtitle: "AI-Powered Financial Insights & Report Generation",
        category: "Full-Stack & Generative AI",
        stack: ["Node.js", "Express", "PostgreSQL", "JWT", "Gemini AI", "PDFKit", "Docker"],
        description: "A full-stack expense management application with secure authentication, expense tracking, financial dashboards, and AI-powered spending insights.",
        features: [
            "JWT authentication paired with bcrypt password hashing and protected endpoints.",
            "Comprehensive expense CRUD operations with category-based rollups.",
            "Gemini AI prompt pipeline providing monthly financial habit suggestions.",
            "Automated monthly summary generation scheduled via node-cron.",
            "Downloadable statement reports rendered server-side via PDFKit.",
            "Dockerized PostgreSQL instance with indexed relational schemas."
        ],
        githubUrl: "https://github.com/rdivyatej-cloud/10x-flyrank",
        accentColor: "#38bdf8"
    },
    "subscript": {
        number: "03",
        id: "subscript",
        title: "SubScript — Subscription Optimization & Cost Analyzer",
        subtitle: "Recurring Expense Intelligence & Renewal Alerter",
        category: "Full-Stack Web Application",
        stack: ["React", "Vite", "Recharts", "Node.js", "Express", "MongoDB", "JWT", "Nodemailer"],
        description: "A subscription management platform designed to help users understand, track, and optimize recurring expenses.",
        features: [
            "MERN stack architecture with JWT auth and user-isolated collection queries.",
            "Interactive spend analytics dashboard built with Recharts.",
            "Automated renewal reminders sent 1, 3, and 7 days prior via Nodemailer.",
            "Real-time budget-overrun detection and alert triggers.",
            "Smart duplicate subscription detection algorithm.",
            "One-click CSV financial export for personal accounting."
        ],
        githubUrl: "https://github.com/rdivyatej-cloud/SubScript",
        accentColor: "#60a5fa"
    },
    "study-mate": {
        number: "04",
        id: "study-mate",
        title: "Study-Mate — AI-Powered Study Assistant",
        subtitle: "Contextual Academic Interaction Engine",
        category: "Applied AI & Frontend",
        stack: ["Next.js", "TypeScript", "React", "Gemini AI"],
        description: "An AI-powered study application that helps students process, summarize, and interact with learning materials.",
        features: [
            "Context-aware academic summarization powered by Google Gemini models.",
            "Interactive Q&A engine analyzing long-form lecture materials.",
            "Modular Next.js and TypeScript frontend with zero-latency streaming responses.",
            "Streamlined UI crafted for focused study sessions and review note generation."
        ],
        githubUrl: "https://github.com/rdivyatej-cloud/Study-Mate",
        accentColor: "#818cf8"
    },
    "fitlife-pulse": {
        number: "05",
        id: "fitlife-pulse",
        title: "FitLife Pulse — Gym Membership & Progress Analytics",
        subtitle: "High-Performance Member Progression Engine",
        category: "Data Structures & Python Core",
        stack: ["Python", "NumPy", "Pandas", "OOP", "Data Structures"],
        description: "A Python-based gym management system covering member registration, trainer workload, workout planning, attendance tracking, and analytics.",
        features: [
            "Object-Oriented Architecture organizing members, trainers, and workout routines.",
            "Data structures tracking daily trainer workloads and scheduling constraints.",
            "Recursive calorie burn aggregation across custom fitness routines.",
            "Pandas & NumPy data analysis generating attendance and retention breakdowns."
        ],
        githubUrl: "https://github.com/rdivyatej-cloud/FitLifePulse",
        accentColor: "#34d399"
    }
};

function openProjectModal(projectId) {
    const project = PROJECTS_DATA[projectId];
    if (!project) return;

    const modal = document.getElementById("project-modal");
    if (!modal) return;

    // Populate data
    document.getElementById("modal-num-badge").textContent = `PROJECT ${project.number}`;
    document.getElementById("modal-num-badge").style.borderColor = `${project.accentColor}50`;
    document.getElementById("modal-num-badge").style.color = project.accentColor;
    document.getElementById("modal-num-badge").style.backgroundColor = `${project.accentColor}15`;

    document.getElementById("modal-category").textContent = project.category;
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-subtitle").textContent = project.subtitle;
    document.getElementById("modal-desc").textContent = project.description;

    // Schematic visual card
    const schematicWrap = document.getElementById("modal-schematic-wrap");
    schematicWrap.innerHTML = `
        <div style="background: linear-gradient(145deg, #181820, #0f0f13); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${project.accentColor}; box-shadow: 0 0 8px ${project.accentColor};"></span>
                    <span style="color: var(--text-secondary);">${project.category.toUpperCase()}</span>
                </div>
                <span>ROOM ${project.number}</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff;">${project.title}</h4>
            <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.6rem;">
                <span>STATUS: PRODUCTION_READY</span>
                <span style="color: ${project.accentColor};">[ AUDITED SPEC ]</span>
            </div>
        </div>
    `;

    // Features List
    const featuresList = document.getElementById("modal-features-list");
    featuresList.innerHTML = project.features.map(f => `<li><span>${f}</span></li>`).join("");

    // Stack Chips
    const stackChips = document.getElementById("modal-stack-chips");
    stackChips.innerHTML = project.stack.map(s => `<span>${s}</span>`).join("");

    // GitHub Link
    const ghLink = document.getElementById("modal-github-link");
    ghLink.href = project.githubUrl;

    // Show modal
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function closeProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Modal Backdrop Click & Escape Key Listener
window.addEventListener("click", (e) => {
    const modal = document.getElementById("project-modal");
    if (modal && e.target === modal) {
        closeProjectModal();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeProjectModal();
    }
});

/* ==========================================================================
   6. EXPERIENCE & EDUCATION STORYBOARD
   ========================================================================== */
const STORYBOARD_DATA = [
    {
        period: "2026",
        role: "Backend & AI Engineering Intern",
        organization: "FlyRank AI",
        type: "experience",
        badge: "Internship",
        icon: "briefcase",
        accent: "#00e5ff",
        details: [
            "Worked on backend and AI-integrated engineering projects using Python, Node.js, and REST APIs.",
            "Implemented structured input validation, defensive middleware, and robust API error handling.",
            "Integrated AI model and API capabilities into production application workflows.",
            "Designed and developed the Usage Metering & Billing Engine for SaaS multi-tenant billing.",
            "Collaborated using Git, GitHub workflows, Docker containerization, automated testing, and technical documentation."
        ]
    },
    {
        period: "2024 — 2028",
        role: "B.Tech in Computer Science Engineering (Cybersecurity)",
        organization: "SRM University–AP",
        type: "education",
        badge: "Undergraduate",
        icon: "graduation-cap",
        accent: "#38bdf8",
        details: [
            "Current CGPA: 7.5",
            "Specialization coursework in Cybersecurity, Network Security, and Defensive Architecture.",
            "Core CS foundations: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and System Design."
        ]
    },
    {
        period: "2022 — 2024",
        role: "Intermediate (MPC)",
        organization: "Sri Chaitanya, Hormavu, Bangalore",
        type: "education",
        badge: "Pre-University",
        icon: "graduation-cap",
        accent: "#818cf8",
        details: [
            "Completed higher secondary studies in Mathematics, Physics, and Chemistry (MPC).",
            "Rigorous problem-solving curriculum building a strong mathematical and logical foundation."
        ]
    }
];

function initStoryboard() {
    switchEra(0);
}

function switchEra(index) {
    const data = STORYBOARD_DATA[index];
    if (!data) return;

    // Update active tab buttons
    const buttons = document.querySelectorAll(".era-pill-btn");
    buttons.forEach((btn, i) => {
        const badge = btn.querySelector(".era-year-badge");
        if (i === index) {
            btn.classList.add("active");
            if (badge) badge.classList.add("active-badge");
        } else {
            btn.classList.remove("active");
            if (badge) badge.classList.remove("active-badge");
        }
    });

    // Populate Detail Card
    const card = document.getElementById("storyboard-card");
    if (!card) return;

    card.innerHTML = `
        <div class="story-header">
            <div class="story-badge-wrap">
                <div class="story-icon-box">
                    <i data-lucide="${data.icon}" class="icon-sm" style="color: ${data.accent};"></i>
                </div>
                <span class="story-badge-text" style="color: ${data.accent};">${data.badge}</span>
            </div>
            <span class="story-period">${data.period}</span>
        </div>

        <div>
            <h3 class="story-role-title">${data.role}</h3>
            <p class="story-org-name">${data.organization}</p>
        </div>

        <div>
            <span class="story-bullets-label">Key Focus &amp; Responsibilities:</span>
            <ul class="story-bullets-list" style="margin-top: 0.75rem;">
                ${data.details.map(d => `
                    <li class="story-bullet-item">
                        <i data-lucide="check-circle-2" class="story-check-icon"></i>
                        <span>${d}</span>
                    </li>
                `).join("")}
            </ul>
        </div>
    `;

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

/* ==========================================================================
   7. UTILITY: ONE-CLICK COPY TO CLIPBOARD
   ========================================================================== */
function copyText(text, btnId) {
    if (!navigator.clipboard) {
        fallbackCopy(text);
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(btnId);
    }).catch(() => {
        fallbackCopy(text);
    });
}

function fallbackCopy(text) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}

function showCopyFeedback(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.classList.add("copied");
    const label = btn.querySelector(".copy-label");
    const originalText = label ? label.textContent : "Copy";

    if (label) label.textContent = "Copied!";

    setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = originalText;
    }, 2000);
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION & VALIDATION
   ========================================================================== */
function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const feedback = document.getElementById("form-feedback");

    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    const emailSubject = encodeURIComponent(
        subject || `Portfolio Inquiry from ${name}`
    );
    const bodyContent = `Hi Divyatej,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`;
    const mailtoUrl = `mailto:rdivyatej@gmail.com?subject=${emailSubject}&body=${encodeURIComponent(bodyContent)}`;

    if (feedback) {
        feedback.style.display = "block";
        feedback.className = "form-feedback success";
        feedback.textContent = "Opening your email client with your message drafted...";
    }

    // Launch mail client
    setTimeout(() => {
        window.location.href = mailtoUrl;
    }, 500);
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}
