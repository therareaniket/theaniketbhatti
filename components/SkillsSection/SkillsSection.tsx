import Link from 'next/link'
import React from 'react'

const SkillsSection = () => {
    return (
        <section>
            <Link href="/Skills" title="Checkout My Projects" className="next-section-btn-skills absolute bottom-[40px] right-[40px] z-[22] bg-[#fed2ed] text-[#2a2a2a] text-[clamp(1rem,4vw,1.5rem)] font-casko px-[10px] py-[6px] rounded-full">Things I Developed</Link>
        
            <Link href="/" title="Get Back to Intro" className="prev-section-btn-skills absolute bottom-[40px] left-[40px] z-[22] bg-[#fed2ed] text-[#2a2a2a] text-[clamp(1rem,4vw,1.5rem)] font-casko px-[10px] py-[6px] rounded-full">Back to Intro</Link>
        </section>
    )
}

export default SkillsSection