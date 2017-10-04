import {bindable} from 'aurelia-framework';

export class YoutubeVideo {
  @bindable vdata;
  @bindable channelFn;
  @bindable playFn;

  attached() {
    console.log(this.vdata);
  }
}
