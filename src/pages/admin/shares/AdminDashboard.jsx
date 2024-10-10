import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RouterAdmin from '../../../routes/AdminRouters';
import { DatasLink } from "../../../utils/Contanst";
import { Title } from '@mui/icons-material';
function AdminDashboard(props) {
  // const [hidden, setHidden] = useState(false);
  const intervalRef = useRef(false);
  const [left, setLeft] = useState(true);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [idShow, setIdShow] = useState(null);
  const handleShowProfile = () => {
    setProfileMenuVisible(!isProfileMenuVisible);
  }
  const handleHideProfile = () => {

    setProfileMenuVisible(false);

  }
  useEffect(() => {
    document.addEventListener("mousedown", handleHideProfile);
    return () => document.removeEventListener("mousedown", handleHideProfile);
  }, [])
 
  const handelMenu = (id) => {
         if(id == idShow) {
          setIdShow(null);
         }else{
           setIdShow(id);
         }
  }
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className='khoaHome'>
      <div className="left text-white px-4" style={{backgroundImage:"linear-gradient( #da4453, #89216b)"}}>
        <ul className="menu" >
          <li className='store flex justify-center items-center py-3' onClick={() => setLeft(!left)}>
            <h5><span className={`${left ? "hidden" : "mr-3"}`}>CinemaNest</span></h5>
            <i class={`fa-solid fa-bars ${left ? "xoay" : "nguoc"}`}></i>
          </li>
          <div className={left ? "main-left" : ""}>
            <Link class="nav-item" to="/" >
              <i class="fa-solid fa-gauge" ></i>
              <h5 className={`ml-5 ${left ? "hidden" : ""}`}>DASHBOARD</h5>
            </Link>
            <h5 className={left ? "hidden" : ""}>UI ELEMENTS</h5>
            <Link to="/categories" class="nav-item">
              <i class="fa-brands fa-elementor"></i>
              <h5 className={`ml-5 ${left ? "hidden" : ""}`}>Categories</h5>
            </Link>
            <h5 className={left ? "hidden" : ""} >Forms and Datas</h5>
            {
              DatasLink.map(element => (
                <div>
                <div onClick={() => handelMenu(element.id)} className={`flex justify-between items-center nav-item ${left ? "" : "gap-5"}`}>
                  <i className={element.icon}></i>
                  <h5 className={left ? "hidden" : ""}>{element.title}</h5>
                  <i class={`fa-solid fa-chevron-right ${left ? "hidden" : ""}`}></i>
                </div>
                <ul className={idShow == element.id ? "" : "hidden"}>
                   {
                     element.items.map(a => (
                      <Link to={a.path} className="nav-item">
                      <i class="fa-solid fa-caret-right mr-5"></i>
                      <p>{a.title}</p>
                    </Link>
                     ))
                   }           
              </ul>
              </div>
              ))
           
            }

            <h5 className={left ? "hidden" : ""}>Pages</h5>
            <Link class="nav-item" to="user">
              <i class="fa-solid fa-user"></i>
              <h5 className={left ? "hidden" : ""}>User Pages</h5>
            </Link>
          </div>
        </ul>
      </div>
      <div className="right flex-1 ">
        <div className=" rightHeader flex header-right justify-between items-center p-2 border-b  border-gray-700">
          <div className="head-text">
            <h1 className='md:text-2xl text-sm'><b>Good Morning, CinemaNest</b></h1>
            <p className='md:text-1xl text-xs'>Your performance sumary this week</p>
          </div>
          <div className="flex items-center">
            <i class="fa-solid fa-magnifying-glass mr-5 text-xl "></i>
            <i class="fa-regular fa-envelope mr-5 text-xl"></i>
            <i class="fa-regular fa-bell mr-5 text-xl"></i>
            <div className='relative w-8 h-8 avatar '>
              <img onClick={handleShowProfile} className='rounded-full' src="https://img.freepik.com/premium-photo/avatar-resourcing-company_1254967-6662.jpg?w=740" alt="" />
              <ul ref={intervalRef} className={`absolute right-0 shadow-lg bg-slate-200 ${isProfileMenuVisible ? "block" : "hidden"}`}>
                <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-regular fa-user"></i> My Profile</li>
                <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-solid fa-gear"></i> Setting</li>
                <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-solid fa-right-from-bracket"></i> Logout</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rightMain "  >
          <Routes>
            {
              RouterAdmin.map((route, index) => (

                <Route key={index} path={route.path} element={<route.Component />} />
              ))
            }
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;