import React,{Component} from "react";
import { Modal, Button, Row, Col, Spin, Affix } from 'antd';
import '../../node_modules/antd/lib/modal/style/index.less'
import '../../node_modules/antd/lib/button/style/index.less'
import '../../node_modules/antd/lib/spin/style/index.less'
import {getDanmuXml, getCid, getVideoUpTime, getVideoLen } from '../apis/apis'
import {parseXML} from '../utils/utils'
import DanmuDCVis from '../components/DanmuVisDc'

import '../styles/MyDialogModal.css'

export default class MyDialogModal extends Component{
  state = { 
    visible: false,
    data: "",
    csv_data: [],
    video_up_time: 0,
    video_len: 0,
    cid: ''
  }

  refresh(){
    getCid()
      .then(res=>{
        const cid = res;
        Promise.all([getDanmuXml(res), getVideoLen(), getVideoUpTime()])
          .then(([res, video_len, video_up_time]) =>{
            const {data} = res;
            const csv_data = parseXML(data,video_len);
            // console.log("here",data, video_len, video_up_time);
            this.setState({
                data,
                csv_data,
                cid,
                video_up_time,
                video_len
            })
          })
      })
      .catch(error=>{
        console.log(error);
      })
  }

  componentWillMount(){
    this.refresh()
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

 
  
  
  render() {
    console.log(this.state);
    const modelHeader = (<div>
                          <span>弹幕可视化报告</span>
                          {this.state.video_len > 0 || <Button onClick={()=>this.refresh()}> Refresh </Button>}
                          </div>);
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open</Button>
        <Modal
          title={modelHeader}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="75%"
          height="100%"
          style={{top:65}}
        > 
        <Spin tips="Loading..." spinning={this.state.video_len > 0 ?false: true} delay={500}>
          <div className="vis-custom" ref={(node) => { this.container = node;}}>
            <Affix offsetTop={120} target={()=> this.container}>
              <Button onClick={()=> this.refs.danmu_dc.handleReset()}>Reset</Button>
            </Affix>
            {this.state.video_len ? <DanmuDCVis {...this.state} ref="danmu_dc"/> : <div></div>}
          </div>
        </Spin>
		  </Modal>
		</div>
    );
  }
}