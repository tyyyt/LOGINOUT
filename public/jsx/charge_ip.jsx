/**
 * cop the page of charge ip(支付访问IP管理)
 * @authors Orz&jkk
 */

// ajax sync
$.ajaxSettings.async = false;
var newchar;

var Chargeip = React.createClass({
    getInitialState: function() {
        return {
            chargeloading: true,
            chargeerror: null,
            chargedata: null,
            langloading: true,
            langerror: null,
            langdata: null
        };
    },

    componentDidMount() {
        this.props.langpackage.then(value => this.setState({langloading: false, langdata: value}), error => this.setState({langloading: false, langerror: error}));
        this.props.chargeip.then(value => this.setState({chargeloading: false, chargedata: value}), error => this.setState({chargeloading: false, chargeerror: error}));
    },
    ShowAddUser: function() {
        $('#addu').modal('show');
    },
    showmodi: function(agent){
      $.post("/cmd", {
   _cmd: 22,
   agent: agent
    }, function(data, status) {
    $("#agentid").text(agent);
    $("#chargeip").val(data[0].charge_ip);
    $('#agent_chagreip').modal('show');
    }).error(function() {
     $('#chzone').modal('hide');
     $('#opMsg').text('请求时间超时');
     $('#fos').modal('show');
    });
  },
     showaddagent:function(){
         $("#agentaddd").modal('show');
     },
    modifyip:function() {
        $("#agent_chagreip").modal('hide');
        var charge_agent = $("#agentid").text();
        var charge_ip = $("#chargeip").val();
        if (!(checkip(charge_ip)) || $.trim(charge_ip) == '*') {
            $.post("/cmd", {
                _cmd: 23,
                agent: charge_agent,
                charge_ip: charge_ip
            }, function (data, status) {
                if (data.status == "yes") {
                    $('#opMsg').text('修改成功');
                    $('#fos').modal('show');
                } else {
                    $('#opMsg').text('操作失败');
                    $('#fos').modal('show');
                }
            }).error(function (s) {
                console.log(s);
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            });
            $.getJSON(getData('8'), function (result) {
                newchar = result;
            });
            this.setState({chargedata: newchar});
        } else {
            $('#opMsg').text('IP格式错误，请重新填写');
            $('#fos').modal('show');
        }
    },
    render: function() {
        if (this.state.chargeloading || this.state.langloading) {
            return (<img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.chargeerror !== null) {
            return (
                <span>Error: {this.state.chargeerror}</span>
            );
        } else if (this.state.langerror !== null) {
            return (
                <span>Error: {this.state.langerror}</span>
            );
        } else {
            var repos = this.state.chargedata;
            var LangPackage = this.state.langdata;
            var o = this;
            var chargeippage = repos.map(function(repo) {
                if(repo.charge_ip == "*"){
                    var charge_ip = "未知";
                }else{
                    var charge_ip = repo.charge_ip;
                }
                return (
                    <tr key={repo.agent}>
                        <td>{repo.agent}</td>
                        <td>{charge_ip}</td>
                        <td><input type="button"  className="btn btn-default" name="agent"  id={repo.agent} onClick={o.showmodi.bind(null,repo.agent)} value="修改"/></td>
                    </tr>
                );
            });
            return (
                <div className="container">
                    <ol className="breadcrumb">
                        <li>后台相关</li>
                        <li className="active">支付访问IP管理</li>
                    </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>平台名称</td>
                                <td>支付IP</td>
                            </tr>
                        </thead>
                        <tbody>
                            {chargeippage}
                        </tbody>
                    </table>
                    {/* 修改支付IP */}
                    <div className="modal fade" id="agent_chagreip" tabIndex="-1" role="dialog" aria-labelledby="修改平台信息" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改平台信息</h4>
                                    <h6>“*”表示所有IP都可访问，添加IP以“ip1 || ip2 || ip3” 的格式进行添加</h6>
                                    <span id="agentid"></span>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        支付IP<input className="form-control" type="text" id="chargeip"  />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.modifyip}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 成功&失败&IP格式提示 */}
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
//Verify that the IP address is legal or not
function checkip(ip){
    var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var cheip = ip.split("||");
    let i = cheip.length;
    while (i--) {
        var theip = $.trim(cheip[i]);
        if (theip.match(exp) == null) {
            return true;
        }
    }
    return false;
}
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
    <Chargeip chargeip={$.getJSON(getData('8'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('show'));
