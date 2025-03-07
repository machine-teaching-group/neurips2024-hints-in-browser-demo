import ArrowIcon from '@/components/ArrowIcon.tsx'
import { CollapsibleTrigger } from '@/components/ui/collapsible.tsx'
import { twMerge } from 'tailwind-merge'
import { cloneElement, ReactElement } from 'react'

export default function SideHeader({
  className,
  isOpen,
  title,
  icon,
}: {
  className?: string
  isOpen: boolean
  title: string
  icon: ReactElement
}) {
  const clonedIcon = cloneElement(icon, {
    className: twMerge(
      'h-[26px] w-[26px] bg-gray-400/20 p-1.5 rounded-lg text-gray-800/70 transition-colors group-hover:bg-gray-400/30 group-hover:text-gray-800/100'
    ),
  })

  return (
    <CollapsibleTrigger
      className={twMerge(
        `w-full flex flex-row justify-between items-center pl-4 font-semibold text-gray-800 py-2.5 group`,
        className
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        {clonedIcon}
        <span className="transition-colors text-gray-700 group-hover:text-gray-800">
          {title}
        </span>
      </div>
      <ArrowIcon
        className={twMerge(
          'duration-100 ease-in transition w-4 h-4 fill-gray-800',
          'transition-colors fill-gray-500 group-hover:fill-gray-800',
          isOpen ? 'rotate-0' : '-rotate-90'
        )}
      />
    </CollapsibleTrigger>
  )
}
