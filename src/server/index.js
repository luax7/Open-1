const liveServer = require('live-server');
const express = require('express')();
require('dotenv').config()
const fs = require('fs');   
const fileMap = [];

fs.readdirSync(__dirname + "\\Projects").forEach(element => {
    fileMap.push({
        key:element.slice(0,-5),
        path:__dirname + '\\Projects\\' + element
    })
})

const Dir = __dirname
const rootDir = Dir
    .split('\\')
    .slice(0,-1)
    .join('\\')

liveServer.start({
    file: rootDir + '\\frontend\\',
    root: rootDir + '\\frontend\\',
    middleware: [function(req, res, next) { next(); }],
    wait:1000,
})

// Setup of the middleware
const Parser = require('body-parser').json()



express.listen(process.env.PORT, function(){

    express.post  ('/', Parser , (req,res) => {
        console.log(fileMap)
        for(let i = 0; i < fileMap.length;i++){

            const file = fileMap[i]

                if(file.key === req.body.name){
                    res.status(502).json({
                        Message:"Error, Already added this file"
                    })
                    return
                }

        }

        const object = {
            name: req.body.name,
            path: req.body.path,
            image : null,
            cmdString: null
        }

        fs.writeFileSync(__dirname + '/Projects/' + req.body.name+ '.json',JSON.stringify(object))
        fileMap.push({
            key:req.body.name,
            path:__dirname + '/Projects/' + req.body.name+ '.json',
            image:null
        })

        res.status(200).json({
            Message:"Successfully added you application"
        })
        return
    })
    express.get   ('/', Parser, (req,res)=> {

        const finds = []

        for(const find of fileMap){
            if(find.key == req.body.name) finds.push(find.path)
        }
        if(finds.length===0) {
            res.status(404).json({
                Message:"Not found"
            })
            return
        }

        res.status(200).json({
            Message:"Sucessfully finded application",
            Data : finds
        })
        return
    })
    express.put   ('/', Parser, (req,res)=> {

        const finds = []

        for(const find of fileMap){
            if(find.key == req.body.name) finds.push(find.path)
        }
        if(finds.length===0) {
            res.status(404).json({
                Message:"Not found"
            })
            return
        }

        const object = {
            name: req.body.name,
            path: req.body.path,
            image : req.body.image | null,
            cmdString: req.body.cmd | null
        }

        fs.writeFileSync(__dirname + '/Projects/' + req.body.name+ '.json',JSON.stringify(object))

        res.status(200).json({
            
                Message:"Sucessfully edited application",
            
        })
    })
    express.delete('/', Parser, (req,res)=>{
        const finds = []

        for(const find of fileMap){
            if(find.key === req.body.name) {
                    fs.unlinkSync(find.path)
                    const finds = []

                    for(let i = 0; i < fileMap.length; i++) {
                        if(fileMap[i] === req.body.name) {
                            finds.push(i)
                        }
                    }

                    for(const index in finds){
                        fileMap[index] = null;
                    }

                    res.status(200).json({
                        Message:"Sucessfully deleted application"
                    })

                    console.log(fileMap)
                    return
            }
        }
        res.status(404).json({
            Message:"No such file or directory"
        })
        return
    })

})
