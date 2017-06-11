import React from 'react'
import { Footer } from 'react-materialize'

export default () => {
  return (
    <Footer
      copyrights='&copy; 2017 Copyright Brackette'
      moreLinks={
        <a className='grey-text text-lighten-4 right' href='https://github.com/HappyZombies/brackette/releases/tag/v0.2.1b' target='_blank' rel='noopener noreferrer'>v0.2.1b</a>
      }
      className='amber accent-2'
      links={
        <ul>
          <li><a className='grey-text text-lighten-4 right' href='https://github.com/HappyZombies/brackette' target='_blank' rel='noopener noreferrer'>Source Code</a></li>
        </ul>
      }
    >
      <h5 className="white-text">Brackette</h5>
      <p className="grey-text text-lighten-4">Run your tournaments with ease.</p>
    </Footer>
  )
}
