const requestURL = "http://localhost:8080/";

let EmptyPageComponent = {
  template: `<div></div>`,
};

let ReportListComponent = {
  template: `
  <div>

    <h1 class="w3-text-teal">업무일지 조회</h1>

    <div class="search-condition">
      <label for="start" >조회 기간:</label>
      <input type="date" id="start" name="search-start" v-model="startDate">
      ~
      <input type="date" id="end" name="search-end" v-model="endDate">

      <input class="w3-button w3-black" type="button" value="조회" @click="onSearchBtnClick">
    </div>

    <div class="report-content">
      <ul class="w3-ul w3-border">
        <li><h3>작성내역</h3></li>
        <li v-for="report in reports" :key="report.id">
          {{ formatDateTime(report.inputDate) }}
        </li>
      </ul>
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
    this.startDate = formatDate(new Date());

    let nowDate = new Date();
    this.plusDays(nowDate, 1);
    this.endDate = formatDate(nowDate);
  },
  methods: {
    onSearchBtnClick: function () {
      this.content = this.$route.query.content;
      this.requestMenuUrl(this.content);
    },
    requestMenuUrl: function (content) {
      axios
        .get(requestURL + content.reqUrl + "?startDate=" + this.startDate + "&endDate=" + this.endDate)
        .then((response) => {
          this.reports = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    plusDays: function (date, days) {
      date.setDate(date.getDate() + days);
    },
    formatDateTime: function (dateTime) {
      return formatDateTime(dateTime);
    },
  },
};

let WriteReportComponent = {
  template: `
  <div class="report-container">
    <h1 class="w3-text-teal">업무일지 작성</h1>
    <div class="report-content-container">
      <label class="label-input-datetime">
        작성일자: {{ formatDate(inputData) }}
      </label>
      <input type="button" id="registry-report" class="w3-button w3-black" value="등록">

      <textarea class="report-content w3-input w3-border"></textarea>
    </div>
  </div>`,
  data: function () {
    return {
      inputData: "",
    };
  },
  created: function () {
    this.inputData = formatDateTime(new Date());
  },
  methods: {
    formatDate: function (date) {
      return formatDate(date);
    },
  },
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
      component: WriteReportComponent,
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

function formatDateTime(dateTime) {
  const paramDate = new Date(dateTime);
  const dt = {
    year: () => paramDate.getFullYear(),
    month: () => (paramDate.getMonth() + 1).toString().padStart(2, "0"),
    day: () => paramDate.getDate().toString().padStart(2, "0"),
    hour: () => paramDate.getHours(),
    min: () => paramDate.getMinutes(),
    sec: () => paramDate.getSeconds(),
  };

  return dt.year() + "-" + dt.month() + "-" + dt.day() + " " + dt.hour() + ":" + dt.min() + ":" + dt.sec();
}

function formatDate(date) {
  return new Date(date).toISOString().substring(0, 10);
}
