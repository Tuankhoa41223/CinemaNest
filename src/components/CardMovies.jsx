import { BsCaretRightSquareFill } from "react-icons/bs";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
const CardMovies = (props) => {
    const { img, title, timeMovie, category, index, movieClassification } = props
    return (
            <div key={index}  >
                <div className="group hover:-translate-y-5 bg-black  transition-all duration-500 ease-in-out  ">
                    <img className="w-full mb-3 " src={img} alt="" />
                    <div className="p-3 hidden detail-movie">
                        <div className="flex justify-between items-center">
                            <BsCaretRightSquareFill className="text-white border border-zinc-50 rounded-full p-2 text-5xl hover:text-yellow-500 hover:bg-white" />
                            <MdOutlineSaveAlt className="text-white border border-zinc-50 rounded-full p-2 text-5xl hover:text-yellow-500 hover:bg-white" />
                            <FaRegHeart className="text-white border border-zinc-50 rounded-full p-2 text-5xl hover:text-yellow-500 hover:bg-white" />
                            <BiMessageDetail className="text-white border border-zinc-50 rounded-full p-2 text-5xl hover:text-yellow-500 hover:bg-white" />
                        </div>
                        <h1 className="text-white text-center "><b>{title}</b></h1>
                        <div className="flex justify-between items-center">
                            <span className="text-white ">{category}</span>
                            <p className="text-white ">{timeMovie}</p>
                            <p className="text-white ">{movieClassification}</p>
                        </div>
                    </div>
                </div>
            </div>
                    
    );
};

export default CardMovies;