import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const Home = ()=>{

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
    },[])
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
    return <>

    <div className=" text-5xl text-center" >Home</div>
    {!user &&  <div>
    <Link to="/register">
        <button>Register</button>
    </Link>
    <Link to="/login">
        <button>Login</button>
    </Link>
    </div>}
    {user && <button onClick={handleLogout}>Logout</button>}
    </>
}

export default Home;