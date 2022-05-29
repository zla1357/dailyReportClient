var mySidebar;
var overlayBg;

window.addEventListener("load", function () {
  // Get the Sidebar
  mySidebar = document.getElementById("mySidebar");

  // Get the DIV with overlay effect
  overlayBg = document.getElementById("myOverlay");
});
// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === "block") {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = "block";
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
