import React from 'react';
import { Modal, Button } from 'antd';
import { CaveInfo } from '../pages/CaveInfo'

interface Props {
    id: string,
    onClick: ()=> void
}

class PointInfoPopup extends React.Component<Props,any> {
  state = { visible: true };

//   componentWillReceiveProps(nextProps: Props){
//     if (this.props.clicked !== nextProps.clicked){
//         this.setState({visible: !this.state.visible})
//     }
//   }

  showModal = () => {
    console.log("Clicked", this.props.id)
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.onClick();
  };

//   handleCancel = e => {
//     console.log(e);
//     this.setState({
//       visible: false,
//     });
//     this.props.onClick();
//   };

  render() {
    return (
      <div>
        <Modal
          width="90%"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="Close"
          cancelButtonProps={{ style: { display: 'none' } }}
          
        >
          <CaveInfo id={this.props.id} showMap={false}></CaveInfo>
        </Modal>
      </div>
    );
  }
}

export {PointInfoPopup}