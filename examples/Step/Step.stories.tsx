import type { Meta } from '@storybook/react'
import { useAtom, useSetup } from '@xoid/react'
import React from 'react'
import { create } from 'xoid'
import StepComponent from './Step'
import { generate } from 'random-words'
import { contentMap } from '.'

export default {
  title: 'Side by side drag and drop',
  component: StepComponent,
} as Meta<typeof StepComponent>

export const Default = () => {
  const $stepsLayout = useSetup(() => {
    const initialValue = {
      aaa: [['1', '2', '3'], ['4'], ['5', '6'], ['7']],
      bbb: [['10', '20'], ['30'], ['40', '50', '60'], ['70']],
    }

    Object.keys(initialValue).forEach((key) => {
      initialValue[key as keyof typeof initialValue]
        .flatMap(s => s)
        .map(s => {
          contentMap[s] = generate() as unknown as string
        })
    })

    return create<Record<string, string[][]>>(initialValue)
  })
  

  const stepsLayout = useAtom($stepsLayout)

  return (
    <div style={{ background: '#f0f2f9', padding: 32 }}>
      {Object.keys(stepsLayout).map((stepId) => (
        <StepComponent $stepLayout={$stepsLayout.focus(stepId)} key={stepId} />
      ))}
    </div>
  )
}
