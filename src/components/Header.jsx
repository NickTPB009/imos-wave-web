import React, { useState } from "react";
import logo from "../assets/logo.png";

const Header = ({ onSelectLocation, landmarks, savedSites, clearSavedSites, removeSavedSite, setHasNewSavedSite, hasNewSavedSite, }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);

  // Get all site names from uniqueSites
  const siteNames = landmarks
    .map((site) => site.site_name)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));


  // Filter site names based on search keywords (not case sensitive)
  const filteredSiteNames = siteNames.filter((site) =>
    site.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white text-sky-800 py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <a
            href="https://imos.org.au"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} alt="Logo" className="h-20 w-30 mr-3" />
          </a>
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => window.location.reload()}
          >
            IMOS - Wave Data
          </div>
        </div>

        <ul className="flex space-x-4 items-center">
          <li>
            <a
              href="/"
              className="hover:text-gray-400"
              onClick={() => window.location.reload()}
            >
              Home
            </a>
          </li>
          <li>
            <a href="https://imos.org.au/about" className="hover:text-gray-400">
              About
            </a>
          </li>
          <li>
            <a
              href="https://imos.org.au/facility"
              className="hover:text-gray-400"
            >
              Service
            </a>
          </li>
          <li>
            <a
              href="https://imos.org.au/about/contact-us"
              className="hover:text-gray-400"
            >
              Contact
            </a>
          </li>
          <li className="relative">
            <button
              className="hover:text-gray-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Location Select
            </button>
            {dropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white text-[#075985] rounded shadow-md z-10"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {/* Search input box */}
                <div className="p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <ul>
                  {filteredSiteNames.length > 0 ? (
                    filteredSiteNames.map((site, index) => (
                      <li
                        key={index}
                        className="py-2 px-4 hover:bg-[#075985] hover:text-white cursor-pointer"
                        onClick={() => {
                          setDropdownOpen(false);
                          onSelectLocation(site);
                          setSearchQuery(""); // Clear search query
                        }}
                      >
                        {site}
                      </li>
                    ))
                  ) : (
                    <li className="py-2 px-4 text-red-500">
                      No this site, try again.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>
          <li className="relative">
            <button
              className="hover:text-gray-400 relative"
              onClick={() => {
                setSavedOpen(!savedOpen);
                setHasNewSavedSite(false); // 👈 清除红点
              }}
            >
              Saved Location
              {hasNewSavedSite && (
                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              )}
            </button>
            {savedOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white text-[#075985] rounded shadow-md z-10"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {savedSites.length === 0 ? (
                  <div className="py-2 px-4 text-gray-500">No Saved Location, please select.</div>
                ) : (
                  <ul>
                    {savedSites.map((site, index) => (
                      <li
                        key={index}
                        className="py-2 px-4 hover:bg-[#075985] hover:text-white flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          onSelectLocation(site);
                          setSavedOpen(false);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          removeSavedSite(site);
                        }}
                      >
                        {site}
                        <span className="text-sm text-gray-400 ml-2">(Right-click to remove)</span>
                      </li>
                    ))}
                    <li
                      className="py-2 px-4 text-red-600 hover:bg-red-100 cursor-pointer font-semibold"
                      onClick={() => {
                        clearSavedSites();
                        setSavedOpen(false);
                      }}
                    >
                      Clear All
                    </li>
                  </ul>
                )}
              </div>
            )}
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
