/**
 * cop the page of client url(客户端URL管理)
 * @authors Orz&jkk
 */

// ajax sync
$.ajaxSettings.async = false;
var AjaxData;

var Clienturl = React.createClass({
    getInitialState: function() {
        return {
            urlloading: true,
            urlerror: null,
            clientdata: null,
            urlagent: null,
            urlbtn: 'hide'
        }
    },

    componentDidMount() {
        this.props.clientpage.then(value => this.setState({urlloading: false, urlagent: value}), error => this.setState({urlloading: false, urlerror: error}));
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
            $.getJSON(getData('10'),'agent=' + chk_value.join(','), function(result) {
                AjaxData = result;
            });
            console.log(AjaxData);
            this.setState({clientdata: AjaxData, urlbtn: ''});
        }else {
            $('#opMsg').text('请选择平台！');
            $('#fos').modal('show');
        }
    },
    showurl: function() {
        var client_value = [];
        $('input[name="client_url"]:checked').each(function() {
            client_value.push($(this).val());
        });
        if (client_value.length > 0) {
            $('#chaurl').val(client_value[0]);
            $('#chaurl').attr('disabled',false);
            $('#chkey').modal('show');
        }else {
            $('#chaMsg1').html('<h6>请选择修改客户端服务器</h6>');
            $('#chaurl').attr('disabled',true);
            $('#chkey').modal('show');
        }
    },
    selectusers: function() {
        var checkboxs = document.getElementsByName('client_url');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    chankey: function(){
        var client_value = [];
        $('input[name="client_url"]:checked').each(function() {
            client_value.push($(this).attr('title'));
        });
        var client_url = $('#chaurl').val();
        console.log(client_value);
        $.post("/cmd", {
            _cmd: 21,
            users: client_value.join(','),
            client_url: client_url
        }, function(data, status) {
            if (data.status == 'yes') {
                $('#chkey').modal('hide');
                $('#opMsg').text('修改客户端版本信息成功');
                $('#fos').modal('show');
            }else{
                $('#chkey').modal('hide');
                $('#opMsg').text('[ERROR] ' + status);
                $('#fos').modal('show');
            }
        }).error(function(){
            $('#chkey').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        var chk_value = [];
        $('input[name="agent"]:checked').each(function() {
            chk_value.push('"' + $(this).val() + '"');
        });
        $.getJSON(getData('10'),'agent=' + chk_value.join(','), function(result) {
            AjaxData = result;
        });
        this.setState({clientdata: AjaxData});
    },

    render: function() {
        if (this.state.urlloading) {
            return (<img src="/images/show_loading.gif" alt="Loading" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.urlerror !== null) {
            return (
                <pre>Error: {this.state.urlerror}</pre>
            );
        } else {
            var Agent = this.state.urlagent;
            var AgentPage = Agent.map(function(repo) {
                return (
                    <div className="col-md-4 col-xs-12 col-sm-6" key={repo.AGENT}>
                        <input type="checkbox" name="agent" value={repo.AGENT}/> {repo.AGENT}
                    </div>
                );
            });
            if (this.state.clientdata == null) {
                var ServerSelectPage;
            } else {
                if(this.state.clientdata !== null){
                    var repos = this.state.clientdata;
                    var ServerSelectPage = repos.map(function(repo) {
                        return (
                            <tr key={repo.game_zone_id}>
                                <td>{repo.game_zone_id}</td>
                                <td>{repo.game_site}</td>
                                <td>{repo.assets}</td>
                                <td><input type="checkbox" name="client_url" title={repo.game_zone_id} value={repo.assets}/></td>
                            </tr>
                        );
                    });
                }
            }
            return (
                <div className="container-fluid row">
                    <ol className="breadcrumb">
                        <li>服务器管理</li>
                        <li className="active">客户端版本</li>
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

                    <table className={"table table-striped table-hover" + this.state.urlbtn}>
                        <thead className={this.state.urlbtn}>
                        <tr>
                            <td>ID</td>
                            <td>GAME_SITE</td>
                            <td>客户端URL</td>
                            <td>操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        {ServerSelectPage}
                        </tbody>
                    </table>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.urlbtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.urlbtn}></div>
                    <div className={'col-md-2 col-sm-6 col-xs-10 ' + this.state.urlbtn}>
                    </div>
                    <hr className={'col-md-12 col-sm-12 col-xs-12 ' + this.state.urlbtn}/>
                    <div className={'col-md-4 col-sm-3 col-xs-1 ' + this.state.urlbtn}></div>
                    <div className={'btn-group col-md-4 col-sm-6 col-xs-10 ' + this.state.urlbtn}>
                        <button className="btn btn-default" onClick={this.selectusers}>全选／反选</button>
                        <button className="btn btn-primary" onClick={this.showurl}>修改</button>
                    </div>
                    {/* 修改客户端链接 */}
                    <div className="modal fade" id="chkey" tabIndex="-1" role="dialog" aria-labelledby="修改key" aria-hidden="true">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改客户端版本</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <div  id="chaMsg1"></div>
                                        {/* <input className="form-control" type="text" id="chaname" placeholder="使用者名称"/> */}
                                        <input className="form-control" type="text" id="chaurl"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.chankey}>保存</button>
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
    <Clienturl clientpage={$.getJSON(getData('3'))}/>, document.getElementById('show'));
