export class App {
  constructor() {
    this.apiKey = '';
    this.videosPerPage = 25;
    this.message = 'Hello World!';
    this.videos = [];
    this.channel = [];
    this.pageNum = 1;
    this.maxPages = 1;
    this.nextPageToken = null;
    this.prevPageToken = null;
    this.searchedTerm = "";
    this.lastResult = null;
    this.playVideo = false;
    this.loading = true;
    this.currentChannel = {id : null,name: null};
    window.app = this; //FIXME: For debug purposes only

    $.getJSON('./api.json', (data) => {
      this.apiKey = data.key;
      this.loading = false;
    });

    document.body.addEventListener('playVideo', (e) => {this.performPlay(e.detail)});
    document.body.addEventListener('openChannel', (e) => {this.openChannel(e.detail)});
  }

  performSearch(a) {
    console.log(a);
    $('.navbar-collapse').collapse('hide') //Responsivity hack to close the sidebar
    this.restartPager();
    this.resetChannel;
    this.currentChannel = {}
    this.getList(this.searchedTerm);
  }

  getList(query,channel=null,pageToken=null) {
    this.videos = [];
    this.nextPageToken = null;
    this.prevPageToken = null;

    this.loading=true;
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + encodeURI(query) + "&maxResults=" + this.videosPerPage + '&key=' + this.apiKey;
    if (channel) url = url + '&channelId='+channel;
    if (pageToken) url = url + "&pageToken=" + pageToken;
    $.getJSON(url,(data) => {
      this.lastResult = data;
      if (data.nextPageToken) this.nextPageToken = data.nextPageToken 
      if (data.prevPageToken) this.prevPageToken = data.prevPageToken;
      this.maxPages = Math.ceil(this.lastResult.pageInfo.totalResults/this.lastResult.pageInfo.resultsPerPage);

      this.videos = data.items;
      this.loading=false;
      window.scrollTo(0,0);
    });

  }
  openChannel(id,name) {
    console.log(id);
    console.log(name);
    this.searchedTerm = ""
    this.currentChannel = {'id' : id, 'name' : name};
    this.getList('',this.currentChannel.id);
  }

  restartPager() {
    this.pageNum = 1;
    this.nextPageToken = null;
    this.prevPageToken = null;
  }
  prevPage() {
    this.getList(this.searchedTerm,this.currentChannel.id,this.prevPageToken);
    this.pageNum--;
  }
  nextPage() {
    this.getList(this.searchedTerm,this.currentChannel.id,this.nextPageToken);
    this.pageNum++;
  }
  performPlay(vid) {
    console.log(vid);
    this.playVideo = true;
    this.youtubeFrame.src="http://www.youtube.com/embed/" + vid;
  }
  closeVideo() {
    this.playVideo=false;
    this.youtubeFrame.src='about:blank'
  }
  resetChannel() {
    this.currentChannel = {id : null,name: null};
  }
}
