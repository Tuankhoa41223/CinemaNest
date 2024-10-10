import React,{ useState } from "react";

function Header(props) {
    const [showmenu,setShowmenu]= useState(false);
    return (
        <header className='head px-5 flex justify-between items-center bg-black'>
                <i onClick={()=>setShowmenu(!showmenu)} class="w-16 fa-solid fa-bars md:hidden text-white "></i>
            <div className='flex justify-center items-center text-white '>
            <div className='w-20 logo'><img src="https://assets.glxplay.io/web/images/logoglx.svg" alt="" /></div>
               <ul className={`flex items-center ${showmenu ? "" :"menu"}`}>
                 <li className='ms-10 cursor-pointer'>Trang Chủ</li>
                  <li className='ms-10 cursor-pointer'> Kho Phim</li>
                  <li className='ms-10 cursor-pointer'> Phim Điện Ảnh</li>
                 <li className='ms-10 cursor-pointer'> Phim Bộ</li>
                  <li className='ms-10 cursor-pointer'>Phim Thuê</li>
                 <li className='ms-10 cursor-pointer'>Khuyến Mãi</li>
                 <li className='ms-10 cursor-pointer'>Blog</li>
                 <li className='ms-10 cursor-pointer'>Hỗ trợ</li>
                 <li className='ms-10 cursor-pointer'>Giao diện mới</li>
               </ul>               
            </div>
            <button className='w-20 border text-xs text-white border-gray-100 rounded-full p-2'>Đăng Nhập</button>
        </header>
    );
}
export default Header;