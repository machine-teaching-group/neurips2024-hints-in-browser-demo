import { useEffect, useRef, useState } from 'react'
import { PythonResult, ResultType, TestCase } from '@/checkmate.ts'
import { v4 as uuidv4 } from 'uuid'

const FIRST_TIMEOUT = 1500
const SUBSEQUENT_TIMEOUT = 500

export default function usePyodide() {
  const [runningPython, setRunningPython] = useState<boolean>(false)
  const worker = useRef<Worker>()
  const [loadingPyodide, setLoadingPyodide] = useState<boolean>(true)
  const interruptBuffer = useRef<Uint8Array>()
  const interruptFlag = useRef<string | null>(null)

  useEffect(() => {
    worker.current = new Worker(
      new URL('./pyodideWorker.js', import.meta.url),
      {
        type: 'classic',
      }
    )
    interruptBuffer.current = new Uint8Array(new SharedArrayBuffer(1))
    worker.current.postMessage({
      cmd: 'LOAD',
      interruptBuffer: interruptBuffer.current,
    })

    worker.current.onmessage = (event) => {
      if (event.data.loaded) {
        setLoadingPyodide(false)
      }
    }
  }, [])

  async function runPython({
    code,
    tests,
    function_name,
    delayMs = 0,
  }: {
    code: string
    tests: TestCase[]
    function_name: string
    delayMs?: number
  }) {
    setRunningPython(true)

    await new Promise((resolve) => setTimeout(resolve, delayMs))

    for (const test of tests) {
      const res = await runOne({ code, test, function_name, test_id: uuidv4() })
      if (res.type !== 'success') {
        setRunningPython(false)
        return res
      }
    }
    setRunningPython(false)
    return { type: 'success' } as PythonResult
  }

  function delay(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  async function runOne({
    code,
    test,
    function_name,
    test_id,
  }: {
    code: string
    test: TestCase
    function_name: string
    test_id: string
  }): Promise<PythonResult> {
    if (!worker.current || loadingPyodide) {
      console.error('Pyodide not loaded')
      throw new Error('Pyodide not loaded')
    }

    worker.current.postMessage({
      cmd: 'RUN',
      test_id,
      code,
      tests: JSON.stringify([test]),
      function_name,
    })

    interruptBuffer.current![0] = 0
    interruptFlag.current = test_id
    /*
     * This promise interrupts Pyodide's runPython execution after some time, and then waits some more time
     * before it settles to give time for the actual runPromise to return a timeout result after being interrupted.
     * Thus, under normal circumstances, the runPromise should resolve before the timeoutPromise.
     *
     * Since interruptBuffer is shared, we use interruptFlag to check if we should still interrupt the current test.
     * After the test has finished, i.e., runPromise has resolved, we set interruptFlag to null. Furthermore, if
     * another test starts running, interruptFlag will be set to the new test_id. This means that only when the
     * value of interruptFlag is equal to the test_id of the current test, should we interrupt the test.
     *
     * To be on the safe side, we attempt to interrupt three times, because Pyodide seems to be fickle and does not
     * always register the first interrupt. This may warrant further investigation.
     */
    const timeoutPromise = new Promise<null>((res) => {
      Promise.resolve()
        .then(() => delay(FIRST_TIMEOUT))
        .then(() => {
          if (interruptFlag.current === test_id) {
            interruptBuffer.current![0] = 2
          }
        })
        .then(() => delay(SUBSEQUENT_TIMEOUT))
        .then(() => {
          if (interruptFlag.current === test_id) {
            console.log(`${test_id} -- interrupting again @@`)
            interruptBuffer.current![0] = 0
            interruptBuffer.current![0] = 2
          }
        })
        .then(() => delay(SUBSEQUENT_TIMEOUT))
        .then(() => {
          if (interruptFlag.current === test_id) {
            console.log(`${test_id} -- interrupting a third time @@@`)
            interruptBuffer.current![0] = 0
            interruptBuffer.current![0] = 2
          }
        })
        .then(() => delay(SUBSEQUENT_TIMEOUT))
        .then(() => {
          res(null)
        })
    })

    const runPromise = new Promise<PythonResult>((res) => {
      worker.current!.onmessage = (event) => {
        if (event.data.test_id === test_id && event.data.error) {
          console.error('[runPromise] : ', event.data.error)
        } else if (event.data.test_id === test_id && event.data.result) {
          res(event.data.result[0])
        }
      }
    })

    const result: PythonResult | null = await Promise.race([
      timeoutPromise,
      runPromise,
    ])
    interruptFlag.current = null
    interruptBuffer.current![0] = 0
    if (result === null) {
      console.error('timeoutPromise resolved first, this should not happen!')
      // This should really not be necessary, but just in case Pyodide screws up and does not register any of the
      // multiple keyboard interrupts, we should still return a timeout result.
      return {
        type: ResultType.TIMEOUT,
        function_name: test.function_name || function_name,
        input_args: test.input_args,
        expected_output_args: test.output_args,
        expected_output: test.output,
      } as PythonResult
    }
    return result as PythonResult
  }

  async function getDistance({
    code1,
    code2,
  }: {
    code1: string
    code2: string
  }): Promise<number> {
    if (!worker.current || loadingPyodide) {
      console.error('Pyodide not loaded')
      throw new Error('Pyodide not loaded')
    }

    worker.current.postMessage({
      cmd: 'DISTANCE',
      code1,
      code2,
    })

    return await new Promise((res) => {
      worker.current!.onmessage = (event) => {
        if (event.data.distance) {
          res(event.data.distance)
        }
      }
    })
  }

  return { runningPython, loadingPyodide, runPython, getDistance }
}
