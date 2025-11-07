// 節目表來源：
// 中嘉寬頻 https://www.homeplus.net.tw/
// 凱擘大寬頻 https://www.kbro.com.tw/K01/catv-table_18_2683_3427.html
const channelList = [
  {
    channelName: "公視",
    sch_id: 1013,
  },
  {
    channelName: "公視台語台",
    sch_id: 14,
  },
  {
    channelName: "三立新聞",
    sch_id: 54,
  },
  {
    channelName: "三立iNews",
    sch_id: 106,
  },
  {
    channelName: "民視新聞",
    sch_id: 53,
  },
  {
    channelName: "華視新聞",
    sch_id: 296,
  },
  {
    channelName: "東森新聞",
    sch_id: 51,
  },
  {
    channelName: "TVBS新聞台",
    sch_id: 55,
  },
  {
    channelName: "中視新聞",
    sch_id: 1154,
  },
  {
    channelName: "寰宇新聞",
    sch_id: 307,
  },
  {
    channelName: "鏡電視新聞台",
    sch_id: 1086,
  },
];

export default {
  data() {
    return {
      schedule: "",
      channelList: channelList,
      selected: 1013,
      isLoading: false,
      today: new Date().toLocaleDateString().replace(/\//gm, "-"),
    };
  },
  methods: {
    async getSchedule() {
      this.isLoading = true;
      const data = {
        // day: this.today,
        programId: this.selected,
      };
      // const url = "https://tv-web-scraper-twozwu6489-d27y0arg.apn.leapcell.dev";
      // const url = "https://tv-web-scraper.vercel.app";
      // const url = "https://tv-web-scraper.onrender.com";
      const url = "https://playwright-crawler-twozwu6489-rp7z49je.apn.leapcell.dev";
      // const url = "http://localhost:8080";
      const params = new URLSearchParams();
      Object.keys(data).forEach(key => {
        params.append(key, data[key]);
      });

      const myHeaders = new Headers();
      myHeaders.append("Accept", "*/*");
      myHeaders.append("Connection", "keep-alive");

      try {
        const res = await fetch(`${url}/tv`, {
          method: "POST",
          headers: myHeaders,
          body: params,
          redirect: 'follow'
        });
        const json = await res.json();
        this.schedule = json;
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        this.schedule = { title: 'Error loading schedule', list: [] };
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getSchedule();
  },
  template: `
  <div
  class="offcanvas offcanvas-end"
  tabindex="-1"
  id="offcanvasRight"
  aria-labelledby="offcanvasRightLabel"
  >
    <div class="offcanvas-header">
      <h5 id="offcanvasRightLabel">節目表：{{ today }}</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
    <select class="form-select mb-3" aria-label="Default select example" v-model="selected" @change="getSchedule">
      <option selected>請選擇頻道</option>
      <option v-for="item in channelList" :key="item.sch_id" :value="item.sch_id">{{ item.channelName }}</option>
    </select>
    <div v-if="isLoading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else>
      <h3>{{ schedule.title }}</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">時間</th>
            <th scope="col">節目</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in schedule.list" :key="index">
            <th scope="row">{{ item.time }}</th>
            <td>{{ item.show }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>
  `,
};
