function resizeToMax(id){
    myImage = new Image()
    var img = document.getElementById(id);
    myImage.src = img.src;
    if(myImage.width > myImage.height){
        img.style.width = "100%";
    } else {
        img.style.height = "100%";
    }
}
