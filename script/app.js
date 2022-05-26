// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

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

let vm = new Vue({
  el: "#app",
  data: {
    masterMenu: [],
  },
  created: function () {
    this.getNavItems();
  },
  methods: {
    getNavItems: function () {
      let vm = this;

      axios
        .get("http://localhost:8080/menus")
        .then(function (response) {
          vm.masterMenu = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
});
