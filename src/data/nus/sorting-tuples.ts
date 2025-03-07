import { Dataset } from '@/data/types.ts'

export const taskSortingTuples = {
  dataset: Dataset.NUS,
  name: 'Sorting Tuples',
  menuName: 'Sorting Tuples',
  llmDescription:
    "Can we sort items other than integers? For this question, you will be sorting tuples! We represent a person using a tuple (gender, age). Given a list of people, write a function sort_age that sorts the people and return a list in an order such that the older people are at the front of the list. An example of the list of people is [('M', 23), ('F', 19), ('M', 30)]. The sorted list would look like [('M', 30), ('M', 23), ('F', 19)]. You may assume that no two members in the list of people are of the same age.",
  description: [
    'Can we sort items other than integers? For this question, you will be sorting tuples! We represent a person using a tuple $$(gender, age)$$. Given a list of people, write a function that sorts the people and returns a list in an order such that the older people are at the front of the list. You may assume that no two members in the list of people are of the same age.',
  ],
  starterCode: 'def sort_age(people):\n' + '    # Write your code here\n    ',
  functionName: 'sort_age',
  examples: [
    {
      input: "sort_age([('M', 23), ('F', 19), ('M', 30)])",
      output: "[('M', 30), ('M', 23), ('F', 19)]",
    },
    {
      input: "sort_age([('F', 88), ('M', 89)])",
      output: "[('M', 89), ('F', 88)]",
    },
  ],
  tests: [
    {
      input_args: ['[("M", 23), ("F", 19), ("M", 30)]'],
      output: "[('M', 30), ('M', 23), ('F', 19)]",
    },
    {
      input_args: ['[("F", 88), ("M", 89)]'],
      output: "[('M', 89), ('F', 88)]",
    },
    { input_args: ['[("F", 19)]'], output: "[('F', 19)]" },
    {
      input_args: [
        '[("M", 35), ("F", 18), ("M", 23), ("F", 19), ("M", 30), ("M", 17)]',
      ],
      output:
        "[('M', 35), ('M', 30), ('M', 23), ('F', 19), ('F', 18), ('M', 17)]",
    },
    {
      input_args: ['[("F", 18), ("M", 23), ("F", 19), ("M", 30), ("M", 17)]'],
      output: "[('M', 30), ('M', 23), ('F', 19), ('F', 18), ('M', 17)]",
    },
    {
      input_args: ['[("F", 18), ("M", 23), ("F", 19), ("M", 30)]'],
      output: "[('M', 30), ('M', 23), ('F', 19), ('F', 18)]",
    },
    { input_args: ['[]'], output: '[]' },
  ],
}
