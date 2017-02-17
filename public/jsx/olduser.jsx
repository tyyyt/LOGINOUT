/**
 * cop menu
 * @authors Orz
 * @version $Id$
 */

var User = React.createClass({
    getInitialState: function() {
        return {
            userloading: true,
            usererror: null,
            userdata: null,
        };
    },
    componentDidMount() {
        this.props.userpage.then(value => this.setState({userloading: false, userdata: value}), error => this.setState({userloading: false, usererror: error}));
    },
    adduser: function () {
        alert('hello');
    },
    deluser: function(r){
        alert(r);
    },
    render: function() {
        if (this.state.userloading) {
            return (
                <span>Loading UserList...</span>
            );
        } else if (this.state.usererror !== null) {
            return (
                <span>Error:error</span>
            );
        } else {
            var repos = this.state.userdata;
            var userpage = repos.map(function(repo) {
                return (
                                <tr>
                                    <td>{repo.id}</td>
                                    <td>{repo.username}</td>
                                    <td>{repo.showname}</td>
                                    <td>{repo.per_name}</td>
                                    <td><button className="btn btn-primary btn-block" >删除用户</button></td>
                                </tr>


                );
            });
            console.log(userpage);
            return (
                <div>

                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <td>ID</td>
                            <td>用户名</td>
                            <td>使用者</td>
                            <td>权限</td>
                            <td>操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        {userpage}
                        </tbody>
                    </table>
                    <button className="btn btn-primary btn-block" onClick={this.adduser}>新增用户</button>
                </div>
            );
        }
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
    <User userpage= { $.getJSON('./getdata/?key=64c7fec2c2f089907943c6939956be47&case=2') } />, document.getElementById('show'));
