const express = require('express');
const { __esModule } = require('../dist');
const app = express()



app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

app.use(express.urlencoded({extendend:false}));



app.post('/validateData', function(req, res){
    console.log(req.body)
    var{rules, definitions} = req.body
    definitions = validateDefenitions(definitions)
    rules = validateRules(rules)
    parse(definitions, rules)
})


app.listen(3001)

function validateDefenitions(str)
{
    var definitions = {}
    var tmp = ""
    var key = ""
    for(let i = 0; i < str.length; i++){
        if(str[i] == '\n'){
            definitions[key] = tmp
            tmp = ''
        }
        else if(str[i] == '\r'){
            continue;
        }
        else if(str[i] == ':' && tmp != ''){
            key = tmp
            tmp = ''
        }
        else if(i == str.length - 1)
        {
            tmp += str[i]
            definitions[key] = tmp
        }
        else if(str[i] != ' '){
            tmp += str[i];
        }   
    }
    return definitions
}

function validateRules(str){
    var rules = new Object()
    arr = []
    var tmp = ""
    var keyValue = ""
    for(let i = 0; i < str.length; i++){
        if(str[i] == '\n' || i == str.length - 1){
            
            rules[keyValue] = arr
            arr.push(tmp.trim())
            tmp = ''
            arr = []
            keyValue = ''
        }
        else if(str[i] == '\r'){
            continue
        }
        else if(str[i] == ':'){
            keyValue = tmp.replaceAll(' ','')
            tmp = '';
        }
        else if(str[i] == '|'){
            
            arr.push(tmp.trim())
            tmp = ''
        }
        else if(str != ' '){
            tmp += str[i]
        }    
    }
    return rules
}




function parse(definitions, rules){

    const Parser = require("c:/slavoyarMC/parser_generator/parser_generator/dist/ParserGenerator/index");


    grammar = {
        tokens: definitions,
        rules: rules
    };
    const parser = new Parser.ParserGenerator(grammar);
    parser.test();
}