const server = "http://127.0.0.1:12345/";
let idforum = 0;

setInterval(fetchMessage, 5000);
fetchMessage();
fetchForum(document.getElementById("search"));

async function fetchMessage(){
    const answer = await fetch(server+"cgi-bin/message?forum="+idforum, {
        method:"GET"
    });
    let messages = await answer.json();

    let listNode = document.getElementById("msg-out");
    clearChildren(listNode);
    if (messages){
        messages.forEach(element => {
            const listEl = document.createElement("li");
            const infodiv = document.createElement("div");

            const author = document.createElement("label");
            const time = document.createElement("label");
            const message = document.createElement("p");

            const date = new Date(element.timestamp);

            infodiv.className = "message-info"
            
            author.className = "message-author"
            author.for = element.id;
            
            time.className = "message-time"
            time.for = element.id;
            
            author.textContent = element.author;
            time.textContent = date.toLocaleString();
            
            infodiv.appendChild(author);
            infodiv.appendChild(time);

            message.id = element.id;
            message.textContent = element.message;
            
            listEl.className = "message-container";
            listEl.appendChild(infodiv);
            listEl.appendChild(message);

            listNode.appendChild(listEl);
        });
    }
}

async function sendMessage(){
    const messageNode = document.getElementById("msg-in");
    const date = new Date();

    const message = messageNode.value; 
    const timestamp = date.getTime();

    const answer = await fetch(server + "cgi-bin/message?forum=" + idforum, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
        },
        body: JSON.stringify({timestamp, message})
    });
    let log = await answer.json();

    switch(log.status){
        case "ok":
            await fetchMessage();
            
            let logdiv = document.getElementById("msg-log");
            logdiv.scrollTop = logdiv.scrollHeight;
            break;
        case "need-auth":
            window.location.href = "login.html";
            break;
        case "error":
            console.log(log.message);
            break;
        default:
            console.log("default")
            break;
    }
}

async function fetchForum(el){
    const search = el.value;

    const answer = await fetch(server+"cgi-bin/forum", {
        method:"POST",
        body: JSON.stringify({search})
    });
    const forum = await answer.json()
    
    const listNode = document.getElementById("search-list");
    clearChildren(listNode);
    if (forum){
        forum.forEach(element => {
            const forumItem = document.createElement("li")
            const forumButton = document.createElement("button");
            
            forumButton.setAttribute("onClick", "setForum("+element.id + ",\"" + element.name + "\");");
            forumButton.textContent = element.name;
            
            forumItem.appendChild(forumButton);
            listNode.appendChild(forumItem);
        });
    }
}

function clearChildren(node){
    let child = node.lastElementChild;
    while(child){
        node.removeChild(child);
        child = node.lastElementChild;
    }
}

function setForum(id, name){
    const forumTitle = document.getElementById("forum-name");
    forumTitle.textContent = name;
    idforum = id;
    fetchMessage();
}
