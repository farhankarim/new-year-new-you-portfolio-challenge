
import React from 'react';
import { SKILLS } from '../constants';
import { Skill } from '../types';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
  <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-gray-700 hover:scale-105">
    {skill.icon}
    <p className="mt-4 font-semibold text-gray-200">{skill.name}</p>
  </div>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        My Tech Stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
        {SKILLS.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
