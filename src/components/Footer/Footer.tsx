import React from "react";
import "./Footer.css";
import { useEffect, useState } from 'react';

const Footer: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });

  useEffect(() => {
    // Get repository info from the current URL when deployed
    // or fallback to environment variables during development
    const getRepoInfo = () => {
      if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        return {
          owner: pathParts[1],
          repo: pathParts[2] || 'TPL-Font-Reader'
        };
      }
      return {
        owner: (import.meta.env.VITE_GITHUB_USERNAME as string) || 'as280093',
        repo: 'TPL-Font-Reader'
      };
    };

    setRepoInfo(getRepoInfo());
  }, []);

  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} TPL Font Reader. Made with ❤️ • Open Source on{' '}
        <a 
          href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
