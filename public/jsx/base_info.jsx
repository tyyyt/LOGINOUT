/**
 * cop the page of basename(策划配置)
 * @authors Orz&jkk
 */

// ajax sync
$.ajaxSettings.async = false;
var res;

var Basename = React.createClass({
    getInitialState: function() {
        return {
            baseloading: true,
            baseerror: null,
            basedata: null,
            langloading: true,
            langerror: null,
            langdata: null
        };
    },

    componentDidMount() {
        this.props.langpackage.then(value => this.setState({langloading: false, langdata: value}), error => this.setState({langloading: false, langerror: error}));
        this.props.basepage.then(value => this.setState({baseloading: false, basedata: value}), error => this.setState({baseloading: false, baseerror: error}));
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

    showch: function(id) {
        $('#modify_base').modal('show');
        $('#base_id').val(id);
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
        this.setState({basedata: res});
    },
    render: function() {
        if (this.state.baseloading || this.state.langloading) {
            return (<img src="/images/show_loading.gif" alt="Loading Menu" className="img-responsive img-rounded center-block"/>);
        } else if (this.state.baseerror !== null) {
            return (
                <span>Error: {this.state.baseerror}</span>
            );
        } else if (this.state.langerror !== null) {
            return (
                <span>Error: {this.state.langerror}</span>
            );
        } else {
            var repos = this.state.basedata;
            var o = this;
            var zonepage = repos.map(function(repo) {
                return (
                    <tr key={repo.game_zone_id}>
                        <td>{repo.game_zone_id}</td>
                        <td>{repo.site_name}</td>
                        <td>{repo.db_base_name}</td>
                    </tr>
                );
            });
            return (
                <div className="container">
                    <ol className="breadcrumb">
                        <li>版本控制</li>
                        <li className="active">策划版本配置</li>
                    </ol>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <td>服务器ID</td>
                                <td>SITE_NAME</td>
                                <td>策划版本</td>
                            </tr>
                        </thead>
                        <tbody>
                            {zonepage}
                        </tbody>
                    </table>
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
    <Basename basepage={$.getJSON(getData('9'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('show'));
