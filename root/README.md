<!-- README.md -->
# ISAAC PORTFOLIO

simple, elegant, all-black portfolio with subtle motion.

## deploy on vercel
1. create a new github repo and push these files.
2. import the repo in vercel.
3. add env var: `NEXT_PUBLIC_LINKEDIN_URL` with your profile url.
4. build command: `npm run build` (default). output: `.next`.
5. no extra config needed; images are unoptimized locally.

## editing content
- projects/photos: `data/projects.json`
- timeline: `data/timeline.json`
- images: `/public/images/*` (use `/images/...` paths)

## tech
- next.js 14 app router, typescript strict
- tailwindcss, framer-motion, lucide-react
- a11y: semantic html, focus-visible, reduced-motion respected


