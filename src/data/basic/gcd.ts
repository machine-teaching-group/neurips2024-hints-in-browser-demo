import { Dataset } from '@/data/types.ts'

export const taskGcd = {
  dataset: Dataset.BASIC,
  name: 'Greatest Common Divisor',
  menuName: 'Greatest Common Divisor',
  description: [
    'Given two positive integers $$a$$ and $$b$$, find the greatest common divisor of $$a$$ and $$b$$.',
    'The time complexity of your program should be O(log(min(a, b))).',
  ],
  llmDescription:
    'Given two positive integers a and b, find the greatest common divisor of a and b.',
  starterCode: 'def gcd(a, b):\n' + '    # Write your code here\n    ',
  functionName: 'gcd',
  examples: [
    {
      input: 'gcd(3, 6)',
      output: '3',
    },
    {
      input: 'gcd(8, 1)',
      output: '1',
    },
  ],
  tests: [
    { input_args: ['3', '6'], output: '3' },
    { input_args: ['8', '1'], output: '1' },
    { input_args: ['1', '1'], output: '1' },
    { input_args: ['43', '38'], output: '1' },
    { input_args: ['21', '21'], output: '21' },
    { input_args: ['21', '38'], output: '1' },
    { input_args: ['8', '80'], output: '8' },
    { input_args: ['42', '56'], output: '14' },
    { input_args: ['999999998', '2'], output: '2' },
    { input_args: ['20', '987567235'], output: '5' },
    { input_args: ['194067000', '194067'], output: '194067' },
    { input_args: ['461952', '116298'], output: '18' },
    { input_args: ['7966496', '314080416'], output: '32' },
    { input_args: ['24826148', '45296490'], output: '526' },
    { input_args: ['999999999', '999999998'], output: '1' },
    { input_args: ['745685214', '897541211'], output: '1' },
    { input_args: ['666000000', '999000000'], output: '333000000' },
  ],
}
