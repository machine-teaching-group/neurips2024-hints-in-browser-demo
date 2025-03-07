import CodeEditor from './components/CodeEditor.tsx'
import Description from './components/Description.tsx'
import {
  CollapsibleTabs,
  CollapsibleTabsHandle,
} from './components/Console.tsx'

import { useCallback, useRef, useState } from 'react'
import { ProgressCard } from './components/ProgressCard.tsx'
import { twMerge } from 'tailwind-merge'
import { ProgressType, useLLM } from './use-llm.ts'
import SideNav from '@/components/SideNav.tsx'
import { allTasks } from '@/data/tasks.ts'
import TopBar from '@/components/TopBar.tsx'
import SideParams, { LLMParams } from '@/components/SideParams.tsx'
import {
  configLlama,
  configLlamaBasic,
  configLlamaNus,
  configPhi,
  configPhiBasic,
  configPhiNUS,
} from '@/config.ts'
import usePyodide from '@/use-pyodide.ts'
import SideBar from '@/components/SideBar.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { LayoutGroup } from 'framer-motion'

const RUN_PYTHON_DELAY_MS = 300

const defaultLLMParams: LLMParams = {
  temperature: 0.7,
  hint_temperature: 0.1,
  max_gen_len: 1024,
  numRepairs: 3,
}

const modelConfigList = [
  configLlamaNus,
  configLlamaBasic,
  configLlama,
  configPhiNUS,
  configPhiBasic,
  configPhi,
]

