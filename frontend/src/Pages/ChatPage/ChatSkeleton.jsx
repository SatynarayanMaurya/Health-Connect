import React from 'react'

function ChatSkeleton() {
  return (
    <div className="w-[73vw] mx-auto bg-[#F5F1EB]   animate-pulse">
        <div className='flex flex-col gap-4'>
            
            <div className='flex-flex-col gap-4'>
                <div className='flex justify-start'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
                <div className='flex justify-end'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
            </div>
            
            <div className='flex-flex-col gap-4'>
                <div className='flex justify-start'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
                <div className='flex justify-end'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
            </div>
            
            <div className='flex-flex-col gap-4'>
                <div className='flex justify-start'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
                <div className='flex justify-end'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
            </div>
            
            <div className='flex-flex-col gap-4'>
                <div className='flex justify-start'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
                <div className='flex justify-end'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
            </div>
            
            <div className='flex-flex-col gap-4'>
                <div className='flex justify-start'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
                <div className='flex justify-end'>
                    <div className='h-10 w-[30vw] bg-gray-200 rounded flex flex-end'></div>
                </div>
            </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-full p-3"></div>
            <div className="h-10 bg-gray-200 rounded w-16"></div>
        </div>
    </div>
  )
}

export default ChatSkeleton
