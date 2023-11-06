import $ from "jquery";
global.$ = global.jQuery = $;
global.Image = class MockImage {
  constructor() {
    this.src = "";
  }
};
