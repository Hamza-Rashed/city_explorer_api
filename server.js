const
    express = require('express'),
    port = process.env.PORT || 3000,
    app = express();

app.use(express.static('public'));

app.get('/',(req , res)=>{
    res.status(200).sendFile('index.html')
})

app.listen(port , ()=>{
    console.log('server is running')
})