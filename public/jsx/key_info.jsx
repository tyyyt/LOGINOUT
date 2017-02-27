/**
 * cop the page of key information(key信息管理)
 * @authors Orz&jkk
 */

 // ajax sync
$.ajaxSettings.async = false;
var res;

var Keyinfo = React.createClass({
    getInitialState: function() {
        return {keyloading: true, keyerror: null, keydata: null};
    },

    componentDidMount() {
        this.props.keypage.then(value => this.setState({keyloading: false, keydata: value}), error => this.setState({keyloading: false, keyerror: error}));
    },

    showkey: function() {
      var chk_value = [];
      $('input[name="users"]:checked').each(function() {
          chk_value.push($(this).attr('title'));
      });
      if (chk_value.length > 0) {
        $('#chaMsg1').html('<h6>修改以下用户KEY吗:</h6><br/>' + chk_value.join('<br/>'));
        $('#chakey').attr('disabled',false);
        $('#chkey').modal('show');
      }else {
        $('#chaMsg1').html('<h6>请选择需要修改KEY信息的用户</h6>');
        $('#chakey').attr('disabled',true);
        $('#chkey').modal('show');
      }
    },
    selectusers: function() {
        var checkboxs = document.getElementsByName('users');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    chankey: function(){
      var chk_value = [];
      $('input[name="users"]:checked').each(function() {
          chk_value.push('"' + $(this).val() + '"');
      });
      var keyinfo = $('#chakey').val();
      $.post("/cmd", {
           _cmd: 7,
          users: chk_value.join(','),
          keyinfo: keyinfo
      }, function(data, status) {
          if (data.status == 'yes') {
            $('#chkey').modal('hide');
            $('#opMsg').text('修改KEY信息成功');
            $('#fos').modal('show');
          }else{
            $('#chkey').modal('hide');
            $('#opMsg').text('[ERROR]' + data.deluser);
            $('#fos').modal('show');
          }
      }).error(function(){
        $('#chkey').modal('hide');
        $('#opMsg').text('请求时间超时');
        $('#fos').modal('show');
      });
      $.getJSON(getData('2'), function(result){
        res = result;
      });
      this.setState({keydata: res});
    },

    render: function() {
        if (this.state.keyloading) {
            return (
                <img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>
            );
        } else if (this.state.keyerror !== null) {
            return (
                <span>Error:error</span>
            );
        } else {
            var repos = this.state.keydata.users;
            var userpage = repos.map(function(repo) {
                return (
                    <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.username}</td>
                        <td>{repo.showname}</td>
                        <td>{repo.key}</td>
                        <td><input type="checkbox" name="users" title={repo.showname} id={repo.user} value={repo.username}/></td>
                    </tr>
                );
            });
            return (
                <div className="container">
                  <ol className="breadcrumb">
                    <li>后台相关</li>
                    <li className="active">KEY管理</li>
                  </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>用户名</td>
                                <td>使用者</td>
                                <td>KEY</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            {userpage}
                        </tbody>
                    </table>
                  <div className="container">
                    <div className="col-md-3 col-sm-3 col-xs-3"></div>
                    <div className="btn-group center-block col-md-4 col-sm-6 col-xs-10">
                        <button className="btn btn-default" onClick={this.selectusers}>全选／反选</button>
                        <button className="btn btn-primary" onClick={this.showkey}>修改</button>
                    </div>
                  </div>
                  {/* 修改key */}
                  <div className="modal fade" id="chkey" tabIndex="-1" role="dialog" aria-labelledby="修改key" aria-hidden="true">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">
                                      <span aria-hidden="true">&times;</span>
                                      <span className="sr-only">Close</span>
                                  </button>
                                  <h4 className="modal-title">修改KEY信息</h4>
                              </div>
                              <div className="modal-body">
                                <div className="form-group">
                                  <div  id="chaMsg1"></div>
                                  {/* <input className="form-control" type="text" id="chaname" placeholder="使用者名称"/> */}
                                  <input className="form-control" type="text" id="chakey" placeholder="KEY"/>
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
    <Keyinfo keypage={$.getJSON(getData('2'))} />, document.getElementById('show'));
