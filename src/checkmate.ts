/* eslint-disable @typescript-eslint/no-explicit-any */
type TestCase = {
  input_args: string[]
  output_args?: string[]
  output: string
  function_name?: string
}

enum ResultType {
  SUCCESS = 'success',
  SYNTAX_ERROR = 'syntax_error',
  SPECIFICATION_ERROR = 'specification_error',
  RUNTIME_ERROR = 'runtime_error',
  FAIL = 'fail',
  TIMEOUT = 'timeout',
}

type SuccessResult = {
  type: ResultType.SUCCESS
}

type BaseErrorResult = {
  arg_names: string[]
  input_args: string[]
  expected_output_args?: string[]
  expected_output: string
  function_name: string
}

type SyntaxErrorResult = {
  type: ResultType.SYNTAX_ERROR
  error: string
}

type SpecificationErrorResult = {
  type: ResultType.SPECIFICATION_ERROR
  error: string
}

type RuntimeErrorResult = BaseErrorResult & {
  type: ResultType.RUNTIME_ERROR
  error: string
}

type TimeoutResult = BaseErrorResult & {
  type: ResultType.TIMEOUT
}

type FailResult = BaseErrorResult & {
  type: ResultType.FAIL
  output_args: any[]
  output: any
}

type PythonResult =
  | SuccessResult
  | SyntaxErrorResult
  | SpecificationErrorResult
  | RuntimeErrorResult
  | TimeoutResult
  | FailResult

export type { TestCase, PythonResult }
export { ResultType }
