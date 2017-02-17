/**
 * cop user
 * @authors Orz
 */

var User = React.createClass({
    getInitialState: function() {
        return {userloading: true, usererror: null, userdata: null};
    },

    componentDidMount() {
        this.props.userpage.then(value => this.setState({userloading: false, userdata: value}), error => this.setState({userloading: false, usererror: error}));
    },

    ShowAddUser: function() {
       $('#addu').modal('show');
    },

    ShowDelUser: function() {
      var chk_value = [];
      $('input[name="users"]:checked').each(function() {
          chk_value.push($(this).attr('title'));
      });
      if (chk_value.length > 0) {
        $('#delMsg').html('<h6>确认删除以下用户吗:</h6><br/>' + chk_value.join('<br/>'));
        $('#delu').modal('show');
      }else {
        $('#delMsg').html('<h6>请选择服务器，或者您根本就不想删除？</h6>');
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
      }else {
        $('#chaMsg1').text('请选择服务器！');
        $('#chaMsg2').text('或者您根本就不想修改？');
        $('#chau').modal('show');
      }
    },

    AddUser: function() {
        var username = $('#adduser').val();
        var showname = $('#addname').val();
        var passwd = $('#addpwd').val();
        var key = $('#addkey').val();
        var per = $('#choice_per').val();
        if(per == "请选择权限组"){
            $('#opMsg').text('请选择权限组');
            $('#fos').modal('show');
        }else if(username == "" || showname == "" ||passwd == "" || key == "" ){
            $('#opMsg').text('请将信息填写完整');
            $('#fos').modal('show');
        }else{
            $.ajax({
                dataType: 'json',
                cache: false,
                url: "/cmd?_cmd=2&username="+ username +"&showname="+ showname +"&passwd="+hex_md5(passwd)+"&key="+key+"&per="+per,
                success: function(data) {
                    if(data.adduser == "yes"){
                        $('#addu').modal('hide');
                        $('#opMsg').text('添加用户成功');
                        $('#fos').modal('show');
                        // alert('添加用户成功')
                    }
                    if(data.adduser == "no"){
                        $('#addu').modal('hide');
                        $('#opMsg').text('添加用户失败');
                        $('#fos').modal('show');
                        // alert('添加用户失败')
                    }
                },
                error: function() {
                    $('#addu').modal('hide');
                    $('#opMsg').text('请求时间超时');
                    $('#fos').modal('show');
                }
            });
        }
        this.setState({userdata: $.getJSON(getData('2'))});
    },

    DelUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        $.ajax({
            dataType: 'json',
            cache: false,
            url: "/cmd?_cmd=3&delname=" + chk_value.join(','),
            success: function(data) {
                if(data.deluser=="yes"){
                    $('#delu').modal('hide');
                    $('#opMsg').text('删除用户成功');
                    $('#fos').modal('show');

                }else {
                    $('#delu').modal('hide');
                    $('#opMsg').text('[ERROR]' + data.deluser);
                    $('#fos').modal('show');
                }
            },
            error: function() {
                $('#delu').modal('hide');
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            }
        });
        this.setState({userdata: $.getJSON(getData('2'))});
    },

    ChaUser: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        var passwd = hex_md5($('#chapwd').val());
        $.ajax({
            dataType: 'json',
            cache: false,
            url: "/cmd?_cmd=4&passwd=" + passwd + "&chaname=" + chk_value.join(','),
            success: function(data) {
                if(data.chauser == "yes"){
                    $('#chau').modal('hide');
                    $('#opMsg').text('修改用户密码成功');
                    $('#fos').modal('show');

                }else {
                    $('#chau').modal('hide');
                    $('#opMsg').text('[ERROR]' + data.chauser);
                    $('#fos').modal('show');
                }
            },
            error: function() {
                $('#chau').modal('hide');
                $('#opMsg').text('请求时间超时');
                $('#fos').modal('show');
            }
        });

    },

    render: function() {
        if (this.state.userloading) {
            return (
                <img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>
            );
        } else if (this.state.usererror !== null) {
            return (
                <span>Error:error</span>
            );
        } else {
            console.log(this.state.userdata);
            var repos = this.state.userdata.users;
            var per = this.state.userdata.per;
            var userpage = repos.map(function(repo) {
                return (
                    <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.username}</td>
                        <td>{repo.showname}</td>
                        <td>{per[repo.permissions - 1]}</td>
                        <td><input type="checkbox" name="users" title={repo.showname} id={repo.username} value={repo.id}/></td>
                    </tr>
                );
            });
            var perKey = 0;
            var perName = per.map(function(data){
                perKey++;
                return(
                  <option value={perKey} key={perKey}>{data}</option>
                );
            });
            return (
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>用户名</td>
                                <td>使用者</td>
                                <td>权限组</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            {userpage}
                        </tbody>
                    </table>
                  <div className="col-md-4 col-sm-4 col-xs-4"></div>
                  <div className="btn-group center-block col-md-4 col-sm-4 col-xs-4">
                    <button className="btn btn-primary" onClick={this.ShowAddUser}>新增用户</button>
                    <button className="btn btn-danger" onClick={this.ShowDelUser}>删除用户</button>
                    <button className="btn btn-default" onClick={this.ShowChaUser}>修改用户</button>
                  </div>
                  {/* 新增用户 */}
                  <div className="modal fade" id="addu" tabIndex="-1" role="dialog" aria-labelledby="新增用户" aria-hidden="true">
                      <div className="modal-dialog modal-sm">
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
                                  <select className="form-control" id="choice_per">
                                      <option defaultValue="selected">请选择权限组</option>
                                      {perName}
                                  </select>
                                </div>
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
                  {/* 修改用户 */}
                  <div className="modal fade" id="chau" tabIndex="-1" role="dialog" aria-labelledby="修改用户" aria-hidden="true">
                      <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">
                                      <span aria-hidden="true">&times;</span>
                                      <span className="sr-only">Close</span>
                                  </button>
                                  <h4 className="modal-title">修改用户</h4>
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
    var getData  = './getdata/?key=';
    getData += key;
    getData += '&tm=';
    getData += tm;
    getData += '&case=';
    getData += data;
    return getData;
}

ReactDOM.render(
    <User userpage={$.getJSON(getData('2'))} />, document.getElementById('show'));
