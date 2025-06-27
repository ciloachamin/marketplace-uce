import DarkMode from "./DarkMode";
import { FaFacebook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
const Header = () => {


  return (
      <div className="header-top md-lg:hidden shadow-sm bg-gray-200 dark:bg-gray-900 dark:text-white duration-200 relative z-40 dark:shadow-slate-700">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[50px] text-slate-500">
            <ul className="flex justify-start items-center gap-8">
              <li className="flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <span>Tienda virtual</span>
              </li>
            </ul>
            <div>
              <div className="flex justify-center items-center gap-10">
                <div className="flex justify-center items-center gap-4">
                  <a href="https://www.facebook.com/smartuc32"><FaFacebook/></a>
                  <a href="https://api.whatsapp.com/send/?phone=5930983537312"><FaWhatsapp/></a>
                  <a href="https://www.gmail.com/mail/help/intl/es/about.html?iframe"><MdOutlineMail/></a>
                  <a href="https://www.linkedin.com/"><FaLinkedin/></a>
                </div>
                
                <div>
                  <DarkMode></DarkMode>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Header;
