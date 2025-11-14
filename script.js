const slider = document.getElementById("slider");
const sliderDisplay = document.getElementById("display");
const copy = document.getElementById("copy"); 
const copied = document.getElementById("copied");
const password = document.getElementById("password-text");
const generate = document.getElementById("generate");

const container = document.getElementById("bar-container");

const passStr = document.getElementById("passStatus");

const upperCase = document.getElementById("upperCaseLetters");
const lowerCase = document.getElementById("lowerCaseLetters");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");


function updateSliderFill(){
    const percent = (slider.value/20)*100;
    slider.style.setProperty('--slider-fill', percent + '%');
};

function copyToClipboard(){
    password.select();
    navigator.clipboard.writeText(password.value);
    copied.style.display = "flex";
};

function generatePassword(){
    let length = Number(slider.value);
    let chars = "";
    let result = "";
    if(upperCase.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(lowerCase.checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if(numbers.checked) chars += "0123456789";
    if(symbols.checked) chars += "~`!@#$%^&*()_-+={[}]|:;'<,>.?/";

    if(chars.length===0){
        password.classList.add("shake");
        setTimeout(()=>password.classList.remove("shake"), 500);
        return;
    }

    for(let i=0;i<length;i++){
        const indexArray = new Uint32Array(1);
        window.crypto.getRandomValues(indexArray);
        const index = indexArray[0]%chars.length;
        result += chars[index];
    }
    
    password.value = result;

};

function passStrength(password){
    let score = 0;
    const bars = container.querySelectorAll(".bar");

    if(password.length>=8){
        score++;
    }
    if(password.length>=12){
        score+=2;
    }
    if(/[a-z]/.test(password)){
        score++;
    }
    if(/[A-Z]/.test(password)){
        score++;
    }
    if(/[0-9]/.test(password)){
        score++;
    }
    if(/[^a-zA-Z0-9]/.test(password)){
        score++;
    }

    bars.forEach(bar=>{
        bar.style.backgroundColor = "#24232C";
        bar.style.border = "2px solid #E6E5EA";
    })
    if(score<=2){
        passStr.innerHTML = "TOO WEAK!";
        bars[0].style.backgroundColor = "#F64A4A";
        bars[0].style.border = "#F64A4A";
    }else if(score<=4){
        passStr.innerHTML = "WEAK";
        for(let i=0;i<2;i++){
            bars[i].style.backgroundColor = "#FB7C58";
            bars[i].style.border = "#FB7C58";
        }
    }else if(score<=6){
        passStr.innerHTML = "MEDIUM";
        for(let i=0;i<3;i++){
            bars[i].style.backgroundColor = "#F8CD65";
            bars[i].style.border = "#F8CD65";
        }
    }else{
        passStr.innerHTML = "STRONG";
        bars.forEach(bar=>{
            bar.style.backgroundColor = "#A4FFAF";
            bar.style.border = "#A4FFAF";
        })
    }

    if(password.length===0){
        passStr.innerHTML = "";
    }
}

function refreshUID(){
    if(password.value.length===0 || !password.value){
        passStr.innerHTML = "";
    }
}
generate.addEventListener("click", (e)=>{
    generatePassword();
    passStrength(password.value);
})

slider.addEventListener("input", (e)=>{
    let length = slider.value;
    sliderDisplay.innerText = length;
    updateSliderFill();
    copied.style.display="none";
});

password.addEventListener("input", ()=>{
    copied.style.display="none";
    refreshUID();
});





