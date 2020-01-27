import Noty from "noty";
export default {
  methods: {
    catchError(e) {
      console.log("e", e);
      if (e.response) {
        const status = e.response.status;
        let message = "";
        if (e.response && e.response.meta) message = e.response.meta.message;
        switch (status) {
          case 400:
            this.showNoty(message, "error");
            break;
          case 422:
            {
              const { details } = e.response.data;
              details.forEach(d => {
                this.showNoty(d.message, "error");
              });
            }
            break;
          case 401:
            {
              this.$suth.logout();
              this.$router.push("/login");
            }
            break;

          case 403:
            this.showNoty(message, "error");
            break;

          default:
            this.showNoty(
              "Internal Server Error, please contact our Administrator",
              "error"
            );
            console.log("Unknown Status"); //eslint-disable-line
            break;
        }
      } else {
        console.log("default error"); //eslint-disable-line
        this.showNoty(
          "Internal Server Error, please contact our Administrator",
          "error"
        );
      }
    },
    showNoty(text, type) {
      return new Noty({
        layout: "topRight",
        text,
        theme: "metroui",
        timeout: 5000,
        progressBar: true,
        type
      }).show();
    }
  }
};
