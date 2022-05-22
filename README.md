# Parser generator
This parser generator works on Operator-precedence grammar.

Example of input grammar:<br>E -> E+E | E*E | id

However, the grammar given below is not an operator grammar because two non-terminals are adjacent to each other:
<br>S -> SAS | a
<br>A -> bSb | b

We can convert it into an operator grammar, though:
<br>S -> SbSbS | SbS | a
<br>A -> bSb | b  

<h1>Defenitions format</h1>
Those grammar rules, such as tokens should be defined in json format. 

The example for grammar:
<br>S → -B
<br>B → T | B&T
<br>T → J | T^J 
<br>J → (B) | p
```javascript
{
  tokens: {
  'p': /[a-zA-Z]+/,
  'AND': /\&/,
  'XOR': /\^/,
  'MINUS': /\-/,
  'LEFT_PR': /\(/,
  'RIGHT_PR': /\)/,
  '_': /\s+|\t+|\n+/
},
  rules : {
    'S': ['MINUS B'],
    'B': ['T', 'B AND T'],
    'T': ['J', 'T XOR J'],
    'J': ['p', 'LEFT_PR B RIGHT_PR']
  }
}
```
Token are defined in json with following properties:
<ul>
<li>name : Regular expression.</li>
</ul>
If name is '_' then it will be skiped in tokenizer.

<br>
Rules are defined in json with following properties:
<ul>
<li>name : List of statements</li>
</ul>
