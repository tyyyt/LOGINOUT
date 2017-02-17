/**
 * cop user
 * @authors Orz
 */

// ajax sync
$.ajaxSettings.async = false;
var AjaxData;

var Entrance = React.createClass({
    getInitialState: function() {
        return {
            entranceloading: true,
            entranceerror: null,
            entrancedata: null,
            entranceagent: null,
            entrancebtn: 'hide',
            entrancestate: {
                "text": [
                    "测试状态", "正常状态", "维护状态", "关闭状态"
                ],
                "class": ["label-info", "label-success", "label-warning", "label-danger"]
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
        if (chk_value.length > 0) {
          $.post("/cmd", {
              _cmd: 6,
              zoneid: chk_value.join(','),
              state: $("#mods").val()
              }, function(data, status) {
                  if(data.status=="yes"){
                      $('#opMsg').text('操作成功');
                      $('#fos').modal('show');
                  }else {
                      $('#opMsg').text('操作失败：[ERROR]:' + data.deluser);
                      $('#fos').modal('show');
                  }
            }).error(function(){
                  $('#opMsg').text('请求时间超时');
                  $('#fos').modal('show');
          });
          var chk_value = [];
          $('input[name="agent"]:checked').each(function() {
              chk_value.push('"' + $(this).val() + '"');
          });
          $.getJSON(getData('4'),'agent=' + chk_value.join(','), function(result) {
              AjaxData = result;
          });
          this.setState({entrancedata: AjaxData, entrancebtn: ''});
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
            var State = this.state.entrancestate;
            var AgentPage = Agent.map(function(repo) {
                return (
                    <div className="col-md-4 col-xs-12 col-sm-6">
                        <input type="checkbox" name="agent" value={repo.AGENT}/> {repo.AGENT}
                    </div>
                );
            });
            if (this.state.entrancedata == null) {
                var ServerSelectPage;
            } else {
                var ServerSelectPage = this.state.entrancedata.map(function(data){
                  return(
                    <div className="col-md-4 col-sm-6 col-xs-12">
                      <input type="checkbox" name="gamesrv" value={data.game_zone_id}/>
                      <span>
                        {data.SITE_NAME}[{data.GAME_SITE}]
                        <span className={'pull-right label ' + State.class[data.SEVER_STATE]}>{State.text[data.SEVER_STATE]}</span>
                      </span>
                    </div>
                  );
                });
            }
            return (
                <div className="container-fluid row">
                    <ol className="breadcrumb">
                        <li>服务器管理</li>
                        <li className="active">入口管理</li>
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
                    <div className="container-fluid">
                    {ServerSelectPage}
                    </div>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.entrancebtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.entrancebtn}></div>
                    <div className={'col-md-2 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                      <select name="mods" id="mods" className="form-control" defaultValue="请选择状态">
                        {/* <option>请选择状态</option> */}
                        <option value="0">测试状态</option>
                        <option value="1">正常状态</option>
                        <option value="2">维护状态</option>
                        <option value="3">关闭状态</option>
                      </select>
                    </div>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.entrancebtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.entrancebtn}></div>
                    <div className={'btn-group col-md-4 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                        <button className="btn btn-default" onClick={this.selectSrv}>全选／反选</button>
                        <button className="btn btn-primary" onClick={this.sendMsg}>提交</button>
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
    <Entrance enpage={$.getJSON(getData('3'))}/>, document.getElementById('show'));
