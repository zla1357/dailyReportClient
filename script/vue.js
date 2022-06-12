const requestURL = "http://localhost:8080/";

/**
 * 마스터 메뉴를 선택하지 않았을 때 메인화면 가운데 보여줄 빈 페이지 컴포넌트
 */
let EmptyPageComponent = {
  template: `<div></div>`,
};

/**
 * 업무일지 조회 메뉴 선택시 메인화면 가운데 보여줄 업무일지 리스트 조회 컴포넌트
 */
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
        <li class="w3-hover-black" v-for="report in reports" :key="report.id" @click="onClickReport(report)">
          {{ formatDateTime(report.inputDate) }}
        </li>
      </ul>
    </div>

  </div>`,
  data: function () {
    return {
      reports: [],
      content: {}, // router로 이동하여 열렸을 시 itemContent 객체를 받아올 데이터
      startDate: "",
      endDate: "",
      loginUser: {},
    };
  },
  mounted: function () {
    this.startDate = formatDate(new Date());

    let nowDate = new Date();
    this.plusDays(nowDate, 1);
    this.endDate = formatDate(nowDate);

    this.loginUser = this.$route.query.loginUser;
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
    onClickReport: function (report) {
      this.$emit("click-report", report);
    },
  },
};

/**
 * 보고서 작성 메뉴 선택시 메인 화면 가운데 보여줄 보고서 작성용 컴포넌트
 */
let WriteReportComponent = {
  template: `
  <div class="report-container">
    <h1 class="w3-text-teal">업무일지 작성</h1>
    <div class="report-content-container">
      <label class="label-input-datetime">
        작성일자: {{ formatDate(report.inputDate) }}
      </label>
      <input type="button" id="registry-report" class="w3-button w3-black" value="등록" @click="onClickRegistryReport">
      <label class="report-status">
        {{ reportStatus.statName }}
      </label>

      <textarea class="report-content w3-input w3-border" v-model="report.content"></textarea>
    </div>
  </div>`,
  props: ["loginUser", "propReport"],
  data: function () {
    return {
      reportStatus: {},
      report: {},
    };
  },
  created: function () {
    this.initData();
  },
  methods: {
    initData: function () {
      this.report.inputDate = formatDateTime(new Date());
      this.reportStatus = {
        statCode: "I",
        statName: "입력",
      };

      if (this.isModify()) {
        this.report = this.propReport;
        this.reportContent = this.report.content;
        this.reportStatus.statCode = "U";
        this.reportStatus.statName = "수정";
      }
    },
    isModify: function () {
      return this.propReport.hasOwnProperty("content");
    },
    formatDate: function (date) {
      return formatDate(date);
    },
    onClickRegistryReport: function () {
      this.registryReport();
    },
    registryReport: function () {
      this.requestRegistryReport()
        .then((response) => {
          if (this.isRegistrySucceed(response)) {
            alert("작성완료");
            this.changeReportStat();
            this.report = response.data;
          } else {
            alert("업무일지 등록 오류");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    requestRegistryReport: function () {
      let report = {
        member: this.loginUser,
        content: this.report.content,
      };

      if (this.isNewReport()) {
        return axios.post(this.registryUrl(), report);
      } else {
        return axios.put(this.registryUrl(), this.report);
      }
    },
    registryUrl: function () {
      if (this.isNewReport()) {
        return requestURL + "report";
      } else {
        return requestURL + "report/" + this.report.id;
      }
    },
    isNewReport: function () {
      return this.reportStatus.statCode === "I";
    },
    isRegistrySucceed: function (response) {
      return response.status === 200;
    },
    changeReportStat: function () {
      this.$set(this.reportStatus, "statCode", "U");
      this.$set(this.reportStatus, "statName", "수정");
    },
  },
};

/**
 * 메인 화면 가운데 보여줄 컴포넌트에 대한 라우터
 */
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

/**
 * 로그인 성공시 보여줄 메인화면 컴포넌트
 */
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
          <router-view @click-report="modifyReportForm" :propReport="report" :loginUser="loginUser"></router-view>
        </div>
      </div>
      <!-- END MAIN -->
    </div>
  </div>
  `,
  router: mainRouter,
  props: ["member"],
  data: function () {
    return {
      masterMenu: [],
      subMenu: [],
      sideBar: "",
      loginUser: {},
      report: {},
    };
  },
  mounted: function () {
    this.getMasterMenu();
    this.$router.replace("empty");
    this.sideBar = this.$refs.sideBar;
    this.loginUser = this.member;
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
    openSideBar: function () {
      this.sideBar.style.display = "block";
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
    closeSideBar: function () {
      this.sideBar.style.display = "none";
    },
    onClickSubMenu: function () {
      this.report = {};

      if (this.sideBar.style.display === "block") {
        this.closeSideBar();
      }
    },
    modifyReportForm: function (report) {
      this.report = report;
      this.$router.replace("report");
    },
  },
};

/**
 * 로그인용 컴포넌트
 */
let LoginComponent = {
  template: `
  <div>
    <form class="w3-container">
      <h1>로그인</h1>
      <label class="w3-text-black"><b>account</b></label>
      <input class="w3-input w3-border" type="text" v-model="accountId">
      
      <label class="w3-text-black"><b>password</b></label>
      <input class="w3-input w3-border" type="password" v-model="password" @keydown="onKeyDownPassword($event)">
      
      <input type="button" id="btn-login" class="w3-btn w3-black" @click="onClickLoginBtn" value="Register">
    
    </form>
  </div>
  `,
  data: function () {
    return {
      accountId: "",
      password: "",
    };
  },
  methods: {
    onKeyDownPassword: function (event) {
      if (this.isKeyEnter(event.keyCode)) {
        this.onClickLoginBtn();
      }
    },
    isKeyEnter: function (keyCode) {
      return keyCode === 13;
    },
    onClickLoginBtn: function () {
      this.tryLogin();
    },
    tryLogin: function () {
      axios
        .post(requestURL + "login", {
          accountId: this.accountId,
          password: this.password,
        })
        .then((response) => {
          if (this.isLoginSucceed(response)) {
            this.$emit("on-login", response.data);
          } else {
            alert("로그인 오류");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    isLoginSucceed: function (response) {
      return response.status === 200;
    },
  },
};

/**
 * 화면 처음 진입시 보여줄 컴포넌트에 대한 라우터
 */
let loginRouter = new VueRouter({
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/mainView",
      name: "mainViewComponent",
      component: MainViewComponent,
    },
  ],
});

let model = new Vue({
  el: "#app",
  data: {
    loginMember: {},
  },
  router: loginRouter,
  created: function () {
    this.$router.replace("login");
  },
  methods: {
    onLoginSuccess: function (member) {
      this.loginMember = member;
      this.$router.replace("mainView");
    },
  },
});

/**
 * Date를 받아서 yyyy-mm-dd hh:nn:ss 형식의 문자열로 반환한다
 * @param {Date} dateTime 변환할 Date
 * @returns 형식에 맞춘 일시를 표현하는 문자열
 */
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

/**
 * Date를 받아서 yyyy-mm-dd 형식의 문자열로 반환한다.
 * @param {Date} date 변환할 Date
 * @returns 형식에 맞춘 날짜를 표현하는 문자열
 */
function formatDate(date) {
  return new Date(date).toISOString().substring(0, 10);
}
