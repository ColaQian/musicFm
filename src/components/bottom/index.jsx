import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.styl'

class Bottom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <h1>the bottom</h1>
        )
    }
}

export default Bottom