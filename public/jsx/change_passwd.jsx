/**
 * cop the page of change password(修改密码页面)
 * @authors Orz&jkk
 */
var Changepd = React.createClass({
    chpd: function () {
        let oldpass = $("#oldpass").val();
        let newone = $("#newone").val();
        let newtwo = $("#newtwo").val();
        if(oldpass =="" || newone =="" || newtwo==""){
            $('#msg').text('请将信息输入完整');
            $('#myModal').modal('show');
            return 1;
        }
        if(newone != newtwo){
            $('#msg').text('两次输入的密码不一致');
            $('#myModal').modal('show');
            return 1;
        }
        var status;
        $.post("/cmd", {
           _cmd: 1,
           newpd: hex_md5(newone),
           oldpass: hex_md5(oldpass)
      }, function(data, status) {
                if(data.status=="ok"){
                    $('#msg').text('修改成功');
                    $('#myModal').modal('show');
                }
                if(data.status=="fail"){
                    $('#msg').text('修改失败');
                    $('#myModal').modal('show');
                }
                if(data.status=="no"){
                    $('#msg').text('原密码输入错误');
                    $('#myModal').modal('show');
                }
          }).error(function(){
               $('#msg').text('请求时间超时');
               $('#myModal').modal('show');
        });

    },
    render: function() {
        return (
            <div className="col-md-12 col-xs-12 col-sm-12">
              <ol className="breadcrumb">
                <li>后台相关</li>
                <li className="active">密码修改</li>
              </ol>
                <div className="col-md-3 col-xs-3 col-sm-3"></div>
                <div className="col-md-4 col-xs-4 col-sm-4">
                    <form action="" className="form-signin">
                        <div className="form-group">
                            <label  className="sr-only">密码</label>
                            <input type="password" className="form-control" id="oldpass" placeholder="请输入原密码"/>
                            <input type="password" className="form-control" id="newone"  placeholder="请输入新密码"/>
                            <input type="password" className="form-control" id="newtwo"  placeholder="请确认新密码"/>
                        </div>
                    </form>
                    <button className="btn btn-lg btn-primary btn-block"  onClick={this.chpd}>确定</button>
                </div>
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                              <div id="msg"></div>
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
    <Changepd/>, document.getElementById('show'));
