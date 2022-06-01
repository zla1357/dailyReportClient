const requestURL = "http://localhost:8080/";

let ReportListComponent = {
  template: `<div>
    <h1 class="w3-text-teal">업무일지 조회</h1>
    <p v-for="report in $route.query.respvalue" :key="$route.query.respvalue.id">{{ report.content }}</p>
  </div>`,
  created: function () {},
};

let ReportModifyComponent = {
  template: `<div>
    <h1 class="w3-text-teal">업무일지 수정</h1>
  </div>`,
};

let router = new VueRouter({
  routes: [
    {
      path: "/reports",
      name: "reports",
      component: ReportListComponent,
    },
    {
      path: "/report",
      name: "report",
      component: ReportModifyComponent,
    },
  ],
});

let model = new Vue({
  el: "#app",
  router: router,
  data: {
    masterMenu: [],
    subMenu: [],
    respValue: [],
  },
  created: function () {
    this.getMasterMenu();
  },
  methods: {
    getMasterMenu: function () {
      let vm = this;

      axios
        .get(requestURL + "menus")
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
      let vm = this;
      axios
        .get(requestURL + "menu/sub?parentId=" + masterId)
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
      let vm = this;

      if (content.reqUrl === "reports") {
        if (content.method === "GET") {
          let startDate = this.formatDate(new Date());

          let nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + 1);
          let endDate = this.formatDate(nowDate);

          axios
            .get(requestURL + content.reqUrl + "?startDate=" + startDate + "&endDate=" + endDate)
            .then(function (response) {
              vm.respValue = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    formatDate: function (date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let day = String(date.getDate()).padStart(2, "0");

      return year + "-" + month + "-" + day;
    },
  },
});
