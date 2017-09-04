import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.styl'

class Top extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <div className="top">
              <div className="like">
                <span className="icon-like"></span>
              </div>
              <h1 className="title">{this.props.songInfo.name}</h1>
              <h2 className="subtitle">{this.props.songInfo.singer}</h2>
            </div>
    )
  }
}

export default Top