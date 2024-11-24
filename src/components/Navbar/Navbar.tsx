import React, { useState } from "react";
import Modal from "../common/Modal";
import './Navbar.css';
import { BiLogoGithub, BiGitPullRequest, BiInfoCircle, BiX, BiMenu } from 'react-icons/bi';

const Navbar: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const repoInfo = {
    owner: import.meta.env.VITE_GITHUB_USERNAME || 'as280093',
    repo: 'tpl-font-reader'
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <h1>TPL Font Reader</h1>
        </div>
        <nav className="navbar-links">
          <a 
            href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            <BiLogoGithub className="nav-icon" /> Issues
          </a>
          <a 
            href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            <BiGitPullRequest className="nav-icon" /> Contribute
          </a>
          <a 
            onClick={() => setIsAboutOpen(true)}
            className="nav-link"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setIsAboutOpen(true)}
          >
            <BiInfoCircle className="nav-icon" /> About
          </a>
          <button 
            onClick={toggleMenu}
            className="menu-toggle" 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <BiX /> : <BiMenu />}
          </button>
        </nav>
      </header>

      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)}>
        <div className="about-content">
          <h2>TPL Font Reader</h2>
          <h3>Why I Made This</h3>
          <p>So, here's the deal: I use Photoshop a lot, and something that really annoys me is when I install a new .tpl file, and some fonts are missing. Photoshop doesn't even bother telling me—it just switches everything to Myriad Pro like nothing happened. And honestly, that's super frustrating.</p>
          <p>I got tired of guessing what fonts were missing and manually fixing things, so I decided to make this little tool. It's simple: it helps you figure out what fonts are missing from your .tpl files so you don't have to deal with surprises or wasted time.</p>
          <h3>What It Does</h3>
          <ul>
            <li>🔍 Reads your .tpl files and shows exactly which fonts you have and don't have.</li>
            <li>📋 Copy font names with one click</li>
            <li>🔗 Quick Google search links to find missing fonts</li>
          </ul>
          <p className="made-with">
            Made with ❤️ by <a href={`https://github.com/${repoInfo.owner}`} target="_blank" rel="noopener noreferrer">
              {repoInfo.owner}
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
