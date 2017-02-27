/**
 * cop the log of the server(服务器日志)
 * @authors Orz&jkk
 */
 $.ajaxSettings.async = false;
 var AjaxData;
 var Loglist;
 var Loghost;
var Server = React.createClass({
    getInitialState: function() {
        return {serverloading: true, servererror: null, serverdata: null, serveragent: null,entrancebtn: 'hide',logdata:null,loghost:null,logpath:null,logbutton:'hide'};
    },

    componentDidMount() {
        this.props.serverpage.then(value => this.setState({serverloading: false, serveragent: value}), error => this.setState({serverloading: false, servererror: error}));
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
          $('#opMsg').text('请选择平台!');
          $('#fos').modal('show');
        }
    },
    showlog: function() {
        var logserver;
        var host;
        var o = this;
        $('input[name="gamesrv"]:checked').each(function() {
            logserver = ($(this).val());
        });
        $('input[name="gamesrv"]:checked').each(function() {
            host = $(this).attr('title');
        });
        if(logserver == undefined){
          $('#opMsg').text('请选择服务器');
          $('#fos').modal('show');
        }else{
          $.post('/cmd', {
               _cmd: 18,
               path: logserver,
               host: host
                }, function(data, status) {
                    if(data.status=="err"){
                        $('#opMsg').text('服务器连接失败');
                        $('#fos').modal('show');
                    }else {
                        var Loglist = data;
                        var Loghost = host;
                        console.log(Loglist);
                    }
              o.setState({logdata: Loglist,loghost:Loghost,logpath:logserver});
              $('#loglist').modal('show');
              }).error(function(){
                    $('#delu').modal('hide');
                    $('#opMsg').text('请求时间超时');
                    $('#fos').modal('show');
            });
        }
        this.setState({userdata: $.getJSON(getData('3'))});
    },
    logcontent:function(logname){
        var host = this.state.loghost;
        var logpath = this.state.logpath;
        var start = document.getElementById('start' + logname).value;
        var stop = document.getElementById('stop' + logname).value;
        if(host == undefined || logpath == undefined || logname == undefined){
            $('#opMsg').text('系统错误');
            $('#fos').modal('show');
        }else{
            $.post('/cmd', {
                _cmd: 19,
                host: host,
                log: logpath + 'log/'+logname,
                start:start,
                stop:stop
            }, function(data, status) {
                if(data.status=="err"){
                    $('#opMsg').text('服务器连接失败');
                    $('#fos').modal('show');
                }else {
                    $('#serverlog').text(data.status);
                    $('#showlog').modal('show');
                }
            }).error(function(){
                $('#delu').modal('hide');
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            });
        }

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
                      <input type="radio" name="gamesrv" title={data.GAME_HOST} value={data.BIN_DIR}/>
                      <span>
                        {data.SITE_NAME}[{data.GAME_SITE}]
                      </span>
                    </div>
                  );
                });
            }
            if (this.state.logdata == null) {
                var Serverlogdata;
            } else {
                var t = this;
                var Serverlogdata = this.state.logdata.map(function(data){
                    return(
                        <div className="col-md-12 col-sm-12 col-xs-12" key={data}>
                            {data} <input  type="number" min={0} style={{width:'80px',height:"30px"}} id={"start" + data} placeholder="起始行"/>
                            <input  type="number" min={0} style={{width:'80px',height:"30px"}} id={"stop" + data} placeholder="终止行"/>
                             <input className="btn btn-info" type="button" name="gamelog"  value="查看日志"  style={{position:'absolute',right:"20px"}} onClick={t.logcontent.bind(data,data)}/>
                        </div>
                    );
                });
            }
            return (
                <div className="container-fluid row">
                    <ol className="breadcrumb">
                        <li>服务器管理</li>
                        <li className="active">服务器日志</li>
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
                    <div className={'btn-group col-md-4 col-sm-6 col-xs-10 ' + this.state.entrancebtn}>
                        <button className="btn btn-primary " onClick={this.showlog}>显示日志列表</button>
                    </div>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.logbutton}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.logbutton}></div>
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
                    {/* 日志列表 */}
                    <div className="modal fade" id="loglist" tabIndex="-1" role="dialog" aria-labelledby="信息" aria-hidden="true">
                        <div className="modal-dialog modal-bg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title text-center">日志列表</h4>
                                    <span>请输入要查看日志的起始行和终止行</span>
                                </div>
                                <div className="modal-body">
                                    <div>{Serverlogdata}</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default center-block" data-dismiss="modal">关闭</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 日志显示 */}
                    <div className="modal fade" id="showlog" tabIndex="-1" role="dialog" aria-labelledby="信息" aria-hidden="true">
                        <div className="modal-dialog modal-bg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title text-center">日志</h4>
                                </div>
                                <div className="modal-body">
                                    <div id="serverlog"></div>
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
