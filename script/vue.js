const requestURL = "http://localhost:8080/";

let EmptyPageComponent = {
  template: `<div></div>`,
};

let ReportListComponent = {
  template: `
  <div>

    <h1 class="w3-text-teal">업무일지 조회</h1>

    <div class="search-condition">
      <label for="start">조회 기간:</label>
      <input type="date" id="start" name="search-start" v-model="startDate">
      ~
      <input type="date" id="end" name="search-end" v-model="endDate">

      <input type="button" value="조회" @click="onSearchBtnClick">
    </div>

    <div class="report-content">
      <p v-for="report in reports" :key="report.id">{{ report.content }}</p>
    </div>

  </div>`,
  data: function () {
    return {
      reports: [],
      content: {},
      startDate: "",
      endDate: "",
    };
  },
  created: function () {
    this.startDate = this.formatDate(new Date());

    let nowDate = new Date();
    this.plusDays(nowDate, 1);
    this.endDate = this.formatDate(nowDate);
  },
  methods: {
    onSearchBtnClick: function () {
      this.content = this.$route.query.content;
      this.requestMenuUrl(this.content);
    },
    requestMenuUrl: function (item) {
      let content = item;

      axios
        .get(requestURL + content.reqUrl + "?startDate=" + this.startDate + "&endDate=" + this.endDate)
        .then((response) => {
          this.reports = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate: function (date) {
      return date.toISOString().substring(0, 10);
    },
    plusDays: function (date, days) {
      date.setDate(date.getDate() + days);
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
