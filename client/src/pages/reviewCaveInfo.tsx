import {CaveInfo} from './CaveInfo';
import React, {Component} from 'react';
import {userContext} from '../context/userContext';

class ReviewCaveInfo extends Component {
  render() {
    if (this.props.location === undefined) {
      return (
        <CaveInfo
          submittedPoint={this.props.match.params.id}
          action="View"
        ></CaveInfo>
      );
    } else if (this.props.location.state === undefined) {
      const action = this.context.user.role === 'Admin' ? 'Review' : 'Edit';
      return (
        <CaveInfo
          submittedPoint={this.props.match.params.id}
          action={action}
        ></CaveInfo>
      );
    } else {
      return (
        <CaveInfo
          submittedPoint={this.props.match.params.id}
          action={this.props.location.state.action}
        ></CaveInfo>
      );
    }
  }
}

ReviewCaveInfo.contextType = userContext;

export {ReviewCaveInfo};