export default function App() {
  const [consoleContent, setConsoleContent] = useState<string[]>(
    Array(allTasks.length).fill('>')
  )
  const [hintContent, setHintContent] = useState<string[]>(
    Array(allTasks.length).fill('')
  )
  const [hintStatus, setHintStatus] = useState<string[]>(
    Array(allTasks.length).fill('')
  )
  const [hintTime, setHintTime] = useState<string[]>(
    Array(allTasks.length).fill('')
  )
  const [selectedTask, setSelectedTask] = useState<number>(0)
  const collapsibleTabsRef = useRef<CollapsibleTabsHandle>(null)
  const [code, setCode] = useState(allTasks.map((task) => task.starterCode))
  const [llmParams, setLLMParams] = useState<LLMParams>(defaultLLMParams)
  const [progress, setProgress] = useState<ProgressType | undefined>(undefined)
  const [generatingHint, setGeneratingHint] = useState(false)
  const [generatingTaskIdx, setGeneratingTaskIdx] = useState<
    number | undefined
  >(undefined)

  const customInitProgressCallback = useCallback(
    (progress: ProgressType | undefined) => {
      setProgress(progress)
    },
    []
  )

  const { loadingModel, loadModel, generateHint, stopHintGeneration } = useLLM({
    customInitProgressCallback,
    modelConfigList,
  })

  async function getHint() {
    setGeneratingHint(true)
    setGeneratingTaskIdx(selectedTask)
    setHintContent((prev) =>
      prev.map((content, index) => (index === selectedTask ? '' : content))
    )
    collapsibleTabsRef.current?.open(1)
    const hint = await generateHint({
      task: allTasks[selectedTask],
      buggyCode: code[selectedTask],
      params: llmParams,
      onHintStatusChange: (status) =>
        setHintStatus((prev) =>
          prev.map((c, i) => (i === selectedTask ? status : c))
        ),
      onHintTimeChange: (time) =>
        setHintTime((prev) =>
          prev.map((c, i) => (i === selectedTask ? time : c))
        ),
    })
    setHintContent((prev) =>
      prev.map((content, index) =>
        index === selectedTask ? hint || '' : content
      )
    )
    setGeneratingHint(false)
    setGeneratingTaskIdx(undefined)
  }

  function onSelectTask(task: number) {
    setSelectedTask(task)
  }

  const { runningPython, runPython, loadingPyodide } = usePyodide()

  function formatFunctionCall(functionName: string, args: string[]) {
    return `${functionName}(${args.join(', ')})`
  }

  async function runPythonCode() {
    setConsoleContent((prev) =>
      prev.map((content, index) =>
        index === selectedTask ? '> Running tests ...' : content
      )
    )
    collapsibleTabsRef.current?.open(0)

    const result = await runPython({
      code: code[selectedTask],
      tests: allTasks[selectedTask].tests,
      function_name: allTasks[selectedTask].functionName,
      delayMs: RUN_PYTHON_DELAY_MS,
    })

    let msg = ''
    if (result.type === 'success') {
      msg += `> All tests passed!`
    } else if (result.type === 'syntax_error') {
      msg += `> Syntax error\n`
      msg += `> ${result.error}`
    } else if (result.type === 'specification_error') {
      msg += `> Specification error\n`
      msg += `> ${result.error}`
    } else if (result.type === 'runtime_error') {
      msg += `> Failed \`${formatFunctionCall(result.function_name, result.input_args)}\`:\n`
      msg += `> ${result.error}`
    } else if (result.type === 'timeout') {
      msg += `> Failed \`${formatFunctionCall(result.function_name, result.input_args)}\`:\n`
      msg += `> Timeout: the code took too long to run\n`
    } else if (result.type === 'fail') {
      msg += `> Failed \`${formatFunctionCall(result.function_name, result.input_args)}\`:\n`
      msg += `> Expected output: ${result.expected_output}\n`
      msg += `> Output: ${result.output}\n`
    }

    setConsoleContent((prev) =>
      prev.map((content, index) => (index === selectedTask ? msg : content))
    )
  }

  return (
    <div
      className={`min-h-dvh flex flex-col items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white to-white`}
    >
      <TopBar />
      <div className={`w-full flex flex-row flex-grow pr-4 gap-x-6`}>
        <SideBar className="w-[300px] min-w-64">
          <ScrollArea className={`flex-grow h-48 pt-5 pr-6`}>
            <SideNav
              className={`pb-6`}
              selectedTaskIdx={selectedTask}
              onSelectTaskIdx={onSelectTask}
              generatingTaskIdx={generatingTaskIdx}
            />
            <div className="pl-4 pr-3">
              <Separator className="bg-gradient-to-r from-gray-400/5 via-gray-400/20 to-gray-400/5" />
            </div>
            <SideParams
              className={`py-6`}
              modelConfigList={modelConfigList}
              defaultModel={modelConfigList[0].model_id}
              onModelChange={async (selectedModel) => {
                await loadModel(selectedModel)
              }}
              loading={loadingModel}
              params={llmParams}
              setParams={setLLMParams}
            />
          </ScrollArea>
          <div className="w-full flex flex-row justify-center px-2">
            <ProgressCard
              className={twMerge(
                `w-full justify-self-end`,
                progress === undefined && 'hidden'
              )}
              value={progress?.value || 0}
              text={progress?.text || ''}
              extraText={progress?.extraText || ''}
            />
          </div>
        </SideBar>
        <div className={`flex flex-col flex-grow items-center pt-5 pb-3`}>
          <div className={`w-[850px] flex flex-col flex-grow`}>
            <Description
              className={`mb-2`}
              title={allTasks[selectedTask].name}
              text={allTasks[selectedTask].description}
              examples={allTasks[selectedTask].examples}
            />
            <LayoutGroup>
              <CodeEditor
                className={`w-full h-40`}
                code={code[selectedTask]}
                setCode={(s) =>
                  setCode((prev) =>
                    prev.map((_, i) => (i === selectedTask ? s : _))
                  )
                }
              />
              <CollapsibleTabs
                className={`mt-2`}
                hintStatus={hintStatus[selectedTask]}
                hintTime={hintTime[selectedTask]}
                onClickRun={runPythonCode}
                runningPython={runningPython}
                loadingModel={loadingModel}
                onGetHint={getHint}
                onStopHint={stopHintGeneration}
                loadingHint={generatingHint}
                loadingPyodide={loadingPyodide}
                content={[
                  consoleContent[selectedTask],
                  hintContent[selectedTask],
                ]}
                ref={collapsibleTabsRef}
              />
            </LayoutGroup>
          </div>
        </div>
        <div className={`w-24 flex-shrink`}></div>
      </div>
    </div>
  )
}
