/**
 * cop menu
 * @authors Orz
 * @version $Id$
 */

var MeunList = React.createClass({
    getInitialState: function() {
        return {
            menuloading: true,
            menuerror: null,
            menudata: null,
            langloading: true,
            langerror: null,
            langdata: null
        };
    },
    componentDidMount() {
        this.props.langpackage.then(value => this.setState({langloading: false, langdata: value}), error => this.setState({langloading: false, langerror: error}));
        this.props.menulist.then(value => this.setState({menuloading: false, menudata: value}), error => this.setState({menuloading: false, menuerror: error}));
    },

    ss: function (){
          var repos = this.state.menudata;
          var LangPackage = this.state.langdata;
          var result = [];
              for (var variable in repos) {
                  result.push(
                      <div className="panel panel-default" key={'p' + variable}>
                          <div className="panel-heading" role="tab" id={variable}>
                              <h4 className="panel-title">
                                  <a data-toggle="collapse" data-parent="#accordion" href={'#' + variable + variable} aria-expanded="false" aria-controls={variable}>
                                      {LangPackage.menu[variable]}
                                  </a>
                              </h4>
                          </div>
                          <div id={variable + variable} className="panel-collapse collapse" role="tabpanel" aria-labelledby={variable}>
                              <div className="panel-body">
                                  {repos[variable].map(function(body) {
                                      return (
                                          <div key={body}>
                                              <a href={'/showpage?s=' + body}>{LangPackage.menu[body]}</a>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  );
              }
          return result;
    },

    render: function() {
        if (this.state.menuloading || this.state.langloading) {
            return (<img src="/images/menu_loading.gif" alt="Loading Menu" className="img-responsive"/>);
        } else if (this.state.menuerror !== null) {
            return (
                <pre>Error:error</pre>
            );
        } else if (this.state.langerror !== null) {
            return (
                <span>Error: {this.state.error}</span>
            );
        } else {
                return (
                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        {this.ss()}
                    </div>
                );
        }
    }
})

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return (r[2]);
    } else {
        return ('zh');
    }
}

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
    <MeunList menulist={$.getJSON(getData('1'))} langpackage={$.getJSON(getData('6'))}/>, document.getElementById('menu'));
