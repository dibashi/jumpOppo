const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {

    _audioSource_o = {
        bg_1: null,
        bg_2: null,
        bg_3: null,
        bg_4: null,
        bg_5: null,
        btn_click: null,
        prop_block: null,
        prop_empy: null,
        prop_score: null
    };

    _jumpID = null;
    _loadBgNum = 0;

    init() {
        toolsLog("--- onLoad AudioMgr ---")
        cc.game.on(cc.game.EVENT_HIDE, function () {
            //toolsLog("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            //toolsLog("cc.audioEngine.resumeAll");
            if (cc.dataMgr.userData.onGaming)
                cc.audioEngine.resumeAll();
        });

        // let node_sound = cc.find("Canvas/node_sound");
        // if (node_sound) {
        //     for (let i = 0; i < node_sound.children.length; ++i) {
        //         let nodeN = node_sound.children[i];
        //         let adClip = nodeN.getComponent(cc.AudioSource)
        //         if (adClip) {
        //             this._audioSource_o[nodeN.name] = adClip.clip;
        //         }
        //     }
        // }
        cc.dataMgr.userData.loadOver = true;
        // cc.loader.loadRes("sound/bg_6", cc.AudioClip, function (err, clip) {
        //     if (!err) {
        //         self._audioSource_o.bg_1 = clip;
        //         self.playBg(true);
        //     }
        //     toolsLog("--- 加载 error --");
        //     toolsLog(err);
        // });
        let self = this;
        if (cc.dataMgr.userData.isFirstIn == 0) {
            cc.loader.loadRes("sound/bg", cc.AudioClip, function (err, clip) {
                if (!err) {
                    self._audioSource_o.bg = clip;
                    self.playBg(false);
                }
            });
            this.loadBgByName("bg_1");
        }
        else {
            cc.loader.loadRes("sound/bg_1", cc.AudioClip, function (err, clip) {
                if (!err) {
                    self._audioSource_o.bg_1 = clip;
                    self.playBg(true);
                }
                toolsLog("--- 加载 error --");
                toolsLog(err);
            });
            cc.loader.loadRes("sound/bg", cc.AudioClip, function (err, clip) {
                if (!err) {
                    self._audioSource_o.bg = clip;
                }
            });
        }

        cc.loader.loadRes("sound/btn_click", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.btn_click = clip;
        });
        cc.loader.loadRes("sound/prop_block", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.prop_block = clip;
        });
        cc.loader.loadRes("sound/prop_empy", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.prop_empy = clip;
        });
        cc.loader.loadRes("sound/prop_score", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.prop_score = clip;
        });
        cc.loader.loadRes("sound/prop_speed", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.prop_speed = clip;
        });
        cc.loader.loadRes("sound/role_jump1", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.role_jump1 = clip;
        });
        cc.loader.loadRes("sound/random_rand", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.random_rand = clip;
        });
        cc.loader.loadRes("sound/random_take", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.random_take = clip;
        });

        cc.audioEngine.setMaxAudioInstance(20);
        //this.init();
    }

    loadBgByName(bgName) {
        if (!bgName)
            bgName = "bg_1";
        if (bgName && !this._audioSource_o[bgName]) {
            let pathBg = "sound/" + bgName;
            let self = this;
            cc.loader.loadRes(pathBg, cc.AudioClip, function (err, clip) {
                if (!err) {
                    self._audioSource_o[bgName] = clip;
                }
            });
        }
    }

    //type_s 为这个音乐的名称
    playEffect(type_s) {
        //toolsLog("-- playEffect -- " + type_s);
        let source = this._audioSource_o[type_s];
        if (source) {
            if (type_s == "role_jump1") {
                //cc.audioEngine.setEffectsVolume(0.6);
                if (this._jumpID)
                    cc.audioEngine.stopEffect(this._jumpID);
                this._jumpID = cc.audioEngine.playEffect(source, false);
                cc.audioEngine.setVolume(this._jumpID, 0.8);
            } else {
                //cc.audioEngine.setEffectsVolume(1);
                let id = cc.audioEngine.playEffect(source, false);
                cc.audioEngine.setVolume(id, 1);
            }
        }
    }

    stopEffect() {

    }

    playBg(isGame) {
        let soundName = "bg";
        if (isGame) {
            soundName = "bg_1";
            // if (cc.dataMgr && cc.dataMgr.userData.useSoundName) {
            //     soundName = cc.dataMgr.userData.useSoundName;
            // }
        }
        let source = this._audioSource_o[soundName];
        if (!source)
            source = this._audioSource_o["bg"];
        if (source) {
            //cc.audioEngine.setMusicVolume(0);
            let id = cc.audioEngine.playMusic(source, true);
            //cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setVolume(id, 0.6);
        }
    }

    stopBg() {
        cc.audioEngine.stopMusic();
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}