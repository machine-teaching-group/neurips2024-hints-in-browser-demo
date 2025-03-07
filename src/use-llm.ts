'use client'

import { useEffect, useRef, useState } from 'react'
import * as webllm from '@mlc-ai/web-llm'
import {
  createHintRequest,
  createRepairRequest,
  extractHint,
  extractRepair,
} from './prompt.ts'
import { LLMParams } from '@/components/SideParams.tsx'
import usePyodide from '@/use-pyodide.ts'
import { Task } from '@/data/types.ts'
import { PythonResult } from '@/checkmate.ts'

export type ProgressType = {
  value: number
  text: string
  extraText?: string
}

enum GenerationResultType {
  SUCCESS = 'success',
  ABORT = 'abort',
  ERROR = 'error',
}

type GenerationResultSuccess = {
  type: GenerationResultType.SUCCESS
  message: string
}

type GenerationResultError = {
  type: GenerationResultType.ERROR
  error: string
}

type GenerationResultAbort = {
  type: GenerationResultType.ABORT
}

type GenerationResult =
  | GenerationResultSuccess
  | GenerationResultError
  | GenerationResultAbort

enum HintResultType {
  PASSING = 'passing',
  HINT_REPAIR = 'hint-repair',
  HINT_NOREPAIR = 'hint-norepair',
  NOHINT = 'nohint',
  ERROR = 'error',
  ABORT = 'abort',
}

type HintResultSuccess = {
  type: HintResultType.HINT_REPAIR | HintResultType.HINT_NOREPAIR
  hint: string
}

type HintResultPassing = {
  type: HintResultType.PASSING
}

type HintResultNoHint = {
  type: HintResultType.NOHINT
}

type HintResultError = {
  type: HintResultType.ERROR
  error: string
}

type HintResultAbort = {
  type: HintResultType.ABORT
}

type HintResult =
  | HintResultSuccess
  | HintResultPassing
  | HintResultNoHint
  | HintResultError
  | HintResultAbort

