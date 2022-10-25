export default (function () {
  const RoutePatterns = [['/', '/index.html'], ['/about.html']];
  const selectedClass = 'nav__link_selected';

  const navLinks = document.querySelectorAll('.nav__link') as NodeListOf<HTMLAnchorElement>;
  const currentLocation = document.location.pathname;

  const linkIndex = RoutePatterns.findIndex(
    (patterns) => patterns.some((pattern) => currentLocation.endsWith(pattern)),
  );

  navLinks[linkIndex].classList.add(selectedClass);
}());
