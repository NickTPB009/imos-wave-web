import React, { useState } from 'react';
import logo from '../assets/logo.png';
import albatrossBayData from '../wavedata/AlbatrossBay.json';
import capeSorellData from '../wavedata/CapeSorell.json';
import portKemblaData from '../wavedata/PortKembla.json';
import capeduCouedicData from '../wavedata/CapeduCouedic.json';
import hayPointData from '../wavedata/HayPoint.json';
import wideBayData from '../wavedata/WideBay.json';
import rottnestIslandData from '../wavedata/RottnestIsland.json';
import cottesloeData from '../wavedata/Cottesloe.json';
import mandurahData from '../wavedata/Mandurah.json';

const Header = ({ onSelectLocation }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Extract site names from JSON files
  const extractSiteNames = (data) => {
    return data.features.map((feature) => feature.properties.site_name);
  };

  const albatrossBaySites = extractSiteNames(albatrossBayData);
  const capeSorellSites = extractSiteNames(capeSorellData);
  const portKemblaSites = extractSiteNames(portKemblaData);
  const capeduCouedicSites = extractSiteNames(capeduCouedicData);
  const hayPointSites = extractSiteNames(hayPointData);
  const wideBaySites = extractSiteNames(wideBayData);
  const rottnestIslandSites = extractSiteNames(rottnestIslandData);
  const cottesloeSites = extractSiteNames(cottesloeData);
  const mandurahSites = extractSiteNames(mandurahData);

  const siteNames = [...new Set([...albatrossBaySites, ...capeSorellSites, ...portKemblaSites, ...capeduCouedicSites, ...hayPointSites, ...wideBaySites, ...rottnestIslandSites, ...cottesloeSites, ...mandurahSites])];

  return (
    <header className="bg-white text-sky-800 py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
        <a href="https://imos.org.au" target="_blank" rel="noopener noreferrer"><img src={logo} alt="Logo" className="h-20 w-30 mr-3" /></a>
        <div className="text-2xl font-bold cursor-pointer" onClick={() => window.location.reload()}>IMOS - Wave Data</div>
        </div>

        <ul className="flex space-x-4 items-center">
          <li><a href="#" className="hover:text-gray-400" onClick={() => window.location.reload()}>Home</a></li>
          <li><a href="#" className="hover:text-gray-400">About</a></li>
          <li><a href="#" className="hover:text-gray-400">Service</a></li>
          <li><a href="#" className="hover:text-gray-400">Contact</a></li>
          <li className="relative">
            <button
              className="hover:text-gray-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Location Select
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white text-[#075985] rounded shadow-md z-10">
                {siteNames.map((site, index) => (
                  <li
                    key={index}
                    className="py-2 px-4 hover:bg-[#075985] hover:text-white cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      onSelectLocation(site);
                    }}
                  >
                    {site}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
