import * as webllm from '@mlc-ai/web-llm'
import { LLMParams } from '@/components/SideParams.tsx'
import { PythonResult, TestCase } from '@/checkmate.ts'
import { Task } from '@/data/types.ts'

export const REPAIR_STOP_STRING = '[/FIXED]'

const systemPrompt =
  'You are an AI tutor. You have to help a student learning programming. The program uses Python. You have to strictly follow the format for the final output as instructed below. While coming up with any explanations or codes, think step-by-step and justify your steps.'

function createRepairPrompt({
  task,
  buggyCode,
  pythonResult,
}: {
  task: Task
  buggyCode: string
  pythonResult: PythonResult
}) {
  return `
Following is the setup of a problem in Python. It contains the description and a sample testcase.

[Problem Starts]
${task.llmDescription}

Sample Testcase -
${formatSampleTestcase(task.tests[0], task.functionName)}
[Problem Ends]

Following is the student's buggy code for this problem:

[Buggy Code Starts]
${buggyCode}
[Buggy Code Ends]

Following are the testcases on which the student's code failed:

[Failing Testcases Start]
${formatPythonResult(pythonResult)}
[Failing Testcases End]

Fix the buggy code. Make as few changes as possible to fix the program. Output your entire fixed code between [FIXED] and [/FIXED].
  `
}

export function createRepairRequest({
  task,
  buggyCode,
  pythonResult,
  params,
}: {
  task: Task
  buggyCode: string
  pythonResult: PythonResult
  params: LLMParams
}): webllm.ChatCompletionRequestStreaming {
  const userPrompt = createRepairPrompt({ task, buggyCode, pythonResult })

  return {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    ...params,
    stop: [REPAIR_STOP_STRING],
    stream: true,
  }
}

function createHintPrompt({
  task,
  buggyCode,
  repairedCode,
  pythonResult,
}: {
  task: Task
  buggyCode: string
  repairedCode: string | undefined
  pythonResult: PythonResult
}) {
  return `
Following is the setup of a problem in Python. It contains the description and a sample testcase.

[Problem Starts]
${task.llmDescription}

Sample Testcase -
${formatSampleTestcase(task.tests[0], task.functionName)}
[Problem Ends]

Following is the student's buggy code for this problem:

[Buggy Code Starts]
${buggyCode}
[Buggy Code Ends]

Following are the testcases on which the student's code failed:

[Failing Testcases Start]
${formatPythonResult(pythonResult)}
[Failing Testcases End]

${
  repairedCode !== undefined
    ? `Following is the fixed code for this problem:
[Fixed Code Starts]
${repairedCode}
[Fixed Code Ends]`
    : ''
}

1. Describe the bugs and provide an explanation along with the fixes. Output the explanation between [EXPLANATION] and [/EXPLANATION].
2. Provide a concise single-sentence hint to the student about one bug in the student's buggy code. Do not give out the answer or any code. If there's an obvious bug, direct to the location of the bug. If there's a conceptual misunderstanding, offer a conceptual refresher. Limit your response for the hint to a sentence or two at most. Be as socratic as possible, and be super friendly. Output your hint between [HINT] and [/HINT].
  `
}

export function createHintRequest({
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
}): webllm.ChatCompletionRequestStreaming {
  const userPrompt = createHintPrompt({
    task,
    buggyCode,
    repairedCode,
    pythonResult,
  })

  return {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    ...params,
    stream: true,
  }
}

export type ExtractedParts = {
  code: string | undefined
  explanation: string | undefined
  hint: string | undefined
}

/**
 * Extract the code, explanation, and hint from a string, according to the format:
 * - Code: [FIXED] ... [/FIXED]
 * - Explanation: [EXPLANATION] ... [/EXPLANATION]
 * - Hint: [HINT] ... [/HINT]
 * @param content
 * @type string
 * @returns ExtractedParts
 */
export function extractParts(content: string) {
  const codeMatch = content.match(/\[FIXED](.*)\[\/FIXED]/s)
  const explanationMatch = content.match(/\[EXPLANATION](.*)\[\/EXPLANATION]/s)
  const hintMatch = content.match(/\[HINT](.*)\[\/HINT]/s)

  return {
    code: codeMatch ? codeMatch[1].trim() : undefined,
    explanation: explanationMatch ? explanationMatch[1].trim() : undefined,
    hint: hintMatch ? hintMatch[1].trim() : undefined,
  }
}

export function extractRepair(content: string): string | undefined {
  return extractParts(content).code
}

export function extractHint(content: string): string | undefined {
  return extractParts(content).hint
}

function formatPythonResult(pythonResult: PythonResult): string {
  if (pythonResult.type === 'success') {
    return ''
  }

  let resultString = ''
  if (
    pythonResult.type === 'fail' ||
    pythonResult.type === 'runtime_error' ||
    pythonResult.type === 'timeout'
  ) {
    resultString += `Input:\n${pythonResult.function_name}(${pythonResult.input_args.join(', ')})\n`
  }
  resultString += 'Student Code Output:\n'
  if (pythonResult.type === 'fail') {
    resultString += `${pythonResult.output}\n`
  } else if (pythonResult.type === 'timeout') {
    resultString += 'Timeout: the code took too long to run\n'
  } else {
    resultString += `${pythonResult.error}\n`
  }
  if (
    pythonResult.type === 'fail' ||
    pythonResult.type === 'runtime_error' ||
    pythonResult.type === 'timeout'
  ) {
    resultString += 'Expected Output:\n' + `${pythonResult.expected_output}\n`
  }

  return resultString.trim()
}

function formatSampleTestcase(test: TestCase, functionName: string): string {
  return (
    'Input:\n' +
    `${test.function_name || functionName}(${test.input_args.join(', ')})` +
    '\nExpected Output:\n' +
    `${test.output}`
  )
}
