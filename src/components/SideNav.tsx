import { twMerge } from 'tailwind-merge'
import { allTasks, nusTasks, basicTasks } from '@/data/tasks.ts'
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible.tsx'
import { useState } from 'react'
import { FaFlask } from 'react-icons/fa6'
import SideHeader from '@/components/SideHeader.tsx'
import { RiseLoader } from 'react-spinners'
import { Task } from '@/data/types.ts'

export default function SideNav({
  className,
  selectedTaskIdx,
  onSelectTaskIdx,
  generatingTaskIdx,
}: {
  className?: string
  selectedTaskIdx: number
  onSelectTaskIdx: (idx: number) => void
  generatingTaskIdx?: number
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible
      className={twMerge(`flex flex-col gap-y-4 items-start`, className)}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SideHeader isOpen={isOpen} title={'Tasks'} icon={<FaFlask />} />
      <CollapsibleContent className={`w-full`}>
        <TaskTitle className="pt-2" title="Intro Py NUS" />
        <TaskList
          className="pb-9"
          tasks={nusTasks}
          selectedTaskIdx={nusTasks.findIndex(
            (task) => task.name === allTasks[selectedTaskIdx].name
          )}
          onSelectTaskIdx={onSelectTaskIdx}
          generatingTaskIdx={
            generatingTaskIdx === undefined
              ? undefined
              : nusTasks.findIndex(
                  (task) => task.name === allTasks[generatingTaskIdx].name
                )
          }
        />
        <TaskTitle title="Basic Algo" />
        <TaskList
          tasks={basicTasks}
          selectedTaskIdx={basicTasks.findIndex(
            (task) => task.name === allTasks[selectedTaskIdx].name
          )}
          onSelectTaskIdx={onSelectTaskIdx}
          generatingTaskIdx={
            generatingTaskIdx === undefined
              ? undefined
              : basicTasks.findIndex(
                  (task) => task.name === allTasks[generatingTaskIdx].name
                )
          }
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

function TaskTitle({
  className,
  title,
}: {
  className?: string
  title: string
}) {
  return (
    <div
      className={twMerge(
        'poppins pl-6 font-semibold text-veryDarkBlue/50 text-xs pb-3.5 uppercase',
        className
      )}
    >
      {title}
    </div>
  )
}

function TaskList({
  className,
  tasks,
  selectedTaskIdx,
  onSelectTaskIdx,
  generatingTaskIdx,
}: {
  className?: string
  tasks: Task[]
  selectedTaskIdx: number
  onSelectTaskIdx: (task: number) => void
  generatingTaskIdx?: number
}) {
  function onTaskClick(index: number) {
    const idx = allTasks.findIndex((task) => task.name === tasks[index].name)
    if (idx === -1) {
      throw new Error('Task not found')
    }
    onSelectTaskIdx(idx)
  }

  return (
    <ul className={twMerge('flex flex-col gap-y-2', className)}>
      {tasks.map((task, index) => (
        <li className={`w-full`} key={task.menuName}>
          <NavButton
            onClick={() => onTaskClick(index)}
            className={twMerge(
              'w-full flex flex-row justify-between items-center pr-4',
              selectedTaskIdx === index && 'bg-veryDarkBlue/15 text-gray-800',
              selectedTaskIdx !== index && 'hover:bg-veryDarkBlue/5'
            )}
          >
            <span className="flex flex-row items-center gap-x-2.5 font-normal">
              {task.menuName}
            </span>
            {generatingTaskIdx === index && (
              <RiseLoader size={4} color="#9ca3af" />
            )}
          </NavButton>
        </li>
      ))}
    </ul>
  )
}

function NavButton({
  className,
  onClick,
  children,
}: {
  className?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={twMerge(
        `w-full rounded-r-xl transition-colors text-sm font-medium text-gray-700 px-3 py-2 pl-6 text-start`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
