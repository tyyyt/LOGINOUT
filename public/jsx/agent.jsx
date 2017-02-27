/**
 * cop the page of agent(平台信息管理)
 * @authors Orz&jkk
 */

// ajax sync
$.ajaxSettings.async = false;
var res;

var Agent = React.createClass({
    getInitialState: function() {
        return {
            agentloading: true,
            agenterror: null,
            agentdata: null,
            langloading: true,
            langerror: null,
            langdata: null
        };
    },

    componentDidMount() {
        this.props.langpackage.then(value => this.setState({langloading: false, langdata: value}), error => this.setState({langloading: false, langerror: error}));
        this.props.agentpage.then(value => this.setState({agentloading: false, agentdata: value}), error => this.setState({agentloading: false, agenterror: error}));
    },
    ShowAddUser: function() {
        $('#addu').modal('show');
    },
    showmodi: function(agent){
      $.post("/cmd", {
   _cmd: 14,
   agent: agent
    }, function(data, status) {
    $("#oldagent").text(agent);
    $("#agentmodi").modal('show');
    $("#magent").val(data[0].agent);
    $("#mlogin_key").val(data[0].login_key);
    $("#mcharge_key").val(data[0].charge_key);
    $("#mdefault_login_key").val(data[0].default_login_key);
    $("#mnetty_version").val(data[0].netty_version);
    }).error(function() {
     $('#chzone').modal('hide');
     $('#opMsg').text('请求时间超时');
     $('#fos').modal('show');
    });
  },
 showdel:function(agent){
   $('#delMsg').html('<h6>确定要删除该平台吗? 平台台名称:</h6><br/>');
   $('#agentid').html(agent);
   $('#delagent').modal('show');
 },
delagent:function(){
 var agent_del = $("#agentid").text();
    $.post("/cmd", {
        _cmd: 16,
        agent_del:agent_del
    }, function(data, status) {
        if (data.status == "yes") {
            $('#delagent').modal('hide');
            $('#opMsg').text('平台删除成功');
            $('#fos').modal('show');
        } else {
            $('#delagent').modal('hide');
            $('#opMsg').text('[ERROR]');
            $('#fos').modal('show');
        }
    }).error(function() {
        $('#delagent').modal('hide');
        $('#opMsg').text('请求时间超时');
        $('#fos').modal('show');
    });
    $.getJSON(getData('8'), function(result) {
        res = result;
    });
    this.setState({agentdata: res});
},
 showaddagent:function(){
     $("#agentaddd").modal('show');
 },
modifyagent:function(){
    $("#agentmodi").modal('hide');
    var oldagent = $("#oldagent").text();
    var magent = $("#magent").val();
    var mlogin_key = $("#mlogin_key").val();
    var mcharge_key = $("#mcharge_key").val();
    var mdefault_login_key = $("#mdefault_login_key").val();
    var mnetty_version = $("#mnetty_version").val();
    $.post("/cmd", {
        _cmd: 17,
        oldagent:oldagent,
        magent: magent,
        mlogin_key: mlogin_key,
        mcharge_key: mcharge_key,
        mdefault_login_key: mdefault_login_key,
        mnetty_version: mnetty_version
    }, function(data, status) {
        if (data.status == "yes") {
            $('#opMsg').text('修改平台信息成功');
            $('#fos').modal('show');
        }else {
            $('#opMsg').text('操作失败');
            $('#fos').modal('show');
        }
    }).error(function(s) {
        console.log(s);
        $('#opMsg').text('请求时间超时');
        $('#fos').modal('show');
    });
    $.getJSON(getData('8'), function(result) {
        res = result;
    });
    this.setState({agentdata: res});
},
addagent:function(){
    $("#agentaddd").modal('hide');
    var agent = $("#addagent").val();
    var login_key = $("#addlogin_key").val();
    var charge_key = $("#addcharge_key").val();
    var default_login_key = $("#adddefault_login_key").val();
    var netty_version = $("#addnetty_version").val();
    $.post("/cmd", {
        _cmd: 15,
        agent: agent,
        login_key: login_key,
        charge_key: charge_key,
        default_login_key:default_login_key,
        netty_version:netty_version
    }, function(data, status) {
        if (data.status == "yes") {
            $('#opMsg').text('添加平台信息成功');
            $('#fos').modal('show');
        }else {
            $('#opMsg').text('操作失败');
            $('#fos').modal('show');
        }
    }).error(function() {
        $('#opMsg').text('请求时间超时');
        $('#fos').modal('show');
    });
    $.getJSON(getData('8'), function(result) {
        res = result;
    });
    this.setState({agentdata: res});
},
    render: function() {
        if (this.state.agentloading || this.state.langloading) {
            return (<img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.agenterror !== null) {
            return (
                <span>Error: {this.state.agenterror}</span>
            );
        } else if (this.state.langerror !== null) {
            return (
                <span>Error: {this.state.langerror}</span>
            );
        } else {
            var repos = this.state.agentdata;
            var LangPackage = this.state.langdata;
            var o = this;
            var userpage = repos.map(function(repo) {
                return (
                    <tr key={repo.agent}>
                        <td>{repo.agent}</td>
                        <td>{repo.login_key}</td>
                        <td>{repo.charge_key}</td>
                        <td>{repo.default_login_key}</td>
                        <td><input type="button" className="btn btn-default" name="agent"  id={repo.agent} onClick={o.showmodi.bind(null,repo.agent)} value="修改"/>
                            <input type="button" className="btn btn-danger" name="agent"  id={repo.agent} onClick={o.showdel.bind(null,repo.agent)} value="删除"/></td>
                    </tr>
                );
            });
            return (
                <div className="container">
                    <ol className="breadcrumb">
                        <li>信息中心</li>
                        <li className="active">平台信息管理</li>
                    </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>平台名称</td>
                                <td>登录码</td>
                                <td>支付码</td>
                                <td>默认登录码</td>
                            </tr>
                        </thead>
                        <tbody>
                            {userpage}
                        </tbody>
                    </table>
                    <div className="container">
                        <div className="col-md-3 col-sm-3 col-xs-3"></div>
                        <div className="btn-group center-block col-md-6 col-sm-6 col-xs-6">
                            <button className="btn btn-primary" onClick={this.showaddagent}>新增平台</button>
                        </div>
                    </div>
                    {/* 修改平台信息 */}
                    <div className="modal fade" id="agentmodi" tabIndex="-1" role="dialog" aria-labelledby="修改平台信息" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改平台信息</h4>
                                    <span id="oldagent"></span>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        平台名称<input className="form-control" type="text" id="magent"  />
                                        登录码<input className="form-control" type="text" id="mlogin_key" />
                                        支付码<input className="form-control" type="text" id="mcharge_key"/>
                                        默认登录码<input className="form-control" type="text" id="mdefault_login_key" />
                                        NETTY版本<input className="form-control" type="text" id="mnetty_version" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.modifyagent}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 新增平台 */}
                    <div className="modal fade" id="agentaddd" tabIndex="-1" role="dialog" aria-labelledby="修改平台信息" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">新增平台</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        平台名称<input className="form-control" type="text" id="addagent" />
                                        登录码<input className="form-control" type="text" id="addlogin_key" />
                                        支付码<input className="form-control" type="text" id="addcharge_key"/>
                                        默认登录码<input className="form-control" type="text" id="adddefault_login_key" />
                                        NETTY版本<input className="form-control" type="text" id="addnetty_version" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.addagent}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 删除平台 */}
                    <div className="modal fade" id="delagent" tabIndex="-1" role="dialog" aria-labelledby="删除用户" aria-hidden="true">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h5 className="modal-title">删除平台</h5>
                                </div>
                                <div className="modal-body">
                                    <div id="delMsg"></div>
                                    <div id="agentid"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.delagent}>确定</button>
                                </div>
                            </div>
                        </div>
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
                                    <h4 className="modal-title">信息</h4>
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
    var getData = './getdata/?key=';
    getData += key;
    getData += '&tm=';
    getData += tm;
    getData += '&case=';
    getData += data;
    return getData;
}

ReactDOM.render(
    <Agent agentpage={$.getJSON(getData('8'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('show'));
