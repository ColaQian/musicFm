import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Top from '../../components/top/index.jsx'
import Middle from '../../components/middle/index.jsx'
import Bottom from '../../components/bottom/index.jsx'
import {
  getList,
  getSong
} from '../../api/getSong.js'
import createSong from '../../common/js/createSong.js'
import handleList from '../../common/js/listHandle.js'
import {
  bindActionCreators
} from "redux"
import {
  connect
} from "react-redux"
import * as playerActions from '../../store/actions.js'
import {
  mapState
} from '../../store/reducers/mapState.js'
import {getRandomInt} from '../../common/js/tool.js'
import './style.styl'

class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.state = {
      cdList: [],
      currentId: -1,
      songList: [],
      currentSong: {},
      currentIndex: 0,
      playingMode: 0,
      playingState: false,
      totalTime: '0:00',
      currentTime: '0:00',
      touch: {},
      songLike: false
    }
  }
  componentDidMount() {
    this._initState()
  }
  _initState() {
    getList().then((res) => {
      if (res.code === 0) {
        let idList = handleList(res.data.list)
        let idIndex = getRandomInt(0,idList.length-1)
        let currentId = idList[idIndex]
        console.log(idIndex)
        this.setState({
          cdList: idList,
          currentId: currentId
        })
        getSong(this.state.currentId).then((res) => {
          let ret = []
          res.cdlist[0].songlist.filter((item,index) => {
            if(index < 15) {
              ret.push(createSong(item))
            }
          })
          this.props.setPlayList(ret)
          this.props.setCurrentIndex(0)
          this.props.setPlayingState(true)
          this.props.setPlayingMode(0)
          this.props.setCurrentSong()
          this.setState({
            songList: ret,
            currentSong: this.props.player.currentSong,
            currentIndex: this.props.player.currentIndex,
            playingMode: 0,
            playingState: this.props.player.playingState,
            totalTime: this.countTotalTime(this.props.player.currentSong.duration)
          })
          this.refs.audio.play()
          console.log(this.state.songList)
        })
      }
    })
  }
  _handlePLayer() {
    if(this.state.playingState) {
      this.refs.audio.play()
      return 
    }
    this.refs.audio.pause()
  }
  handleError() {}
  handlePlay() {}
  //计算歌曲当前播放时间
  handleTimeUpdate(e) {
    let currentTime = this.handleTime(e.target.currentTime)
    this.setState({
      currentTime: currentTime
    })
    let percent = e.target.currentTime/this.state.currentSong.duration
    let offset = (this.refs.progressBar.clientWidth-16) * percent
    this._setProgressWidth(offset)
  }
  //处理歌曲结束事件
  handleEnded() {
    console.log("song ended")
    if(this.state.playingMode === 1) {
      this.refs.audio.currentTime = 0
      this.refs.audio.play()
      this.setState({
        currentTime: 0
      })
      return 
    }
    this.nextSong()
  }
  //切换播放模式(顺序播放 or 单曲循环)
  changeMode() {
    const mode = this.state.playingMode === 0 ? 1 : 0
    console.log(typeof this.refs.audio.currentTime)
    this.props.setPlayingMode(mode)
    this.setState({
      playingMode: mode
    })
  }
  //切换播放状态
  togglePlaying() {
    this.setState((prevState,props) =>{
      return {
        playingState: !prevState.playingState
      }
    })
    setTimeout(() =>{
      this._handlePLayer()
      this.props.setPlayingState(this.state.playingState)  
    },20)
  }
  //切换到下一首歌
  nextSong() {
    if(this.state.currentIndex > this.state.songList.length-1) {
      this._initState()
      return 
    }
    this.props.setCurrentIndex(this.state.currentIndex+1)
    this.props.setCurrentSong()
      this.setState({
        currentIndex: this.state.currentIndex+1,
        currentSong: this.props.player.currentSong,
        totalTime: this.countTotalTime(this.props.player.currentSong.duration)
      })
    setTimeout(() =>{
      if(!this.state.playingState) {
        this.togglePlaying()
        return 
      }
      this.refs.audio.play()
    },20)
  }
  //计算歌曲的总时间
  countTotalTime(time) {
    let totalTime = this.handleTime(time)
    return totalTime
  }
  handleTime(time) {
    const total = time | 0
    const minute = total / 60 | 0
    const second = this._handleSec(total % 60)
    return `${minute}:${second}`
  }
  _handleSec(sec) {
    let num  = sec.toString()
    if(num.length < 2) {
      num = '0' + num
    }
    return num
  }
  //控制歌曲进度,滑动进度条开始
  touchStart(e) {
    e.stopPropagation()
    let touch = {}
    touch.initialState = true
    touch.startX = e.touches[0].pageX
    touch.left = this.refs.progress.clientWidth
    this.setState({
      touch: touch
    })
  }
  touchMove(e) {
    e.stopPropagation()
    if(!this.state.touch.initialState) {
      return 
    }
    const delta = e.touches[0].pageX - this.state.touch.startX
    const offset = Math.min(this.refs.progressBar.clientWidth-16,Math.max(0,this.state.touch.left+delta))
    this._setProgressWidth(offset)
  }
  //滑动进度条结束
  touchEnd() {
    this.setState({
      touch: Object.assign(this.state.touch,{
        initialState: false
      })
    })
      this._setSongTime()
  }
  changeProgress(e) {
    const rec = this.refs.progressBar.getBoundingClientRect()
    const offset = e.pageX - rec.left
    this._setProgressWidth(offset)
    this._setSongTime()
  }
  _setProgressWidth(offset) {
    this.refs.progress.style.width = `${offset}px`
    this.refs.progressBtn.style.transform = `translate3d(${offset}px,0,0)`
  }
  _setSongTime() {
    let percent = this.refs.progress.clientWidth/(this.refs.progressBar.clientWidth-16)
    this.refs.audio.currentTime = this.state.currentSong.duration * percent
  }
  render() {
    const currentSong = this.state.currentSong
    let iconPlayState = this.state.playingState ? 'icon-pause' : 'icon-play'
    let playmode = this.state.playingMode === 0 ? 'icon-loop' : 'icon-infinite'
    let iconLike = this.state.songLike ? 'icon-like-list1' : 'icon-like-list'
    return (
      <div className="player-wrapper">
        <div className="background-image">
          <img src={currentSong.image} style={{width:'100%',height:'100%'}}/>
        </div>
        <Top songInfo={currentSong}/>
        <Middle songInfo={currentSong}/>
        <div className="progress-wrapper">
          <span className="time time-l">{this.state.currentTime}</span>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" ref="progressBar" onClick={this.changeProgress.bind(this)}>
              <div className="bar-inner">
              <div className="progress" ref="progress"></div>
                <div className="progress-btn-wrapper" 
                    ref="progressBtn" 
                    onTouchStart = {this.touchStart.bind(this)}
                    onTouchMove = {this.touchMove.bind(this)}
                    onTouchEnd = {this.touchEnd.bind(this)}>
                  <div className="progress-btn"></div>
                </div>
              </div>
            </div>
          </div>
          <span className="time time-r">{this.state.totalTime}</span>
        </div>
        <div className="operators">
          <div className="icon i-left" onClick={this.changeMode.bind(this)}>
            <i className={playmode}></i>
          </div>
          <div onClick={this.togglePlaying.bind(this)} className="icon i-center">
            <i className={iconPlayState}></i>
          </div>
          <div onClick={this.nextSong.bind(this)} className="icon i-right">
            <i className="icon-next"></i>
          </div>
          <div className="icon i-right">
            <i className={iconLike}></i>
          </div>
        </div>
        <audio ref="audio" 
                src={currentSong.url}
                onCanPlay={this.handlePlay.bind(this)}
                onError={this.handleError.bind(this)} 
                onTimeUpdate={this.handleTimeUpdate.bind(this)}
                onEnded={this.handleEnded.bind(this)}>
        </audio>
      </div>
    )
  }
}

function bindAction(dispatch) {
  return bindActionCreators(playerActions, dispatch)
}
export default connect(mapState, bindAction)(Home)