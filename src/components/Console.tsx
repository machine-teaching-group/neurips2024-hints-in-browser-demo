import { twMerge } from 'tailwind-merge'
import {
  cloneElement,
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Separator } from '@/components/ui/separator.tsx'
import { LuTimer } from 'react-icons/lu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area.tsx'
import {
  FaLightbulb,
  FaPlay,
  FaStop,
  FaTerminal,
  FaWrench,
} from 'react-icons/fa6'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { Button } from '@/components/ui/button.tsx'
import { PulseLoader } from 'react-spinners'
import { AnimatePresence, motion } from 'framer-motion'

const textBoxOptions = [
  'bg-veryDarkBlue sourcecodepro text-slate-50 whitespace-pre',
  'bg-white text-gray-800 font-normal leading-normal whitespace-pre-wrap',
]
const consoleOptions = [
  'bg-veryDarkBlue/10 font-semibold text-gray-800',
  'bg-veryDarkBlue/10 font-semibold text-gray-800',
]

export type CollapsibleTabsHandle = {
  open: (number: number) => void
  scrollToEnd: () => void
}

type CollapsibleTabsProps = {
  className?: string
  content: string[]
  hintStatus: string
  hintTime: string
  onClickRun: () => void
  onGetHint: () => void
  onStopHint: () => void
  loadingHint: boolean
  loadingModel: boolean
  loadingPyodide: boolean
  runningPython: boolean
}

const CollapsibleTabs = forwardRef<CollapsibleTabsHandle, CollapsibleTabsProps>(
  (
    {
      className,
      content,
      hintStatus,
      hintTime,
      onClickRun,
      onGetHint,
      onStopHint,
      loadingHint,
      loadingModel,
      loadingPyodide,
      runningPython,
    }: CollapsibleTabsProps,
    ref
  ) => {
    const [openNumber, setOpenNumber] = useState<number | null>(null)
    const textBoxRef = useRef<HTMLDivElement>(null)

    function onConsoleClick(number: number) {
      if (openNumber === number) {
        setOpenNumber(null)
      } else {
        setOpenNumber(number)
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        open: (number: number) => {
          setOpenNumber(number)
        },
        scrollToEnd: () => {
          textBoxRef.current?.scrollTo({
            top: textBoxRef.current.scrollHeight,
            behavior: 'smooth',
          })
        },
      }),
      []
    )

    return (
      <div className={twMerge(`flex flex-col gap-y-2 w-full`, className)}>
        <AnimatePresence>
          {openNumber !== null && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '160px' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScrollArea
                className={twMerge(
                  `w-full h-full border border-veryDarkBlue/10 rounded-md text-sm main-shadow`,
                  textBoxOptions[openNumber]
                )}
              >
                {openNumber === 1 && (hintStatus || hintTime) && (
                  <div className="px-3 py-1">
                    <div className="flex flex-row justify-between text-gray-500">
                      <div className={`text-xs pl-1 py-2`}>{hintStatus}</div>
                      <div className="flex flex-row items-center gap-x-1">
                        {hintTime && (
                          <LuTimer className="w-3.5 h-3.5 pb-0.5 stroke-gray-50" />
                        )}
                        {loadingHint && !hintTime && (
                          <PulseLoader size={5} color="#d1d5db" />
                        )}
                        <div className={`text-xs pr-1 py-2`}>{hintTime}</div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                )}
                <div className={`h-fit px-4 py-4`} ref={textBoxRef}>
                  {content[openNumber]}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={twMerge(
            `flex flex-row w-full gap-x-8 justify-between items-center`
          )}
        >
          <div className="flex flex-row gap-x-2 w-2/3">
            <Console
              name={'Console'}
              icon={<FaTerminal className="w-3.5 h-3.5" />}
              isOpen={openNumber === 0}
              openOptions={consoleOptions[0]}
              onClick={() => onConsoleClick(0)}
            />
            <Console
              name={'Hint info'}
              icon={<FaWrench className="w-[15px] h-[15px] fill-gray-600" />}
              isOpen={openNumber === 1}
              openOptions={consoleOptions[1]}
              onClick={() => onConsoleClick(1)}
            />
          </div>
          <div className="flex flex-row gap-x-2 w-1/3 justify-end">
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={twMerge(
                      `w-24 h-9 main-shadow`,
                      runningPython && `pointer-events-none`,
                      loadingPyodide && `opacity-50`
                    )}
                    onClick={onClickRun}
                    variant={'secondary'}
                    disabled={loadingPyodide}
                  >
                    {runningPython ? (
                      <PulseLoader size={6} color="#9ca3af" />
                    ) : (
                      <div className="flex flex-row gap-x-2 items-center">
                        <FaPlay className="w-[14px] h-[14px] pb-px fill-gray-500" />
                        <span>Run</span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-64 text-xs">
                  Run your Python code on a number of test cases.{' '}
                  <span className="italic">(Does not invoke the LLM.)</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={twMerge(
                      `w-24 h-9 main-shadow`,
                      loadingHint && `animate-pulse`,
                      loadingModel && `opacity-50`
                    )}
                    onClick={() => {
                      if (loadingHint) {
                        onStopHint()
                      } else {
                        onGetHint()
                      }
                    }}
                    disabled={loadingModel}
                  >
                    {loadingHint ? (
                      <div className="flex flex-row gap-x-2 items-center">
                        <FaStop className="w-[14px] h-[14px] pb-px" />
                        <span>Stop</span>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-x-2 items-center">
                        <FaLightbulb className="w-[14px] h-[14px] pb-px" />
                        <span>Hint</span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Generate a hint based on your current Python code.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    )
  }
)

function Console({
  className,
  icon,
  name,
  onClick,
  isOpen = false,
  openOptions = '',
}: {
  className?: string
  icon?: ReactElement
  name: string
  onClick: () => void
  isOpen?: boolean
  openOptions?: string
}) {
  const clonedIcon = icon
    ? cloneElement(icon, {
        className: twMerge('pb-0.5 fill-gray-800', icon.props.className),
      })
    : null

  return (
    <div
      className={twMerge(
        `flex flex-col justify-center w-full h-9 border border-veryDarkBlue/10 rounded-md font-medium`,
        `transition-colors`,
        isOpen ? openOptions : `bg-white text-gray-800`,
        isOpen ? 'shadow-sm' : 'main-shadow',
        className
      )}
      role={`button`}
      tabIndex={0}
      aria-label={`Console`}
      onClick={onClick}
    >
      <div className={`flex flex-row items-center justify-between px-4`}>
        <div className="flex flex-row items-center gap-x-3">
          {clonedIcon}
          <span className={`text-sm`}>{name}</span>
        </div>
        <UpIcon
          className={twMerge(
            `w-3 h-3 transition-transform duration-100`,
            isOpen ? 'rotate-0 fill-gray-800' : 'rotate-90 fill-gray-800'
          )}
        />
      </div>
    </div>
  )
}

export function UpIcon({ className }: { className?: string }) {
  return (
    <div className={twMerge(``, className)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
      </svg>
    </div>
  )
}

export { CollapsibleTabs }
