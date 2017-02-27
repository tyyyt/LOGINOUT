/**
 * cop the page of logout(登出)
 * @authors jkk
 */
var Logout = React.createClass({
    confirm: function () {
        $('#confimout').modal('show');
    },
    logout: function () {
        var status;
        $.post("/cmd", {
           _cmd: 24
      }, function(data, status) {
            $('#confimout').modal('hide');
            location.reload();
          }).error(function(){
               $('#opMsg').text('请求时间超时');
               $('#fos').modal('show');
        });

    },
    render: function() {
        return (
            <div className="col-md-12 col-xs-12 col-sm-12">
              <ol className="breadcrumb">
                <li>后台相关</li>
                <li className="active">退出登录</li>
              </ol>
                <div className="col-md-3 col-xs-3 col-sm-3"></div>
                <div className="col-md-4 col-xs-4 col-sm-4">
                    <button className="btn btn-lg btn-danger btn-block"  onClick={this.confirm}>退出登录</button>
                </div>
                {/* 退出登录确认 */}
                <div className="modal fade" id="confimout" tabIndex="-1" role="dialog" aria-labelledby="退出登录" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">退出登录</h4>
                            </div>
                            <div className="modal-body">
                                <div id="delMsg">确定退出登录吗</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                <button type="button" className="btn btn-primary" onClick={this.logout}>确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return (r[2]);
    } else {
        return ('zh');
    }
}

ReactDOM.render(
    <Logout/>, document.getElementById('show'));
