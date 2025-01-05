let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chat-container")
let imgbtn=document.querySelector("#img")
let img=document.querySelector("#img img")
let imginput= document.querySelector("#img input")
let submit=document.querySelector("#submit")

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB5j0J7HXQn8-69UZp3MezkOEdD1J-BbZE"
let user={
    message:null,
    file:{
        mime_type:null,
          data: null
    }
}

async function generateResponse(aiChatBox) {
let text=aiChatBox.querySelector(".aitxt")



   let  RequestOption={
    method:"POST",
    headers:{'Content-Type' : 'application/json'},
    body:JSON.stringify({
        
            "contents": [
                {"parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])

                ]
              }
            ]
             
    })
   }

    try{let response=await fetch(Api_Url,RequestOption)
        let data=await response.json()
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiResponse
        
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
        img.src=`imageicon.svg`
        img.classList.remove("choose")  
        user.file={}  
    }
    
}
function createChatBox(html, classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}
function handlechatResponse(message){
    user.message=message
    let html= `<img src="https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-a-cartoonist-character-diploma-student-standing-with-certificate-png-image_12532451.png" alt="" id="userim" width="10%">
    <div class="usertxt">
    ${user.message}
    ${user.file.data ? `<img src="data:${user.file.mime_type}; base64,${user.file.data}" 
        class="chooseimg" />`:" "}
</div>`
    prompt.value=""
    let userChatBox= createChatBox(html,"user")
    chatContainer.appendChild(userChatBox)
    chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
    setTimeout(()=>{
        let html=`<img src="https://purepng.com/public/uploads/large/purepng.com-robotrobotprogrammableautomatonelectronicscyborg-1701528371874ax93z.png" alt="" id="aiim" width="10%">
    <div class="aitxt">
    <img src="https://cdn.statically.io/img/www.blogson.com.br/wp-content/uploads/2017/10/584b607f5c2ff075429dc0e7b8d142ef.gif" class="load" alt="" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

    },600)
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
handlechatResponse(prompt.value)

    }
    
})
submit.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})
imginput.addEventListener("change",()=>{
    const file=imginput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       //convert into base64
       let base64string=e.target.result.split(",")[1]
       user.file=
       {
        mime_type:file.type,
          data:base64string
    }
    img.src=`data:${user.file.mime_type}; base64,${user.file.data}`
    img.classList.add("choose")    
    }
    
   
    reader.readAsDataURL(file)
})

imgbtn.addEventListener("click",()=>{
    imgbtn.querySelector("input").click()

})