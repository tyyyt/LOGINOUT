/**
 * cop user
 * @authors Orz
 */

// ajax sync
$.ajaxSettings.async = false;
var res;

var User = React.createClass({
    getInitialState: function() {
        return {
            userloading: true,
            usererror: null,
            userdata: null,
            langloading: true,
            langerror: null,
            langdata: null
        };
    },

    componentDidMount() {
        this.props.langpackage.then(value => this.setState({langloading: false, langdata: value}), error => this.setState({langloading: false, langerror: error}));
        this.props.zonepage.then(value => this.setState({userloading: false, userdata: value}), error => this.setState({userloading: false, usererror: error}));
    },
    ShowAddUser: function() {
        $('#addu').modal('show');
    },
    allper: function() {
        var checkboxs = document.getElementsByName('mennu');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    showdel: function(id) {
            $('#delMsg').html('<h6>确定要删除该服务器吗？服务器ID:</h6><br/>');
            $('#delzone').html(id)
            $('#delu').modal('show');
    },

    showchanzone: function(id) {
            $.post("/cmd", {
                _cmd: 10,
                zoneid: id
            }, function(data, status) {
              console.log(data);
              $("#modify_zone").modal('show');
              $("#zone_id").val(data[0].game_zone_id);
              $("#site").val(data[0].game_site);
              $("#host").val(data[0].game_host);
              $("#open_date").val(data[0].open_server_date.split(':00.000Z')[0]);
              $("#game_port").val(data[0].game_port);
              $("#web_port").val(data[0].web_port);
              $("#actcode_port").val(data[0].actcode_port);
              $("#bin").val(data[0].bin_dir);
              $("#hotbin").val(data[0].hot_bin_dir);
              $('#db_base_url').val(data[0].db_base_url);
              $("#db_game_name").val(data[0].db_game_name);
              $("#db_base_name").val(data[0].db_base_name);
              $("#db_log_name").val(data[0].db_log_name);
              $("#db_username").val(data[0].db_username);
              $("#db_password").val(data[0].db_password);
              $("#agent").val(data[0].agent);
              $("#site_name").val(data[0].site_name);
            }).error(function() {
                $('#chzone').modal('hide');
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            });
    },

    showcopyzone: function(id) {
        $.post("/cmd", {
            _cmd: 10,
            zoneid: id
        }, function(data, status) {
            $("#ccopy_zone").modal('show');
            $("#czone_id").val(data[0].game_zone_id);
            $("#csite").val(data[0].game_site);
            $("#chost").val(data[0].game_host);
            $("#copen_date").val(data[0].open_server_date.split(':00.000Z')[0]);
            $("#cgame_port").val(data[0].game_port);
            $("#cweb_port").val(data[0].web_port);
            $("#cactcode_port").val(data[0].actcode_port);
            $("#cbin").val(data[0].bin_dir);
            $("#chotbin").val(data[0].hot_bin_dir);
            $('#cdb_base_url').val(data[0].db_base_url);
            $("#cdb_game_name").val(data[0].db_game_name);
            $("#cdb_base_name").val(data[0].db_base_name);
            $("#cdb_log_name").val(data[0].db_log_name);
            $("#cdb_username").val(data[0].db_username);
            $("#cdb_password").val(data[0].db_password);
            $("#cagent").val(data[0].agent);
            $("#csite_name").val(data[0].site_name);
        }).error(function() {
            $('#chzone').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
    },
    delzone: function() {
        var id = $("#delzone").text();
        $.post("/cmd", {
            _cmd: 11,
            delzone:id
        }, function(data, status) {
            if (data.status == "yes") {
                $('#delu').modal('hide');
                $('#opMsg').text('删除区服信息成功');
                $('#fos').modal('show');
            } else {
                $('#delu').modal('hide');
                $('#opMsg').text('[ERROR]');
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#delu').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        $.getJSON(getData('7'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },

    ChanInfo: function() {
        $("#modify_zone").modal('hide');
        var zone_id = $("#zone_id").val();
        var game_site = $("#site").val();
        var game_host = $("#host").val();
        var showdate = $("#open_date").val().toString().split('T');
        var date = showdate[0] + ' ' + showdate[1] + ':00' ;
        var game_port = $("#game_port").val();
        var web_port = $("#web_port").val();
        var actcode_port = $("#actcode_port").val();
        var bin = $("#bin").val();
        var hotbin = $("#hotbin").val();
        $.post("/cmd", {
            _cmd: 12,
            zone_id: zone_id,
            game_site: game_site,
            game_host:game_host,
            date: date,
            game_port:game_port,
            web_port:web_port,
            actcode_port:actcode_port,
            bin:bin,
            hotbin:hotbin
        }, function(data, status) {
            if (data.status == "yes") {
                $('#chau').modal('hide');
                $('#opMsg').text('修改区服信息成功');
                $('#fos').modal('show');

            } else if(data.status =="porterr"){
                $('#chau').modal('hide');
                $('#opMsg').text('端口冲突,请检查');
                $('#fos').modal('show');
            } else {
                $('#chau').modal('hide');
                $('#opMsg').text('[ERROR]');
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#chau').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        $.getJSON(getData('7'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },
    CopyInfo: function() {
        $("#ccopy_zone").modal('hide');
        var game_zone_id = $("#czone_id").val();
        var zone_id = $("#czone_id").val();
        var game_site = $("#csite").val();
        var game_host = $("#chost").val();
        var open_server_date = $('#copen_server_date').val()
        var date = $("#cdate").val();
        var game_port = $("#cgame_port").val();
        var web_port = $("#cweb_port").val();
        var actcode_port = $("#cactcode_port").val();
        var bin = $("#cbin").val();
        var hotbin = $("#chotbin").val();
        $.post("/cmd", {
            _cmd: 13,
            zone_id: zone_id,
            game_site: game_site,
            game_host:game_host,
            date: date,
            game_port:game_port,
            web_port:web_port,
            actcode_port:actcode_port,
            bin:bin,
            hotbin:hotbin
        }, function(data, status) {
            if (data.status == "yes") {
                $('#chau').modal('hide');
                $('#opMsg').text('新增区服信息成功');
                $('#fos').modal('show');

            } else if(data.status =="porterr"){
                $('#chau').modal('hide');
                $('#opMsg').text('端口冲突,请检查');
                $('#fos').modal('show');
            }else {
                $('#chau').modal('hide');
                $('#opMsg').text('填写信息有误');
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#chau').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        $.getJSON(getData('7'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },
    render: function() {
        if (this.state.userloading || this.state.langloading) {
            return (<img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.usererror !== null) {
            return (
                <span>Error: {this.state.usererror}</span>
            );
        } else if (this.state.langerror !== null) {
            return (
                <span>Error: {this.state.langerror}</span>
            );
        } else {
            var repos = this.state.userdata;
            var o = this;
            var zonepage = repos.map(function(repo) {
                return (
                    <tr key={repo.game_zone_id}>
                        <td>{repo.game_zone_id}</td>
                        <td>{repo.game_site}</td>
                        <td>{formattime(repo.open_server_date)}</td>
                        <td>{repo.game_host}</td>
                        <td><input type="button" name="zone"  id={repo.game_zone_id}  onClick={o.showdel.bind(null,repo.game_zone_id)} value="删除"/>
                            <input type="button" name="zone"  id={repo.game_zone_id}  onClick={o.showchanzone.bind(null,repo.game_zone_id)} value="修改"/>
                            <input type="button" name="zone"  id={repo.game_zone_id}  onClick={o.showcopyzone.bind(null,repo.game_zone_id)} value="复制新增"/></td>
                    </tr>
                );
            });
            return (
                <div className="container">
                    <ol className="breadcrumb">
                        <li>信息中心</li>
                        <li className="active">区服信息管理</li>
                    </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>服务器ID</td>
                                <td>GAME_SITE</td>
                                <td>开服时间</td>
                                <td>服务器IP</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            {zonepage}
                        </tbody>
                    </table>
                    {/* 修改区服信息 */}
                    <div className="modal fade" id="modify_zone" tabIndex="-1" role="dialog" aria-labelledby="修改区服" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改区服</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        服务器ID<input className="form-control" type="text" id="zone_id" disabled="true"/>
                                        平台<input className="form-control" type="text" id="agent"/>
                                        服务器名称<input className="form-control" type="text" id="site_name"/>
                                        GAME_SITE<input className="form-control" type="text" id="site" />
                                        服务器IP<input className="form-control" type="text" id="host" />
                                        开服日期<input className="form-control" type="datetime-local" id="open_date" />
                                        game_port<input className="form-control" type="text" id="game_port"/>
                                        web_port<input className="form-control" type="text" id="web_port"/>
                                        actcode_port<input className="form-control" type="text" id="actcode_port"/>
                                        db_base_url<input className="form-control" type="text" id="db_base_url"/>
                                        db_game_name<input className="form-control" type="text" id="db_game_name"/>
                                        db_base_name<input className="form-control" type="text" id="db_base_name"/>
                                        db_log_name<input className="form-control" type="text" id="db_log_name"/>
                                        db_username<input className="form-control" type="text" id="db_username"/>
                                        db_password<input className="form-control" type="text" id="db_password"/>
                                        游戏路径<input className="form-control" type="text" id="bin"/>
                                        热更新路径<input className="form-control" type="text" id="hotbin"/>
                                        <div className="col-md-11 col-sm-11 col-xs-11" id="choice_per">
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.ChanInfo}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 复制区服信息 */}
                    <div className="modal fade" id="ccopy_zone" tabIndex="-1" role="dialog" aria-labelledby="复制新增区服信息" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">复制区服</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        服务器ID<input className="form-control" type="text" id="czone_id" />
                                        平台<input className="form-control" type="text" id="cagent"/>
                                        服务器名称<input className="form-control" type="text" id="csite_name"/>
                                        GAME_SITE<input className="form-control" type="text" id="csite" />
                                        服务器IP<input className="form-control" type="text" id="chost" />
                                        开服日期<input className="form-control" type="datetime-local" id="copen_date" />
                                        game_port<input className="form-control" type="text" id="cgame_port"/>
                                        web_port<input className="form-control" type="text" id="cweb_port"/>
                                        actcode_port<input className="form-control" type="text" id="cactcode_port"/>
                                        db_base_url<input className="form-control" type="text" id="cdb_base_url"/>
                                        db_game_name<input className="form-control" type="text" id="cdb_game_name"/>
                                        db_base_name<input className="form-control" type="text" id="cdb_base_name"/>
                                        db_log_name<input className="form-control" type="text" id="cdb_log_name"/>
                                        db_username<input className="form-control" type="text" id="cdb_username"/>
                                        db_password<input className="form-control" type="text" id="cdb_password"/>
                                        游戏路径<input className="form-control" type="text" id="cbin"/>
                                        热更新路径<input className="form-control" type="text" id="chotbin"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.CopyInfo}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 删除区服 */}
                    <div className="modal fade" id="delu" tabIndex="-1" role="dialog" aria-labelledby="删除用户" aria-hidden="true">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">删除区服</h4>
                                </div>
                                <div className="modal-body">
                                    <div id="delMsg"></div>
                                    <div id="delzone"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.delzone}>确定</button>
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

function formattime(time){
    var a = time.split("T");
    var b =a[1].slice(0,5);
    var time = a[0] + " " + a[1].slice(0,5);
    return time;
}
ReactDOM.render(
    <User zonepage={$.getJSON(getData('7'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('show'));
