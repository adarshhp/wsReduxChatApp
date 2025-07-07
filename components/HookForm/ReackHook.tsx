import React from 'react'
import { useForm } from 'react-hook-form';

const ReackHook = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => console.log(data);

    console.log(watch("example"))
  return (
    <div >
      <h3>A simple Form</h3>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2'>
      <input defaultValue="test" {...register("example")} className='w-[30vw] h-[10vh] bg-white text-black rounded-md'/>

      <input {...register("exampleRequired", { required: true })} className='w-[30vw] h-[10vh] bg-white text-black rounde'/>
      <input type="submit"></input>
        </form>
    </div>
  )
}

export default ReackHook
