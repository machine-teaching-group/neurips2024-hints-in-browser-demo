import { Dataset } from '@/data/types.ts'

export const taskFibonacciUpToN = {
  dataset: Dataset.BASIC,
  name: 'Fibonacci up to n',
  menuName: 'Fibonacci up to n',
  description: [
    'Given a positive integer $$n$$, calculate the Fibonacci series up to the number $$n$$. If $$n$$ is a part of the series, include $$n$$ as well.',
  ],
  llmDescription:
    'Given a positive integer n, calculate the Fibonacci series up to the number n. If n is a part of the series, include n as well.',
  starterCode: 'def n_fibonacci(n):\n' + '    # Write your code here\n    ',
  functionName: 'n_fibonacci',
  examples: [
    {
      input: 'n_fibonacci(1)',
      output: '[0, 1, 1]',
    },
    {
      input: 'n_fibonacci(6)',
      output: '[0, 1, 1, 2, 3, 5]',
    },
  ],
  tests: [
    { input_args: ['1'], output: '[0, 1, 1]' },
    { input_args: ['6'], output: '[0, 1, 1, 2, 3, 5]' },
    { input_args: ['5'], output: '[0, 1, 1, 2, 3, 5]' },
    {
      input_args: ['1000000000'],
      output:
        '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733]',
    },
    { input_args: ['4'], output: '[0, 1, 1, 2, 3]' },
    { input_args: ['2'], output: '[0, 1, 1, 2]' },
    {
      input_args: ['433494436'],
      output:
        '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296]',
    },
    {
      input_args: ['433494437'],
      output:
        '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437]',
    },
    {
      input_args: ['433494438'],
      output:
        '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437]',
    },
  ],
}
