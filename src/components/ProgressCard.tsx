import { twMerge } from 'tailwind-merge'
import { Progress } from '@/components/ui/progress.tsx'
import { Separator } from '@/components/ui/separator.tsx'

export function ProgressCard({
  className,
  value,
  text,
  extraText,
}: {
  className?: string
  value: number
  text: string
  extraText?: string
}) {
  return (
    <div
      className={twMerge(
        `flex flex-col rounded-t-md px-4 py-3 bg-white text-xs whitespace-pre-wrap gap-y-2.5 main-shadow border border-veryDarkBlue/10 border-b-0`,
        className
      )}
    >
      <div className={`flex flex-col gap-y-2.5`}>
        <Progress value={value} />
        <span className={`text-center`}>{text}</span>
      </div>
      {extraText && (
        <>
          <Separator />
          <span className={`italic text-gray-500`}>{extraText}</span>
        </>
      )}
    </div>
  )
}
