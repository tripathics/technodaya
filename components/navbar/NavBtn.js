'use client'

const toggleSideNav = () => {
  const mobileNavRef = document.getElementById('mobile-nav');
  mobileNavRef.style.width = !mobileNavRef.offsetWidth ? "100%" : "0%";
}

const NavBtn = ({ children, title }) => {
  return (
    <button title={title} type="button" onClick={toggleSideNav} >
      {children}
    </button>
  )
}

export default NavBtn;