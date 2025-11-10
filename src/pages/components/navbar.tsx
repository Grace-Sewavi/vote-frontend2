import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';


const Navbar = () => {
  return (
    <div className=" w-[80%] m-auto flex py-2 px-2 flex-row-reverse justify-between align-center text-black rounded-lg shadow-md">
        <ConnectButton />
        <div className="w-fit flex justify-between space-x-6">

        <a href='/' className="item-center text-black bg-[#fff4be] p-2 cursor-pointer rounded">home</a >
        <a href='/admin' className="item-center text-white bg-black p-2 cursor-pointer rounded">admin</a >
        </div>
    </div>
  )
}

export default Navbar