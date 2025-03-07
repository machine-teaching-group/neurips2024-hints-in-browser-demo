import { Dataset } from '@/data/types.ts'

export const taskDivisorsBy3 = {
  dataset: Dataset.BASIC,
  name: 'Divisors by 3',
  menuName: 'Divisors by 3',
  description: [
    'Given a positive integer $$n$$, find the number of divisors of $$n$$ that are divisible by 3.',
    'The time complexity of your program should be O(sqrt(n)).',
  ],
  llmDescription:
    'Given a positive integer n, find the number of divisors of n that are divisible by 3.',
  starterCode: 'def count_divisors(n):\n' + '    # Write your code here\n    ',
  functionName: 'count_divisors',
  examples: [
    {
      input: 'count_divisors(6)',
      output: '2',
    },
    {
      input: 'count_divisors(10)',
      output: '0',
    },
  ],
  tests: [
    { input_args: ['6'], output: '2' },
    { input_args: ['10'], output: '0' },
    { input_args: ['1'], output: '0' },
    { input_args: ['7'], output: '0' },
    { input_args: ['30'], output: '4' },
    { input_args: ['18'], output: '4' },
    { input_args: ['6'], output: '2' },
    { input_args: ['100000'], output: '0' },
    { input_args: ['98652'], output: '6' },
    { input_args: ['91524'], output: '12' },
    { input_args: ['53268'], output: '12' },
    { input_args: ['49822'], output: '0' },
    { input_args: ['960000000'], output: '104' },
  ],
}
