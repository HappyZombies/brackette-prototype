import React from 'react'
import {Footer} from 'react-materialize'
import '../css/Footer.css'

export default () => {
  return (
    <Footer
      copyrights='&copy; 2017 Copyright Text'
      moreLinks={
        <a className='grey-text text-lighten-4 right' href='https://github.com/HappyZombies/brackette' target='_blank' rel='noopener noreferrer'>Source Code</a>
        }
      className='amber accent-2'
      />
  )
}
