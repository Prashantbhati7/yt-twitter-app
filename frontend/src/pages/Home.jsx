import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import { useNavigate } from "react-router-dom";
const Home = ()=>{
    const navigate = useNavigate();
    const [user,setuser] = useState(null);
    
    const handleLogout = async ()=>{
        const response = await  fetch("http://localhost:3000/api/v1/user/logout",{
            method:"POST",
            body:JSON.stringify({}),
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const data = await response.json();
        console.log(data);
        setuser(null);
    }
    const handleclick = (e)=>{
        if (e.target.id == 'videos'){
            console.log('videos button clicked');
            navigate('/videos')
        }
        else {
            console.log("tweet button clicked ")
            navigate('/tweets');
        }
    }
    return <>
    <Navbar className="h-[5%]"/>
    <div className="bg-slate-900 h-[95%]">
        <div className="flex flex-row h-full  items-center  text-center justify-center gap-[10%]">
         <div className="bg-red-600 border shadow-md hover:shadow-red-500 cursor-pointer  button rounded-2xl active:scale-95 hover:bg-blue-700 transition duration-75 ease-in-out py-3 w-[10%]" id="videos" onClick={handleclick}>
            Videos
         </div>
         <div className="bg-red-600 border shadow-md hover:shadow-red-400/100 button rounded-2xl py-3 hover:bg-blue-700 transition duration-75 ease-in-out cursor-pointer w-[10%]" id="tweets" onClick={handleclick}>
            Tweets
         </div>
        </div>
    </div>
    </>
}

export default Home;