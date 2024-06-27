import { forwardRef } from 'react'
// forwardRef() - let your component receive a ref and forward it to a child component

const TextInput = forwardRef(({type,placeholder,styles,label,register,name,length,error},ref)=> {

  return (
   <div className="flex flex-col mt-2">
    <p className="text-gray-600 text-sm mb-1">{label}</p>

    {/* ring - box shadow */}

    <input type={type} 
    name={name}

    maxLength={length}

     placeholder={placeholder} 
     ref={ref}
    className={`rounded border border-gray-400 
    text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-500 text-base px-4 py-2 ${styles}`}
    {...register}
    aria-invalid={error ? "true" : "false"}/>
    {
       
        <span className='text-xs text-red-500 mt-0.5'>{error}</span>
    }
   </div>
  )
})

export default TextInput