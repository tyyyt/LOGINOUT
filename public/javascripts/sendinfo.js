function f1(){
 var user=$("#inputUser").val();
 var passwd=$("#inputPassword").val();
 $.ajax({
   type:"post",
   url:'/login',
   data:{
     user:user,
     passwd:passwd
   },
 })
};
