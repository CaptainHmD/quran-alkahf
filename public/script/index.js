console.log("hi");
var cssRoot = document.querySelector(':root');


const themes = document.getElementById('theme-wrapper').addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const pageBackground = event.target.dataset.pageBackground
  const bodyBackground = event.target.dataset.bodyBackground
  setTheme(pageBackground, bodyBackground)
})

function setTheme(pageBackground,bodyBackground) {
  // Set the value of variable --page-background and --body-background  in css root variables
  cssRoot.style.setProperty('--page-background', pageBackground);
  cssRoot.style.setProperty('--body-background', bodyBackground);
}