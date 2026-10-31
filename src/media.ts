// Central photo manifest; Vite base URL supports a future GitHub Pages subpath.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const logo = asset('mark-logo-enhanced.png');
export const heroPhotos = ['hero-01.webp', 'hero-02.webp'].map(name => asset(`images/hero/${name}`));
export const workPhotos = Array.from({ length: 12 }, (_, i) => ({
  src: asset(`images/works/work-${String(i + 1).padStart(2, '0')}.webp`),
  alt: `Татуировка коллектива МАЯК, работа ${i + 1}`,
  number: String(i + 1).padStart(2, '0'),
}));
export const studioPhotos = ['studio-01.webp', 'studio-02.webp'].map(name => asset(`images/studio/${name}`));
