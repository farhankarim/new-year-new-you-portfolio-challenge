
import React, { useRef, useState, useEffect } from 'react';
import { SKILLS } from '../constants.tsx';
import { Skill } from '../types.ts';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
  <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-gray-700 hover:scale-105">
    {/* FIX: Use dangerouslySetInnerHTML to render the SVG string as HTML */}
    <div dangerouslySetInnerHTML={{ __html: skill.icon }} />
    <p className="mt-4 font-semibold text-gray-200">{skill.name}</p>
  </div>
);

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-20" ref={sectionRef}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        My Tech Stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 max-w-5xl mx-auto">
        {SKILLS.map((skill, index) => (
          <div
            key={skill.name}
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0 scale-100 rotate-0'
                : 'opacity-0 translate-y-5 scale-95 -rotate-3'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <SkillCard skill={skill} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
