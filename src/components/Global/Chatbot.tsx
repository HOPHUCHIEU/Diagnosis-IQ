import React from 'react'

export default function Chatbot() {
  return (
    <div className='fixed bottom-10 right-10'>
      <div onClick={() => alert('click')} className='rounded-full bg-green-500 w-10 h-10 cursor-pointer'>
        AI
      </div>
    </div>
  )
}
