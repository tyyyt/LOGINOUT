var a = {"serverList":[{"serverState":0,"agent":"ngame","serverno":1},{"serverState":0,"agent":"ngame","serverno":1}]}
var b = a.serverList;
// for (var variable in b) {
//   if (b.hasOwnProperty(variable)) {
//       console.log(variable);
//       console.log(b[variable]);
//   }
// }
// b.url = "www.baidu";
b.map(function(data){
  data.url="www.baidu";
})
console.log(b);
