import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import InstagramIcon from '../assets/Instagram icon.png'; 
import Companylogo from '../assets/Finlink Favicon.jpeg';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-white bg-opacity-90 shadow-md shadow-gray-400">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <div className="flex items-center">
          <img src={Companylogo} alt="Company Logo" className="h-10 w-10 rounded-full mr-3" />
          <Link to="/" className="flex items-center">
            <h1 className="font-bold text-xl">
              <span className="text-black">Finlink</span>
              <span className="text-blue-500">Enterprise</span>
            </h1>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-blue-500 w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-blue-500" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-black">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-black">About</li>
          </Link>
          <a href="https://www.instagram.com/finlink_enterprise_" target="_blank" rel="noopener noreferrer">
            <li>
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="h-7 w-7 rounded-full"
              />
            </li>
          </a>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-blue-500 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
