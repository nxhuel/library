import BookIcon from "@mui/icons-material/Book";
import ViewListIcon from "@mui/icons-material/ViewList";
import GradeIcon from "@mui/icons-material/Grade";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import "./style/index.css";
import { useEffect, useState } from "react";

function Navbar() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    } else {
      document.querySelector("html")?.classList.remove("dark");
    }
  }, [theme]);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <div className=" w-28 mt-8 ml-4 container">
        <ul className=" fixed w-14">
          <li className="bg-[#3E54A3] dark:bg-[#161D2F] h-[80vh] flex flex-col items-center gap-4 text-white dark:text-[#5C6B91] cursor-pointer rounded-2xl">
            <span className="bg-[#3E54A3] dark:bg-[#161D2F] pt-6 pb-10 text-[#ED2C49] dark:text-[#FF4546] cursor-default">
              <BookIcon
                fontSize="large"
                className="bg-[#3E54A3] dark:bg-[#161D2F]"
              />
            </span>
            <AccountBoxIcon
              fontSize="medium"
              className="bg-[#3E54A3] dark:bg-[#161D2F] hover:text-[#5C6B91] dark:hover:text-white "
            />
            <ViewListIcon
              fontSize="medium"
              className="bg-[#3E54A3] dark:bg-[#161D2F] hover:text-[#5C6B91] dark:hover:text-white "
            />
            <GradeIcon
              fontSize="medium"
              className="bg-[#3E54A3] dark:bg-[#161D2F] hover:text-[#5C6B91] dark:hover:text-white "
            />
            <button
              type="button"
              onClick={handleChangeTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } theme`}
            >
              <Brightness4Icon
                fontSize="medium"
                className="bg-[#3E54A3] dark:bg-[#161D2F] hover:text-[#5C6B91] dark:hover:text-white "
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } theme`}
              />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
export default Navbar;
