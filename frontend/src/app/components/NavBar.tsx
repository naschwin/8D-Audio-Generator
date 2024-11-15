import React from 'react'
import styles from '../styles/Home.module.css';

const NavBar = () => {
  return (
    <nav className="border-gray-200 bg-gray-900 bg-opacity-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/icon.png" alt="icon" className={styles.logo} />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">8D Audio Generator</span>
          </a>
        </div>
    </nav>
  )
}

export default NavBar