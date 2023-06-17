const parallax = () => {
  const parallaxEls = document.getElementsByClassName('parallax');
  const speed = 0.4;
  window.addEventListener("scroll", () => {
    for (let i = 0; i < parallaxEls.length; i++) {
      /** @type {HTMLElement} */
      let el = parallaxEls[i];
      const shift = speed * el.getBoundingClientRect().top;
      el.style.backgroundPositionY = shift + 'px';
    }
  });
};

parallax();
