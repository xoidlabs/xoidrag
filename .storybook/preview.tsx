import type { Preview, Parameters } from '@storybook/react'
import React from 'react'

import '../config/styles/reset.css'
import '../config/styles/global.css'

export const parameters: Parameters = {
  layout: 'fullscreen',
}

const preview: Preview = {
  decorators: [
    Story => {
      // Reset theme for each story.
      window.document.documentElement.setAttribute('data-theme', 'light')
      window.localStorage.setItem('theme', 'light')

      return (
        <>
          <Story />
        </>
      )
    },
  ],
}

export default preview
