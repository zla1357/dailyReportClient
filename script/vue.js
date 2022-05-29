Vue.component("top-nav", {
  template: ``,
});

let vm = new Vue({
  el: "#app",
  data: {
    masterMenu: [],
    subMenu: [],
  },
  created: function () {
    this.getMasterMenu();
  },
  methods: {
    getMasterMenu: function () {
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
    onClickMasterItem: function (masterId) {
      this.getSubMenu(masterId);
    },
    getSubMenu: function (masterId) {
      axios
        .get("http://localhost:8080/menu/sub?parentId=" + masterId)
        .then(function (response) {
          vm.subMenu = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onClickMainTitle: function () {
      location.reload();
    },
    onClickSubItem: function () {
      alert("클릭");
    },
  },
});
