import { Dataset } from '@/data/types.ts'

export const taskSequentialSearch = {
  dataset: Dataset.NUS,
  name: 'Sequential Search',
  menuName: 'Sequential Search',
  llmDescription:
    'Implement a search function that performs a sequential search. It takes in a value x and a sorted sequence seq, and returns the position that x should go to such that the sequence remains sorted. If the same value already exists, then place x before any previous occurrence. The sequence is sorted in ascending order. If the sequence is empty, return 0. The sequence can be a list or a tuple of integers.',
  description: [
    'Implement a search function that performs a sequential search. It takes in a value $$x$$ and a sorted sequence $$seq$$, and returns the position that $$x$$ should go to such that the sequence remains sorted.',
    'If the same value already exists, then place $$x$$ before any previous occurrence. The sequence is sorted in ascending order. If the sequence is empty, return 0. The sequence can be a list or a tuple of integers.',
  ],
  starterCode: 'def search(x, seq):\n' + '    # Write your code here\n    ',
  functionName: 'search',
  examples: [
    {
      input: 'search(3, (1, 2, 4, 5))',
      output: '2',
    },
    {
      input: 'search(2, [1, 2, 2])',
      output: '1',
    },
  ],
  tests: [
    { input_args: ['3', '(1, 2, 4, 5)'], output: '2' },
    { input_args: ['2', '[1, 2, 2]'], output: '1' },
    { input_args: ['42', '(-5, 1, 3, 5, 7, 10)'], output: '6' },
    { input_args: ['42', '[1, 5, 10]'], output: '3' },
    { input_args: ['5', '(1, 5, 10)'], output: '1' },
    { input_args: ['7', '[1, 5, 10]'], output: '2' },
    { input_args: ['3', '(1, 5, 10)'], output: '1' },
    { input_args: ['-5', '(1, 5, 10)'], output: '0' },
    { input_args: ['10', '(-5, -1, 3, 5, 7, 10)'], output: '5' },
    { input_args: ['-100', '(-5, -1, 3, 5, 7, 10)'], output: '0' },
    { input_args: ['0', '(-5, -1, 3, 5, 7, 10)'], output: '2' },
    { input_args: ['100', '[]'], output: '0' },
    { input_args: ['-100', '()'], output: '0' },
  ],
}
