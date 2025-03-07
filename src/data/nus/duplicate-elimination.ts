import { Dataset } from '@/data/types.ts'

export const taskDuplicateElimination = {
  dataset: Dataset.NUS,
  name: 'Duplicate Elimination',
  menuName: 'Duplicate Elimination',
  llmDescription:
    'Write a function remove_extras(lst) that takes in a list and returns a new list with all repeated occurrences of any element removed. For example, remove_extras([5, 2, 1, 2, 3]) returns the list [5, 2, 1, 3]. Relative order of the elements should be preserved.',
  description: [
    'Write a function that takes in a list $$lst$$ and returns a new list with all repeated occurrences of any element removed. Relative order of the elements should be preserved.',
  ],
  starterCode: 'def remove_extras(lst):\n' + '    # Write your code here\n    ',
  functionName: 'remove_extras',
  examples: [
    {
      input: 'remove_extras([5, 2, 1, 2, 3])',
      output: '[5, 2, 1, 3]',
    },
    {
      input: 'remove_extras([8, 8, 7, 7])',
      output: '[8, 7]',
    },
  ],
  tests: [
    { input_args: ['[5, 2, 1, 2, 3]'], output: '[5, 2, 1, 3]' },
    { input_args: ['[8, 8, 7, 7]'], output: '[8, 7]' },
    { input_args: ['[1, 1, 1, 2, 3]'], output: '[1, 2, 3]' },
    { input_args: ['[1, 5, 1, 1, 3, 2]'], output: '[1, 5, 3, 2]' },
    { input_args: ['[]'], output: '[]' },
    { input_args: ['[3, 4, 5, 1, 3]'], output: '[3, 4, 5, 1]' },
    { input_args: ['[42, 42, 42]'], output: '[42]' },
  ],
}
