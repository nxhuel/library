import BookIcon from "@mui/icons-material/Book";
import ViewListIcon from "@mui/icons-material/ViewList";
import GradeIcon from "@mui/icons-material/Grade";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Brightness4Icon from "@mui/icons-material/Brightness4";

import "./style/index.css";
function Navbar() {
  return (
    <>
      <div className="w-28 mt-8 ml-4 container">
        <ul className=" fixed w-20">
          <li className="bg-[#161D2F] h-[80vh] flex flex-col items-center gap-4 text-[#5C6B91] cursor-pointer rounded-2xl">
            <span className="bg-[#161D2F] pt-6 pb-10 text-[#FF4546] cursor-default">
              <BookIcon fontSize="large" className="bg-[#161D2F]" />
            </span>
            <AccountBoxIcon
              fontSize="medium"
              className="bg-[#161D2F] hover:text-white "
            />
            <ViewListIcon
              fontSize="medium"
              className="bg-[#161D2F] hover:text-white"
            />
            <GradeIcon
              fontSize="medium"
              className="bg-[#161D2F] hover:text-white"
            />
            <Brightness4Icon
              fontSize="medium"
              className="bg-[#161D2F] hover:text-white"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
export default Navbar;
