import { Dataset } from '@/data/types.ts'

export const taskUniqueDatesAndMonths = {
  dataset: Dataset.NUS,
  name: 'Unique Dates and Months',
  menuName: 'Unique Dates and Months',
  llmDescription:
    'Implement the functions unique_day, unique_month and contains_unique_day. ' +
    'These functions are designed to work with a list of possible birthdays, where each birthday is represented as a tuple containing a month and a day. ' +
    'unique_day(day, possible_birthdays): This function checks if the given day occurs exactly once among the birthdays in possible_birthdays. ' +
    'unique_month(month, possible_birthdays): Similar to unique_day, this function checks if the given month occurs exactly once among the birthdays in possible_birthdays. ' +
    ' contains_unique_day(month, possible_birthdays): This function determines if there is any day within the specified month that is unique among the possible_birthdays. ' +
    'A day or month is unique if and only if it occurs exactly once in the list of possible birthdays.',
  description: [
    'Given a list $$possible_birthdays$$, where each birthday is represented as a tuple containing a month and a day as strings, implement the following functions: ',
    ' •  $$unique_day$$: Checks if a given $$day$$ occurs exactly once in $$possible_birthdays$$.',
    ' •  $$unique_month$$: Checks if a given $$month$$ occurs exactly once in $$possible_birthdays$$.',
    ' •  $$contains_unique_day$$: Checks if there is any day within a given $$month$$ that is unique in $$possible_birthdays$$.',
  ],
  starterCode:
    'def unique_day(day, possible_birthdays):\n' +
    '    # Write your code here\n    \n\n' +
    'def unique_month(month, possible_birthdays):\n' +
    '    # Write your code here\n    \n\n' +
    'def contains_unique_day(month, possible_birthdays):\n' +
    '    # Write your code here\n    ',
  functionName: '',
  examples: [
    {
      input: 'unique_day("1", (("January", "1"), ("February", "1")))',
      output: 'False',
    },
    {
      input: 'unique_month("January", (("January", "1"), ("January", "2")))',
      output: 'False',
    },
    {
      input:
        'contains_unique_day("January", (("January", "1"), ("January", "2")))',
      output: 'True',
    },
  ],
  tests: [
    {
      input_args: ['"1"', '[("January", "1"), ("February", "1")]'],
      output: 'False',
      function_name: 'unique_day',
    },
    {
      input_args: ['"January"', '[("January", "1"), ("January", "2")]'],
      output: 'False',
      function_name: 'unique_month',
    },
    {
      input_args: ['"January"', '[("January", "1"), ("February", "1")]'],
      output: 'True',
      function_name: 'unique_month',
    },
    {
      input_args: ['"January"', '[("January", "1"), ("January", "2")]'],
      output: 'True',
      function_name: 'contains_unique_day',
    },
    {
      input_args: ['"January"', '[("January", "1"), ("February", "1")]'],
      output: 'False',
      function_name: 'contains_unique_day',
    },
    {
      input_args: [
        '"February"',
        '[("January", "10"), ("February", "1"), ("February", "10")]',
      ],
      output: 'True',
      function_name: 'contains_unique_day',
    },
    {
      input_args: ['"3"', '[("January", "1"), ("January", "2")]'],
      output: 'False',
      function_name: 'unique_day',
    },
    {
      input_args: ['"March"', '[("January", "1"), ("February", "1")]'],
      output: 'False',
      function_name: 'unique_month',
    },
    {
      input_args: ['"1"', '[("January", "1"), ("January", "2")]'],
      output: 'True',
      function_name: 'unique_day',
    },
    {
      input_args: [
        '"16"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'False',
      function_name: 'unique_day',
    },
    {
      input_args: [
        '"17"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'False',
      function_name: 'unique_day',
    },
    {
      input_args: [
        '"18"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'True',
      function_name: 'unique_day',
    },
    {
      input_args: [
        '"19"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'True',
      function_name: 'unique_day',
    },
    {
      input_args: [
        '"May"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'False',
      function_name: 'unique_month',
    },
    {
      input_args: [
        '"June"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'False',
      function_name: 'unique_month',
    },
    {
      input_args: [
        '"June"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'True',
      function_name: 'contains_unique_day',
    },
    {
      input_args: [
        '"July"',
        '[("May", "15"), ("May", "16"), ("May", "19"), ("June", "17"), ("June", "18"), ("July", "14"), ("July", "16"), ("August", "14"), ("August", "15"), ("August", "17")]',
      ],
      output: 'False',
      function_name: 'contains_unique_day',
    },
  ],
}
