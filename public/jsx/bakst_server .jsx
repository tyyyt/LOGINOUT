/**
 * cop server_stop/start
 * @authors Orz
 */

var Server = React.createClass({
    getInitialState: function() {
        return {serverloading: true, servererror: null, serverdata: null};
    },

    componentDidMount() {
        this.props.serverpage.then(value => this.setState({serverloading: false, serverdata: value}), error => this.setState({serverloading: false, servererror: error}));
    },

    allselect: function(){
      var checkboxs = document.getElementsByName('gamesrv');
      for (var i = 0; i < checkboxs.length; i++) {
          var e = checkboxs[i];
          e.checked = !e.checked;
      }
  },

    showstop: function() {
      var chk_value = [];
      $('input[name="gamesrv"]:checked').each(function() {
          chk_value.push($(this).val());
      });
      if (chk_value.length > 0) {
        $('#stopMsg').html('<h6>确定要关闭以下服务器吗:</h6><br/>' + chk_value.join('<br/>'));
        $('#showstop').modal('show');
      }else {
        $('#stopMsg').html('<h6>请选择要关闭的服务器？</h6>');
        $('#showstop').modal('show');
      }
    },
    showstart: function() {
      var chk_value = [];
      $('input[name="gamesrv"]:checked').each(function() {
          chk_value.push($(this).val());
      });
      if (chk_value.length > 0) {
        $('#startMsg').html('<h6>确定要开启以下服务器吗:</h6><br/>' + chk_value.join('<br/>'));
        $('#showstart').modal('show');
      }else {
        $('#startMsg').html('<h6>请选择要开启的服务器？</h6>');
        $('#showstart').modal('show');
      }
    },
    stop: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        $.ajax({
            dataType: 'json',
            cache: false,
            url: "/cmd?_cmd=5&stop_ser=" + chk_value.join(','),
            success: function(data) {
                if(data.stop_ser=="yes"){
                    $('#delu').modal('hide');
                    $('#opMsg').text('关闭服务器成功');
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
        this.setState({userdata: $.getJSON(getData('3'))});
    },
    start: function() {
        var chk_value = [];
        $('input[name="users"]:checked').each(function() {
            chk_value.push($(this).val());
        });
        $.ajax({
            dataType: 'json',
            cache: false,
            url: "/cmd?_cmd=6&start_ser=" + chk_value.join(','),
            success: function(data) {
                if(data.deluser=="yes"){
                    $('#delu').modal('hide');
                    $('#opMsg').text('关闭服务器成功');
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
        this.setState({userdata: $.getJSON(getData('3'))});
    },
    render: function() {
        if (this.state.serverloading) {
            return (
                <img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>
            );
        } else if (this.state.servererror !== null) {
            return (
                <per>Error:error</per>
            );
        } else {
          var repos = this.state.serverdata;
          var serverpage = repos.map(function(repo) {
              return (
                     <option>{repo.AGENT}</option>
              );
          });
            return (
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <ol className="breadcrumb">
                    <li>服务器管理</li>
                    <li className="active">关闭/开启服务器</li>
                  </ol>
                  <div className="row" >
                     <select className="center-block">{serverpage}</select>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4"></div>
                  <div className="btn-group center-block col-md-4 col-sm-4 col-xs-4">
                    <button className="btn btn-primary" onClick={this.showstart}>开启服务器</button>
                    <button className="btn btn-danger" onClick={this.showstop}>关闭服务器</button>
                    <button className="btn btn-info" onClick={this.allselect}>全选/反选</button>
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
                  {/* 关闭服务 */}
                 <div className="modal fade" id="showstop" tabIndex="-1" role="dialog" aria-labelledby="关闭服务" aria-hidden="true">
                     <div className="modal-dialog modal-sm">
                         <div className="modal-content">
                             <div className="modal-header">
                                 <button type="button" className="close" data-dismiss="modal">
                                     <span aria-hidden="true">&times;</span>
                                     <span className="sr-only">Close</span>
                                 </button>
                                 <h4 className="modal-title">确定要关闭这些服务吗</h4>
                             </div>
                             <div className="modal-body">
                               <div id="stopMsg"></div>
                             </div>
                             <div className="modal-footer">
                                 <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                 <button type="button" className="btn btn-primary" onClick={this.star}>确定</button>
                             </div>
                       </div>
                    </div>
                </div>
                {/* 开启服务 */}
                <div className="modal fade" id="showstart" tabIndex="-1" role="dialog" aria-labelledby="关闭服务" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">确定要开启这些服务吗</h4>
                            </div>
                            <div className="modal-body">
                              <div id="startMsg"></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                <button type="button" className="btn btn-primary" onClick={this.start}>确定</button>
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
