import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = ()=>{
    const navigate = useNavigate();
    const [wait,setwait] = useState(false);
    const [user,setuser] = useState({
        username:"",email:"",fullname:"",password:"",avatar:null,coverimage:null,
    })
    const handlechange = (e)=>{
        setuser({...user,[e.target.name]:e.target.value})
    }
    const handlefilechange = (e)=>{
        setuser({...user,[e.target.name]:e.target.files[0]})
    }
    const handleSubmit = async (e)=>{ 
      e.preventDefault();
      setwait(true)
      const User = new FormData();
      User.append("username", user.username);
      User.append("email", user.email);
      User.append("fullname", user.fullname);
      User.append("password", user.password);
      User.append("avatar", user.avatar);
      User.append("coverimage", user.coverimage);

        console.log(User);
        const response = await fetch("http://localhost:3000/api/v1/user/register",{
            method:"POST",
            body:User,
            credentials:"include"
        })
        const data = await response.json();
        console.log(data);
        setuser({username:"",email:"",fullname:"",password:"",avatar:null,coverimage:null})
        setwait(false);
        navigate("/");
    }
    return <>
    {wait && <div className=" text-5xl text-center" >Loading....</div>}
    {!wait &&
    <div>
    <div className=" text-5xl text-center" >Register</div>
       <form className="flex flex-col py-[5%] justify-center items-center g-3">
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="fullname" className="form-label">fullname</label>
    <input type="text" className="form-control" value={user.fullname} name="fullname" onChange={handlechange}  id="fullname"/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="email" className="form-label">
        Email
    </label>
    <input type="email" className="form-control" value={user.email} name="email" onChange={handlechange} id="email"/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="username" className="form-label">username</label>
    <input type="text" className="form-control" id="username" value={user.username} name="username" onChange={handlechange} placeholder="enter username "/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" value={user.password} name="password" onChange={handlechange} placeholder="enter password "/>
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="avatar" className="form-label">avatar</label>
    <input type="file" className="form-control" id="avatar" name="avatar" onChange={handlefilechange} />
  </div>
  <div className="w-[40%] w:md-[60%]">
    <label htmlFor="coverimage" className="form-label">cover image</label>
    <input type="file" className="form-control" id="coverimage" name="coverimage" onChange={handlefilechange} />
  </div>
  <div className="w-auto">
    <button type="submit" className="btn btn-primary my-5" onClick={handleSubmit}>Sign in</button>
  </div>
</form>
</div>
}
    </>
}

export default Register;