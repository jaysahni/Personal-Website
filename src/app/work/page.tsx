import type { Metadata } from "next";
import Divider from "@/components/ui/Divider";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <>
      <section>
        <h1 className="text-2xl font-semibold mb-8">work</h1>

        <h2 className="text-lg font-medium text-text-primary mb-4">experience</h2>
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-text-primary font-medium">{exp.title}</h3>
                <p className="text-text-secondary text-sm">{exp.company}</p>
              </div>
              <div className="text-right text-text-muted text-sm shrink-0 ml-4">
                <p>{exp.location}</p>
                {exp.period && <p>{exp.period}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">education</h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-text-primary font-medium">{edu.institution}</h3>
                <p className="text-text-secondary text-sm">
                  {edu.degree} {edu.field}
                </p>
              </div>
              {edu.period && (
                <p className="text-text-muted text-sm shrink-0 ml-4">{edu.period}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">skills</h2>
        <div className="space-y-4">
          {skillCategories.map((cat) => (
            <div key={cat.name}>
              <h3 className="text-text-secondary text-sm mb-2">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs bg-surface border border-border rounded-md text-text-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
