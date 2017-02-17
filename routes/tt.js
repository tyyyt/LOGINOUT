const fs = require('fs');
const YAML = require('yamljs');
const config = YAML.parse(fs.readFileSync('../config.yml').toString());
var menu = JSON.parse(fs.readFileSync(__dirname + '/../menu/menu.json'));
var result=[];
function add(){
  for (var variable in menu) {
    menu[variable].map(function(data){
      result.push(data);
    })
  }
  return result;
}
console.log(add());