export function useLLM({
  customInitProgressCallback,
  modelConfigList,
}: {
  customInitProgressCallback: (progress: ProgressType | undefined) => void
  modelConfigList: webllm.ModelRecord[]
}) {
  const [engine, setEngine] = useState<webllm.WebWorkerMLCEngine>()
  const worker = useRef<Worker>()
  const [loadingModel, setLoadingModel] = useState(true)
  const appConfig: webllm.AppConfig = {
    model_list: modelConfigList,
  }

  useEffect(() => {
    worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    })
  }, [])

  useEffect(() => {
    // eslint-disable-next-line
    ;(async () => {
      const initProgressCallback = (progress: webllm.InitProgressReport) => {
        customInitProgressCallback(customProgressInfo(progress))
      }

      setLoadingModel(true)
      const webWorkerEngine = await webllm.CreateWebWorkerMLCEngine(
        worker.current!,
        modelConfigList[0].model_id,
        {
          appConfig,
          initProgressCallback,
        }
      )
      console.log('>>> Engine loaded', webWorkerEngine)
      setEngine(webWorkerEngine)
      setLoadingModel(false)
    })()
  }, [])

  async function loadModel(selectedModel: string) {
    if (engine === undefined) {
      console.error('Engine not loaded')
      return
    }

    setLoadingModel(true)
    await engine.unload()
    await engine.reload(selectedModel)
    setLoadingModel(false)
  }

  function customProgressInfo(
    progress: webllm.InitProgressReport
  ): ProgressType | undefined {
    const regexDownloading = /Fetching param cache\[(\d+)\/(\d+)]/
    const matchDownloading = progress.text.match(regexDownloading)
    if (matchDownloading) {
      const current = parseInt(matchDownloading[1])
      const total = parseInt(matchDownloading[2])
      return {
        value: (100 * (current + 1)) / total,
        text: `Downloading model parameter files ...`,
        extraText:
          'This is only necessary the first time you visit this page. On subsequent visits, the model is loaded from your browser cache.',
      }
    }

    const regexLoading = /Loading model from cache\[(\d+)\/(\d+)]/
    const matchLoading = progress.text.match(regexLoading)
    if (matchLoading) {
      const current = parseInt(matchLoading[1])
      const total = parseInt(matchLoading[2])
      return {
        value: (100 * current) / total,
        text: `Loading model from cache ...`,
      }
    }

    const regexStarting = /Start to fetch .*/
    const matchStarting = progress.text.match(regexStarting)
    if (matchStarting) {
      return {
        value: 0,
        text: 'Preparing to load model ...',
      }
    }

    return undefined
  }

  const { runPython, getDistance, loadingPyodide } = usePyodide()

  async function pipelineWrapper({
    task,
    buggyCode,
    params,
    onHintStatusChange = () => {},
    onHintTimeChange = () => {},
  }: {
    task: Task
    buggyCode: string
    params: LLMParams
    onHintStatusChange?: (status: string) => void
    onHintTimeChange?: (time: string) => void
  }): Promise<string | undefined> {
    onHintStatusChange('')
    onHintTimeChange('')
    const timeStart = performance.now()
    const hintResult = await pipeline({
      task,
      buggyCode,
      params,
      onHintStatusChange,
    })
    const timeEnd = performance.now()
    onHintTimeChange(`${((timeEnd - timeStart) / 1000).toFixed(1)}s`)

    if (hintResult.type === HintResultType.PASSING) {
      onHintStatusChange('Your code already passes all tests')
    } else if (hintResult.type === HintResultType.HINT_REPAIR) {
      onHintStatusChange('Done')
      return hintResult.hint
    } else if (hintResult.type === HintResultType.HINT_NOREPAIR) {
      onHintStatusChange('Done [no successful repair]')
      return hintResult.hint
    } else if (hintResult.type === HintResultType.NOHINT) {
      onHintStatusChange('Unable to generate any meaningful hints')
    } else if (hintResult.type === HintResultType.ERROR) {
      onHintStatusChange(`Oops, something went wrong: ${hintResult.error}`)
    } else if (hintResult.type === HintResultType.ABORT) {
      onHintStatusChange('Aborted')
    }
  }

  async function pipeline({
    task,
    buggyCode,
    params,
    onHintStatusChange = () => {},
  }: {
    task: Task
    buggyCode: string
    params: LLMParams
    onHintStatusChange?: (status: string) => void
  }): Promise<HintResult> {
    if (loadingPyodide) {
      console.error('[pipeline] Pyodide not loaded')
      return { type: HintResultType.ERROR, error: 'Pyodide not loaded' }
    }

    onHintStatusChange('Testing original Python code ...')
    const pythonResult = await runPython({
      code: buggyCode,
      tests: task.tests,
      function_name: task.functionName,
    })
    if (pythonResult.type === 'success') {
      return { type: HintResultType.PASSING }
    }

    const generated: string[] = []
    for (let hintIdx = 0; hintIdx < params.numRepairs; hintIdx++) {
      onHintStatusChange(
        `Generating repair ${hintIdx + 1} of ${params.numRepairs} ...`
      )
      const gen = await generateRepair({
        task,
        buggyCode,
        pythonResult,
        params,
      })
      if (gen.type === GenerationResultType.ERROR) {
        return { type: HintResultType.ERROR, error: gen.error }
      } else if (gen.type === GenerationResultType.ABORT) {
        return { type: HintResultType.ABORT }
      } else {
        generated.push(gen.message)
      }
    }

    const repairs: string[] = generated
      .map((g) => extractRepair(g))
      .filter((r) => r !== undefined) as string[]

    onHintStatusChange('Testing repaired Python codes ...')
    const successfulRepairs: { code: string; distance: number }[] = []
    for (const repairedCode of repairs) {
      if (repairedCode === undefined) {
        continue
      }

      const repairedPythonResult = await runPython({
        code: repairedCode,
        tests: task.tests,
        function_name: task.functionName,
      })
      if (repairedPythonResult.type === 'success') {
        const distance = await getDistance({
          code1: buggyCode,
          code2: repairedCode,
        })
        successfulRepairs.push({ code: repairedCode, distance })
      }
    }

    return pipelineGenerateHint({
      task,
      buggyCode,
      params,
      onHintStatusChange,
      successfulRepairs,
      pythonResult,
    })
  }

  async function pipelineGenerateHint({
    task,
    buggyCode,
    params,
    onHintStatusChange,
    successfulRepairs,
    pythonResult,
  }: {
    task: Task
    buggyCode: string
    params: LLMParams
    onHintStatusChange: (status: string) => void
    successfulRepairs: { code: string; distance: number }[]
    pythonResult: PythonResult
  }): Promise<HintResult> {
    onHintStatusChange('Generating hint ...')

    let repairedCode = undefined
    let resultType = HintResultType.HINT_NOREPAIR
    if (successfulRepairs.length > 0) {
      repairedCode = successfulRepairs.reduce(
        (prev, cur) => (cur.distance < (prev.distance || 1e6) ? cur : prev),
        { code: '', distance: 1e6 }
      ).code
      resultType = HintResultType.HINT_REPAIR
    }

    const gen = await generateHint({
      task,
      buggyCode,
      repairedCode: repairedCode,
      pythonResult,
      params: { ...params, temperature: params.hint_temperature },
    })
    if (gen.type === GenerationResultType.ERROR) {
      return { type: HintResultType.ERROR, error: gen.error }
    } else if (gen.type === GenerationResultType.ABORT) {
      return { type: HintResultType.ABORT }
    }
    const hint = extractHint(gen.message)
    if (hint === undefined) {
      return { type: HintResultType.NOHINT }
    } else {
      return { type: resultType, hint }
    }
  }

  async function generateRepair({
    task,
    buggyCode,
    pythonResult,
    params,
  }: {
    task: Task
    buggyCode: string
    pythonResult: PythonResult
    params: LLMParams
  }): Promise<GenerationResult> {
    if (engine === undefined) {
      console.error('Engine not loaded')
      return { type: GenerationResultType.ERROR, error: 'Engine not loaded' }
    }
    try {
      const response = await engine.chat.completions.create(
        createRepairRequest({ task, buggyCode, pythonResult, params })
      )
      let message = ''
      for await (const chunk of response) {
        if (chunk.choices[0].finish_reason === 'abort') {
          return { type: GenerationResultType.ABORT }
        }
        if (chunk.choices[0].delta.content) {
          message += chunk.choices[0].delta.content
        }
      }
      message += ']'
      return { type: GenerationResultType.SUCCESS, message: message }
    } catch (e) {
      console.error(e)
      if (typeof e === 'string') {
        return { type: GenerationResultType.ERROR, error: e }
      } else if (e instanceof Error) {
        return { type: GenerationResultType.ERROR, error: e.message }
      } else {
        return { type: GenerationResultType.ERROR, error: 'Unknown error' }
      }
    }
  }

  async function generateHint({
    task,
    buggyCode,
    repairedCode,
    pythonResult,
    params,
  }: {
    task: Task
    buggyCode: string
    repairedCode: string | undefined
    pythonResult: PythonResult
    params: LLMParams
  }): Promise<GenerationResult> {
    if (engine === undefined) {
      console.log('Engine not loaded')
      return { type: GenerationResultType.ERROR, error: 'Engine not loaded' }
    }
    try {
      const response = await engine.chat.completions.create(
        createHintRequest({
          task,
          buggyCode,
          repairedCode,
          pythonResult,
          params,
        })
      )
      let message = ''
      for await (const chunk of response) {
        if (chunk.choices[0].finish_reason === 'abort') {
          return { type: GenerationResultType.ABORT }
        }
        if (chunk.choices[0].delta.content) {
          message += chunk.choices[0].delta.content
        }
      }
      return { type: GenerationResultType.SUCCESS, message: message }
    } catch (e) {
      console.error(e)
      if (typeof e === 'string') {
        return { type: GenerationResultType.ERROR, error: e }
      } else if (e instanceof Error) {
        return { type: GenerationResultType.ERROR, error: e.message }
      } else {
        return { type: GenerationResultType.ERROR, error: 'Unknown error' }
      }
    }
  }

  async function stopHintGeneration() {
    engine?.interruptGenerate()
  }

  return {
    loadingModel,
    loadModel,
    generateHint: pipelineWrapper,
    stopHintGeneration,
  }
}
