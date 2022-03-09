import {useEffect,useState} from "react";
import Blog from "./components/Blog";

function App() {
  const [blogs, setBlogs] = useState([])
  const [userId, setUserId] = useState(0)
  const [token, setToken] = useState("")
  const [userData, setUserData] = useState({
    email:"",
    id:0,
    Blogs:[]
  })
  const [formState, setFormState] = useState({
    email:'',
    password:''
  })
  const [blogFormState, setBlogFormState] = useState({
    title:"",
    body:''
  })
  useEffect(()=>{
    fetchBlogs();
    const savedToken = localStorage.getItem("token");
    fetch("http://localhost:3001/api/users/profile",{
      method:"GET",
      headers:{
          "Content-Type":"application/json",
          "authorization":`Bearer ${savedToken}`
      }
  }).then(res=>{
    
      return res.json()
   
  }).then(data=>{
    // console.log(res);
   
    if(data.id){
      console.log(data)
      setToken(savedToken);
      setUserId(data.id);
      setUserData({
        id:data.id,
        email:data.email,
        Blogs:data.Blogs
      })
    }
  
  })
  },[])

  const fetchBlogs = ()=>{
    fetch("http://localhost:3001/api/blogs").then(res=>res.json()).then(data=>{
      setBlogs(data);
    })
  }

  const login = e=>{
    e.preventDefault();
    fetch("http://localhost:3001/api/users/login",{
        method:"POST",
        body:JSON.stringify(formState),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>res.json()).then(data=>{
      console.log(data)
      setToken(data.token);
      localStorage.setItem("token",data.token);
      setUserId(data.user.id);
      setUserData({
        id:data.user.id,
        email:data.user.email,
        Blogs:data.user.Blogs
      })
    })
  }

  const logout = e=>{
    localStorage.removeItem("token");
    setToken("");
    setUserId(0);
    setUserData({
      email:"",
      id:0,
      Blogs:[]
    })
  }

  const createBlog = e=>{
    e.preventDefault();
    fetch("http://localhost:3001/api/blogs",{
      method:"POST",
      body:JSON.stringify(blogFormState),
      headers:{
          "Content-Type":"application/json",
          "authorization":`Bearer ${token}`
      }
  }).then(res=>res.json()).then(data=>{
    fetchBlogs()
  })
  }
  return (
    <>
    {userId?(
      <div>
        <h1>{userData.email}'s profile!!<button onClick={logout}>Logout</button></h1>
        your blogs:
        {userData.Blogs.map(blog=><Blog key={blog.id} User={userData} title={blog.title} body={blog.body}/>)}
      </div>
     
      ):(
        <div>
        <h1>Hello</h1>
        {blogs.map(blog=><Blog key={blog.id} User={blog.User} title={blog.title} body={blog.body}/>)}
        </div>
      )
    }
      {userId?(<h3>Welcome, {userData.email}!</h3>):(<form onSubmit={login}>
        <input name="email" value={formState.email} onChange={e=>setFormState({...formState,email:e.target.value})}/>
        <input name="password" value={formState.password} onChange={e=>setFormState({...formState,password:e.target.value})}/>
        <button>login!</button>
      </form>)}
      {userId?(<form onSubmit={createBlog}>
        <input name="title" value={blogFormState.title} onChange={e=>setBlogFormState({...blogFormState,title:e.target.value})}/>
        <input name="body" value={blogFormState.body} onChange={e=>setBlogFormState({...blogFormState,body:e.target.value})}/>
        <button>Add blog post!</button>
      </form>):null}

      
    </>
  );
}

export default App;
