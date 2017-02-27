/**
 * cop Server status(服务器状态)
 * @authors Orz&jkk
 */

// ajax sync
$.ajaxSettings.async = false;
var AjaxData;

var Status = React.createClass({
    getInitialState: function() {
        return {
            entranceloading: true,
            entranceerror: null,
            entrancedata: null,
            entranceagent: null,
            entrancebtn: 'hide',
            statdata:null,
            entrancestate: {
                "text": [
                    "未知状态", "正常状态"
                ],
                "class": ["label-danger", "label-success"]
            }
        }
    },

    componentDidMount() {
        this.props.enpage.then(value => this.setState({entranceloading: false, entranceagent: value}), error => this.setState({entranceloading: false, entranceerror: error}));
    },
    selectAgent: function() {
        var checkboxs = document.getElementsByName('agent');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },
    selectserver: function() {
        var checkboxs = document.getElementsByName('gamesrv');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },
    selectSrv: function() {
        var checkboxs = document.getElementsByName('gamesrv');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    showSelectPage: function() {
        var chk_value = [];
        $('input[name="agent"]:checked').each(function() {
            chk_value.push('"' + $(this).val() + '"');
        });
        if (chk_value.length > 0) {
          $.getJSON(getData('4'),'agent=' + chk_value.join(','), function(result) {
              AjaxData = result;
          });
          console.log(AjaxData);
          this.setState({entrancedata: AjaxData, entrancebtn: ''});
        }else {
          $('#opMsg').text('请选择平台！');
          $('#fos').modal('show');
        }
    },

    sendMsg: function() {
        var chk_value = [];
        $('input[name="gamesrv"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        console.log(chk_value);
        if (chk_value.length > 0) {
          $.post("/cmd", {
              _cmd: 20,
              gameid: chk_value.join(',')
              }, function(data, status) {
                  if(data.status == "err"){
                      $('#opMsg').text('查询失败');
                      $('#fos').modal('show');
                  }else {
                      AjaxData = data.status;
                  }
            }).error(function(){
                  $('#opMsg').text('请求时间超时');
                  $('#fos').modal('show');
          });
        this.setState({statdata: AjaxData});
        } else {
          $('#opMsg').text('请选择服务器！');
          $('#fos').modal('show');
        }
    },

    render: function() {
        if (this.state.entranceloading) {
            return (<img src="/images/show_loading.gif" alt="Loading" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.entranceerror !== null) {
            return (
                <pre>Error: {this.state.entranceerror}</pre>
            );
        } else {
            var Agent = this.state.entranceagent;
            var AgentPage = Agent.map(function(repo) {
                return (
                    <div className="col-md-4 col-xs-12 col-sm-6" key={repo.AGENT}>
                        <input type="checkbox" name="agent" value={repo.AGENT}/> {repo.AGENT}
                    </div>
                );
            });
            if (this.state.entrancedata == null) {
                var ServerSelectPage;
            } else {
                if(this.state.statdata !== null){
                    var ServerSelectPage = this.state.statdata.map(function(data){
                        var s = JSON.parse(data);
                        return(
                            <tr key={s.repo}>
                                <td><input type="checkbox" name="gamesrv" value={s.repo}/>{s.repo}</td>
                                <td>{s.state.cpuRate}</td>
                                <td>{s.state.useMemory/1024/1024}Mb</td>
                                <td>{s.state.concurrent}</td>
                                <td>{s.state.online}</td>
                                <td>{s.state.mapCount}</td>
                            </tr>
                        );
                    });
                }else{
                    var ServerSelectPage = this.state.entrancedata.map(function(data){
                        return(
                            <tr key={data.GAME_SITE}>
                                <td><input type="checkbox" name="gamesrv" value={data.GAME_SITE}/>{data.GAME_SITE}</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                            </tr>
                        );
                    });
                }
            }
            return (
                <div className="container-fluid row">
                    <ol className="breadcrumb">
                        <li>服务器管理</li>
                        <li className="active">服务器状态</li>
                    </ol>
                    <div className="container-fluid">
                    {AgentPage}
                    </div>
                    <hr className="container-fluid"/>
                    <div className="col-md-4 col-sm-3 col-xs-1"></div>
                    <div className="btn-group center-block col-md-4 col-sm-6 col-xs-10">
                        <button className="btn btn-default" onClick={this.selectAgent}>全选／反选</button>
                        <button className="btn btn-primary" onClick={this.showSelectPage}>提交</button>
                    </div>
                    <hr className="col-md-12 col-sm-12 col-xs-12"/>

                    <table className={"table table-striped table-hover" + this.state.entrancebtn}>
                        <thead className={this.state.entrancebtn}>
                        <tr>
                            <td>游戏标识</td>
                            <td>CPU使用率</td>
                            <td>内存</td>
                            <td>并发数</td>
                            <td>在线人数</td>
                            <td>副本数</td>
                        </tr>
                        </thead>
                        <tbody>
                        {ServerSelectPage}
                        </tbody>
                    </table>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.entrancebtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.entrancebtn}></div>
                    <div className={'col-md-2 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                    </div>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.entrancebtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.entrancebtn}></div>
                    <div className={'btn-group col-md-4 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                        <button className="btn btn-default" onClick={this.selectserver}>全选／反选</button>
                        <button className="btn btn-primary" onClick={this.sendMsg}>查看</button>
                    </div>
                    {/* 成功OR失败 */}
                    <div className="modal fade" id="fos" tabIndex="-1" role="dialog" aria-labelledby="信息" aria-hidden="true">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title text-center">信息</h4>
                                </div>
                                <div className="modal-body">
                                  <div id="opMsg"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
            );
        }
    }
});

function getData(data) {
    var tm       = new Date().getTime();
    var key      = hex_md5(tm.toString());
    var getData  = './getdata/?key=';
        getData += key;
        getData += '&tm=';
        getData += tm;
        getData += '&case=';
        getData += data;
    return getData;
}

ReactDOM.render(
    <Status enpage={$.getJSON(getData('3'))}/>, document.getElementById('show'));
