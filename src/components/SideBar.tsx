import { twMerge } from 'tailwind-merge'

export default function SideBar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={twMerge(`flex flex-col justify-between bg-gray-50`, className)}
    >
      {children}
    </div>
  )
}
