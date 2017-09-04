import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.styl'

class Middle extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
      const song = this.props.songInfo
        return (
            <div className="cd-wrapper">
              <div className="cd">
                <img className="img" src={song.image}/>
              </div>
            </div>
        )
    }
}

export default Middle