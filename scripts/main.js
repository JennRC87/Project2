$(document).ready(function(){
  console.log('Ready');

  $.ajax({
      url:"/broadway",
      method:"post",
      success: function (data) {
        console.log(data);
      },
      // error: function(){
      //   alert("Cannot get data");
      // }
  });
});
