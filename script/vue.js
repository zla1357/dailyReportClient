const requestURL = "http://localhost:8080/";

let EmptyPageComponent = {
  template: `<div></div>`,
};

let ReportListComponent = {
  template: `<div>
    <h1 class="w3-text-teal">업무일지 조회</h1>
    <input type="button" value="조회" @click="onSearchBtnClick">
    <p v-for="report in reports" :key="report.id">{{ report.content }}</p>
  </div>`,
  data: function () {
    return {
      reports: [],
      content: {},
    };
  },
  methods: {
    onSearchBtnClick: function () {
      this.content = this.$route.query.content;
      this.requestMenuUrl(this.content);
    },
    requestMenuUrl: function (item) {
      let content = item;

      if (content.reqUrl === "reports") {
        if (content.method === "GET") {
          let startDate = this.formatDate(new Date());

          let nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + 1);
          let endDate = this.formatDate(nowDate);

          axios
            .get(requestURL + content.reqUrl + "?startDate=" + startDate + "&endDate=" + endDate)
            .then((response) => {
              this.reports = response.data;
            })
            .catch((error) => {
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
    {
      path: "/",
      name: "empty",
      component: EmptyPageComponent,
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
    router.push("empty");
  },
  methods: {
    getMasterMenu: function () {
      axios
        .get(requestURL + "menus")
        .then((response) => {
          this.masterMenu = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onClickMasterItem: function (masterId) {
      this.getSubMenu(masterId);
    },
    getSubMenu: function (masterId) {
      axios
        .get(requestURL + "menu/sub?parentId=" + masterId)
        .then((response) => {
          this.subMenu = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onClickMainTitle: function () {
      location.reload();
    },
  },
});
