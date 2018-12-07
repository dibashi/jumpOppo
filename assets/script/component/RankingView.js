const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class RankingView extends cc.Component {

    @property(cc.Node) //显示微信子域排行
    sub_end = null;
    @property(cc.Node) //显示微信子域排行
    sub_list = null;
    @property(cc.Node) //显示微信子域排行
    sub_my = null;

    @property(cc.Node) //结束界面
    node_end = null;
    @property(cc.Node) //好友列表和 群列表对应按钮
    node_list = null;
    @property(cc.Node) //显示列表的content
    node_content = null;
    @property(cc.Node) //查看群排行按钮
    btn_qun = null;

    @property(cc.Node)
    btn_share = null;
    @property(cc.Node) //引导分享
    lab_share = null;

    onLoad() {
        this.showPanel("end");
    }

    start() {

    }

    //end friend group 三个对应的层级
    showPanel(panelName) {
        if (panelName == "end") {
            this.node_end.active = true;
            this.node_list.active = false;

            this.lab_share.active = cc.dataMgr.isShowShare;
            this.btn_share.active = cc.dataMgr.isShowShare;
            //this.node_end.getChildByName("anniu_zhuyie").x = (cc.dataMgr.isShowShare ? 0 : -100);
            //this.node_end.getChildByName("anniu_chongxinkaishi").x = (cc.dataMgr.isShowShare ? 150 : 100);

            this.node_end.getChildByName("now_Label").getComponent(cc.Label).string = ("得分:" + cc.dataMgr.userData.countJump);
            this.node_end.getChildByName("prop").active = false;
            //this.node_end.getChildByName("prop").getChildByName("prop_Label").getComponent(cc.Label).string = cc.dataMgr.userData.propGreenNum;

        } else if (panelName == "friend") {
            this.node_end.active = false;
            this.node_list.active = true;
            this.btn_qun.active = true;
            this.node_list.getChildByName("spr_qun").active = false;
            this.node_list.getChildByName("spr_friend").active = true;
        } else if (panelName == "group") {
            this.node_end.active = false;
            this.node_list.active = true;
            this.btn_qun.active = false;
            this.node_list.getChildByName("spr_qun").active = true;
            this.node_list.getChildByName("spr_friend").active = false;
        }
    }

    onClickBtn(event, customeData) {
        if (event.target) {
            cc.audioMgr.playEffect("btn_click");
            let btnN = event.target.name;
            if (btnN == "anniu_zhuyie") {
                cc.director.loadScene("game");
            } else if (btnN == "kuangti_tongyong01") {
                cc.director.loadScene("game");
            } else if (btnN == "anniu_chongxinkaishi") {
                cc.dataMgr.userData.isRegame = true;
                cc.director.loadScene("game");
            }
        }
    }
}