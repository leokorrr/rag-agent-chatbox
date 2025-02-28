import clsx, { ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  // ↓ Add values to existing theme scale or create a new one
  theme: {
    spacing: ['sm', 'md', 'lg'],
  },
  // ↓ Add values to existing class groups or define new ones
  classGroups: {
    bg: ['bg-E20D4D'],
    text: ['text-white', 'text-044EB3', 'text-black', 'text-0B1855'],
    maxWidth: ['max-w-[calc(100%_-_300px)]', 'max-w-default'],
  },
  // ↓ Here you can define additional conflicts across class groups
  conflictingClassGroups: {},
})
export const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(inputs))
}
