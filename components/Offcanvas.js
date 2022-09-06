const channelList = [{
  channelName: "公視",
  sch_id: 17
}, {
  channelName: "公視台語台",
  sch_id: 759
}, {
  channelName: "民視新聞",
  sch_id: 45
}, {
  channelName: "華視新聞",
  sch_id: 634
}, {
  channelName: "中視新聞",
  sch_id: 668
}, {
  channelName: "三立iNews",
  sch_id: 172
}, {
  channelName: "寰宇新聞",
  sch_id: 695
}];

export default {
  data() {
    return {
      schedule: "",
      channelList: channelList,
      selected: 17,
      isLoading: false,
      today: new Date().toLocaleDateString().replace(/\//gm, '-')
    };
  },
  methods: {
    async getSchedule() {
      this.isLoading = true;
      const headers = {
        "Content-Type": "application/json",
      };
      const data = {
        day: this.today,
        sch_id: this.selected,
        act: "select",
      };
      const res = await fetch("https://tv-web-scraper.onrender.com/program-list", {
        // const res = await fetch("http://localhost:8000/tv-schedule", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      const json = await res.json();
      this.schedule = json;
      this.isLoading = false;
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
