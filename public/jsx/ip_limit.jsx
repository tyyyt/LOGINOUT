/**
 * cop the page of limitip(后台登录IP限制)
 * @authors Orz&jkk
 */

 // ajax sync
$.ajaxSettings.async = false;
var res;

var Iplimit = React.createClass({
    getInitialState: function() {
        return {iploading: true, iperror: null, ipdata: null};
    },

    componentDidMount() {
        this.props.limitpage.then(value => this.setState({iploading: false, ipdata: value}), error => this.setState({iploading: false, iperror: error}));
    },

    showadd: function() {
        $('#addip').modal('show');
    },
    selectusers: function() {
        var checkboxs = document.getElementsByName('users');
        for (var i = 0; i < checkboxs.length; i++) {
            var e = checkboxs[i];
            e.checked = !e.checked;
        }
    },

    addip: function(){
      var keyinfo = $('#limitip').val();
      $.post("/cmd", {
           _cmd: 10,
          limit_ip: keyinfo
      }, function(data, status) {
          if (data.status == 'yes') {
            $('#addip').modal('hide');
            $('#opMsg').text('添加成功');
            $('#fos').modal('show');
          }else{
            $('#addip').modal('hide');
            $('#opMsg').text('[ERROR]');
            $('#fos').modal('show');
          }
      }).error(function(){
        $('#addip').modal('hide');
        $('#opMsg').text('请求时间超时');
        $('#fos').modal('show');
      });
      $.getJSON(getData('5'), function(result){
        res = result;
      });
      this.setState({ipdata: res});
    },

   delip: function(){
     var chk_value = [];
     $('input[name="liip"]:checked').each(function() {
         chk_value.push( '"'+ $(this).val() + '"' );
     });
     if(chk_value.length > 0){
       $.post("/cmd", {
            _cmd: 11,
           del_ip: chk_value.join(',')
       }, function(data, status) {
           if (data.status == 'yes') {
             $('#addip').modal('hide');
             $('#opMsg').text('删除成功');
             $('#fos').modal('show');
           }else{
             $('#addip').modal('hide');
             $('#opMsg').text('[ERROR]');
             $('#fos').modal('show');
           }
       }).error(function(){
         $('#addip').modal('hide');
         $('#opMsg').text('请求时间超时');
         $('#fos').modal('show');
       });
       $.getJSON(getData('5'), function(result){
         res = result;
       });
       this.setState({ipdata: res});
     }else{
       $('#opMsg').text('请选择要删除的IP');
       $('#fos').modal('show');
     }
   },

    render: function() {
        if (this.state.iploading) {
            return (
                <img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>
            );
        } else if (this.state.iperror !== null) {
            return (
                <span>Error:error</span>
            );
        } else {
            var repos = this.state.ipdata;
            var userpage = repos.map(function(repo) {
                return (
                    <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.ip}</td>
                        <td><input type="checkbox" name="liip"  id={repo.id} value={repo.ip}/></td>
                    </tr>
                );
            });
            return (
                <div className="container">
                  <ol className="breadcrumb">
                    <li>后台相关</li>
                    <li className="active">后台登陆IP管理</li>
                  </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>IP</td>
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
                        <button className="btn btn-default" onClick={this.showadd}>添加</button>
                        <button className="btn btn-primary" onClick={this.delip}>删除</button>
                    </div>
                  </div>
                  {/* 添加IP*/}
                  <div className="modal fade" id="addip" tabIndex="-1" role="dialog" aria-labelledby="添加ip" aria-hidden="true">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">
                                      <span aria-hidden="true">&times;</span>
                                      <span className="sr-only">Close</span>
                                  </button>
                                  <h4 className="modal-title">添加IP信息</h4>
                              </div>
                              <div className="modal-body">
                                <div className="form-group">
                                  <input className="form-control" type="text" id="limitip" placeholder="ip"/>
                                </div>
                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                  <button type="button" className="btn btn-primary" onClick={this.addip}>保存</button>
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
    <Iplimit limitpage={$.getJSON(getData('5'))} />, document.getElementById('show'));
