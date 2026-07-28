import { create } from 'zustand'

export type CalculatorAnswers = {
  furnitureType?: string
  size?: string
  material?: string
  extras: string[]
}

type CalculatorState = {
  step: number
  answers: CalculatorAnswers
  setAnswer: (key: 'furnitureType' | 'size' | 'material', value: string) => void
  toggleExtra: (value: string) => void
  next: () => void
  back: () => void
  reset: () => void
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  step: 0,
  answers: { extras: [] },
  setAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),
  toggleExtra: (value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        extras: state.answers.extras.includes(value)
          ? state.answers.extras.filter((item) => item !== value)
          : [...state.answers.extras, value],
      },
    })),
  next: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  back: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  reset: () => set({ step: 0, answers: { extras: [] } }),
}))

export const STEPS = [
  {
    title: 'Что будем делать?',
    key: 'furnitureType' as const,
    options: ['Шкаф-купе', 'Гардеробная', 'Кухня', 'Прихожая', 'Спальня', 'Другое'],
  },
  {
    title: 'Какая ширина?',
    key: 'size' as const,
    options: ['До 2 метров', '2–3 метра', 'Более 3 метров', 'Пока не знаю'],
  },
  {
    title: 'Материал фасадов',
    key: 'material' as const,
    options: ['ЛДСП', 'МДФ крашеный', 'Зеркало / стекло', 'Посоветуйте мне'],
  },
  {
    title: 'Что добавить?',
    key: 'extras' as const,
    options: ['Подсветка', 'Зеркальные двери', 'Ящики soft-close', 'Пантограф'],
  },
]
