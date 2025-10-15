
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = ()=>{
    const navigate = useNavigate();
    const [user,setuser] = useState({
        username:"",password:"",email:""
    })
    const handlechange = (e)=>{
        setuser({...user,[e.target.name]:e.target.value})
    }
    const handleSubmit = async (e)=>{ 
      e.preventDefault();
        console.log(user);
        const response = await fetch("http://localhost:3000/api/v1/user/login",{
            method:"POST",
            body:JSON.stringify(user),
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const data = await response.json();
        console.log(data);
        setuser({username:"",password:"",email:""})
        if (data.statuscode == 200) navigate("/");
        else alert("login failed" + data.message);
    }
    return (
        <>
        <div className=" text-5xl text-center" >Login</div>
       <form className="flex flex-col py-[5%] justify-center items-center g-3">
   
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="email" className="form-label">
        Email
    </label>
    <input type="email" className="form-control" value={user.email} name="email" placeholder="Enter your Email" onChange={handlechange} id="email"/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="username" className="form-label">username</label>
    <input type="text" className="form-control" id="username" value={user.username} name="username" onChange={handlechange} placeholder="enter username "/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" required className="form-control" id="password" value={user.password} name="password" onChange={handlechange} placeholder="enter password "/>

  </div>
  <button type="submit" className="btn btn-primary my-5" onClick={handleSubmit}>Sign in</button>
  </form>
        </>
    )
}
export default Login;