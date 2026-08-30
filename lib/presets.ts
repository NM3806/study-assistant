export interface PresetSample {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'web-vitals',
    title: 'Core Web Vitals & Web Performance',
    category: 'Frontend Engineering',
    text: `Core Web Vitals are a set of real-world, user-centered metrics that quantify key facets of user experience on the web.
1. Largest Contentful Paint (LCP): Measures perceived loading speed. Marks when the page's main content has likely loaded. Good score: < 2.5 seconds. Key optimizations include optimizing server response times (TTFB), CDN caching, removing render-blocking JavaScript/CSS, and preloading hero images.
2. Interaction to Next Paint (INP): Replaced FID. Measures page responsiveness to user interactions (clicks, taps, keypresses) throughout the entire page lifecycle. Good score: < 200 milliseconds. Optimized by breaking long tasks (using setTimeout or scheduler.yield), reducing React component re-rendering, and debouncing event listeners.
3. Cumulative Layout Shift (CLS): Measures visual stability to prevent unexpected layout jumps. Good score: < 0.1. Optimized by always including width and height aspect ratios on images and video elements, reserving static space for dynamic ads/embeds, and using CSS font-display: optional to avoid FOIT/FOUT shift.`
  },
  {
    id: 'os-concurrency',
    title: 'OS Concurrency, Mutex & Deadlocks',
    category: 'Computer Science',
    text: `Concurrency is the execution of multiple instruction sequences at the same time in an operating system.
Key Concurrency Primitives:
- Mutex (Mutual Exclusion): A locking mechanism used to synchronize access to a shared resource. Only one thread can acquire the lock at a time.
- Semaphore: A signaling mechanism. A counting semaphore has an integer value allowing N threads concurrent access; a binary semaphore is similar to a mutex.
- Deadlock: A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.
The Four Coffman Conditions for Deadlock:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources.
3. No Preemption: Resources cannot be forcibly taken from a process holding them.
4. Circular Wait: A closed chain of processes exists where each process waits for a resource held by the next process in the chain.`
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Cellular Respiration',
    category: 'Biology',
    text: `Photosynthesis and Cellular Respiration form an energetic cycle in living ecosystems.
Photosynthesis:
- Occurs in chloroplasts of plant cells.
- Light-Dependent Reactions: Take place in thylakoid membranes. Chlorophyll absorbs photon energy to split water molecules (photolysis), releasing O2 as a byproduct and synthesizing ATP and NADPH.
- Light-Independent Reactions (Calvin Cycle): Occurs in the stroma. Utilizes enzyme RuBisCO, ATP, and NADPH to fix carbon dioxide (CO2) into glyceraldehyde-3-phosphate (G3P), which forms glucose.
Cellular Respiration:
- Chemical equation: C6H12O6 + 6O2 -> 6CO2 + 6H2O + ~30-32 ATP.
- Stages:
  1. Glycolysis (cytoplasm, anaerobic): splits glucose into 2 pyruvate, yielding net 2 ATP and 2 NADH.
  2. Pyruvate Oxidation & Krebs Cycle (mitochondrial matrix): produces CO2, NADH, FADH2, and 2 ATP.
  3. Electron Transport Chain & Oxidative Phosphorylation (inner mitochondrial membrane): uses oxygen as the terminal electron acceptor to generate the bulk of cellular ATP (~26-28 ATP).`
  }
];
