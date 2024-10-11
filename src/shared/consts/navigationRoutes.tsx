import { AvatarIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";

export const navigationRoutes = [
  {
    title: 'Home',
    path: '/profile',
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="1.75rem" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
  },
  {
    title: 'Quests',
    path: '/projects',
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="1.75rem" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><ellipse cx="96" cy="84" rx="80" ry="36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M16,84v40c0,19.88,35.82,36,80,36s80-16.12,80-36V84" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="117" x2="64" y2="157" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M176,96.72c36.52,3.34,64,17.86,64,35.28,0,19.88-35.82,36-80,36-19.6,0-37.56-3.17-51.47-8.44" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M80,159.28V172c0,19.88,35.82,36,80,36s80-16.12,80-36V132" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="192" y1="165" x2="192" y2="205" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="117" x2="128" y2="205" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>,
  },
  {
    title: 'Frens',
    path: '/friends',
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="1.75rem" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M192,120a59.91,59.91,0,0,1,48,24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M16,144a59.91,59.91,0,0,1,48-24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="128" cy="144" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M72,216a65,65,0,0,1,112,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M161,80a32,32,0,1,1,31,40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M64,120A32,32,0,1,1,95,80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
  },
  {
    title: 'Wallet',
    path: '/wallet',
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="1.7rem" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M40,56V184a16,16,0,0,0,16,16H216a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8H56A16,16,0,0,1,40,56h0A16,16,0,0,1,56,40H192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="180" cy="132" r="12"/></svg>
  },
];
