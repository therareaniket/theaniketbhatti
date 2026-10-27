"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps { onComplete?: () => void; }

export default function Preloader({ onComplete }: PreloaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const counter3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
        // 1. Populate the 3rd counter column dynamically (digits 0-9 twice + final 0)
        if (counter3Ref.current) {
            counter3Ref.current.innerHTML = "";
            for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 10; j++) {
                const div = document.createElement("div");
                div.className = "num";
                div.textContent = j.toString();
                counter3Ref.current.appendChild(div);
            }
            }
            const finalDiv = document.createElement("div");
            finalDiv.className = "num";
            finalDiv.textContent = "0";
            counter3Ref.current.appendChild(finalDiv);
        }

        // Helper function to animate rolling digit columns
        const animateCounter = (
            selector: string,
            duration: number,
            delay: number = 0
        ) => {
            const target = containerRef.current?.querySelector(selector);
            if (!target) return;
            const numElement = target.querySelector(".num") as HTMLElement;
            if (!numElement) return;

            const numHeight = numElement.clientHeight || 100;
            const totalNums = target.querySelectorAll(".num").length;
            const totalDistance = (totalNums - 1) * numHeight;

            gsap.to(target, {
            y: -totalDistance,
            duration: duration,
            delay: delay,
            ease: "power2.inOut",
            });
        };

        // 2. Animate counter columns
        animateCounter(".counter-3", 5);
        animateCounter(".counter-2", 6);
        animateCounter(".counter-1", 2, 4);

        // 3. Animate loading progress bars
        gsap.from(".loader-1", {
            width: 0,
            duration: 6,
            ease: "power2.inOut",
        });

        gsap.from(".loader-2", {
            width: 0,
            delay: 1.9,
            duration: 4,
            ease: "power2.inOut",
        });

        // 4. Hide bar background container when loading reaches 100%
        gsap.to(".loader", {
            background: "none",
            delay: 6,
            duration: 0.1,
        });

        // 5. Transform bars into "L" shape and zoom reveal transition
        gsap.to(".loader-1", {
            rotate: 90,
            y: -50,
            duration: 0.5,
            delay: 6,
        });

        gsap.to(".loader-2", {
            x: -75,
            y: 75,
            duration: 0.5,
            delay: 6,
        });

        gsap.to(".loader", {
            scale: 40,
            duration: 1,
            delay: 7,
            ease: "power2.inOut",
        });

        gsap.to(".loader", {
            rotate: 45,
            y: 500,
            x: 2000,
            duration: 1,
            delay: 7,
            ease: "power2.inOut",
        });

        // 6. Fade out the overlay screen and trigger website reveal
        gsap.to(".loading-screen", {
            opacity: 0,
            duration: 0.5,
            delay: 7.5,
            ease: "power1.inOut",
            onComplete: () => {
            if (containerRef.current) {
                containerRef.current.style.display = "none";
            }
            if (onComplete) onComplete();
            },
        });
        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen fixed inset-0 z-50 w-full h-full bg-black text-white pointer-events-none overflow-hidden">
        {/* Center Loader Bar Container */}
        <div className="loader absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[50px] flex bg-[#505050]">
            <div className="loader-1 relative w-[200px] h-[50px] bg-white" />
            <div className="loader-2 relative w-[100px] h-[50px] bg-white" />
        </div>

        {/* Bottom-Left Counter Digits */}
        <div className="counter fixed left-[50px] pt-[20px] bottom-[50px] flex h-[100px] text-[100px] leading-[102px] font-normal [clip-path:polygon(0_0,100%_0,100%_100px,0_100px)]">
            {/* Counter 1 (Hundreds digit: 0 -> 1) */}
            <div className="counter-1 relative -top-[15px]">
            <div className="num">0</div>
            <div className="num relative -right-[10px]">1</div>
            </div>

            {/* Counter 2 (Tens digit: 0 -> 9 -> 0) */}
            <div className="counter-2 relative -top-[15px]">
            <div className="num">0</div>
            <div className="num relative -right-[10px]">1</div>
            <div className="num">2</div>
            <div className="num">3</div>
            <div className="num">4</div>
            <div className="num">5</div>
            <div className="num">6</div>
            <div className="num">7</div>
            <div className="num">8</div>
            <div className="num">9</div>
            <div className="num">0</div>
            </div>

            {/* Counter 3 (Units digit: dynamically populated) */}
            <div ref={counter3Ref} className="counter-3 relative -top-[15px]" />
        </div>
    </div>
  );
}