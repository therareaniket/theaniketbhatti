"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./gooeyHero.css"
import Link from "next/link";

const CONFIG = {
	smoothing: 0.1,
	movementThreshold: 0.0,
	sizeFromSpeed: 0.2,
	expandMultiplier: 2,
	expandTime: 2,
	expandEase: "power1.inOut",
	dissolveStart: 1,
	dissolveTime: 1,
	dissolveEase: "power3.in",
};

export default function GooeyHero() {
  	const heroRef = useRef<HTMLElement>(null);
  	const svgRef = useRef<SVGSVGElement>(null);
  	const containerRef = useRef<SVGGElement>(null);

	useEffect(() => {
		const hero = heroRef.current;
		const svg = svgRef.current;
		const container = containerRef.current;

		if (!hero || !svg || !container) return;

		let hasStarted = false;
		let animFrameId: number;

		const pointer = { x: 0, y: 0 };
		const smoothPointer = { x: 0, y: 0 };

		// 1. Synchronize SVG size to window viewport dimensions
		const matchSvgToViewport = () => {
		svg.style.width = `${window.innerWidth}px`;
		svg.style.height = `${window.innerHeight}px`;
		};

		matchSvgToViewport();
		window.addEventListener("resize", matchSvgToViewport);

		// 2. Dynamic circle stamping with GSAP animation lifecycle
		const stampSmudgeAt = (x: number, y: number, radius: number) => {
		const circle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle"
		);
		circle.setAttribute("cx", x.toString());
		circle.setAttribute("cy", y.toString());
		circle.setAttribute("r", radius.toString());
		circle.setAttribute("fill", "#FFFFFF");

		container.prepend(circle);

		const animatedRadius = { current: radius };

		const timeline = gsap.timeline({
			onUpdate: () => {
			circle.setAttribute(
				"r",
				Math.max(0, animatedRadius.current).toString()
			);
			},
			onComplete: () => {
			timeline.kill();
			circle.remove();
			},
		});

		// Bloom expansion phase
		timeline.to(animatedRadius, {
			current: radius * CONFIG.expandMultiplier,
			duration: CONFIG.expandTime,
			ease: CONFIG.expandEase,
		});

		// Dissolve/melt back phase
		timeline.to(
			animatedRadius,
			{
			current: 0,
			duration: CONFIG.dissolveTime,
			ease: CONFIG.dissolveEase,
			},
			CONFIG.dissolveStart
		);
		};

		// 3. Coordinate Tracking
		const onPointerMove = (x: number, y: number) => {
		if (!hasStarted) {
			pointer.x = x;
			pointer.y = y;
			smoothPointer.x = x;
			smoothPointer.y = y;
			hasStarted = true;
			return;
		}
		pointer.x = x;
		pointer.y = y;
		};

		const handleMouseMove = (e: MouseEvent) => {
		onPointerMove(e.clientX, e.clientY);
		};

		const handleTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		if (e.touches.length > 0) {
			onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
		}
		};

		const handleTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		if (e.touches.length > 0) {
			onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
		}
		};

		hero.addEventListener("mousemove", handleMouseMove);
		// hero.addEventListener("touchstart", handleTouchStart, { passive: false });
		hero.addEventListener("touchmove", handleTouchMove, { passive: false });

		// 4. Main Animation Frame Loop
		const update = () => {
		if (hasStarted) {
			smoothPointer.x += (pointer.x - smoothPointer.x) * CONFIG.smoothing;
			smoothPointer.y += (pointer.y - smoothPointer.y) * CONFIG.smoothing;

			const speed = Math.hypot(
			pointer.x - smoothPointer.x,
			pointer.y - smoothPointer.y
			);

			if (speed > CONFIG.movementThreshold) {
			stampSmudgeAt(
				smoothPointer.x,
				smoothPointer.y,
				speed * CONFIG.sizeFromSpeed
			);
			}
		}

		animFrameId = requestAnimationFrame(update);
		};

		update();

		// Cleanup listeners on unmount
		return () => {
		window.removeEventListener("resize", matchSvgToViewport);
		hero.removeEventListener("mousemove", handleMouseMove);
		hero.removeEventListener("touchstart", handleTouchStart);
		hero.removeEventListener("touchmove", handleTouchMove);
		cancelAnimationFrame(animFrameId);
		};
	}, []);

    return (
        <section ref={heroRef} className="relative w-full h-screen overflow-hidden select-none">
            {/* 1. Foreground Content Layer (Top visible default) */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-8 bg-[#2a2a2a] text-[#fed2ed] initial-layer">
                <h1 className="text-[clamp(4rem,22.5vw,10rem)] text-center font-bold uppercase leading-[1.2] font-casko">Dig me to know me</h1>
            </div>

			{/* 2. Background Content Layer (Revealed underneath via SVG Mask) */}
			<div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-8 bg-[#cbc4c2] text-[#232332]" style={{ mask: "url(#smudge-mask)", WebkitMask: "url(#smudge-mask)",}}>
				<h3 className="text-[clamp(1.3rem,4vw,2.5rem)] font-bold leading-[1.2] text-center max-w-4xl font-casko hero-revealed-full-text">
					Hi, I am Aniket; A Clumsy guy with 2+ years of Industry experience and strong foundations in web & software development using MERN, NextJS, NodeJS, Python, WordPress, Shopify, C# AND ASP.NET. I build reliable, user-focused solutions with strong attention to detail, backed by solid communication skills that make teamwork smooth.
				</h3>
			</div>

			{/* 3. SVG Mask Definition & Gooey Matrix Filter */}
			<svg ref={svgRef} className="absolute top-0 left-0 pointer-events-none z-30" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<filter id="smudge-goo">
						<feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
						<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -14" />
					</filter>

					<mask id="smudge-mask">
						<g ref={containerRef} filter="url(#smudge-goo)" />
					</mask>
				</defs>
			</svg>

			<Link href="/Skills" title="Checkout my Skills" className="next-section-btn-home absolute bottom-[40px] right-[40px] z-[22] bg-[#fed2ed] text-[#2a2a2a] text-[clamp(1rem,4vw,1.5rem)] font-casko px-[10px] py-[6px] rounded-full">Things I can Do</Link>
        </section>
    );
}