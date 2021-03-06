import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoPlayerDescription from './VideoPlayer/VideoPlayerDescription';
import VideoPlayerInfo from './VideoPlayer/VideoPlayerInfo';
import VideoPlayerComments from './VideoPlayerComments/VideoPlayerComments';
import VideoSideBar from './VideoSideBar/VideoSideBar';
import { getVideoInfo, getVideoComments } from './../../../api/service';

class VideoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: this.props.match.params.videoId,
      relatedVideos: this.props.location.state.data,
      videoInfo: null,
      videoComments: null,
      redirect: false,
    };

    this.handleSelectedVideo = this.handleSelectedVideo.bind(this);
  }

  componentDidMount() {
    getVideoInfo(this.state.videoId).then(data => this.setState({ videoInfo: data.items[0] }));
    getVideoComments(this.state.videoId).then(data => this.setState({ videoComments: data.items }));
  }

  componentDidUpdate(prevProps, prevState) {}

  handleSelectedVideo(videoId) {
    this.setState({ videoId: videoId });
    getVideoInfo(this.state.videoId).then(data => this.setState({ videoInfo: data.items[0] }));

    getVideoComments(this.state.videoId).then(data =>
      this.setState({
        videoComments: data.items,
        redirect: true,
      }),
    );
  }

  render() {
    const { videoInfo, videoComments, redirect, videoId, relatedVideos } = this.state;
    if (!videoInfo || !videoComments) return <main>Loading...</main>;

    if (redirect)
      return (
        <Redirect
          push
          to={{
            pathname: `/redirectPage`,
            state: { data: relatedVideos },
            link: `/watch/${videoId}`,
            relatedVideos,
          }}
        />
      );
    return (
      <main>
        <section className="player">
          <VideoPlayer embedId={videoId} />
          <VideoPlayerInfo statisticsInfo={videoInfo.statistics} title={videoInfo.snippet.title} />
          <VideoPlayerDescription
            channelTitle={videoInfo.snippet.channelTitle}
            description={videoInfo.snippet.description}
            publishedAt={videoInfo.snippet.publishedAt}
          />
          <VideoPlayerComments
            statisticsInfo={videoInfo.statistics}
            videoComments={videoComments}
          />
        </section>
        <section className="sidebar">
          <VideoSideBar
            relatedVideos={relatedVideos}
            handleSelectedVideo={this.handleSelectedVideo}
          />
        </section>
      </main>
    );
  }
}

export default VideoPage;
