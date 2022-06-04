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

let mainRouter = new VueRouter({
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

let MainViewComponent = {
  template: `
  <div class="main-view-component">
    <!-- Navbar -->
    <div class="w3-top">
      <div class="w3-bar w3-theme w3-top w3-left-align w3-large">
        <a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1" href="javascript:void(0)" @click="openCloseSideBar">
          <em class="fa fa-bars"></em>
        </a>
        <a href="#" class="w3-bar-item w3-button w3-theme-l1" @click="onClickMainTitle">메인</a>
        <a
          href="#"
          class="w3-bar-item w3-button w3-hover-white"
          v-for="item in masterMenu"
          v-bind:key="item.id"
          @click="onClickMasterItem(item.id)"
        >
          {{ item.menuName }}
        </a>
      </div>
    </div>

    <!-- Sidebar -->
    <nav class="w3-sidebar w3-bar-block w3-collapse w3-large w3-theme-l5 w3-animate-left" id="mySidebar" ref="sideBar">
      <a href="javascript:void(0)" class="w3-right w3-xlarge w3-padding-large w3-hover-black w3-hide-large" title="Close Menu" @click="closeSideBar">
        <em class="fa fa-remove"></em>
      </a>
      <h4 class="w3-bar-item"><strong>Menu</strong></h4>
      <a class="w3-bar-item w3-button w3-hover-black" href="#" v-for="item in subMenu" v-bind:key="item.id" @click="onClickSubMenu">
        <router-link
          class="w3-bar-item w3-button w3-hover-black w3-animate-top"
          v-bind:to="{ name: item.itemContent.reqUrl, query: {content: item.itemContent} }"
        >
          {{ item.menuName }}
        </router-link>
      </a>
    </nav>

    <!-- Main content: shift it to the right by 250 pixels when the sidebar is visible -->
    <div class="w3-main" style="margin-left: 250px">
      <div class="w3-row w3-padding-64 main-container">
        <div class="w3-twothird w3-container main-content">
          <router-view></router-view>
        </div>
      </div>
      <!-- END MAIN -->
    </div>
  </div>
  `,
  router: mainRouter,
  data: function () {
    return {
      masterMenu: [],
      subMenu: [],
      respValue: [],
      sideBar: "",
    };
  },
  mounted: function () {
    this.getMasterMenu();
    this.$router.push("empty");
    this.sideBar = this.$refs.sideBar;
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
      this.openSideBar();
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
      this.$router.push("empty");
    },
    openCloseSideBar: function () {
      if (this.sideBar.style.display === "block") {
        this.closeSideBar();
      } else {
        this.openSideBar();
      }
    },
    openSideBar: function () {
      this.sideBar.style.display = "block";
    },
    closeSideBar: function () {
      this.sideBar.style.display = "none";
    },
    onClickSubMenu: function () {
      if (this.sideBar.style.display === "block") {
        this.closeSideBar();
      }
    },
  },
};

let LoginComponent = {
  template: `
  <div>
    <form class="w3-container">
      <h1>로그인</h1>
      <label class="w3-text-black"><b>account</b></label>
      <input class="w3-input w3-border" type="text">
      
      <label class="w3-text-black"><b>password</b></label>
      <input class="w3-input w3-border" type="password">
      
      <button id="btn-login" class="w3-btn w3-black" @click="onClickLoginBtn">Register</button>
    
    </form>
  </div>
  `,
  methods: {
    onClickLoginBtn: function () {
      this.$emit("on-login");
    },
  },
};

let loginRouter = new VueRouter({
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/mainView",
      name: "mainView",
      component: MainViewComponent,
    },
  ],
});

let model = new Vue({
  el: "#app",
  router: loginRouter,
  created: function () {
    this.$router.push("login");
  },
  methods: {
    onLoginSuccess: function () {
      this.$router.push("mainView");
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
