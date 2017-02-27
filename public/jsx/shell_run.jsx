/**
 * cop run the shell command
 * @authors Orz
 */
 $.ajaxSettings.async = false;
 var AjaxData;
var Server = React.createClass({
    getInitialState: function() {
        return {serverloading: true, servererror: null, serverdata: null, serveragent: null,entrancebtn: 'hide'};
    },

    componentDidMount() {
        this.props.serverpage.then(value => this.setState({serverloading: false, serveragent: value}), error => this.setState({serverloading: false, servererror: error}));
    },

  selectSrv: function() {
      var checkboxs = document.getElementsByName('gamesrv');
      for (var i = 0; i < checkboxs.length; i++) {
          var e = checkboxs[i];
          e.checked = !e.checked;
      }
  },
    selectAgent: function() {
        var checkboxs = document.getElementsByName('agent');
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
          this.setState({serverdata: AjaxData, entrancebtn: ''});
        }else {
          $('#opMsg').text('请选择平台！');
          $('#fos').modal('show');
        }
    },
    send: function() {
        var chk_value = [];
        $('input[name="gamesrv"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        if(chk_value.length == 0 ){
          $('#opMsg').text('请选择服务器！');
          $('#fos').modal('show');
        }else{
          $.post('/cmd', {
               _cmd: 10,
               mod: shell,
               server: chk_value.join(','),
               shell: $('#shell').val(),
                }, function(data, status) {
                    if(data.status=="yes"){
                        $('#delu').modal('hide');
                        $('#opMsg').text('SQL执行语句成功');
                        $('#fos').modal('show');

                    }else {
                        $('#delu').modal('hide');
                        $('#opMsg').text('[ERROR]' + data.deluser);
                        $('#fos').modal('show');
                    }
              }).error(function(){
                    $('#delu').modal('hide');
                    $('#opMsg').text('请求时间超时');
                    $('#fos').modal('show');
            });
        }
        this.setState({userdata: $.getJSON(getData('3'))});
    },

    render: function() {
        if (this.state.serverloading) {
            return (<img src="/images/show_loading.gif" alt="Loading" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.servererror !== null) {
            return (
                <pre>Error: {this.state.servererror}</pre>
            );
        } else {
            var Agent = this.state.serveragent;
            var AgentPage = Agent.map(function(repo) {
                return (
                    <div className="col-md-4 col-xs-12 col-sm-6">
                        <input type="checkbox" name="agent" value={repo.AGENT}/> {repo.AGENT}
                    </div>
                );
            });
            if (this.state.serverdata == null) {
                var ServerSelectPage;
            } else {
                var ServerSelectPage = this.state.serverdata.map(function(data){
                  return(
                    <div className="col-md-4 col-sm-6 col-xs-12">
                      <input type="checkbox" name="gamesrv" title={data.BIN_DIR} value={data.GAME_HOST}/>
                      <span>
                        {data.SITE_NAME}[{data.GAME_SITE}]
                      </span>
                    </div>
                  );
                });
            }
            return (
                <div className="container-fluid row">
                    <ol className="breadcrumb">
                        <li>执行中心</li>
                        <li className="active">SHELL命令执行</li>
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
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.entrancebtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.entrancebtn}></div>
                    <div className={'btn-group col-md-4 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                        <button className="btn btn-default" onClick={this.selectSrv}>全选／反选</button>
                    </div>
                        <div className='col-md-10 col-sm-10 col-xs-10'>
                          <textarea cols='80' rows='4' id='sql' placeholder='SHELL语句'/>
                        </div>
                        <div className={'btn-group col-md-4 col-sm-6 col-xs-10'}>
                            <button className="btn btn-default" onClick={this.send}>提交</button>
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
    var tm = new Date().getTime();
    var key = hex_md5(tm.toString());
    var getData  = './getdata/?key=';
    getData += key;
    getData += '&tm=';
    getData += tm;
    getData += '&case=';
    getData += data;
    return getData;
}

ReactDOM.render(
    <Server serverpage={$.getJSON(getData('3'))} />, document.getElementById('show'));
