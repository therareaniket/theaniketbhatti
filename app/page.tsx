"use client";

import { useState } from "react";
import gsap from "gsap";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Homepage/Hero/Hero";

export default function Home() {
  	const [loading, setLoading] = useState(true);

  	const handlePreloaderComplete = () => { 
		setLoading(false);   
  	};

  	return (
    	<main className="relative min-h-screen bg-white text-black overflow-hidden">
			{/* 1. Preloader Overlay */}
			<Preloader onComplete={handlePreloaderComplete} />

			{/* 2. Main Website Content */}
			<div className="website-content min-h-screen flex flex-col justify-center items-center">
				<Hero />
			</div>
		</main>
	);
}