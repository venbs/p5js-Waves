let elementsArr = ['dribbble','behance','weibo','email','inlinked'];
let icons = [];
function buildAnimations(){
    for (let i = 0; i < elementsArr.length; i++) {
        let anim = [];
        let element = document.getElementById('bm'+elementsArr[i])
        let params = {
            container: element,
            autoplay:false,
            loop:true,
            animationData:animations[elementsArr[i]],
            renderer:'svg',
        }
        icons[elementsArr[i]] = bodymovin.loadAnimation(params);
    }
}
buildAnimations();
function iconsPlay(paramsPlay){
    let a = paramsPlay.id; //get id
    let b = a.substring(2,a.length);// remove 'bm'
    icons[b].play();
}
let a;
let b;
