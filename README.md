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
<br>E → E+T/T
<br>T → T*F/F
<br>F → id 
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
<li>name - Name for the token.</li>
<li>regex - Regular expression.</li>
<li>skip - Boolean, eather we add token to the token table or not.</li>
</ul>

Rules are defined in json with following properties:
<ul>
<li>name - Name for the rule.</li>
<li>rules - List of statements where rule can be defined.</li>
</ul>
