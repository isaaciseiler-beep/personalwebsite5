// components/ExperienceEducation.tsx — FULL FILE
"use client";

export default function ExperienceEducation() {
  return (
    <div className="card-hover w-full rounded-xl border border-subtle bg-card p-5 md:p-6">
      <div className="space-y-4">
        <div>
          <div className="font-medium">Washington University in St. Louis · A.B. Sociology & Political Science</div>
          <div className="text-sm text-muted">Graduated May 2025 · Magna Cum Laude · GPA 4.0 · Rhodes Scholarship Finalist · Harry S. Truman Scholar · Fulbright Scholar</div>
        </div>
        <div className="pt-2 border-t border-subtle">
          <div className="font-medium">National Outdoor Leadership School (NOLS) · Leadership Semester in Alaska</div>
          <div className="text-sm text-muted">Focus on environmental studies, glaciology, and risk management</div>
          <a
            href="https://www.nols.edu/courses/summer-semester-in-alaska-SAK/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block link-underline text-sm hover:text-[color:var(--color-accent)]"
          >
            read more about the program →
          </a>
        </div>
        <div className="pt-2 border-t border-subtle text-sm italic">
          transferred from Calvin University after sophomore year.{" "}
          <a
            href="https://calvinchimes.org/2022/12/04/social-work-students-struggled-in-wake-of-csr-split-frustration-remains/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline not-italic"
          >
            read more about my decision to transfer →
          </a>
        </div>
      </div>
    </div>
  );
}
