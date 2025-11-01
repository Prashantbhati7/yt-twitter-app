import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const Navbar = ()=>{
    const [user,setuser] = useState(null);
    useEffect(()=>{
        const fetchuser = async ()=>{
            const resopnse = await fetch("http://localhost:3000/api/v1/user/curruser",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include"
            })
            const data = await resopnse.json();
            console.log(data.data._id);
            setuser(data.data._id);
        }
        fetchuser();
    },)
    const handlelogout = async()=>{
        console.log("navbar user is ",user);
        const res = await fetch("http://localhost:3000/api/v1/user/logout",{
            method:"POST",
            body:JSON.stringify({}),
            credentials:'include',
            headers:{
                    "Content-Type":"application/json"
            }
        })
        const data = await res.json();
        console.log(data);
    }
    return (
        <>
        <div className="bg-red-500 h-[5%] text-stone-400 ">
          {user && <div className="button cursor-pointer " onClick={handlelogout}> Logout </div> }
          {!user && <div className="flex flex-row gap-2 items-center py-1.5 justify-end">
            <Link to='/register'> <div className="text-black no-underline hover:shadow-blue-700">Register</div></Link>
            <Link to='/login'> <div className="text-black no-underline">Login </div></Link>
            </div>}
        </div>
        </>
    )
}

export default Navbar;