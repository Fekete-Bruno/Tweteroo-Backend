import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const  tweets = [];
const users= [];

function addAvatar (element){
    return({...element,
        avatar:(users.find(el=>el.username===element.username)).avatar,
    });
}

function checkString(el){
    return(typeof(el)==="string");
}

function checkHTTP(el){
    el.toLowerCase();
    if(el.startsWith("http://")||el.startsWith("https://")){
        return true;
    }
}

function checkUser(username){
    return(users.find(el=>el.username===username));
}

app.get('/tweets',(req,res)=>{
    const page = parseInt(req.query.page);
    if(!page || page<1){
        return res.status(400).send("Informe uma página válida!");
    }
    const ten = 10;
    const allTweets = [...tweets];
    const recentTweets = allTweets.reverse().filter((e,index)=>{return(((page*ten)-ten)<=index && index<page*ten)}).map((tweet)=>addAvatar(tweet));
    res.send(recentTweets);
});

app.get('/tweets/:username',(req,res)=>{
    const username = req.params.username;
    const allTweets = [...tweets];
    const userTweets = allTweets.reverse().filter((e)=>{return(e.username===username)}).map((tweet)=>addAvatar(tweet));
    res.send(userTweets);
});

app.post('/sign-up',(req,res)=>{
    const { username, avatar } =  req.body;
    if(!username || !avatar){
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    if( !checkString(username) || !checkString(avatar) || !checkHTTP(avatar)){
        return res.status(422).send("Verifique os campos novamente!");
    }

    users.push({username,avatar});
    res.status(201).send("OK");
});

app.post('/tweets',(req,res)=>{
    const username = req.headers.user;
    const { tweet } =  req.body;
    if(!username || !tweet){
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    if( !checkString(username) || !checkString(tweet) || !checkUser(username)){
        return res.status(422).send("Verifique os campos novamente!");
    }

    tweets.push({username,tweet});
    res.status(201).send("OK");
});

app.listen(5000,()=>console.log('Listening on port 5000'));