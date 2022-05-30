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
    onClickSubItem: function (item) {
      this.requestMenuUrl(item);
    },
    requestMenuUrl: function (item) {
      let content = item.itemContent;

      if (content.reqUrl === "reports") {
        if (content.method === "GET") {
          let startDate = this.formatDate(new Date());

          let nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + 1);
          let endDate = this.formatDate(nowDate);

          axios
            .get("http://localhost:8080/" + content.reqUrl + "?startDate=" + startDate + "&endDate=" + endDate)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    formatDate: function (date) {
      let year = date.getFullYear();
      let month = new String(date.getMonth() + 1).toString().padStart(2, "0");
      let day = new String(date.getDate()).padStart(2, "0");

      return year + "-" + month + "-" + day;
    },
  },
});
