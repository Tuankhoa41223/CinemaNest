import React, { useState } from 'react';
function AdminDashboard(props) {
  const [hidden,setHidden] = useState(false);
  const [left,setLeft] = useState(false);
  return (
    <div className='flex'>
      <div className="left bg-red-200 px-4">
        <ul className="menu" >
          <li className='store' onClick={()=>setLeft(!left)}>
            <h5> <i class={`fa-solid fa-bars ${left ? "xoay" : "nguoc"}`}></i><span className={left ? "hidden" :""}>CinemaNest</span></h5>
          </li>
          <div className="main-left">
            <li class="nav-item">
              <i class="fa-solid fa-gauge " ></i>
              <h5 className={left ? "hidden" :""}>DASHBOARD</h5>
            </li>
            <h5 className={left ? "hidden" :""}>UI ELEMENTS</h5>
            <li class="nav-item">
              <i class="fa-brands fa-elementor"></i>
              <h5 className={left ? "hidden" :""}>UI Element</h5>
            </li>
            <h5 className={left ? "hidden" :""} >Forms and Datas</h5>
            <li class="nav-item">
              <i class="fa-brands fa-wpforms"></i>
              <h5 className={left ? "hidden" :""}>Form elements</h5>
            </li>
            <li class="nav-item">
              <i class="fa-solid fa-chart-line"></i>
              <h5 className={left ? "hidden" :""} >Charts</h5>
            </li>
            <li class="nav-item">
              <i class="fa-solid fa-table"></i>
              <h5 className={left ? "hidden" :""}>Tables</h5>
            </li>
            <li class="nav-item">
              <i class="fa-solid fa-icons"></i>
              <h5 className={left ? "hidden" :""} >Icons</h5>
            </li>
            <h5 className={left ? "hidden" :""}>Pages</h5>
            <li class="nav-item">
              <i class="fa-solid fa-user"></i>
              <h5 className={left ? "hidden" :""}>User Pages</h5>
            </li>
          </div>
        </ul>
      </div>
      <div className="right flex-1 ">
        <div className="flex header-right justify-between items-center p-5 border-b  border-gray-700">
          <div className="head-text">
            <h1 className='text-3xl'>Good Morning, CinemaNest</h1>
            <p className='text-2xl'>Your performance sumary this week</p>
          </div>
          <div className="flex">
            <i class="fa-solid fa-magnifying-glass mr-5 text-xl "></i>
            <i class="fa-regular fa-envelope mr-5 text-xl"></i>
            <i class="fa-regular fa-bell mr-5 text-xl"></i>
            <div onClick={() => setHidden(!hidden)} className='relative w-8 h-8 avatar '>
                 <img className='rounded-full' src="https://img.freepik.com/free-photo/photo-delicious-hamburger-isolated-white-background_125540-3378.jpg?ga=GA1.2.795401795.1724035923" alt="" />
                 <ul className={`absolute right-0 shadow-lg bg-slate-200 ${hidden ? "hidden" :""}`}>
                       <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-regular fa-user"></i> My Profile</li>
                       <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-solid fa-gear"></i> Setting</li>
                       <li className='whitespace-nowrap p-2  hover:bg-black hover:text-white'><i class="fa-solid fa-right-from-bracket"></i> Logout</li>
                 </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;