import { Dataset } from '@/data/types.ts'

export const taskTopKElements = {
  dataset: Dataset.NUS,
  name: 'Top-k Elements',
  menuName: 'Top-k Elements',
  llmDescription:
    'Write a function top_k that accepts a list of integers as the input and returns the greatest k number of values as a list, with its elements sorted in descending order. You may use any sorting algorithm you wish, but you are not allowed to use sort and sorted.',
  description: [
    'Write a function that accepts a list of integers $$lst$$ and a number $$k$$, and returns a list that contains in descending order the $$k$$ largest values present in $$lst$$. You may assume that the length of $$lst$$ is at least $$k$$. You may use any sorting algorithm you wish, but you are not allowed to use $$sort$$ and $$sorted$$.',
  ],
  starterCode: 'def top_k(lst, k):\n' + '    # Write your code here\n    ',
  functionName: 'top_k',
  examples: [
    {
      input: 'top_k([9, 8, 9, 3], 3)',
      output: '[9, 9, 8]',
    },
    {
      input: 'top_k([5, 12, 6], 1)',
      output: '[12]',
    },
  ],
  tests: [
    { input_args: ['[9, 8, 9, 3]', '3'], output: '[9, 9, 8]' },
    { input_args: ['[5, 12, 6]', '1'], output: '[12]' },
    {
      input_args: ['[9, 9, 4, 9, 7, 9, 3, 1, 6]', '5'],
      output: '[9, 9, 9, 9, 7]',
    },
    {
      input_args: ['[9, 8, 4, 5, 7, 2, 3, 1, 6]', '5'],
      output: '[9, 8, 7, 6, 5]',
    },
    { input_args: ['[4, 5, 2, 3, 1, 6]', '6'], output: '[6, 5, 4, 3, 2, 1]' },
    { input_args: ['[4, 5, 2, 3, 1, 6]', '3'], output: '[6, 5, 4]' },
    { input_args: ['[4, 5, 2, 3, 1, 6]', '0'], output: '[]' },
    { input_args: ['[42]', '1'], output: '[42]' },
    { input_args: ['[]', '0'], output: '[]' },
  ],
}
