import { taskGcd } from '@/data/basic/gcd.ts'
import { taskFibonacciUpToN } from '@/data/basic/fibonacci.ts'
import { taskDivisorsBy3 } from '@/data/basic/divisors-by-3.ts'
import { taskPalindrome } from '@/data/basic/palindrome.ts'
import { taskMergeStrings } from '@/data/basic/merge-strings.ts'
import { taskDuplicateElimination } from '@/data/nus/duplicate-elimination.ts'
import { taskSortingTuples } from '@/data/nus/sorting-tuples.ts'
import { taskTopKElements } from '@/data/nus/top-k-elements.ts'
import { taskSequentialSearch } from '@/data/nus/sequential-search.ts'
import { taskUniqueDatesAndMonths } from '@/data/nus/unique-dates-and-months.ts'
import { Task } from '@/data/types.ts'

export const basicTasks: Task[] = [
  taskGcd,
  taskFibonacciUpToN,
  taskDivisorsBy3,
  taskPalindrome,
  taskMergeStrings,
]
export const nusTasks: Task[] = [
  taskDuplicateElimination,
  taskSortingTuples,
  taskTopKElements,
  taskSequentialSearch,
  taskUniqueDatesAndMonths,
]

export const allTasks = [...nusTasks, ...basicTasks]
