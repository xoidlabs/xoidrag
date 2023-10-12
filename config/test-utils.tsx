import { render } from '@testing-library/react'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { FC, ReactElement, ReactNode } from 'react'

const Providers: FC<{
  children: ReactNode
}> = ({ children }) => {
  return <>{children}</>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
