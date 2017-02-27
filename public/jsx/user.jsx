/**
 * cop user management(用户管理)
 * @authors Orz&jkk
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
        this.props.userpage.then(value => this.setState({userloading: false, userdata: value}), error => this.setState({userloading: false, usererror: error}));
    },
    ShowAddUser: function() {
        $('#addu').modal('show');
    },
    allper: function() {
        var checkboxs = document.getElementsByName('per');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    ShowDelUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).attr('title'));
        });
        if (chk_value.length > 0) {
            $('#delMsg').html('<h6>确认删除以下用户吗:</h6><br/>' + chk_value.join('<br/>'));
            $('#delu').modal('show');
        } else {
            $('#delMsg').html('<h6>请选择用户，或者您根本就不想删除？</h6>');
            $('#delu').modal('show');
        }
    },

    ShowChaUser: function() {
        var chk_value1 = [];
        var chk_value2 = [];
        $('input[name = "users"]:checked').each(function() {
            chk_value1.push($(this).attr('title'));
            chk_value2.push($(this).attr('id'));
        });
        if (chk_value1.length > 0 && chk_value2.length > 0) {
            $('#chaMsg1').text(chk_value2.join(';'));
            $('#chaMsg2').text(chk_value1.join(';'));
            $('#chau').modal('show');
        } else {
            $('#chaMsg1').text('请选择用户！');
            $('#chaMsg2').text('或者您根本就不想修改？');
            $('#chau').modal('show');
        }
    },

    ShowPerUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).attr('title'));
        });
        if (chk_value.length > 0) {
            $('#chaMsg').html('<h6>确认修改以下用户吗:</h6><br/>' + chk_value.join('<br/>'));
            $('#peruser').modal('show');
        } else {
            $('#chaMsg').html('<h6>请选择用户，或者您根本就不想删除？</h6>');
            $('#peruser').modal('show');
        }
    },

    AddUser: function() {
        var user_menu = [];
        $('input[name = "per"]:checked').each(function() {
            user_menu.push($(this).val());
        });
        var username = $('#adduser').val();
        var showname = $('#addname').val();
        var passwd = $('#addpwd').val();
        var key = $('#addkey').val();
        console.log(user_menu);
        if (username == "" || showname == "" || passwd == "" || key == "") {
            $('#opMsg').text('请将信息填写完整');
            $('#fos').modal('show');
        } else {
            $.post("/cmd", {
                _cmd: 2,
                username: username,
                showname: showname,
                passwd: hex_md5(passwd),
                key: key,
                per: user_menu.join(',')
            }, function(data, status) {
                if (data.status == "yes") {
                    $('#addu').modal('hide');
                    $('#opMsg').text('添加用户成功');
                    $('#fos').modal('show');
                } else {
                    $('#addu').modal('hide');
                    $('#opMsg').text('添加用户失败');
                    $('#fos').modal('show');
                }
            }).error(function() {
                $('#addu').modal('hide');
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            });

        }
        $.getJSON(getData('2'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },

    DelUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        $.post("/cmd", {
            _cmd: 3,
            delname: chk_value.join(',')
        }, function(data, status) {
            if (data.status == "yes") {
                $('#delu').modal('hide');
                $('#opMsg').text('删除用户成功');
                $('#fos').modal('show');
            } else {
                $('#delu').modal('hide');
                $('#opMsg').text('[ERROR]' + data.deluser);
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#delu').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        $.getJSON(getData('2'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },

    ChaUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        var passwd = hex_md5($('#chapwd').val());
        $.post("/cmd", {
            _cmd: 4,
            passwd: passwd,
            chaname: chk_value.join(',')
        }, function(data, status) {
            if (data.status == "yes") {
                $('#chau').modal('hide');
                $('#opMsg').text('修改用户密码成功');
                $('#fos').modal('show');

            } else {
                $('#chau').modal('hide');
                $('#opMsg').text('[ERROR]' + data.chauser);
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#chau').modal('hide');
            $('#opMsg').text('请求时间超时');l
            $('#fos').modal('show');
        });
    },

    ChaPer: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        var user_menu = [];
        $('input[name = "chper"]:checked').each(function() {
            user_menu.push($(this).val());
        });
        $.post("/cmd", {
            _cmd: 5,
            per: user_menu.join(','),
            peruser: chk_value.join(',')
        }, function(data, status) {
            if (data.status == "yes") {
                $('#peruser').modal('hide');
                $('#opMsg').text('修改用户权限成功');
                $('#fos').modal('show');

            } else {
                $('#peruser').modal('hide');
                $('#opMsg').text('[ERROR]' + data.chauser);
                $('#fos').modal('show');
            }
        }).error(function() {
            $('#peruser').modal('hide');
            $('#opMsg').text('请求时间超时');
            $('#fos').modal('show');
        });
        $.getJSON(getData('2'), function(result) {
            res = result;
        });
        this.setState({userdata: res});
    },

    allmenu: function() {
        var result = [];
        var menu = this.state.userdata.menu;
        for (var variable in menu) {
            menu[variable].map(function(data) {
                result.push(data);
            })
        }
        return result;
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
            var repos = this.state.userdata.users;
            var LangPackage = this.state.langdata;
            var menu = this.state.userdata.menu;
            var userpage = repos.map(function(repo) {
                return (
                    <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.username}</td>
                        <td>{repo.showname}</td>
                        <td><input type="checkbox" name="users" title={repo.showname} id={repo.id} value={repo.id}/></td>
                    </tr>
                );
            });
            var xx = this.allmenu();
            var perName = xx.map(function(data) {
                return (
                  <div key={data}>
                    <input type="checkbox" name="per" value={data} id={data} key={data} />{LangPackage.menu[data]}
                  </div>
                );
            });
            var chPerName = xx.map(function(data) {
                return (
                  <div key={data}>
                    <input type="checkbox" name="chper" value={data} id={data} key={data} />{LangPackage.menu[data]}
                  </div>
                );
            });
            return (
                <div className="container">
                    <ol className="breadcrumb">
                        <li>后台相关</li>
                        <li className="active">用户管理</li>
                    </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>用户名</td>
                                <td>使用者</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            {userpage}
                        </tbody>
                    </table>
                    <div className="container">
                        <div className="col-md-3 col-sm-3 col-xs-3"></div>
                        <div className="btn-group center-block col-md-6 col-sm-6 col-xs-6">
                            <button className="btn btn-primary" onClick={this.ShowAddUser}>新增用户</button>
                            <button className="btn btn-danger" onClick={this.ShowDelUser}>删除用户</button>
                            <button className="btn btn-default" onClick={this.ShowChaUser}>修改密码</button>
                            <button className="btn btn-info" onClick={this.ShowPerUser}>修改权限</button>
                        </div>
                    </div>
                    {/* 新增用户 */}
                    <div className="modal fade" id="addu" tabIndex="-1" role="dialog" aria-labelledby="新增用户" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">新增用户</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <input className="form-control" type="text" id="adduser" placeholder="用户名"/>
                                        <input className="form-control" type="text" id="addname" placeholder="使用者名称"/>
                                        <input className="form-control" type="password" id="addpwd" placeholder="密码"/>
                                        <input className="form-control" type="text" id="addkey" placeholder="密钥[登录时使用]"/>
                                        <div className="col-md-11 col-sm-11 col-xs-11" id="choice_per">
                                            {perName}
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-default" onClick={this.allper}>全选/反选</button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.AddUser}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 删除用户 */}
                    <div className="modal fade" id="delu" tabIndex="-1" role="dialog" aria-labelledby="删除用户" aria-hidden="true">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">删除用户</h4>
                                </div>
                                <div className="modal-body">
                                    <div id="delMsg"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.DelUser}>确定</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 修改密码 */}
                    <div className="modal fade" id="chau" tabIndex="-1" role="dialog" aria-labelledby="修改用户" aria-hidden="true">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改密码</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <div className="form-control" readOnly id="chaMsg1"></div>
                                        <div className="form-control" readOnly id="chaMsg2"></div>
                                        {/* <input className="form-control" type="text" id="chaname" placeholder="使用者名称"/> */}
                                        <input className="form-control" type="password" id="chapwd" placeholder="密码"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.ChaUser}>保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 修改权限*/}
                    <div className="modal fade" id="peruser" tabIndex="-1" role="dialog" aria-labelledby="修改权限" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">修改权限</h4>
                                </div>
                                <div className="modal-body">
                                  <div id="chaMsg"></div>
                                  <hr/>
                                  {chPerName}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary" onClick={this.ChaPer}>保存</button>
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
    <User userpage={$.getJSON(getData('2'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('show'));
