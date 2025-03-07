import { TestCase } from '@/checkmate.ts'

export enum Dataset {
  NUS = 'NUS',
  BASIC = 'BASIC',
}

export type Task = {
  dataset: Dataset
  name: string
  menuName: string
  description: string[]
  llmDescription: string
  starterCode: string
  functionName: string
  examples?: { input: string; output: string }[]
  tests: TestCase[]
}
